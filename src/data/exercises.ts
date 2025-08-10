import { Exercise } from '../types/learning';

export const exercises: Exercise[] = [
  {
    id: 'roi-calculation-basic',
    type: 'roi',
    title: 'ROI計算の基礎',
    description: 'プロジェクトのROI（投資収益率）を計算し、投資判断を行う',
    difficulty: 'beginner',
    parameters: [
      {
        name: 'initialInvestment',
        value: 5000000,
        unit: '円',
        description: '初期投資額'
      },
      {
        name: 'annualRevenue',
        value: 2000000,
        unit: '円/年',
        description: '年間売上増加'
      },
      {
        name: 'annualCosts',
        value: 500000,
        unit: '円/年',
        description: '年間運用コスト'
      },
      {
        name: 'years',
        value: 3,
        unit: '年',
        description: '評価期間'
      }
    ],
    expectedAnswer: {
      value: 90,
      unit: '%',
      breakdown: [
        {
          step: 1,
          description: '年間純利益の計算',
          calculation: '2,000,000 - 500,000',
          result: 1500000
        },
        {
          step: 2,
          description: '3年間の総利益',
          calculation: '1,500,000 × 3',
          result: 4500000
        },
        {
          step: 3,
          description: 'ROIの計算',
          calculation: '(4,500,000 - 5,000,000) ÷ 5,000,000 × 100',
          result: 90
        }
      ]
    },
    explanation: `
ROI（Return on Investment）は投資効率を測定する重要な指標です。
この例では、3年間で初期投資を90%回収できることを意味しています。

計算式：ROI = (総利益 - 初期投資) ÷ 初期投資 × 100

一般的に、ROIが15%以上であれば良好な投資とされます。
ただし、業界やリスクレベルによって基準は異なります。
    `,
    relatedConcepts: ['NPV', 'IRR', 'ペイバック期間', '割引現在価値']
  },
  {
    id: 'irr-calculation-intermediate',
    type: 'irr',
    title: 'IRR計算と意思決定',
    description: '内部収益率（IRR）を理解し、複数の投資案の比較検討を行う',
    difficulty: 'intermediate',
    parameters: [
      {
        name: 'initialInvestment',
        value: 10000000,
        unit: '円',
        description: '初期投資額'
      },
      {
        name: 'cashFlow1',
        value: 3000000,
        unit: '円',
        description: '1年目キャッシュフロー'
      },
      {
        name: 'cashFlow2',
        value: 4000000,
        unit: '円',
        description: '2年目キャッシュフロー'
      },
      {
        name: 'cashFlow3',
        value: 5000000,
        unit: '円',
        description: '3年目キャッシュフロー'
      },
      {
        name: 'wacc',
        value: 8,
        unit: '%',
        description: '加重平均資本コスト（WACC）'
      }
    ],
    expectedAnswer: {
      value: 18.7,
      unit: '%',
      breakdown: [
        {
          step: 1,
          description: 'IRR方程式の設定',
          calculation: '0 = -10,000,000 + 3,000,000/(1+r) + 4,000,000/(1+r)² + 5,000,000/(1+r)³',
          result: 0
        },
        {
          step: 2,
          description: '試行錯誤によるIRR算出',
          calculation: 'r = 0.187 (18.7%)',
          result: 18.7
        },
        {
          step: 3,
          description: 'WACC比較による判定',
          calculation: '18.7% > 8.0%',
          result: 1
        }
      ]
    },
    explanation: `
IRR（Internal Rate of Return：内部収益率）は、NPVをゼロにする割引率です。
この例では18.7%となり、WACC（8%）を上回っているため、投資を実行すべきです。

IRRの解釈：
- IRR > WACC：投資を実行すべき
- IRR < WACC：投資を見送るべき
- IRR = WACC：損益分岐点

IRRは複数の投資案を比較する際に特に有用ですが、
投資規模が大きく異なる場合はNPVも併せて検討することが重要です。
    `,
    relatedConcepts: ['NPV', 'WACC', 'リスク調整割引率', 'キャッシュフロー分析']
  },
  {
    id: 'depreciation-straight-line',
    type: 'depreciation',
    title: '定額法による減価償却',
    description: 'システム開発費の減価償却計算と会計処理を理解する',
    difficulty: 'beginner',
    parameters: [
      {
        name: 'assetCost',
        value: 12000000,
        unit: '円',
        description: '資産取得価額'
      },
      {
        name: 'residualValue',
        value: 0,
        unit: '円',
        description: '残存価額'
      },
      {
        name: 'usefulLife',
        value: 5,
        unit: '年',
        description: '耐用年数'
      },
      {
        name: 'monthsInFirstYear',
        value: 9,
        unit: 'ヶ月',
        description: '初年度使用月数'
      }
    ],
    expectedAnswer: {
      value: 1800000,
      unit: '円',
      breakdown: [
        {
          step: 1,
          description: '年間償却額の計算',
          calculation: '(12,000,000 - 0) ÷ 5年',
          result: 2400000
        },
        {
          step: 2,
          description: '月割償却額の計算',
          calculation: '2,400,000 ÷ 12ヶ月',
          result: 200000
        },
        {
          step: 3,
          description: '初年度償却額の計算',
          calculation: '200,000 × 9ヶ月',
          result: 1800000
        }
      ]
    },
    explanation: `
定額法による減価償却は、最も一般的な償却方法です。
システム開発費も無形固定資産として5年間で償却するのが一般的です。

減価償却の仕訳（初年度）：
借方：減価償却費 1,800,000円
貸方：ソフトウェア償却累計額 1,800,000円

月割計算により、資産を取得した月から償却を開始します。
定額法は計算が簡単で、毎期同じ金額を費用計上するため、
業績への影響が平準化される特徴があります。
    `,
    relatedConcepts: ['無形固定資産', '耐用年数', '残存価額', '月割計算']
  },
  {
    id: 'budget-variance-analysis',
    type: 'budget',
    title: '予算差異分析',
    description: '実績と予算の差異を分析し、原因究明と対策を検討する',
    difficulty: 'intermediate',
    parameters: [
      {
        name: 'budgetedAmount',
        value: 15000000,
        unit: '円',
        description: '予算額'
      },
      {
        name: 'actualAmount',
        value: 18000000,
        unit: '円',
        description: '実績額'
      },
      {
        name: 'budgetedQuantity',
        value: 150,
        unit: '人日',
        description: '予算工数'
      },
      {
        name: 'actualQuantity',
        value: 180,
        unit: '人日',
        description: '実績工数'
      },
      {
        name: 'budgetedRate',
        value: 100000,
        unit: '円/人日',
        description: '予算単価'
      },
      {
        name: 'actualRate',
        value: 100000,
        unit: '円/人日',
        description: '実績単価'
      }
    ],
    expectedAnswer: {
      value: 3000000,
      unit: '円（不利差異）',
      breakdown: [
        {
          step: 1,
          description: '総差異の計算',
          calculation: '18,000,000 - 15,000,000',
          result: 3000000
        },
        {
          step: 2,
          description: '数量差異の計算',
          calculation: '(180 - 150) × 100,000',
          result: 3000000
        },
        {
          step: 3,
          description: '単価差異の計算',
          calculation: '(100,000 - 100,000) × 180',
          result: 0
        }
      ]
    },
    explanation: `
予算差異分析により、コスト超過の原因が数量（工数）増加にあることが判明しました。

差異分析の結果：
- 総差異：300万円（不利差異）
- 数量差異：300万円（不利差異）← 工数20%増加が原因
- 単価差異：0円 ← 単価は予算通り

原因と対策：
1. 要件変更による作業量増加
2. 技術的困難度の過小評価
3. チームのスキル不足

今後の対策：
- より詳細な要件定義の実施
- 技術リスクの事前評価強化
- スキル向上研修の実施
    `,
    relatedConcepts: ['予算管理', 'コスト管理', '差異分析', '原価計算']
  },
  {
    id: 'accounting-asset-vs-expense',
    type: 'accounting',
    title: '資産化vs費用化の判定',
    description: 'システム開発費用の会計処理判定を行う実践的な演習',
    difficulty: 'advanced',
    parameters: [
      {
        name: 'developmentCost',
        value: 8000000,
        unit: '円',
        description: '開発費用総額'
      },
      {
        name: 'planningStageCost',
        value: 1500000,
        unit: '円',
        description: '企画・要件定義費用'
      },
      {
        name: 'developmentStageCost',
        value: 5000000,
        unit: '円',
        description: '開発・製造費用'
      },
      {
        name: 'testingStageCost',
        value: 1000000,
        unit: '円',
        description: 'テスト・検証費用'
      },
      {
        name: 'trainingCost',
        value: 500000,
        unit: '円',
        description: '研修・導入費用'
      },
      {
        name: 'expectedRevenue',
        value: 3000000,
        unit: '円/年',
        description: '期待年間売上増加'
      }
    ],
    expectedAnswer: {
      value: 6000000,
      unit: '円（資産計上）',
      breakdown: [
        {
          step: 1,
          description: '資産計上対象の判定',
          calculation: '開発・製造費用 + テスト費用',
          result: 6000000
        },
        {
          step: 2,
          description: '費用計上対象の判定',
          calculation: '企画費用 + 研修費用',
          result: 2000000
        },
        {
          step: 3,
          description: '資産計上率',
          calculation: '6,000,000 ÷ 8,000,000 × 100',
          result: 75
        }
      ]
    },
    explanation: `
システム開発費の会計処理判定：

【資産計上対象（600万円）】
- 開発・製造費用：500万円
- テスト・検証費用：100万円
→ 完成したソフトウェアの機能に直接寄与

【費用計上対象（200万円）】
- 企画・要件定義費用：150万円（調査研究段階）
- 研修・導入費用：50万円（付随費用）

判定基準：
1. 将来の経済的便益の確実性 ✓
2. 技術的実現可能性 ✓
3. 完成・使用の意図 ✓
4. 必要な資源の確保 ✓

年間売上増加300万円が見込まれるため、
2年で投資回収可能な合理的な投資判断です。
    `,
    relatedConcepts: ['無形固定資産', '資産計上基準', '将来経済便益', 'ソフトウェア会計']
  }
];