# 機能仕様書

## システム開発費用の会計処理シミュレータ

### 画面構成

#### メイン画面
```
┌─────────────────────────────────────────┐
│ システム開発プロジェクト: ECサイトリニューアル │
├─────────────────────────────────────────┤
│ フェーズ選択:                            │
│ ○ 要件定義・設計 → [費用化] (自動)        │
│ ○ 開発・テスト   → [資産化/費用化] 選択可 │
│ ○ 運用・保守    → [費用化] (自動)        │
├─────────────────────────────────────────┤
│ 判断基準チェック:                        │
│ ☑ 将来の経済的便益が見込める            │
│ ☑ 技術的実現可能性がある               │
│ ☑ 完成・利用の意図がある               │
│ ☑ 完成に必要な資源が確保されている       │
├─────────────────────────────────────────┤
│ 推奨: [資産化] - ソフトウェア資産計上     │
│ [シミュレーション実行] [仕訳を確認]      │
└─────────────────────────────────────────┘
```

### データ構造

#### Project Interface
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  phase: DevelopmentPhase;
  cost: number;
  duration: number; // months
  teamSize: number;
}
```

#### DevelopmentPhase Type
```typescript
type DevelopmentPhase = 'requirements' | 'development' | 'maintenance';
```

#### AccountingTreatment Type
```typescript
type AccountingTreatment = 'expense' | 'capitalize';
```

#### DecisionCriteria Interface
```typescript
interface DecisionCriteria {
  futureEconomicBenefit: boolean;
  technicalFeasibility: boolean;
  completionIntention: boolean;
  adequateResources: boolean;
}
```

### 処理フロー

#### 1. フェーズ選択処理
1. ユーザーが開発フェーズを選択
2. 選択されたフェーズに応じて会計処理選択肢を表示
   - 要件定義・設計: 費用化のみ（選択不可）
   - 開発・テスト: 費用化/資産化選択可能
   - 運用・保守: 費用化のみ（選択不可）

#### 2. 判断基準チェック処理
1. 資産化が選択された場合のみ判断基準チェックを表示
2. 4つの基準項目を表示
3. チェック状況に応じて推奨事項を動的に更新

#### 3. 結果表示処理
1. 選択内容に基づいて仕訳例を生成
2. 会計処理のポイントを表示
3. 資産化の場合は減価償却見込みを計算・表示

## 財務3表ダッシュボード

### 画面構成

#### ダッシュボード画面
```
┌─────────────────────────────────────────────────────────┐
│                    財務ダッシュボード                    │
├─────────────┬─────────────┬─────────────────────────────┤
│ 損益計算書(P/L)│ 貸借対照表(B/S)│     キャッシュフロー(C/F)      │
├─────────────┼─────────────┼─────────────────────────────┤
│ 売上高        │ 流動資産      │ 営業CF: +150,000            │
│ 100,000      │ 50,000       │ 投資CF: -80,000             │
│             │             │ 財務CF: +20,000             │
│ 売上原価      │ 固定資産      │                           │
│ 60,000       │ 120,000      │ フリーCF: +70,000           │
│             │             │                           │
│ 営業利益      │ 負債         │ [月次推移グラフ]             │
│ 25,000       │ 80,000       │     ████████████           │
│             │             │ ┌──┬──┬──┬──┬──┐             │
│ [詳細表示]    │ [詳細表示]    │ │4月│5月│6月│7月│8月│             │
└─────────────┴─────────────┴─────────────────────────────┘
```

### データ構造

#### FinancialStatement Interface
```typescript
interface FinancialStatement {
  profitLoss: ProfitLossStatement;
  balanceSheet: BalanceSheet;
  cashFlow: CashFlowStatement;
}
```

#### ProfitLossStatement Interface
```typescript
interface ProfitLossStatement {
  revenue: number;
  costOfSales: number;
  grossProfit: number;
  operatingExpenses: number;
  operatingProfit: number;
  netProfit: number;
}
```

## 予算策定練習モジュール

### 画面構成

#### 予算策定画面
```
┌─────────────────────────────────────────────────┐
│ プロジェクト予算策定: モバイルアプリ開発          │
├─────────────────────────────────────────────────┤
│ 基本情報:                                      │
│ プロジェクト期間: 6ヶ月                        │
│ 開発人員: PM1名、SE3名、PG4名                   │
├─────────────────────────────────────────────────┤
│ 費用項目              予算額      実績   差異    │
│ ─────────────────────────────────────────      │
│ 人件費               8,000,000    -     -     │
│ 外注費               2,000,000    -     -     │
│ サーバー・インフラ費    500,000    -     -     │
│ ライセンス費          300,000    -     -     │
│ その他経費            200,000    -     -     │
│ ─────────────────────────────────────────      │
│ 合計               11,000,000    -     -     │
├─────────────────────────────────────────────────┤
│ シナリオ分析:                                  │
│ [+] 要員1名追加した場合                         │
│ [+] スケジュール1ヶ月延長の場合                  │
│ [保存] [承認申請] [レポート出力]                │
└─────────────────────────────────────────────────┘
```

### データ構造

#### Budget Interface
```typescript
interface Budget {
  id: string;
  projectName: string;
  duration: number;
  teamComposition: TeamMember[];
  budgetItems: BudgetItem[];
  scenarios: Scenario[];
}
```

## 学習コンテンツ

### ケーススタディ構造

#### CaseStudy Interface
```typescript
interface CaseStudy {
  id: string;
  title: string;
  description: string;
  scenario: string;
  questions: Question[];
  solutions: Solution[];
}
```

### 計算練習問題構造

#### Exercise Interface
```typescript
interface Exercise {
  id: string;
  type: 'ROI' | 'IRR' | 'Depreciation' | 'BreakEven';
  question: string;
  parameters: ExerciseParameter[];
  expectedAnswer: number;
  explanation: string;
}
```

## 進捗管理・アセスメント

### 進捗ダッシュボード画面
```
┌─────────────────────────────────────────┐
│          学習進捗ダッシュボード           │
├─────────────────────────────────────────┤
│ 全体進捗: ████████░░ 80%               │
├─────────────────────────────────────────┤
│ 分野別習熟度:                          │
│                                       │
│      予算策定 ████████████ 100%        │
│    システム開発 ████████░░░ 75%         │
│      財務3表 ██████░░░░ 60%           │
│    ROI/IRR計算 ████████░░░ 80%         │
├─────────────────────────────────────────┤
│ 推奨学習:                              │
│ • 財務3表の相互関係 [学習開始]          │
│ • キャッシュフロー分析 [復習]           │
└─────────────────────────────────────────┘
```

### データ構造

#### Progress Interface
```typescript
interface Progress {
  userId: string;
  overallProgress: number;
  moduleProgress: ModuleProgress[];
  learningHistory: LearningSession[];
  recommendations: LearningRecommendation[];
}
```

## バリデーションルール

### 入力値検証
- プロジェクト費用: 0以上の数値
- 期間: 1以上の整数値
- チーム構成: 1名以上

### 業務ルール検証
- 資産計上判断基準: 4項目中3項目以上で推奨
- 予算項目: 必須項目の入力チェック
- 学習進捗: 前提条件クリア後の次ステップ解放

## エラーハンドリング

### 入力エラー
- 不正な数値入力時の警告表示
- 必須項目未入力時のバリデーションメッセージ

### システムエラー
- 計算エラー時の代替値表示
- データ読み込み失敗時のリトライ機能

## アクセシビリティ

### キーボードナビゲーション
- Tab順序の設定
- Enter/Spaceでの選択操作

### 視覚的配慮
- 色に依存しない情報表示
- 適切なコントラスト比の確保