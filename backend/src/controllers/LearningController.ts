import { Request, Response } from 'express';
import { AppError } from '@/middleware/errorHandler';
import { ApiResponse } from '@/types';
import { caseStudies } from '../data/caseStudies';
import { exercises } from '../data/exercises';

export class LearningController {
  async getCaseStudies(req: Request, res: Response): Promise<void> {
    const response: ApiResponse = {
      success: true,
      data: caseStudies,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }

  async getCaseStudyById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const caseStudy = caseStudies.find(cs => cs.id === id);
    
    if (!caseStudy) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CASE_STUDY_NOT_FOUND',
          message: 'Case study not found'
        },
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: caseStudy,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }

  async startCaseStudyAttempt(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const caseStudy = caseStudies.find(cs => cs.id === id);
    
    if (!caseStudy) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CASE_STUDY_NOT_FOUND',
          message: 'Case study not found'
        },
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }

    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const attempt = {
      id: attemptId,
      caseStudyId: id,
      status: 'started',
      startedAt: new Date().toISOString(),
      answers: {},
      score: 0
    };

    const response: ApiResponse = {
      success: true,
      data: attempt,
      timestamp: new Date().toISOString()
    };
    res.status(201).json(response);
  }

  async updateCaseStudyAttempt(req: Request, res: Response): Promise<void> {
    const { id, attemptId } = req.params;
    const { answers, score, status } = req.body;
    
    const caseStudy = caseStudies.find(cs => cs.id === id);
    
    if (!caseStudy) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'CASE_STUDY_NOT_FOUND',
          message: 'Case study not found'
        },
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }

    const updatedAttempt = {
      id: attemptId,
      caseStudyId: id,
      answers: answers || {},
      score: score || 0,
      status: status || 'in_progress',
      updatedAt: new Date().toISOString()
    };

    const response: ApiResponse = {
      success: true,
      data: updatedAttempt,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }

  async getExercises(req: Request, res: Response): Promise<void> {
    const response: ApiResponse = {
      success: true,
      data: exercises,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }

  async getExerciseById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const exercise = exercises.find(ex => ex.id === id);
    
    if (!exercise) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Exercise not found'
        },
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: exercise,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }

  async submitExerciseAttempt(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { answer } = req.body;
    
    const exercise = exercises.find(ex => ex.id === id);
    
    if (!exercise) {
      const response: ApiResponse = {
        success: false,
        error: {
          code: 'EXERCISE_NOT_FOUND',
          message: 'Exercise not found'
        },
        timestamp: new Date().toISOString()
      };
      res.status(404).json(response);
      return;
    }

    const expectedValue = exercise.expectedAnswer.value;
    const tolerance = expectedValue * 0.05; // 5% tolerance
    const userValue = typeof answer === 'number' ? answer : parseFloat(answer);
    
    const isCorrect = Math.abs(userValue - expectedValue) <= tolerance;
    const score = isCorrect ? 100 : Math.max(0, 100 - Math.abs(userValue - expectedValue) / expectedValue * 100);

    const result = {
      exerciseId: id,
      userAnswer: userValue,
      expectedAnswer: expectedValue,
      isCorrect,
      score: Math.round(score),
      submittedAt: new Date().toISOString()
    };

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }

  async getProgress(req: Request, res: Response): Promise<void> {
    // Mock progress data for demo purposes
    const progress = {
      overallProgress: 65,
      caseStudiesCompleted: 2,
      exercisesCompleted: 4,
      totalScore: 850,
      averageScore: 85,
      studyTime: 450, // minutes
      lastActivity: new Date().toISOString(),
      moduleProgress: {
        caseStudies: {
          'ecommerce-renewal': { completed: true, score: 85, attempts: 2 },
          'cloud-migration': { completed: true, score: 90, attempts: 1 },
          'ai-development': { completed: false, score: 0, attempts: 0 }
        },
        exercises: {
          'roi-calculation-basic': { completed: true, score: 95, attempts: 2 },
          'irr-calculation-intermediate': { completed: true, score: 80, attempts: 3 },
          'depreciation-straight-line': { completed: true, score: 88, attempts: 1 },
          'budget-variance-analysis': { completed: true, score: 75, attempts: 2 },
          'accounting-asset-vs-expense': { completed: false, score: 0, attempts: 0 }
        }
      }
    };

    const response: ApiResponse = {
      success: true,
      data: progress,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }

  async getAchievements(req: Request, res: Response): Promise<void> {
    // Mock achievements data for demo purposes
    const achievements = [
      {
        id: 'first_case_study',
        name: '初回ケーススタディ完了',
        description: 'はじめてのケーススタディを完了しました',
        icon: '🎯',
        unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        category: 'milestone'
      },
      {
        id: 'perfect_score',
        name: '満点獲得',
        description: '演習問題で満点を獲得しました',
        icon: '🏆',
        unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        category: 'performance'
      },
      {
        id: 'consistent_learner',
        name: '継続学習者',
        description: '3日連続で学習を行いました',
        icon: '📚',
        unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        category: 'consistency'
      }
    ];

    const response: ApiResponse = {
      success: true,
      data: achievements,
      timestamp: new Date().toISOString()
    };
    res.status(200).json(response);
  }
}