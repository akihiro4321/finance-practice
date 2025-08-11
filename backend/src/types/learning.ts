export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  category: 'development' | 'infrastructure' | 'migration' | 'saas';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  scenario: string;
  companyProfile: CompanyProfile;
  projectDetails: ProjectDetails;
  questions: Question[];
  solutions: Solution[];
  learningObjectives: string[];
  tags: string[];
}

export interface CompanyProfile {
  name: string;
  industry: string;
  size: 'startup' | 'sme' | 'large' | 'enterprise';
  revenue: number;
  employees: number;
  businessModel: string;
}

export interface ProjectDetails {
  name: string;
  background: string;
  objectives: string[];
  scope: string;
  budget: number;
  timeline: number; // months
  team: TeamMember[];
  constraints: string[];
  successCriteria: string[];
}

export interface TeamMember {
  role: string;
  name: string;
  experience: string;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'calculation' | 'scenario' | 'free_text';
  question: string;
  context?: string;
  options?: QuestionOption[];
  correctAnswer?: string | number;
  explanation: string;
  points: number;
  hints?: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Solution {
  questionId: string;
  approach: string;
  reasoning: string;
  calculations?: CalculationStep[];
  bestPractices: string[];
  commonMistakes: string[];
}

export interface CalculationStep {
  step: number;
  description: string;
  formula?: string;
  calculation: string;
  result: number;
}

export interface Exercise {
  id: string;
  type: 'roi' | 'irr' | 'depreciation' | 'budget' | 'accounting';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  parameters: ExerciseParameter[];
  expectedAnswer: ExerciseAnswer;
  explanation: string;
  relatedConcepts: string[];
}

export interface ExerciseParameter {
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface ExerciseAnswer {
  value: number;
  unit: string;
  breakdown?: CalculationStep[];
}

// 進捗管理関連
export interface LearningProgress {
  userId: string;
  overallProgress: number; // 0-100
  moduleProgress: ModuleProgress[];
  caseStudyProgress: CaseStudyProgress[];
  exerciseProgress: ExerciseProgress[];
  assessmentResults: AssessmentResult[];
  learningHistory: LearningSession[];
  achievements: Achievement[];
  weakAreas: WeakArea[];
  recommendations: LearningRecommendation[];
  lastUpdated: string;
}

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  progress: number; // 0-100
  timeSpent: number; // minutes
  completedItems: number;
  totalItems: number;
  lastAccessed: string;
  score?: number;
}

export interface CaseStudyProgress {
  caseStudyId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  timeSpent: number; // minutes
  questionsAnswered: number;
  questionsCorrect: number;
  completedAt?: string;
  attempts: number;
}

export interface ExerciseProgress {
  exerciseId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  attempts: number;
  bestScore: number;
  averageScore: number;
  timeSpent: number; // minutes
  lastAttempted: string;
}

export interface AssessmentResult {
  id: string;
  type: 'module' | 'comprehensive' | 'certification';
  moduleName?: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  passThreshold: number;
  timeSpent: number;
  completedAt: string;
  breakdown: ScoreBreakdown[];
}

export interface ScoreBreakdown {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface LearningSession {
  id: string;
  activityType: 'case_study' | 'exercise' | 'assessment' | 'reading';
  activityId: string;
  activityName: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  score?: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'completion' | 'score' | 'streak' | 'time' | 'special';
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface WeakArea {
  concept: string;
  category: string;
  confidence: number; // 0-100
  practiceNeeded: number; // hours
  recommendedActivities: string[];
  lastPracticed?: string;
}

export interface LearningRecommendation {
  id: string;
  type: 'review' | 'practice' | 'advance' | 'focus';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  estimatedTime: number; // minutes
  activities: RecommendedActivity[];
  reason: string;
}

export interface RecommendedActivity {
  type: 'case_study' | 'exercise' | 'reading';
  id: string;
  name: string;
  estimatedTime: number; // minutes
}

export interface LearningAnalytics {
  totalTimeSpent: number; // minutes
  averageSessionTime: number; // minutes
  longestStreak: number; // days
  currentStreak: number; // days
  activeDays: number;
  totalActivities: number;
  averageScore: number;
  improvementRate: number; // score improvement per week
  strongestAreas: string[];
  weakestAreas: string[];
  learningVelocity: number; // activities per week
  retentionRate: number; // percentage
}