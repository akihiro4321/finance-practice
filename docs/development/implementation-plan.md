# 実装計画書

## フェーズ別実装計画

### フェーズ1: 基盤構築とコア機能のMVP ✅ **完了**
**期間**: 1-2週間  
**実装日**: 2025年8月10日完了

#### 実装完了機能
- ✅ React + TypeScript環境構築
- ✅ カスタムCSS（Tailwind風スタイリング）システム
- ✅ 基本レイアウト（Header、Layout）
- ✅ 開発フェーズ選択UI (PhaseSelector)
- ✅ 費用化/資産化選択機能
- ✅ 判断基準チェックリスト (DecisionGuide)
- ✅ 会計処理結果表示 (ResultDisplay)
- ✅ レスポンシブデザイン対応

#### 技術スタック確定
- Frontend: React 18 + TypeScript
- Styling: カスタムCSS（CSS変数ベース）
- State Management: React Context
- データ保存: LocalStorage

#### 成果物
- 動作するシミュレータMVP
- GitHubリポジトリ: https://github.com/akihiro4321/finance-practice
- ローカルアクセス: http://localhost:3000

---

### フェーズ2: 会計処理シミュレータの拡張
**期間**: 1-2週間  
**予定開始**: 2025年8月11日

#### 実装予定機能
- 詳細プロジェクト情報入力フォーム
- 会計仕訳の詳細生成ロジック
- 複数プロジェクト対応
- 判断基準の詳細ガイド拡張
- 財務影響の詳細計算

#### 主要コンポーネント
```
src/components/
├── ProjectForm/
│   ├── ProjectForm.tsx
│   ├── ProjectDetails.tsx
│   └── CostBreakdown.tsx
├── JournalEntry/
│   ├── JournalEntryGenerator.tsx
│   └── JournalEntryDisplay.tsx
└── Calculator/
    ├── DepreciationCalculator.tsx
    └── ImpactAnalysis.tsx
```

#### データ構造拡張
```typescript
interface DetailedProject extends Project {
  industry: string;
  complexity: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
  costBreakdown: CostBreakdown;
}

interface CostBreakdown {
  personnel: number;
  external: number;
  infrastructure: number;
  licenses: number;
  other: number;
}
```

---

### フェーズ3: 財務3表の基本表示
**期間**: 1-2週間

#### 実装予定機能
- 損益計算書（P/L）コンポーネント
- 貸借対照表（B/S）コンポーネント
- キャッシュフロー計算書（C/F）コンポーネント
- 統合ダッシュボード
- 基本的なチャート表示

#### コンポーネント構造
```
src/components/
├── FinancialStatements/
│   ├── ProfitLossStatement.tsx
│   ├── BalanceSheet.tsx
│   ├── CashFlowStatement.tsx
│   └── FinancialDashboard.tsx
├── Charts/
│   ├── BarChart.tsx
│   ├── PieChart.tsx
│   └── LineChart.tsx
└── Tables/
    ├── FinancialTable.tsx
    └── SummaryTable.tsx
```

#### 技術導入
- Chart.js ライブラリ導入
- 状態管理の強化（Context拡張）

---

### フェーズ4: 動的連携とインタラクティブ機能
**期間**: 2-3週間

#### 実装予定機能
- シミュレータ ↔ 財務3表の動的連携
- リアルタイムデータ更新
- Before/After比較機能
- インタラクティブチャート
- データエクスポート機能

#### 状態管理の強化
```typescript
interface AppState {
  projects: Project[];
  financialData: FinancialData;
  settings: AppSettings;
  ui: UIState;
}

interface FinancialData {
  profitLoss: ProfitLossStatement;
  balanceSheet: BalanceSheet;
  cashFlow: CashFlowStatement;
  scenarios: Scenario[];
}
```

---

### フェーズ5: 予算策定練習モジュール
**期間**: 2-3週間

#### 実装予定機能
- プロジェクト予算テンプレート
- 動的費用項目管理
- シナリオ分析機能
- 承認ワークフロー体験
- ROI/IRR計算機

