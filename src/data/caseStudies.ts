import { CaseStudy } from '../types/learning';

export const caseStudies: CaseStudy[] = [
  {
    id: 'ecommerce-renewal',
    title: 'ECサイトリニューアルプロジェクト',
    description: '既存ECサイトの全面リニューアルにおける会計処理判断',
    category: 'development',
    difficulty: 'intermediate',
    estimatedTime: 45,
    scenario: `
中堅アパレル企業のファッション通販サイトが、売上の伸び悩みと競合他社との差別化のため、
ECサイトの全面リニューアルを計画しています。新システムではAI推薦機能、
パーソナライゼーション、モバイル最適化を実装し、売上向上を目指しています。

プロジェクトチームは、この開発費用を資産計上すべきか費用計上すべきかで議論しています。
会計担当者は保守的に費用計上を主張し、システム開発チームは将来効果を理由に資産計上を主張しています。

あなたは財務部長として、適切な会計処理方針を決定する必要があります。
    `,
    companyProfile: {
      name: 'ファッションライフ株式会社',
      industry: 'アパレル・ファッション',
      size: 'sme',
      revenue: 2500000000,
      employees: 150,
      businessModel: 'B2C ECコマース（自社ブランド）'
    },
    projectDetails: {
      name: 'ECサイトリニューアルプロジェクト',
      background: '既存システムの老朽化、競合他社との機能差、モバイル対応不足',
      objectives: [
        '売上を年間15%向上',
        'モバイル経由売上を40%から60%に向上',
        '顧客満足度の改善（NPS向上）',
        'システム運用コストの20%削減'
      ],
      scope: 'フロントエンド全面刷新、AI推薦エンジン導入、決済システム強化、管理画面刷新',
      budget: 12000000,
      timeline: 8,
      team: [
        { role: 'プロジェクトマネージャー', name: '田中 一郎', experience: '10年' },
        { role: 'システムアーキテクト', name: '佐藤 花子', experience: '8年' },
        { role: 'フロントエンド開発者', name: '鈴木 太郎', experience: '5年' },
        { role: 'バックエンド開発者', name: '山田 良子', experience: '6年' },
        { role: 'UIUXデザイナー', name: '高橋 健一', experience: '4年' }
      ],
      constraints: [
        '既存システムとの並行運用期間が必要',
        'ピークシーズン（12月）には影響を与えられない',
        '外部ベンダーとの調整が必要'
      ],
      successCriteria: [
        'システム安定稼働（可用性99.9%以上）',
        'ページ読み込み速度2秒以内',
        '売上目標達成（15%向上）',
        'プロジェクト予算内完了'
      ]
    },
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'このプロジェクトで最も重要な資産計上の判断基準は何ですか？',
        options: [
          { id: 'a', text: 'プロジェクト予算が1000万円を超えている', isCorrect: false },
          { id: 'b', text: '将来の経済的便益が定量的に見込める', isCorrect: true },
          { id: 'c', text: '開発期間が6ヶ月を超えている', isCorrect: false },
          { id: 'd', text: '外部ベンダーを使用している', isCorrect: false }
        ],
        correctAnswer: 'b',
        explanation: '資産計上の最重要基準は将来の経済的便益です。このプロジェクトでは売上15%向上、運用コスト20%削減という定量的な便益が期待でき、これが資産計上を支持する主要根拠となります。',
        points: 10,
        hints: ['会計基準では将来の経済的便益が最重要視されます']
      },
      {
        id: 'q2',
        type: 'calculation',
        question: '年間売上25億円、期待される売上向上15%の場合、年間便益額はいくらですか？',
        correctAnswer: 375000000,
        explanation: '年間便益 = 25億円 × 15% = 3.75億円。ただし、これは売上増加分であり、利益ベースでの便益算出も必要です。',
        points: 15,
        hints: ['売上 × 向上率で計算', '利益率も考慮が必要']
      },
      {
        id: 'q3',
        type: 'scenario',
        question: 'このプロジェクトを資産計上した場合の会計仕訳を作成してください。',
        explanation: `
借方：ソフトウェア資産 12,000,000円
貸方：現金・預金 12,000,000円

資産計上により、開発費用は無形固定資産として計上され、5年間で定額償却されます。
年間償却費は240万円となり、損益計算書への影響は分散されます。
        `,
        points: 20
      }
    ],
    solutions: [
      {
        questionId: 'q1',
        approach: '資産計上要件の体系的検討',
        reasoning: '将来の経済的便益、技術的実現可能性、完成意図、資源確保の4要件を確認',
        bestPractices: [
          '定量的な効果測定指標の設定',
          '保守的な便益見積もりの採用',
          '段階的な効果検証の実施'
        ],
        commonMistakes: [
          'プロジェクト規模のみでの判断',
          '技術的側面のみの検討',
          '短期的視点での評価'
        ]
      }
    ],
    learningObjectives: [
      'システム開発費用の資産計上要件を理解する',
      '将来の経済効果を定量的に評価する方法を学ぶ',
      'ビジネス要件と会計処理の関連性を理解する',
      '実務での意思決定プロセスを体験する'
    ],
    tags: ['資産計上', 'システム開発', 'ECサイト', 'ROI', '判断基準']
  },
  {
    id: 'cloud-migration',
    title: 'クラウド移行プロジェクト',
    description: 'オンプレミスシステムのクラウド移行における会計処理',
    category: 'migration',
    difficulty: 'advanced',
    estimatedTime: 60,
    scenario: `
製造業の中堅企業が、コスト削減と業務効率化を目的として、
オンプレミスの基幹システムをクラウドに移行するプロジェクトを開始します。

移行に際して、既存システムの除却処理、移行費用の会計処理、
新クラウドシステムの初期設定費用の扱いなど、
複数の会計処理が複雑に絡み合っています。

CFOとして、これらの会計処理方針を総合的に決定する必要があります。
    `,
    companyProfile: {
      name: '高精密機器製造株式会社',
      industry: '精密機器製造',
      size: 'large',
      revenue: 8000000000,
      employees: 500,
      businessModel: 'B2B製造業（特注品中心）'
    },
    projectDetails: {
      name: 'クラウド移行プロジェクト',
      background: 'システム老朽化、保守コスト増大、災害対策強化の必要性',
      objectives: [
        'システム運用コストを30%削減',
        'システム可用性を99.9%に向上',
        '災害復旧時間を72時間から4時間に短縮',
        '新機能開発サイクルを50%短縮'
      ],
      scope: 'ERP、CRM、生産管理システムのクラウド移行、データ移行、セキュリティ強化',
      budget: 45000000,
      timeline: 12,
      team: [
        { role: 'プログラムマネージャー', name: '林 部長', experience: '15年' },
        { role: 'クラウドアーキテクト', name: '森 主任', experience: '8年' },
        { role: 'データ移行専門家', name: '川村 さん', experience: '10年' },
        { role: 'セキュリティ専門家', name: '池田 課長', experience: '12年' }
      ],
      constraints: [
        '製造ラインの稼働に影響を与えられない',
        'セキュリティ基準の厳格な遵守が必要',
        '段階的移行による複雑性'
      ],
      successCriteria: [
        '全システムの安定稼働',
        'データ移行100%完了',
        '運用コスト目標達成',
        'セキュリティ監査合格'
      ]
    },
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: '既存オンプレミスシステム（簿価2000万円）の除却処理として適切なものは？',
        options: [
          { id: 'a', text: '特別損失として2000万円を一括計上', isCorrect: true },
          { id: 'b', text: '移行費用の一部として資産化', isCorrect: false },
          { id: 'c', text: '5年間で分割して損失計上', isCorrect: false },
          { id: 'd', text: '新システムの取得価額から控除', isCorrect: false }
        ],
        correctAnswer: 'a',
        explanation: '既存システムの除却時は、残存簿価を特別損失として一括計上するのが原則です。移行プロジェクトの一部として処理することはできません。',
        points: 15
      },
      {
        id: 'q2',
        type: 'scenario',
        question: 'クラウド移行費用4500万円の内訳を分析し、資産化すべき部分と費用化すべき部分を分けてください。',
        explanation: `
移行費用の分類：

【資産化対象（約2000万円）】
・新システムの初期設定・カスタマイズ費用
・データ変換・移行プログラム開発費
・システム統合費用
・初期ライセンス費用

【費用化対象（約2500万円）】
・プロジェクト管理費用
・研修費用
・並行稼働期間の追加コスト
・コンサルティング費用
        `,
        points: 25
      }
    ],
    solutions: [
      {
        questionId: 'q1',
        approach: '資産除却の会計原則適用',
        reasoning: '使用停止により経済的便益が失われたため、残存簿価を損失計上',
        calculations: [
          {
            step: 1,
            description: '既存システム簿価の確認',
            calculation: '取得価額 - 減価償却累計額',
            result: 20000000
          },
          {
            step: 2,
            description: '除却損の計上',
            calculation: '簿価 - 処分価額（0円）',
            result: 20000000
          }
        ],
        bestPractices: [
          '除却のタイミングを適切に設定',
          '税務上の処理との整合性確保',
          '稟議・承認プロセスの適切な実行'
        ],
        commonMistakes: [
          '移行費用との混同',
          '段階的除却による複雑化',
          '税務リスクの見落とし'
        ]
      }
    ],
    learningObjectives: [
      'システム除却の会計処理を理解する',
      '移行費用の分類方法を学ぶ',
      'クラウド移行特有の会計課題を理解する',
      '複合的な会計判断の進め方を習得する'
    ],
    tags: ['クラウド移行', '除却処理', 'システム移行', '複合判断', '特別損失']
  },
  {
    id: 'ai-development',
    title: 'AI システム開発プロジェクト',
    description: '機械学習システムの開発における会計処理の特殊性',
    category: 'development',
    difficulty: 'advanced',
    estimatedTime: 50,
    scenario: `
フィンテック企業が、与信審査の精度向上を目的として、
機械学習を活用した与信判定AIシステムの開発を行います。

このプロジェクトでは、データサイエンティストによるアルゴリズム開発、
大量の学習データの前処理、モデルの訓練・検証、
本番環境への実装など、従来のシステム開発とは異なる工程が含まれます。

これらの費用をどのように会計処理するかが課題となっています。
    `,
    companyProfile: {
      name: 'フィンテックイノベーション株式会社',
      industry: '金融・フィンテック',
      size: 'sme',
      revenue: 1200000000,
      employees: 80,
      businessModel: 'B2B金融サービス（与信サービス）'
    },
    projectDetails: {
      name: 'AI与信判定システム開発',
      background: '従来の与信審査の精度向上、処理時間短縮、人的コスト削減',
      objectives: [
        '与信判定精度を85%から95%に向上',
        '審査時間を平均2日から1時間に短縮',
        '審査関連人件費を40%削減',
        '新規事業領域への展開準備'
      ],
      scope: 'ML アルゴリズム開発、データ前処理、モデル訓練、API開発、管理画面構築',
      budget: 25000000,
      timeline: 10,
      team: [
        { role: 'データサイエンティスト', name: '研究博士', experience: '7年' },
        { role: 'MLエンジニア', name: '開発エキスパート', experience: '5年' },
        { role: 'データエンジニア', name: 'インフラ専門家', experience: '6年' },
        { role: 'プロダクトマネージャー', name: 'ビジネス統括', experience: '8年' }
      ],
      constraints: [
        '金融庁規制への準拠が必要',
        'データプライバシー保護の厳格化',
        'モデルの説明可能性が要求される',
        '継続的な学習・改善が必要'
      ],
      successCriteria: [
        'モデル精度目標達成',
        '金融庁検査合格',
        'パフォーマンス目標達成',
        'A/Bテスト成功'
      ]
    },
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'AIシステム開発における学習データ前処理費用の会計処理として最も適切なものは？',
        options: [
          { id: 'a', text: '研究開発費として全額費用計上', isCorrect: false },
          { id: 'b', text: 'ソフトウェア開発費として資産計上', isCorrect: true },
          { id: 'c', text: 'データ購入費として無形資産計上', isCorrect: false },
          { id: 'd', text: '人件費として期間費用処理', isCorrect: false }
        ],
        correctAnswer: 'b',
        explanation: 'AIシステムの学習データ前処理は、完成したシステムの機能に不可欠な部分であり、ソフトウェア開発費の一部として資産計上するのが適切です。',
        points: 15
      },
      {
        id: 'q2',
        type: 'calculation',
        question: 'モデル開発費2500万円を資産計上し、5年償却する場合の年間償却費は？',
        correctAnswer: 5000000,
        explanation: '年間償却費 = 2500万円 ÷ 5年 = 500万円。AIシステムも一般的なソフトウェアと同様の償却期間を適用できます。',
        points: 10
      }
    ],
    solutions: [
      {
        questionId: 'q1',
        approach: 'AIシステム開発の特殊性を考慮した分類',
        reasoning: '完成したシステムの一部として機能する開発費用は資産計上が適切',
        bestPractices: [
          'AI特有の継続学習コストは運用費として処理',
          'アルゴリズム研究費用と実装費用の明確な分離',
          'モデル更新・改良費用の適切な処理'
        ],
        commonMistakes: [
          '全てを研究開発費として費用処理',
          'データコストの処理方法誤り',
          '継続的改良費用の資産化'
        ]
      }
    ],
    learningObjectives: [
      'AI開発特有の会計処理を理解する',
      'データとアルゴリズムの価値評価方法を学ぶ',
      '継続的改良が必要なシステムの会計処理を理解する',
      '新技術領域での会計判断能力を養う'
    ],
    tags: ['AI開発', '機械学習', 'データサイエンス', '新技術', '継続改良']
  }
];