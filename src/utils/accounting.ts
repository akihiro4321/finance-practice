import { 
  Project, 
  AccountingTreatment, 
  JournalEntry, 
  DetailedJournalEntry, 
  DepreciationEntry, 
  FinancialImpact,
  AccountingDecision 
} from '../types';

export const generateJournalEntries = (
  project: Project, 
  treatment: AccountingTreatment, 
  decision: AccountingDecision
): DetailedJournalEntry => {
  const currentDate = new Date().toISOString().split('T')[0];
  const mainEntry: JournalEntry[] = [];
  const relatedEntries: JournalEntry[] = [];
  let depreciationSchedule: DepreciationEntry[] | undefined;

  if (treatment === 'expense') {
    // 費用化の場合
    mainEntry.push(
      {
        id: `${project.id}-expense-debit`,
        date: currentDate,
        account: 'システム開発費',
        debit: project.cost,
        credit: 0,
        description: `${project.name}の開発費用`,
        category: 'expense'
      },
      {
        id: `${project.id}-expense-credit`,
        date: currentDate,
        account: '現金・預金',
        debit: 0,
        credit: project.cost,
        description: `${project.name}の開発費用支払い`,
        category: 'asset'
      }
    );
  } else {
    // 資産化の場合
    mainEntry.push(
      {
        id: `${project.id}-asset-debit`,
        date: currentDate,
        account: 'ソフトウェア資産',
        debit: project.cost,
        credit: 0,
        description: `${project.name}のソフトウェア資産計上`,
        category: 'asset'
      },
      {
        id: `${project.id}-asset-credit`,
        date: currentDate,
        account: '現金・預金',
        debit: 0,
        credit: project.cost,
        description: `${project.name}の開発費用支払い`,
        category: 'asset'
      }
    );

    // 減価償却スケジュール生成
    depreciationSchedule = generateDepreciationSchedule(project.cost, 5);

    // 月次減価償却仕訳例
    const monthlyDepreciation = project.cost / (5 * 12);
    relatedEntries.push(
      {
        id: `${project.id}-depreciation-debit`,
        date: currentDate,
        account: 'ソフトウェア減価償却費',
        debit: monthlyDepreciation,
        credit: 0,
        description: `${project.name}の月次減価償却`,
        category: 'expense'
      },
      {
        id: `${project.id}-depreciation-credit`,
        date: currentDate,
        account: 'ソフトウェア資産',
        debit: 0,
        credit: monthlyDepreciation,
        description: `${project.name}の減価償却累計額`,
        category: 'asset'
      }
    );
  }

  const impact = calculateFinancialImpact(project, treatment);
  const explanation = generateExplanation(project, treatment, decision);

  return {
    mainEntry,
    relatedEntries: relatedEntries.length > 0 ? relatedEntries : undefined,
    depreciationSchedule,
    explanation,
    impact
  };
};

export const generateDepreciationSchedule = (
  assetValue: number, 
  years: number = 5
): DepreciationEntry[] => {
  const annualDepreciation = assetValue / years;
  const schedule: DepreciationEntry[] = [];

  for (let year = 1; year <= years; year++) {
    const beginningValue = year === 1 ? assetValue : schedule[year - 2].endingValue;
    const depreciationAmount = year === years 
      ? beginningValue // 最終年は残額全て
      : annualDepreciation;
    const endingValue = beginningValue - depreciationAmount;

    schedule.push({
      year,
      beginningValue,
      depreciationAmount: Math.round(depreciationAmount),
      endingValue: Math.round(endingValue)
    });
  }

  return schedule;
};

export const calculateFinancialImpact = (
  project: Project, 
  treatment: AccountingTreatment
): FinancialImpact => {
  if (treatment === 'expense') {
    return {
      currentYear: {
        profitLoss: -project.cost, // 全額費用計上で利益減少
        balanceSheet: {
          assets: -project.cost, // 現金減少
          liabilities: 0
        },
        cashFlow: -project.cost // キャッシュアウト
      },
      futureYears: [] // 費用化の場合、将来影響なし
    };
  } else {
    // 資産化の場合
    const annualDepreciation = project.cost / 5;
    const futureYears = [];

    for (let year = 1; year <= 5; year++) {
      futureYears.push({
        year,
        profitLoss: -annualDepreciation, // 年次減価償却による利益減少
        balanceSheet: {
          assets: -annualDepreciation, // 資産価値減少
          liabilities: 0
        }
      });
    }

    return {
      currentYear: {
        profitLoss: -annualDepreciation / 12 * 12, // 月次減価償却（当年分）
        balanceSheet: {
          assets: 0, // 現金減少とソフトウェア資産増加で相殺
          liabilities: 0
        },
        cashFlow: -project.cost // 初期キャッシュアウト
      },
      futureYears
    };
  }
};

