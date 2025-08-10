export interface FinancialStatement {
  profitLoss: ProfitLossStatement;
  balanceSheet: BalanceSheet;
  cashFlow: CashFlowStatement;
  period: string;
  lastUpdated: string;
}

export interface ProfitLossStatement {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: {
    salaries: number;
    depreciation: number;
    systemDevelopment: number;
    other: number;
    total: number;
  };
  operatingProfit: number;
  nonOperatingIncome: number;
  nonOperatingExpenses: number;
  ordinaryProfit: number;
  extraordinaryIncome: number;
  extraordinaryLoss: number;
  pretaxProfit: number;
  incomeTax: number;
  netProfit: number;
}

export interface BalanceSheet {
  assets: {
    currentAssets: {
      cash: number;
      accountsReceivable: number;
      inventory: number;
      other: number;
      total: number;
    };
    fixedAssets: {
      tangibleAssets: number;
      intangibleAssets: {
        software: number;
        goodwill: number;
        other: number;
        total: number;
      };
      investments: number;
      total: number;
    };
    total: number;
  };
  liabilities: {
    currentLiabilities: {
      accountsPayable: number;
      shortTermDebt: number;
      accrued: number;
      other: number;
      total: number;
    };
    longTermLiabilities: {
      longTermDebt: number;
      other: number;
      total: number;
    };
    total: number;
  };
  equity: {
    capital: number;
    retainedEarnings: number;
    other: number;
    total: number;
  };
  totalLiabilitiesAndEquity: number;
}

export interface CashFlowStatement {
  operatingActivities: {
    netIncome: number;
    depreciation: number;
    accountsReceivableChange: number;
    inventoryChange: number;
    accountsPayableChange: number;
    other: number;
    total: number;
  };
  investingActivities: {
    equipmentPurchase: number;
    softwareDevelopment: number;
    other: number;
    total: number;
  };
  financingActivities: {
    debtIssuance: number;
    debtRepayment: number;
    dividends: number;
    other: number;
    total: number;
  };
  netCashFlow: number;
  beginningCash: number;
  endingCash: number;
}

export interface FinancialScenario {
  id: string;
  name: string;
  description: string;
  statements: FinancialStatement;
}

export interface FinancialComparison {
  baseline: FinancialStatement;
  scenarios: FinancialScenario[];
  differences: FinancialDifference[];
}

export interface FinancialDifference {
  scenarioId: string;
  profitLossImpact: number;
  balanceSheetImpact: {
    assets: number;
    liabilities: number;
    equity: number;
  };
  cashFlowImpact: number;
  description: string;
}