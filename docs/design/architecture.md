# アプリケーションアーキテクチャ

## システム概要

財務実践学習アプリケーションは、新任マネージャーがシステム開発における会計知識を実践的に学習するためのWebアプリケーションです。React + TypeScriptで構築され、モジュラー設計により拡張性と保守性を確保しています。

## アーキテクチャ図

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        A[App.tsx] --> B[Layout/Navigation]
        B --> C1[Simulator Module]
        B --> C2[Financial Module] 
        B --> C3[Budget Module]
        B --> C4[Learning Module]
    end

    subgraph "Simulator Module"
        C1 --> D1[ProjectForm]
        C1 --> D2[DecisionGuide]
        C1 --> D3[ResultDisplay]
        D1 --> D4[CostBreakdown]
        D1 --> D5[JournalEntry]
    end

    subgraph "Financial Module"
        C2 --> E1[ProfitLossStatement]
        C2 --> E2[BalanceSheet]
        C2 --> E3[CashFlowStatement]
        C2 --> E4[FinancialComparison]
    end

    subgraph "Budget Module"
        C3 --> F1[BudgetPlanner]
        C3 --> F2[ROICalculator]
        C3 --> F3[RiskAnalysis]
        C3 --> F4[BudgetTemplates]
    end

    subgraph "Learning Module"
        C4 --> G1[CaseStudyViewer]
        C4 --> G2[ExerciseViewer]
        C4 --> G3[ProgressDashboard]
        C4 --> G4[LearningAnalytics]
    end

    subgraph "Data Layer"
        H1[Types & Interfaces]
        H2[Utility Functions]
        H3[Static Data]
        H4[Validation Logic]
    end

    subgraph "External Systems (Future)"
        I1[User Management API]
        I2[Progress Storage API]
        I3[Analytics Service]
        I4[Notification Service]
    end

    C1 --> H1
    C2 --> H1
    C3 --> H1
    C4 --> H1

    G3 --> I2
    G4 --> I3
    
    classDef moduleStyle fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef dataStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef externalStyle fill:#fff3e0,stroke:#ef6c00,stroke-width:2px,stroke-dasharray: 5 5

    class C1,C2,C3,C4 moduleStyle
    class H1,H2,H3,H4 dataStyle
    class I1,I2,I3,I4 externalStyle
```

## コンポーネント階層図

```mermaid
graph TD
    App --> Layout
    Layout --> Header
    Layout --> Navigation
    Layout --> |Module Routing| Modules

    subgraph Modules
        Simulator
        FinancialDashboard
        BudgetPlanner
        LearningModule
    end

    subgraph Simulator
        Simulator --> PhaseSelector
        Simulator --> ProjectForm
        Simulator --> DecisionGuide
        Simulator --> ResultDisplay
        
        ProjectForm --> ProjectDetails
        ProjectForm --> CostBreakdown
        ProjectForm --> ValidationResults
        
        ResultDisplay --> JournalEntryDisplay
        ResultDisplay --> FinancialImpact
        ResultDisplay --> DepreciationSchedule
    end

    subgraph FinancialDashboard
        FinancialDashboard --> ProfitLossStatement
        FinancialDashboard --> BalanceSheet
        FinancialDashboard --> CashFlowStatement
        FinancialDashboard --> ScenarioComparison
    end

    subgraph BudgetPlanner
        BudgetPlanner --> BudgetItemManager
        BudgetPlanner --> BudgetAnalysis
        BudgetPlanner --> ROICalculator
        BudgetPlanner --> RiskAssessment
    end

    subgraph LearningModule
        LearningModule --> CaseStudyViewer
        LearningModule --> ExerciseViewer  
        LearningModule --> ProgressDashboard
        
        CaseStudyViewer --> ScenarioDisplay
        CaseStudyViewer --> QuestionInterface
        CaseStudyViewer --> SolutionExplanation
        
        ExerciseViewer --> ParameterInput
        ExerciseViewer --> AnswerSubmission
        ExerciseViewer --> CalculationSteps
        
        ProgressDashboard --> OverallProgress
        ProgressDashboard --> ModuleProgress
        ProgressDashboard --> LearningAnalytics
    end

    classDef appLevel fill:#ffebee,stroke:#d32f2f,stroke-width:3px
    classDef moduleLevel fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef componentLevel fill:#fff3e0,stroke:#f57c00,stroke-width:1px

    class App,Layout appLevel
    class Simulator,FinancialDashboard,BudgetPlanner,LearningModule moduleLevel
