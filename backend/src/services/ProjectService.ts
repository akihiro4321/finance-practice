import { executeQuery, executeTransaction } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { Project, FinancialStatement, BudgetPlan, QueryOptions, PaginatedResponse } from '@/types';
import { logger } from '@/utils/logger';

export class ProjectService {
  async createProject(userId: string, projectData: Partial<Project>): Promise<Project> {
    try {
      const {
        name,
        description,
        phase = 'requirements',
        totalBudget,
        startDate,
        endDate,
        accountingTreatment = 'expense',
        costBreakdown = {},
        decisionCriteria = {},
        roiProjection,
        irrProjection,
        paybackPeriod
      } = projectData;

      if (!name || !totalBudget || !startDate) {
        throw new AppError('Name, total budget, and start date are required', 400, 'MISSING_REQUIRED_FIELDS');
      }

      const projects = await executeQuery<Project>(
        `INSERT INTO projects (
          user_id, name, description, phase, total_budget, used_budget,
          start_date, end_date, accounting_treatment, cost_breakdown,
          decision_criteria, roi_projection, irr_projection, payback_period
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *`,
        [
          userId, name, description, phase, totalBudget, 0,
          startDate, endDate, accountingTreatment, JSON.stringify(costBreakdown),
          JSON.stringify(decisionCriteria), roiProjection, irrProjection, paybackPeriod
        ]
      );

      logger.info('Project created successfully', { projectId: projects[0].id, userId });
      return projects[0];
    } catch (error) {
      logger.error('Failed to create project', { error, userId, projectData });
      throw error;
    }
  }