export const generateExplanation = (
  project: Project, 
  treatment: AccountingTreatment, 
  decision: AccountingDecision
): string => {
  const baseExplanation = treatment === 'expense' 
    ? `${project.name}の開発費用 ${project.cost.toLocaleString()}円を費用として即時計上しました。`
    : `${project.name}の開発費用 ${project.cost.toLocaleString()}円をソフトウェア資産として計上しました。`;

  const phaseExplanation = getPhaseExplanation(project.phase, treatment);
  const criteriaExplanation = treatment === 'capitalize' 
    ? getCriteriaExplanation(decision.criteria)
    : '';

  const businessImpact = getBusinessImpact(project, treatment);

  return `${baseExplanation}\n\n${phaseExplanation}\n\n${criteriaExplanation}\n\n${businessImpact}`.trim();
};

const getPhaseExplanation = (phase: string, treatment: AccountingTreatment): string => {
  switch (phase) {
    case 'requirements':
      return '要件定義・設計段階では、将来の経済的便益が不確実なため、通常は費用として計上されます。';
    case 'development':
      return treatment === 'capitalize'
        ? '開発・テスト段階では、資産計上の要件を満たす場合にソフトウェア資産として計上できます。'
        : '開発・テスト段階ですが、資産計上の要件を満たさないため費用として計上しました。';
    case 'maintenance':
      return '運用・保守段階での費用は、既存システムの機能維持にかかる費用として扱われ、通常は費用計上されます。';
    default:
      return '';
  }
};

const getCriteriaExplanation = (criteria: any): string => {
  const satisfiedCount = Object.values(criteria).filter(Boolean).length;
  const totalCount = Object.keys(criteria).length;

  if (satisfiedCount >= 3) {
    return `資産計上の判断基準 ${satisfiedCount}/${totalCount} 項目を満たしており、資産計上が適切です。`;
  } else if (satisfiedCount >= 2) {
    return `資産計上の判断基準 ${satisfiedCount}/${totalCount} 項目を満たしていますが、より慎重な検討が必要です。`;
  } else {
    return `資産計上の判断基準 ${satisfiedCount}/${totalCount} 項目のみの満足のため、費用計上が適切です。`;
  }
};

const getBusinessImpact = (project: Project, treatment: AccountingTreatment): string => {
  if (treatment === 'expense') {
    return `当期の営業利益は ${project.cost.toLocaleString()}円 減少しますが、将来年度への影響はありません。税務上の損金算入により、税負担軽減効果も期待できます。`;
  } else {
    const annualDepreciation = Math.round(project.cost / 5);
    return `当期の営業利益への影響は減価償却費 ${annualDepreciation.toLocaleString()}円の減少に留まり、残りは今後5年間に渡って費用配分されます。これにより期間損益の平準化が図れます。`;
  }
};

export const calculateConfidenceScore = (
  project: Project, 
  criteria: any, 
  treatment: AccountingTreatment
): number => {
  let score = 50; // 基準点

  // 判断基準の満足度
  const satisfiedCount = Object.values(criteria).filter(Boolean).length;
  score += satisfiedCount * 15;

  // プロジェクトの特性による調整
  if (project.complexity === 'high') {
    score -= 10;
  } else if (project.complexity === 'low') {
    score += 5;
  }

  if (project.riskLevel === 'high') {
    score -= 15;
  } else if (project.riskLevel === 'low') {
    score += 10;
  }

  // 金額による調整
  if (project.cost > 50000000) { // 5千万円以上
    score += 10;
  } else if (project.cost < 5000000) { // 5百万円未満
    score -= 5;
  }

  // 期間による調整
  if (project.duration > 12) {
    score += 5;
  } else if (project.duration < 3) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
};