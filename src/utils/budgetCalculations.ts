import { 
  Budget, 
  BudgetItem, 
  BudgetAnalysis, 
  BudgetRisk, 
  BudgetRecommendation, 
  ROICalculation, 
  AnnualBenefit, 
  BudgetCategory,
  MonthlyBudget 
} from '../types/budget';

export const calculateBudgetAnalysis = (items: BudgetItem[]): BudgetAnalysis => {
  const totalBudget = items.reduce((sum, item) => sum + item.totalAmount, 0);
  
  // カテゴリ別分析
  const categoryBreakdown = {} as BudgetAnalysis['categoryBreakdown'];
  const categories: BudgetCategory[] = ['personnel', 'external', 'infrastructure', 'software', 'hardware', 'travel', 'training', 'other'];
  
  categories.forEach(category => {
    const categoryItems = items.filter(item => item.category === category);
    const amount = categoryItems.reduce((sum, item) => sum + item.totalAmount, 0);
    categoryBreakdown[category] = {
      amount,
      percentage: totalBudget > 0 ? (amount / totalBudget) * 100 : 0,
      items: categoryItems.length
    };
  });

  // 月次分布
  const monthlyDistribution: MonthlyBudget[] = [];
  for (let month = 1; month <= 12; month++) {
    const plannedAmount = items.reduce((sum, item) => {
      const monthlySchedule = item.schedule.find(s => s.month === month);
      return sum + (monthlySchedule?.plannedAmount || 0);
    }, 0);

    monthlyDistribution.push({
      month,
      plannedAmount
    });
  }

  // リスク分析
  const risks = generateBudgetRisks(items, totalBudget);
  
  // 推奨事項
  const recommendations = generateBudgetRecommendations(categoryBreakdown, totalBudget);

  return {
    totalBudget,
    categoryBreakdown,
    monthlyDistribution,
    risks,
    recommendations
  };
};

export const generateBudgetRisks = (items: BudgetItem[], totalBudget: number): BudgetRisk[] => {
  const risks: BudgetRisk[] = [];

  // 人件費比率チェック
  const personnelRatio = items
    .filter(item => item.category === 'personnel')
    .reduce((sum, item) => sum + item.totalAmount, 0) / totalBudget;

  if (personnelRatio > 0.7) {
    risks.push({
      id: 'high-personnel-ratio',
      category: 'cost',
      severity: 'medium',
      description: '人件費比率が70%を超過',
      impact: '人員計画変更時の予算への大きな影響',
      mitigation: '外部リソース活用の検討、スキル向上による効率化',
      probability: 60
    });
  }

  // 外注依存度チェック
  const externalRatio = items
    .filter(item => item.category === 'external')
    .reduce((sum, item) => sum + item.totalAmount, 0) / totalBudget;

  if (externalRatio > 0.5) {
    risks.push({
      id: 'high-external-dependency',
      category: 'external',
      severity: 'high',
      description: '外部委託比率が50%を超過',
      impact: 'ベンダー依存による品質・スケジュールリスク',
      mitigation: '内製化推進、複数ベンダーの確保',
      probability: 75
    });
  }

  // 大型予算項目チェック
  const largeItems = items.filter(item => item.totalAmount > totalBudget * 0.2);
  if (largeItems.length > 0) {
    risks.push({
      id: 'large-budget-items',
      category: 'cost',
      severity: 'medium',
      description: '単一項目で全体の20%以上を占める予算項目が存在',
      impact: '当該項目の変動が全体予算に大きく影響',
      mitigation: '詳細な見積もり精度向上、段階的実行の検討',
      probability: 40
    });
  }

  // スケジュールリスク
  const frontLoadedItems = items.filter(item => {
    const firstQuarterAmount = item.schedule
      .filter(s => s.month <= 3)
      .reduce((sum, s) => sum + s.plannedAmount, 0);
    return firstQuarterAmount > item.totalAmount * 0.6;
  });

  if (frontLoadedItems.length > items.length * 0.3) {
    risks.push({
      id: 'schedule-front-loaded',
      category: 'schedule',
      severity: 'medium',
      description: 'プロジェクト初期に予算が集中',
      impact: '初期段階での予算執行遅延リスク',
      mitigation: '段階的な予算執行計画の策定',
      probability: 50
    });
  }

  return risks;
};

export const generateBudgetRecommendations = (
  categoryBreakdown: BudgetAnalysis['categoryBreakdown'], 
  totalBudget: number
): BudgetRecommendation[] => {
  const recommendations: BudgetRecommendation[] = [];

  // インフラ費最適化
  if (categoryBreakdown.infrastructure.percentage > 15) {
    recommendations.push({
      id: 'optimize-infrastructure',
      type: 'cost_reduction',
      title: 'インフラコスト最適化',
      description: 'クラウドリソースの最適化、予約インスタンス活用による費用削減',
      expectedSavings: Math.round(categoryBreakdown.infrastructure.amount * 0.2),
      implementationCost: 50000,
      priority: 'high'
    });
  }

  // ソフトウェアライセンス統合
  if (categoryBreakdown.software.percentage > 10) {
    recommendations.push({
      id: 'consolidate-licenses',
      type: 'efficiency',
      title: 'ソフトウェアライセンス統合',
      description: '類似ツールの統合、ボリュームディスカウントの活用',
      expectedSavings: Math.round(categoryBreakdown.software.amount * 0.15),
      implementationCost: 30000,
      priority: 'medium'
    });
  }

  // 研修効率化
  if (categoryBreakdown.training.percentage > 5) {
    recommendations.push({
      id: 'optimize-training',
      type: 'efficiency',
      title: '研修プログラム効率化',
      description: 'オンライン研修の活用、内製研修の推進',
      expectedSavings: Math.round(categoryBreakdown.training.amount * 0.3),
      implementationCost: 20000,
      priority: 'medium'
    });
  }

  // 段階的実行提案
  if (totalBudget > 50000000) {
    recommendations.push({
      id: 'phased-execution',
      type: 'risk_mitigation',
      title: '段階的プロジェクト実行',
      description: 'プロジェクトを複数フェーズに分割し、リスク軽減と品質向上',
      expectedSavings: Math.round(totalBudget * 0.05),
      implementationCost: 100000,
      priority: 'high'
    });
  }

  return recommendations;
};