  async getProjectsByUser(
    userId: string,
    options: QueryOptions = {}
  ): Promise<PaginatedResponse<Project[]>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        filter = {}
      } = options;

      const offset = (page - 1) * limit;
      let whereClause = 'WHERE user_id = $1';
      const queryParams: any[] = [userId];
      let paramCount = 1;

      // Add filters
      if (filter.phase) {
        paramCount++;
        whereClause += ` AND phase = $${paramCount}`;
        queryParams.push(filter.phase);
      }

      if (filter.status) {
        paramCount++;
        whereClause += ` AND status = $${paramCount}`;
        queryParams.push(filter.status);
      }

      if (filter.accountingTreatment) {
        paramCount++;
        whereClause += ` AND accounting_treatment = $${paramCount}`;
        queryParams.push(filter.accountingTreatment);
      }

      // Get total count
      const countResult = await executeQuery<{ count: string }>(
        `SELECT COUNT(*) as count FROM projects ${whereClause}`,
        queryParams
      );
      const total = parseInt(countResult[0].count);

      // Get paginated results
      const projects = await executeQuery<Project>(
        `SELECT * FROM projects ${whereClause}
         ORDER BY ${sortBy} ${sortOrder}
         LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
        [...queryParams, limit, offset]
      );

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        success: true,
        data: projects,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext,
          hasPrev
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to get projects by user', { error, userId, options });
      throw error;
    }
  }

  async getProjectById(projectId: string, userId: string): Promise<Project> {
    try {
      const projects = await executeQuery<Project>(
        'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );

      if (projects.length === 0) {
        throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      return projects[0];
    } catch (error) {
      logger.error('Failed to get project by ID', { error, projectId, userId });
      throw error;
    }
  }

  async updateProject(
    projectId: string,
    userId: string,
    updates: Partial<Project>
  ): Promise<Project> {
    try {
      // First check if project exists and belongs to user
      await this.getProjectById(projectId, userId);

      const allowedFields = [
        'name', 'description', 'phase', 'total_budget', 'used_budget',
        'end_date', 'accounting_treatment', 'cost_breakdown', 'decision_criteria',
        'roi_projection', 'irr_projection', 'payback_period', 'status'
      ];

      const updateFields: string[] = [];
      const updateValues: any[] = [];
      let paramCount = 0;

      Object.entries(updates).forEach(([key, value]) => {
        const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (allowedFields.includes(dbField) && value !== undefined) {
          paramCount++;
          updateFields.push(`${dbField} = $${paramCount}`);
          
          if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            updateValues.push(JSON.stringify(value));
          } else {
            updateValues.push(value);
          }
        }
      });

      if (updateFields.length === 0) {
        throw new AppError('No valid fields to update', 400, 'NO_VALID_FIELDS');
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(projectId, userId);

      const projects = await executeQuery<Project>(
        `UPDATE projects SET ${updateFields.join(', ')}
         WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
         RETURNING *`,
        updateValues
      );

      logger.info('Project updated successfully', { projectId, userId, updates });
      return projects[0];
    } catch (error) {
      logger.error('Failed to update project', { error, projectId, userId, updates });
      throw error;
    }
  }

  async deleteProject(projectId: string, userId: string): Promise<void> {
    try {
      // Check if project exists and belongs to user
      await this.getProjectById(projectId, userId);

      await executeQuery(
        'DELETE FROM projects WHERE id = $1 AND user_id = $2',
        [projectId, userId]
      );

      logger.info('Project deleted successfully', { projectId, userId });
    } catch (error) {
      logger.error('Failed to delete project', { error, projectId, userId });
      throw error;
    }
  }

  async getFinancialStatements(projectId: string, userId: string): Promise<FinancialStatement[]> {
    try {
      // Verify project ownership
      await this.getProjectById(projectId, userId);

      const statements = await executeQuery<FinancialStatement>(
        `SELECT * FROM financial_statements 
         WHERE project_id = $1 
         ORDER BY period DESC, created_at DESC`,
        [projectId]
      );

      return statements;
    } catch (error) {
      logger.error('Failed to get financial statements', { error, projectId, userId });
      throw error;
    }
  }

  async createFinancialStatement(
    projectId: string,
    userId: string,
    statementData: Partial<FinancialStatement>
  ): Promise<FinancialStatement> {
    try {
      // Verify project ownership
      await this.getProjectById(projectId, userId);

      const { period, statementType, data } = statementData;

      if (!period || !statementType || !data) {
        throw new AppError('Period, statement type, and data are required', 400, 'MISSING_REQUIRED_FIELDS');
      }

      const statements = await executeQuery<FinancialStatement>(
        `INSERT INTO financial_statements (project_id, period, statement_type, data)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [projectId, period, statementType, JSON.stringify(data)]
      );

      logger.info('Financial statement created successfully', { 
        statementId: statements[0].id, 
        projectId, 
        userId 
      });
      return statements[0];
    } catch (error) {
      logger.error('Failed to create financial statement', { 
        error, 
        projectId, 
        userId, 
        statementData 
      });
      throw error;
    }
  }

  async getBudgetPlans(projectId: string, userId: string): Promise<BudgetPlan[]> {
    try {
      // Verify project ownership
      await this.getProjectById(projectId, userId);

      const budgetPlans = await executeQuery<BudgetPlan>(
        `SELECT * FROM budget_plans 
         WHERE project_id = $1 
         ORDER BY created_at DESC`,
        [projectId]
      );

      return budgetPlans;
    } catch (error) {
      logger.error('Failed to get budget plans', { error, projectId, userId });
      throw error;
    }
  }

  async createBudgetPlan(
    projectId: string,
    userId: string,
    budgetData: Partial<BudgetPlan>
  ): Promise<BudgetPlan> {
    try {
      // Verify project ownership
      await this.getProjectById(projectId, userId);

      const {
        name,
        description,
        totalAmount,
        categories = {},
        timeline = {},
        roiPercentage,
        irrPercentage,
        npvAmount,
        paybackMonths,
        riskAssessment = {}
      } = budgetData;

      if (!name || !totalAmount) {
        throw new AppError('Name and total amount are required', 400, 'MISSING_REQUIRED_FIELDS');
      }

      const budgetPlans = await executeQuery<BudgetPlan>(
        `INSERT INTO budget_plans (
          project_id, name, description, total_amount, allocated_amount, spent_amount,
          categories, timeline, roi_percentage, irr_percentage, npv_amount,
          payback_months, risk_assessment
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          projectId, name, description, totalAmount, 0, 0,
          JSON.stringify(categories), JSON.stringify(timeline),
          roiPercentage, irrPercentage, npvAmount, paybackMonths,
          JSON.stringify(riskAssessment)
        ]
      );

      logger.info('Budget plan created successfully', { 
        budgetPlanId: budgetPlans[0].id, 
        projectId, 
        userId 
      });
      return budgetPlans[0];
    } catch (error) {
      logger.error('Failed to create budget plan', { 
        error, 
        projectId, 
        userId, 
        budgetData 
      });
      throw error;
    }
  }

  async getProjectStats(userId: string): Promise<any> {
    try {
      const stats = await executeQuery(
        `SELECT 
          COUNT(*) as total_projects,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects,
          SUM(total_budget) as total_budget,
          SUM(used_budget) as used_budget,
          AVG(roi_projection) as avg_roi_projection
         FROM projects WHERE user_id = $1`,
        [userId]
      );

      return {
        totalProjects: parseInt(stats[0].total_projects) || 0,
        activeProjects: parseInt(stats[0].active_projects) || 0,
        completedProjects: parseInt(stats[0].completed_projects) || 0,
        totalBudget: parseFloat(stats[0].total_budget) || 0,
        usedBudget: parseFloat(stats[0].used_budget) || 0,
        avgRoiProjection: parseFloat(stats[0].avg_roi_projection) || 0
      };
    } catch (error) {
      logger.error('Failed to get project stats', { error, userId });
      throw error;
    }
  }

  async getDashboardStats(userId: string): Promise<any> {
    // Get project stats
    const projectStats = await executeQuery(
      `SELECT 
        COUNT(*) as total_projects,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects
       FROM projects WHERE user_id = $1`,
      [userId]
    );

    // Get learning stats
    const learningStats = await executeQuery(
      `SELECT 
        COALESCE(lp.overall_progress, 0) as overall_progress,
        COUNT(DISTINCT csa.case_study_id) as completed_case_studies
       FROM users u
       LEFT JOIN learning_progress lp ON u.id = lp.user_id
       LEFT JOIN case_study_attempts csa ON u.id = csa.user_id AND csa.status = 'completed'
       WHERE u.id = $1
       GROUP BY u.id, lp.overall_progress`,
      [userId]
    );

    return {
      totalProjects: parseInt(projectStats[0]?.total_projects) || 0,
      activeProjects: parseInt(projectStats[0]?.active_projects) || 0,
      completedProjects: parseInt(projectStats[0]?.completed_projects) || 0,
      learningProgress: parseInt(learningStats[0]?.overall_progress) || 0,
      completedCaseStudies: parseInt(learningStats[0]?.completed_case_studies) || 0
    };
  }
}