#### コンポーネント構造
```
src/components/
├── BudgetPlanning/
│   ├── BudgetTemplate.tsx
│   ├── CostItemManager.tsx
│   ├── ScenarioAnalysis.tsx
│   └── ApprovalWorkflow.tsx
├── Calculators/
│   ├── ROICalculator.tsx
│   ├── IRRCalculator.tsx
│   └── BreakEvenAnalysis.tsx
└── Reports/
    ├── BudgetReport.tsx
    └── VarianceAnalysis.tsx
```

---

### フェーズ6: 学習コンテンツとケーススタディ
**期間**: 2-3週間

#### 実装予定機能
- ケーススタディデータベース
- インタラクティブな問題解決フロー
- 計算練習問題エンジン
- 自動採点・解説機能
- コンテンツ管理システム

#### データ構造
```typescript
interface LearningContent {
  caseStudies: CaseStudy[];
  exercises: Exercise[];
  explanations: Explanation[];
  assessments: Assessment[];
}

interface CaseStudy {
  id: string;
  title: string;
  scenario: string;
  steps: LearningStep[];
  solutions: Solution[];
}
```

---

### フェーズ7: 進捗管理とアセスメント
**期間**: 1-2週間

#### 実装予定機能
- 学習履歴記録システム
- 進捗ダッシュボード
- 分野別習熟度算出
- 弱点分析・推奨機能
- 学習レポート生成

#### 進捗管理コンポーネント
```
src/components/
├── Progress/
│   ├── ProgressDashboard.tsx
│   ├── LearningHistory.tsx
│   ├── SkillAssessment.tsx
│   └── Recommendations.tsx
└── Analytics/
    ├── LearningAnalytics.tsx
    └── PerformanceMetrics.tsx
```

## 技術的進化計画

### データ管理の進化
1. **フェーズ1-2**: LocalStorage + React State
2. **フェーズ3-4**: Context API + useReducer
3. **フェーズ5-6**: IndexedDB導入
4. **フェーズ7**: 軽量データベース（Dexie.js）

### パフォーマンス最適化
1. **フェーズ4**: React.memo、useMemo導入
2. **フェーズ6**: Code Splitting実装
3. **フェーズ7**: Virtual Scrolling、PWA対応

### テスト戦略
1. **フェーズ2**: Jest + React Testing Library導入
2. **フェーズ4**: E2Eテスト（Playwright）
3. **フェーズ6**: ビジュアルリグレッションテスト

## 品質管理

### 各フェーズでのチェックポイント
- [ ] 機能要件の実装完了
- [ ] UI/UX仕様への準拠
- [ ] レスポンシブデザインの動作確認
- [ ] パフォーマンステスト
- [ ] ブラウザ互換性確認
- [ ] アクセシビリティチェック

### ブラウザサポート
- Chrome: 最新版 + 1つ前
- Firefox: 最新版 + 1つ前
- Safari: 最新版 + 1つ前
- Edge: 最新版 + 1つ前

## リスク管理

### 技術リスク
- **ライブラリ依存**: Chart.jsのサイズ増大 → 軽量代替案検討
- **状態管理複雑化**: Context地獄 → Redux Toolkit移行検討
- **パフォーマンス劣化**: 大量データ処理 → 仮想化技術導入

### スケジュールリスク
- **各フェーズ延長**: バッファ期間の設定
- **要件変更**: アジャイル開発での対応

## デプロイ計画

### 開発環境
- ローカル開発: npm start
- GitHub Pages: 各フェーズでのデモ公開

### 本番環境（将来）
- Netlify / Vercel: 静的サイトホスティング
- PWA対応: オフライン利用可能

## ドキュメント管理

### 更新予定ドキュメント
- API仕様書（フェーズ5以降）
- コンポーネントライブラリ（フェーズ4以降）
- ユーザーマニュアル（フェーズ7）
- 開発者ガイド（フェーズ6以降）