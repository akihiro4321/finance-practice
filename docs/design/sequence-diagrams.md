# シーケンス図

## 1. システム開発シミュレーション フロー

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Simulator UI
    participant PF as ProjectForm
    participant CB as CostBreakdown
    participant V as Validator
    participant AC as AccountingCalculator
    participant RD as ResultDisplay

    U->>UI: プロジェクト開始
    UI->>PF: フォーム表示
    U->>PF: プロジェクト情報入力
    PF->>CB: コスト詳細入力
    U->>CB: コスト項目設定
    
    CB->>V: バリデーション実行
    V-->>CB: バリデーション結果
    
    alt バリデーションエラー
        CB->>U: エラーメッセージ表示
        U->>CB: 修正入力
    else バリデーション成功
        CB->>AC: 会計処理計算
        AC->>AC: 仕訳生成
        AC->>AC: 減価償却計算
        AC->>AC: 財務影響分析
        AC-->>RD: 計算結果
        RD->>U: 結果表示
    end

    U->>RD: 会計処理選択
    RD->>AC: 処理方法変更
    AC->>AC: 再計算実行
    AC-->>RD: 更新結果
    RD->>U: 更新結果表示
```

## 2. 財務三表ダッシュボード フロー

```mermaid
sequenceDiagram
    participant U as User
    participant FD as FinancialDashboard
    participant PL as P/L Statement
    participant BS as Balance Sheet
    participant CF as Cash Flow
    participant SC as ScenarioComparison
    participant FC as FinancialCalculator

    U->>FD: ダッシュボードアクセス
    FD->>FC: 初期データ要求
    FC->>FC: 財務データ準備
    FC-->>FD: 基本財務データ

    par 並列表示
        FD->>PL: P/L データ要求
        PL->>FC: 損益計算
        FC-->>PL: P/L結果
        PL-->>FD: P/L表示
    and
        FD->>BS: B/S データ要求  
        BS->>FC: 貸借計算
        FC-->>BS: B/S結果
        BS-->>FD: B/S表示
    and
        FD->>CF: C/F データ要求
        CF->>FC: CF計算
        FC-->>CF: C/F結果
        CF-->>FD: C/F表示
    end

    U->>FD: シナリオ比較要求
    FD->>SC: 比較画面表示
    U->>SC: 比較パラメータ設定
    SC->>FC: 複数シナリオ計算
    FC->>FC: シナリオ分析
    FC-->>SC: 比較結果
    SC->>U: 比較結果表示
```

## 3. 予算策定・ROI分析 フロー

```mermaid
sequenceDiagram
    participant U as User
    participant BP as BudgetPlanner
    participant BT as BudgetTemplate
    participant BI as BudgetItems
    participant BA as BudgetAnalyzer
    participant RC as ROICalculator
    participant RA as RiskAnalyzer

    U->>BP: 予算策定開始
    BP->>BT: テンプレート選択画面
    U->>BT: プロジェクトタイプ選択
    BT->>BI: テンプレート予算項目生成
    BI-->>BP: 初期予算項目表示

    U->>BI: 予算項目編集
    BI->>BA: 予算分析実行
    
    par 分析処理
        BA->>BA: カテゴリ別分析
        BA->>RA: リスク分析
        BA->>RC: ROI計算要求
    end

    RC->>RC: NPV計算
    RC->>RC: IRR計算
    RC->>RC: ペイバック期間計算
    RC-->>BP: ROI結果

    RA->>RA: 予算リスク評価
    RA-->>BP: リスク評価結果

    BA-->>BP: 予算分析結果
    BP->>U: 総合分析結果表示

    U->>BP: ROIパラメータ調整
    BP->>RC: 再計算要求
    RC->>RC: パラメータ更新計算
    RC-->>BP: 更新ROI結果
    BP->>U: 更新結果表示
```

## 4. 学習モジュール - ケーススタディ フロー

```mermaid
sequenceDiagram
    participant U as User
    participant LM as LearningModule
    participant CSV as CaseStudyViewer
    participant QM as QuestionManager
    participant AS as AssessmentSystem
    participant PD as ProgressDashboard

    U->>LM: 学習モジュールアクセス
    LM->>CSV: ケーススタディ選択
    U->>CSV: ケーススタディ開始

    CSV->>U: シナリオ表示
    U->>CSV: シナリオ理解完了

    loop 問題演習
        CSV->>QM: 次の問題表示
        QM->>U: 問題提示
        U->>QM: 回答提出
        QM->>AS: 採点実行
        AS->>AS: 正答判定
        AS->>AS: スコア計算
        AS-->>QM: 採点結果
        QM->>U: 結果と解説表示
    end

    AS->>PD: 進捗更新
    PD->>PD: 統計情報更新
    PD->>PD: 推奨事項生成

    CSV->>U: ケーススタディ完了
    U->>PD: 進捗確認
    PD->>U: 学習分析表示
