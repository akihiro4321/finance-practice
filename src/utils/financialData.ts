import { FinancialStatement, ProfitLossStatement, BalanceSheet, CashFlowStatement } from '../types/financial';
import { Project, AccountingTreatment } from '../types';

// サンプル財務データを生成
export const generateSampleFinancialData = (): FinancialStatement => {
  const profitLoss: ProfitLossStatement = {
    revenue: 500000000,
    costOfSales: 300000000,
    grossProfit: 200000000,
    operatingExpenses: {
      salaries: 80000000,
      depreciation: 15000000,
      systemDevelopment: 0, // プロジェクトにより変動
      other: 25000000,
      total: 120000000
    },
    operatingProfit: 80000000,
    nonOperatingIncome: 2000000,
    nonOperatingExpenses: 3000000,
    ordinaryProfit: 79000000,
    extraordinaryIncome: 0,
    extraordinaryLoss: 0,
    pretaxProfit: 79000000,
    incomeTax: 23700000,
    netProfit: 55300000
  };

  const balanceSheet: BalanceSheet = {
    assets: {
      currentAssets: {
        cash: 150000000,
        accountsReceivable: 80000000,
        inventory: 60000000,
        other: 20000000,
        total: 310000000
      },
      fixedAssets: {
        tangibleAssets: 200000000,
        intangibleAssets: {
          software: 50000000, // プロジェクトにより変動
          goodwill: 30000000,
          other: 20000000,
          total: 100000000
        },
        investments: 50000000,
        total: 350000000
      },
      total: 660000000
    },
    liabilities: {
      currentLiabilities: {
        accountsPayable: 70000000,
        shortTermDebt: 40000000,
        accrued: 30000000,
        other: 20000000,
        total: 160000000
      },
      longTermLiabilities: {
        longTermDebt: 150000000,
        other: 10000000,
        total: 160000000
      },
      total: 320000000
    },
    equity: {
      capital: 200000000,
      retainedEarnings: 140000000,
      other: 0,
      total: 340000000
    },
    totalLiabilitiesAndEquity: 660000000
  };

  const cashFlow: CashFlowStatement = {
    operatingActivities: {
      netIncome: 55300000,
      depreciation: 15000000,
      accountsReceivableChange: -5000000,
      inventoryChange: -3000000,
      accountsPayableChange: 8000000,
      other: 2000000,
      total: 72300000
    },
    investingActivities: {
      equipmentPurchase: -20000000,
      softwareDevelopment: 0, // プロジェクトにより変動
      other: -5000000,
      total: -25000000
    },
    financingActivities: {
      debtIssuance: 0,
      debtRepayment: -10000000,
      dividends: -15000000,
      other: 0,
      total: -25000000
    },
    netCashFlow: 22300000,
    beginningCash: 127700000,
    endingCash: 150000000
  };

  return {
    profitLoss,
    balanceSheet,
    cashFlow,
    period: '2025年度',
    lastUpdated: new Date().toISOString()
  };
};