```

## データフロー図

```mermaid
flowchart TD
    subgraph "User Interactions"
        UI1[Project Input]
        UI2[Accounting Decisions]
        UI3[Budget Planning]
        UI4[Learning Activities]
    end

    subgraph "State Management"
        S1[Project State]
        S2[Financial State] 
        S3[Budget State]
        S4[Progress State]
    end

    subgraph "Business Logic"
        BL1[Accounting Calculations]
        BL2[Financial Analysis]
        BL3[Budget Analysis]
        BL4[Learning Assessment]
    end

    subgraph "Data Persistence"
        DP1[Local Storage]
        DP2[Session Storage]
        DP3[Future: Database]
    end

    subgraph "Output/Results"
        O1[Journal Entries]
        O2[Financial Statements]
        O3[Budget Reports]
        O4[Progress Analytics]
    end

    UI1 --> S1 --> BL1 --> O1
    UI2 --> S1 --> BL1 --> O1
    UI3 --> S3 --> BL3 --> O3
    UI4 --> S4 --> BL4 --> O4

    S1 --> BL2 --> O2
    S3 --> BL2 --> O2

    S4 --> DP1
    S4 --> DP2
    
    O4 --> DP3

    classDef userStyle fill:#e3f2fd,stroke:#1976d2
    classDef stateStyle fill:#f1f8e9,stroke:#388e3c  
    classDef logicStyle fill:#fff3e0,stroke:#f57c00
    classDef persistStyle fill:#fce4ec,stroke:#c2185b
    classDef outputStyle fill:#f3e5f5,stroke:#7b1fa2

    class UI1,UI2,UI3,UI4 userStyle
    class S1,S2,S3,S4 stateStyle
    class BL1,BL2,BL3,BL4 logicStyle
    class DP1,DP2,DP3 persistStyle
    class O1,O2,O3,O4 outputStyle
```

## 技術スタック

### フロントエンド
- **React 18**: UIライブラリ
- **TypeScript**: 型安全性と開発効率
- **Custom CSS**: Tailwind風のユーティリティクラス
- **React Hooks**: 状態管理とライフサイクル

### データ管理
- **TypeScript Interfaces**: 型定義による安全性
- **Utility Functions**: ビジネスロジックの分離
- **Static Data**: ケーススタディと演習問題
- **Local State**: React useState/useEffect

### 計算エンジン
- **会計計算**: 減価償却、仕訳生成
- **財務分析**: ROI、IRR、NPV計算
- **予算分析**: 分散分析、リスク評価
- **学習分析**: 進捗追跡、推奨システム

## 設計原則

### 1. モジュラー設計
各機能を独立したモジュールとして設計し、相互依存を最小化。

### 2. 型安全性
TypeScriptによる厳密な型定義で実行時エラーを防止。

### 3. 再利用可能性
共通コンポーネントとユーティリティ関数による重複排除。

### 4. 拡張性
新しい機能やモジュールを容易に追加できる構造。

### 5. ユーザビリティ
直感的なUI/UXと段階的な学習体験。

## パフォーマンス考慮事項

### 1. コンポーネント最適化
- React.memo による不要な再レンダリング防止
- useCallback/useMemo による計算結果キャッシュ
- 条件付きレンダリングによるDOM負荷軽減

### 2. データ構造最適化
- 効率的な配列操作とオブジェクト参照
- 計算結果の適切なキャッシュ戦略
- メモリリークの防止

### 3. 将来的な最適化
- Code Splitting による初期ロード時間短縮
- Service Worker によるオフライン対応
- CDN活用による静的アセット配信最適化