export const calculateROI = (
  investment: number,
  annualRevenue: number,
  annualCostSavings: number,
  years: number = 5,
  discountRate: number = 0.1
): ROICalculation => {
  const benefits: AnnualBenefit[] = [];
  let cumulativeCashFlow = -investment;
  let paybackPeriod = years;
  
  for (let year = 1; year <= years; year++) {
    const totalBenefit = annualRevenue + annualCostSavings;
    const discountedBenefit = totalBenefit / Math.pow(1 + discountRate, year);
    
    benefits.push({
      year,
      revenue: annualRevenue,
      costSavings: annualCostSavings,
      totalBenefit,
      discountedBenefit
    });

    cumulativeCashFlow += totalBenefit;
    if (cumulativeCashFlow > 0 && paybackPeriod === years) {
      paybackPeriod = year - 1 + (investment - (cumulativeCashFlow - totalBenefit)) / totalBenefit;
    }
  }

  const npv = benefits.reduce((sum, benefit) => sum + benefit.discountedBenefit, 0) - investment;
  
  // IRR計算（簡易版）
  let irr = 0.1;
  for (let i = 0; i < 100; i++) {
    let npvAtRate = -investment;
    for (const benefit of benefits) {
      npvAtRate += benefit.totalBenefit / Math.pow(1 + irr, benefit.year);
    }
    
    if (Math.abs(npvAtRate) < 1000) break;
    irr += npvAtRate > 0 ? 0.01 : -0.01;
    if (irr < 0) irr = 0;
    if (irr > 1) irr = 1;
  }

  const totalBenefits = benefits.reduce((sum, benefit) => sum + benefit.totalBenefit, 0);
  const roi = ((totalBenefits - investment) / investment) * 100;

  return {
    investment,
    benefits,
    npv,
    irr: irr * 100,
    paybackPeriod: Math.min(paybackPeriod, years),
    roi
  };
};

export const generateBudgetTemplate = (
  projectType: 'web' | 'mobile' | 'infrastructure' | 'ai',
  totalBudget: number
): BudgetItem[] => {
  const templates = {
    web: {
      personnel: 0.55,
      external: 0.20,
      infrastructure: 0.10,
      software: 0.08,
      hardware: 0.02,
      travel: 0.02,
      training: 0.02,
      other: 0.01
    },
    mobile: {
      personnel: 0.60,
      external: 0.15,
      infrastructure: 0.08,
      software: 0.10,
      hardware: 0.03,
      travel: 0.02,
      training: 0.01,
      other: 0.01
    },
    infrastructure: {
      personnel: 0.40,
      external: 0.25,
      infrastructure: 0.25,
      software: 0.05,
      hardware: 0.03,
      travel: 0.01,
      training: 0.01,
      other: 0.00
    },
    ai: {
      personnel: 0.50,
      external: 0.20,
      infrastructure: 0.15,
      software: 0.08,
      hardware: 0.05,
      travel: 0.01,
      training: 0.01,
      other: 0.00
    }
  };

  const template = templates[projectType];
  const items: BudgetItem[] = [];

  Object.entries(template).forEach(([category, ratio], index) => {
    const amount = Math.round(totalBudget * ratio);
    if (amount > 0) {
      // 月次スケジュール生成（簡易版）
      const monthlyAmount = Math.round(amount / 6); // 6ヶ月分散
      const schedule = Array.from({ length: 12 }, (_, monthIndex) => ({
        month: monthIndex + 1,
        plannedAmount: monthIndex < 6 ? monthlyAmount : 0
      }));

      items.push({
        id: `template-${index}`,
        category: category as BudgetCategory,
        subcategory: getCategorySubcategory(category as BudgetCategory),
        description: getCategoryDescription(category as BudgetCategory, projectType),
        unitPrice: amount,
        quantity: 1,
        unit: 'LS',
        totalAmount: amount,
        isFixed: category === 'personnel',
        schedule,
        notes: `${projectType}プロジェクト用テンプレート項目`
      });
    }
  });

  return items;
};

const getCategorySubcategory = (category: BudgetCategory): string => {
  const subcategories = {
    personnel: '開発要員',
    external: '外部委託',
    infrastructure: 'クラウドサービス',
    software: '開発ツール',
    hardware: '開発機器',
    travel: '出張費',
    training: '技術研修',
    other: 'その他経費'
  };
  return subcategories[category];
};

const getCategoryDescription = (category: BudgetCategory, projectType: string): string => {
  const descriptions = {
    personnel: `${projectType}プロジェクト開発チームの人件費`,
    external: `${projectType}プロジェクトの外部委託費用`,
    infrastructure: `${projectType}プロジェクト用インフラ・クラウド費用`,
    software: `${projectType}開発に必要なソフトウェアライセンス`,
    hardware: `${projectType}開発用ハードウェア・機器`,
    travel: `${projectType}プロジェクト関連の出張・交通費`,
    training: `${projectType}開発チーム向け技術研修費`,
    other: `${projectType}プロジェクトのその他経費`
  };
  return descriptions[category];
};