// プロジェクトの影響を財務諸表に反映
export const applyProjectImpact = (
  baseData: FinancialStatement,
  project: Project,
  treatment: AccountingTreatment
): FinancialStatement => {
  const updatedData = JSON.parse(JSON.stringify(baseData)) as FinancialStatement;

  if (treatment === 'expense') {
    // 費用化の場合
    updatedData.profitLoss.operatingExpenses.systemDevelopment += project.cost;
    updatedData.profitLoss.operatingExpenses.total += project.cost;
    updatedData.profitLoss.operatingProfit -= project.cost;
    updatedData.profitLoss.ordinaryProfit -= project.cost;
    updatedData.profitLoss.pretaxProfit -= project.cost;
    updatedData.profitLoss.incomeTax = Math.round(updatedData.profitLoss.pretaxProfit * 0.3);
    updatedData.profitLoss.netProfit = updatedData.profitLoss.pretaxProfit - updatedData.profitLoss.incomeTax;

    // 現金減少
    updatedData.balanceSheet.assets.currentAssets.cash -= project.cost;
    updatedData.balanceSheet.assets.currentAssets.total -= project.cost;
    updatedData.balanceSheet.assets.total -= project.cost;
    
    // 利益剰余金減少
    updatedData.balanceSheet.equity.retainedEarnings += updatedData.profitLoss.netProfit - baseData.profitLoss.netProfit;
    updatedData.balanceSheet.equity.total = updatedData.balanceSheet.equity.capital + updatedData.balanceSheet.equity.retainedEarnings;
    updatedData.balanceSheet.totalLiabilitiesAndEquity = updatedData.balanceSheet.assets.total;

    // キャッシュフロー
    updatedData.cashFlow.operatingActivities.netIncome = updatedData.profitLoss.netProfit;
    updatedData.cashFlow.operatingActivities.total = updatedData.cashFlow.operatingActivities.netIncome + 
      updatedData.cashFlow.operatingActivities.depreciation + 
      updatedData.cashFlow.operatingActivities.accountsReceivableChange +
      updatedData.cashFlow.operatingActivities.inventoryChange +
      updatedData.cashFlow.operatingActivities.accountsPayableChange +
      updatedData.cashFlow.operatingActivities.other;
    
    updatedData.cashFlow.netCashFlow = updatedData.cashFlow.operatingActivities.total + 
      updatedData.cashFlow.investingActivities.total + 
      updatedData.cashFlow.financingActivities.total;
    updatedData.cashFlow.endingCash = updatedData.balanceSheet.assets.currentAssets.cash;

  } else {
    // 資産化の場合
    const annualDepreciation = Math.round(project.cost / 5);
    
    // ソフトウェア資産増加
    updatedData.balanceSheet.assets.fixedAssets.intangibleAssets.software += project.cost;
    updatedData.balanceSheet.assets.fixedAssets.intangibleAssets.total += project.cost;
    updatedData.balanceSheet.assets.fixedAssets.total += project.cost;
    updatedData.balanceSheet.assets.total += project.cost;
    
    // 現金減少
    updatedData.balanceSheet.assets.currentAssets.cash -= project.cost;
    updatedData.balanceSheet.assets.currentAssets.total -= project.cost;
    updatedData.balanceSheet.assets.total -= project.cost;

    // 減価償却費追加
    updatedData.profitLoss.operatingExpenses.depreciation += annualDepreciation;
    updatedData.profitLoss.operatingExpenses.total += annualDepreciation;
    updatedData.profitLoss.operatingProfit -= annualDepreciation;
    updatedData.profitLoss.ordinaryProfit -= annualDepreciation;
    updatedData.profitLoss.pretaxProfit -= annualDepreciation;
    updatedData.profitLoss.incomeTax = Math.round(updatedData.profitLoss.pretaxProfit * 0.3);
    updatedData.profitLoss.netProfit = updatedData.profitLoss.pretaxProfit - updatedData.profitLoss.incomeTax;

    // 利益剰余金調整
    updatedData.balanceSheet.equity.retainedEarnings += updatedData.profitLoss.netProfit - baseData.profitLoss.netProfit;
    updatedData.balanceSheet.equity.total = updatedData.balanceSheet.equity.capital + updatedData.balanceSheet.equity.retainedEarnings;
    updatedData.balanceSheet.totalLiabilitiesAndEquity = updatedData.balanceSheet.assets.total;

    // キャッシュフロー
    updatedData.cashFlow.operatingActivities.netIncome = updatedData.profitLoss.netProfit;
    updatedData.cashFlow.operatingActivities.depreciation = updatedData.profitLoss.operatingExpenses.depreciation;
    updatedData.cashFlow.operatingActivities.total = updatedData.cashFlow.operatingActivities.netIncome + 
      updatedData.cashFlow.operatingActivities.depreciation + 
      updatedData.cashFlow.operatingActivities.accountsReceivableChange +
      updatedData.cashFlow.operatingActivities.inventoryChange +
      updatedData.cashFlow.operatingActivities.accountsPayableChange +
      updatedData.cashFlow.operatingActivities.other;

    updatedData.cashFlow.investingActivities.softwareDevelopment -= project.cost;
    updatedData.cashFlow.investingActivities.total += (-project.cost);
    
    updatedData.cashFlow.netCashFlow = updatedData.cashFlow.operatingActivities.total + 
      updatedData.cashFlow.investingActivities.total + 
      updatedData.cashFlow.financingActivities.total;
    updatedData.cashFlow.endingCash = updatedData.balanceSheet.assets.currentAssets.cash;
  }

  updatedData.lastUpdated = new Date().toISOString();
  return updatedData;
};

// 財務比率を計算
export const calculateFinancialRatios = (statement: FinancialStatement) => {
  const { profitLoss, balanceSheet } = statement;
  
  return {
    // 収益性指標
    grossProfitMargin: (profitLoss.grossProfit / profitLoss.revenue) * 100,
    operatingProfitMargin: (profitLoss.operatingProfit / profitLoss.revenue) * 100,
    netProfitMargin: (profitLoss.netProfit / profitLoss.revenue) * 100,
    
    // 効率性指標
    totalAssetTurnover: profitLoss.revenue / balanceSheet.assets.total,
    roa: (profitLoss.netProfit / balanceSheet.assets.total) * 100,
    roe: (profitLoss.netProfit / balanceSheet.equity.total) * 100,
    
    // 安全性指標
    currentRatio: (balanceSheet.assets.currentAssets.total / balanceSheet.liabilities.currentLiabilities.total) * 100,
    debtRatio: (balanceSheet.liabilities.total / balanceSheet.assets.total) * 100,
    equityRatio: (balanceSheet.equity.total / balanceSheet.assets.total) * 100,
    
    // 成長性指標（簡易版）
    softwareAssetRatio: (balanceSheet.assets.fixedAssets.intangibleAssets.software / balanceSheet.assets.total) * 100
  };
};