```

## 5. 学習モジュール - 演習問題 フロー

```mermaid
sequenceDiagram
    participant U as User
    participant EV as ExerciseViewer
    participant EP as ExerciseParameters
    participant CE as CalculationEngine
    participant AS as AnswerSystem
    participant PG as ProgressManager

    U->>EV: 演習問題選択
    EV->>EP: パラメータ表示
    EP->>U: 問題データ提示

    U->>EV: 回答入力
    EV->>AS: 回答検証
    AS->>CE: 正解計算実行
    
    CE->>CE: ステップ別計算
    CE->>CE: 最終答え算出
    CE-->>AS: 計算結果

    AS->>AS: 回答比較
    AS->>AS: 許容範囲判定
    AS->>AS: スコア算出
    AS-->>EV: 判定結果

    alt 正解の場合
        EV->>U: 正解通知
        EV->>CE: 解法表示要求
        CE-->>EV: 計算手順
        EV->>U: 詳細解説表示
    else 不正解の場合
        EV->>U: 不正解通知
        EV->>U: 再挑戦オプション
    end

    AS->>PG: 進捗記録
    PG->>PG: 統計更新
    PG->>PG: 学習分析
    
    U->>EV: 次の問題要求
    EV->>U: 新しい演習表示
```

## 6. 進捗管理・学習分析 フロー

```mermaid
sequenceDiagram
    participant U as User
    participant PD as ProgressDashboard
    participant LT as LearningTracker
    participant AA as ActivityAnalyzer
    participant RS as RecommendationSystem
    participant AS as AchievementSystem

    U->>PD: ダッシュボードアクセス
    PD->>LT: 進捗データ要求
    LT->>LT: 学習履歴集計
    LT-->>PD: 基本進捗データ

    PD->>AA: 分析実行要求
    AA->>AA: 時間分析
    AA->>AA: スコア分析  
    AA->>AA: 強み・弱み分析
    AA-->>PD: 分析結果

    PD->>RS: 推奨事項生成要求
    RS->>RS: 弱点エリア特定
    RS->>RS: 学習パス最適化
    RS->>RS: 推奨活動選定
    RS-->>PD: 推奨事項

    PD->>AS: 実績チェック
    AS->>AS: 達成条件判定
    AS->>AS: 新規実績確認
    AS-->>PD: 実績情報

    PD->>U: 統合ダッシュボード表示

    U->>PD: 詳細分析要求
    PD->>AA: 深掘り分析
    AA->>AA: トレンド分析
    AA->>AA: 予測モデル適用
    AA-->>PD: 詳細分析結果
    PD->>U: 詳細レポート表示
```

## 7. データ永続化・状態管理 フロー

```mermaid
sequenceDiagram
    participant C as Component
    participant SM as StateManager
    participant LS as LocalStorage
    participant SS as SessionStorage
    participant API as Future API

    C->>SM: 状態更新要求
    SM->>SM: 状態検証
    SM->>SM: 状態更新

    par 永続化
        SM->>LS: 重要データ保存
        LS-->>SM: 保存完了
    and
        SM->>SS: セッションデータ保存
        SS-->>SM: 保存完了
    end

    SM-->>C: 更新通知

    C->>SM: データ取得要求
    SM->>LS: 永続データ取得
    LS-->>SM: データ返却
    SM-->>C: データ提供

    Note over API: 将来実装予定
    SM-->>API: クラウド同期
    API-->>SM: 同期結果
```

## エラーハンドリング パターン

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component  
    participant EH as ErrorHandler
    participant L as Logger
    participant N as NotificationSystem

    C->>C: 処理実行
    
    alt エラー発生
        C->>EH: エラー捕捉
        EH->>L: エラーログ記録
        EH->>EH: エラー分類
        
        alt 回復可能エラー
            EH->>C: 再試行指示
            C->>U: 再試行オプション表示
        else 致命的エラー
            EH->>N: エラー通知
            N->>U: エラーメッセージ表示
            EH->>C: 安全な状態に復帰
        end
    else 正常処理
        C->>U: 結果表示
    end
```

これらのシーケンス図は、アプリケーションの主要な機能フローと、各コンポーネント間の相互作用を詳細に示しています。開発者がシステムの動作を理解し、新機能を追加する際の参考として活用できます。