export interface Budget {
  id: string;
  projectName: string;
  fiscalYear: number;
  department: string;
  manager: string;
  period: {
    startDate: string;
    endDate: string;
    duration: number; // months
  };
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  subcategory: string;
  description: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  totalAmount: number;
  isFixed: boolean; // 固定費か変動費か
  schedule: MonthlySchedule[];
  notes?: string;
}

export interface MonthlySchedule {
  month: number; // 1-12
  plannedAmount: number;
  actualAmount?: number;
  note?: string;
}

export type BudgetCategory = 
  | 'personnel'      // 人件費
  | 'external'       // 外注費
  | 'infrastructure' // インフラ費
  | 'software'       // ソフトウェアライセンス
  | 'hardware'       // ハードウェア
  | 'travel'         // 旅費交通費
  | 'training'       // 研修費
  | 'other';         // その他

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'mobile' | 'infrastructure' | 'ai' | 'general';
  items: BudgetTemplateItem[];
}

export interface BudgetTemplateItem {
  category: BudgetCategory;
  subcategory: string;
  description: string;
  estimatedCost: number;
  unit: string;
  quantity: number;
  ratioToTotal: number; // 全体予算に対する比率
  notes?: string;
}

export interface BudgetScenario {
  id: string;
  name: string;
  description: string;
  multipliers: {
    [key in BudgetCategory]: number;
  };
  additionalItems?: BudgetItem[];
  notes?: string;
}

export interface BudgetAnalysis {
  totalBudget: number;
  categoryBreakdown: {
    [key in BudgetCategory]: {
      amount: number;
      percentage: number;
      items: number;
    };
  };
  monthlyDistribution: MonthlyBudget[];
  risks: BudgetRisk[];
  recommendations: BudgetRecommendation[];
}

export interface MonthlyBudget {
  month: number;
  plannedAmount: number;
  actualAmount?: number;
  variance?: number;
  variancePercentage?: number;
}

export interface BudgetRisk {
  id: string;
  category: 'cost' | 'schedule' | 'resource' | 'external';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  mitigation: string;
  probability: number; // 0-100
}

export interface BudgetRecommendation {
  id: string;
  type: 'cost_reduction' | 'efficiency' | 'risk_mitigation' | 'optimization';
  title: string;
  description: string;
  expectedSavings?: number;
  implementationCost?: number;
  priority: 'low' | 'medium' | 'high';
}

export interface ROICalculation {
  investment: number;
  benefits: AnnualBenefit[];
  npv: number;
  irr: number;
  paybackPeriod: number;
  roi: number;
}

export interface AnnualBenefit {
  year: number;
  revenue: number;
  costSavings: number;
  totalBenefit: number;
  discountedBenefit: number;
}

export interface BudgetApprovalWorkflow {
  id: string;
  budgetId: string;
  currentStep: number;
  steps: ApprovalStep[];
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  submittedAt: string;
  completedAt?: string;
}

export interface ApprovalStep {
  stepNumber: number;
  approverRole: string;
  approverName: string;
  requiredBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  comments?: string;
  actionedAt?: string;
  budgetLimit?: number; // この承認者の承認可能金額上限
}