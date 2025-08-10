export interface User {
  id: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: 'admin' | 'user';
  preferences: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  phase: 'requirements' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';
  totalBudget: number;
  usedBudget: number;
  startDate: Date;
  endDate?: Date;
  accountingTreatment: 'expense' | 'capitalize';
  costBreakdown: Record<string, any>;
  decisionCriteria: Record<string, any>;
  roiProjection?: number;
  irrProjection?: number;
  paybackPeriod?: number;
  status: 'active' | 'completed' | 'cancelled' | 'on_hold';
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialStatement {
  id: string;
  projectId: string;
  period: string;
  statementType: 'profit_loss' | 'balance_sheet' | 'cash_flow';
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetPlan {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  totalAmount: number;
  allocatedAmount: number;
  spentAmount: number;
  categories: Record<string, any>;
  timeline: Record<string, any>;
  roiPercentage?: number;
  irrPercentage?: number;
  npvAmount?: number;
  paybackMonths?: number;
  riskAssessment: Record<string, any>;
  status: 'draft' | 'approved' | 'active' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  category: 'development' | 'infrastructure' | 'migration' | 'saas';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  scenario: string;
  companyProfile: Record<string, any>;
  projectDetails: Record<string, any>;
  questions: Array<Record<string, any>>;
  solutions: Array<Record<string, any>>;
  learningObjectives: string[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  exerciseType: 'roi' | 'irr' | 'depreciation' | 'budget' | 'accounting';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  parameters: Array<Record<string, any>>;
  expectedAnswer: Record<string, any>;
  explanation: string;
  relatedConcepts: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningProgress {
  id: string;
  userId: string;
  overallProgress: number;
  moduleProgress: Array<Record<string, any>>;
  weakAreas: Array<Record<string, any>>;
  achievements: Array<Record<string, any>>;
  lastUpdated: Date;
}

export interface CaseStudyAttempt {
  id: string;
  userId: string;
  caseStudyId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  timeSpent: number;
  questionsAnswered: number;
  questionsCorrect: number;
  answers: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  attemptNumber: number;
}

export interface ExerciseAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  userAnswer?: number;
  isCorrect: boolean;
  timeSpent: number;
  submittedAt: Date;
  attemptNumber: number;
}

export interface LearningSession {
  id: string;
  userId: string;
  activityType: 'case_study' | 'exercise' | 'reading' | 'assessment';
  activityId?: string;
  activityName: string;
  startedAt: Date;
  endedAt?: Date;
  durationMinutes?: number;
  score?: number;
  completed: boolean;
  metadata: Record<string, any>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'score' | 'streak' | 'time' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  criteria: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  metadata: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
  method?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: Record<string, any>;
  include?: string[];
}