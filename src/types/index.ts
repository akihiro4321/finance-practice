export interface Project {
  id: string;
  name: string;
  description: string;
  phase: DevelopmentPhase;
  cost: number;
  duration: number; // months
  teamSize: number;
  industry: string;
  complexity: ProjectComplexity;
  riskLevel: RiskLevel;
  costBreakdown: CostBreakdown;
}

export interface CostBreakdown {
  personnel: number;
  external: number;
  infrastructure: number;
  licenses: number;
  other: number;
}

export type DevelopmentPhase = 'requirements' | 'development' | 'maintenance';
export type ProjectComplexity = 'low' | 'medium' | 'high';
export type RiskLevel = 'low' | 'medium' | 'high';
export type AccountingTreatment = 'expense' | 'capitalize';

export interface DecisionCriteria {
  futureEconomicBenefit: boolean;
  technicalFeasibility: boolean;
  completionIntention: boolean;
  adequateResources: boolean;
}

export interface AccountingDecision {
  phase: DevelopmentPhase;
  treatment: AccountingTreatment;
  criteria: DecisionCriteria;
  reasoning: string;
  confidence: number; // 0-100
}

export interface JournalEntry {
  id: string;
  date: string;
  account: string;
  debit: number;
  credit: number;
  description: string;
  category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
}

export interface DetailedJournalEntry {
  mainEntry: JournalEntry[];
  relatedEntries?: JournalEntry[];
  depreciationSchedule?: DepreciationEntry[];
  explanation: string;
  impact: FinancialImpact;
}

export interface DepreciationEntry {
  year: number;
  beginningValue: number;
  depreciationAmount: number;
  endingValue: number;
}

export interface FinancialImpact {
  currentYear: {
    profitLoss: number;
    balanceSheet: {
      assets: number;
      liabilities: number;
    };
    cashFlow: number;
  };
  futureYears: {
    year: number;
    profitLoss: number;
    balanceSheet: {
      assets: number;
      liabilities: number;
    };
  }[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}