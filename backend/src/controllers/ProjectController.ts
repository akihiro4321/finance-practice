import { Request, Response } from 'express';
import { ProjectService } from '@/services/ProjectService';
import { AppError } from '@/middleware/errorHandler';
import { ApiResponse, QueryOptions } from '@/types';
import { logger } from '@/utils/logger';

// Fixed user ID for single-user application
const FIXED_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const options: QueryOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string || 'created_at',
        sortOrder: (req.query.sortOrder as 'ASC' | 'DESC') || 'DESC',
        filter: {
          phase: req.query.phase as string,
          status: req.query.status as string,
          accountingTreatment: req.query.accountingTreatment as string
        }
      };

      // Remove undefined filter values
      Object.keys(options.filter!).forEach(key => {
        if (options.filter![key] === undefined) {
          delete options.filter![key];
        }
      });

      const result = await this.projectService.getProjectsByUser(FIXED_USER_ID, options);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Failed to get projects', { error, userId: FIXED_USER_ID });
      throw error;
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const project = await this.projectService.createProject(FIXED_USER_ID, req.body);
      
      const response: ApiResponse = {
        success: true,
        data: project,
        timestamp: new Date().toISOString()
      };
      
      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create project', { error, userId: FIXED_USER_ID, body: req.body });
      throw error;
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new AppError('Project ID is required', 400, 'MISSING_PROJECT_ID');
      }

      const project = await this.projectService.getProjectById(projectId, FIXED_USER_ID);
      
      const response: ApiResponse = {
        success: true,
        data: project,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to get project by ID', { 
        error, 
        projectId: req.params.id, 
        userId: FIXED_USER_ID 
      });
      throw error;
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new AppError('Project ID is required', 400, 'MISSING_PROJECT_ID');
      }

      const project = await this.projectService.updateProject(projectId, FIXED_USER_ID, req.body);
      
      const response: ApiResponse = {
        success: true,
        data: project,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to update project', { 
        error, 
        projectId: req.params.id, 
        userId: FIXED_USER_ID,
        body: req.body
      });
      throw error;
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new AppError('Project ID is required', 400, 'MISSING_PROJECT_ID');
      }

      await this.projectService.deleteProject(projectId, FIXED_USER_ID);
      
      const response: ApiResponse = {
        success: true,
        message: 'Project deleted successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to delete project', { 
        error, 
        projectId: req.params.id, 
        userId: FIXED_USER_ID 
      });
      throw error;
    }
  }

  async getFinancialStatements(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new AppError('Project ID is required', 400, 'MISSING_PROJECT_ID');
      }

      const statements = await this.projectService.getFinancialStatements(projectId, FIXED_USER_ID);
      
      const response: ApiResponse = {
        success: true,
        data: statements,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to get financial statements', { 
        error, 
        projectId: req.params.id, 
        userId: FIXED_USER_ID 
      });
      throw error;
    }
  }

  async createFinancialStatement(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new AppError('Project ID is required', 400, 'MISSING_PROJECT_ID');
      }

      const statement = await this.projectService.createFinancialStatement(
        projectId, 
        FIXED_USER_ID, 
        req.body
      );
      
      const response: ApiResponse = {
        success: true,
        data: statement,
        timestamp: new Date().toISOString()
      };
      
      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create financial statement', { 
        error, 
        projectId: req.params.id, 
        userId: FIXED_USER_ID,
        body: req.body
      });
      throw error;
    }
  }

  async getBudgetPlans(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new AppError('Project ID is required', 400, 'MISSING_PROJECT_ID');
      }

      const budgetPlans = await this.projectService.getBudgetPlans(projectId, FIXED_USER_ID);
      
      const response: ApiResponse = {
        success: true,
        data: budgetPlans,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to get budget plans', { 
        error, 
        projectId: req.params.id, 
        userId: FIXED_USER_ID 
      });
      throw error;
    }
  }

  async createBudgetPlan(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      if (!projectId) {
        throw new AppError('Project ID is required', 400, 'MISSING_PROJECT_ID');
      }

      const budgetPlan = await this.projectService.createBudgetPlan(
        projectId, 
        FIXED_USER_ID, 
        req.body
      );
      
      const response: ApiResponse = {
        success: true,
        data: budgetPlan,
        timestamp: new Date().toISOString()
      };
      
      res.status(201).json(response);
    } catch (error) {
      logger.error('Failed to create budget plan', { 
        error, 
        projectId: req.params.id, 
        userId: FIXED_USER_ID,
        body: req.body
      });
      throw error;
    }
  }

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.projectService.getDashboardStats(FIXED_USER_ID);
      
      const response: ApiResponse = {
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to get project stats', { 
        error, 
        userId: FIXED_USER_ID 
      });
      throw error;
    }
  }
}