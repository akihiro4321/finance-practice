export interface Project {
  id: string;
  name: string;
  description: string;
  phase: DevelopmentPhase;
  cost: number;
  duration: number; // months
  teamSize: number;
}

export type DevelopmentPhase = 'requirements' | 'development' | 'maintenance';

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
}

export interface JournalEntry {
  account: string;
  debit: number;
  credit: number;
  description: string;
}