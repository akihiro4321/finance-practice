import { Request, Response } from 'express';
import { executeQuery } from '@/config/database';
import { AppError } from '@/middleware/errorHandler';
import { ApiResponse, User } from '@/types';
import { logger } from '@/utils/logger';

// Fixed user ID for single-user application
const FIXED_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export class UserController {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const users = await executeQuery<User>(
        `SELECT id, email, display_name, role, preferences, 
                created_at, updated_at, last_login_at, is_active
         FROM users WHERE id = $1`,
        [FIXED_USER_ID]
      );

      if (users.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      const response: ApiResponse = {
        success: true,
        data: users[0],
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to get user profile', { error, userId: FIXED_USER_ID });
      throw error;
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { displayName, preferences } = req.body;
      const updateData: any = {};

      if (displayName !== undefined) updateData.display_name = displayName;
      if (preferences !== undefined) updateData.preferences = JSON.stringify(preferences);

      if (Object.keys(updateData).length === 0) {
        throw new AppError('No valid fields to update', 400, 'NO_VALID_FIELDS');
      }

      const updateFields = Object.keys(updateData).map((key, index) => `${key} = $${index + 2}`);
      updateFields.push('updated_at = CURRENT_TIMESTAMP');
      const updateValues = [FIXED_USER_ID, ...Object.values(updateData)];

      const users = await executeQuery<User>(
        `UPDATE users SET ${updateFields.join(', ')}
         WHERE id = $1
         RETURNING id, email, display_name, role, preferences, 
                   created_at, updated_at, last_login_at, is_active`,
        updateValues
      );

      if (users.length === 0) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      logger.info('User profile updated successfully', { userId: FIXED_USER_ID, updates: updateData });

      const response: ApiResponse = {
        success: true,
        data: users[0],
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to update user profile', { 
        error, 
        userId: FIXED_USER_ID, 
        body: req.body 
      });
      throw error;
    }
  }

  async getProgress(req: Request, res: Response): Promise<void> {
    try {
      // Get learning progress
      const progressResult = await executeQuery(
        'SELECT * FROM learning_progress WHERE user_id = $1',
        [FIXED_USER_ID]
      );

      // Get case study attempts stats
      const caseStudyStats = await executeQuery(
        `SELECT 
          COUNT(*) as total_attempts,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_attempts,
          AVG(CASE WHEN status = 'completed' THEN score END) as avg_score
         FROM case_study_attempts WHERE user_id = $1`,
        [FIXED_USER_ID]
      );

      // Get exercise attempts stats
      const exerciseStats = await executeQuery(
        `SELECT 
          COUNT(*) as total_attempts,
          COUNT(CASE WHEN is_correct = true THEN 1 END) as correct_attempts,
          AVG(score) as avg_score
         FROM exercise_attempts WHERE user_id = $1`,
        [FIXED_USER_ID]
      );

      // Get achievements
      const achievements = await executeQuery(
        `SELECT a.*, ua.unlocked_at 
         FROM achievements a
         INNER JOIN user_achievements ua ON a.id = ua.achievement_id
         WHERE ua.user_id = $1 AND a.is_active = true
         ORDER BY ua.unlocked_at DESC`,
        [FIXED_USER_ID]
      );

      const progressData = {
        overall: progressResult[0] || {
          overallProgress: 0,
          moduleProgress: [],
          weakAreas: [],
          achievements: []
        },
        caseStudies: {
          totalAttempts: parseInt(caseStudyStats[0]?.total_attempts) || 0,
          completedAttempts: parseInt(caseStudyStats[0]?.completed_attempts) || 0,
          averageScore: parseFloat(caseStudyStats[0]?.avg_score) || 0
        },
        exercises: {
          totalAttempts: parseInt(exerciseStats[0]?.total_attempts) || 0,
          correctAttempts: parseInt(exerciseStats[0]?.correct_attempts) || 0,
          averageScore: parseFloat(exerciseStats[0]?.avg_score) || 0
        },
        achievements: achievements
      };

      const response: ApiResponse = {
        success: true,
        data: progressData,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to get user progress', { error, userId: FIXED_USER_ID });
      throw error;
    }
  }

  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      // Get project stats
      const projectStats = await executeQuery(
        `SELECT 
          COUNT(*) as total_projects,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_projects,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_projects
         FROM projects WHERE user_id = $1`,
        [FIXED_USER_ID]
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
        [FIXED_USER_ID]
      );

      const dashboardStats = {
        totalProjects: parseInt(projectStats[0]?.total_projects) || 0,
        activeProjects: parseInt(projectStats[0]?.active_projects) || 0,
        completedProjects: parseInt(projectStats[0]?.completed_projects) || 0,
        learningProgress: parseInt(learningStats[0]?.overall_progress) || 0,
        completedCaseStudies: parseInt(learningStats[0]?.completed_case_studies) || 0
      };

      const response: ApiResponse = {
        success: true,
        data: dashboardStats,
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      logger.error('Failed to get dashboard stats', { error, userId: FIXED_USER_ID });
      throw error;
    }
  }
}