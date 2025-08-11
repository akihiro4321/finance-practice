# Finance Practice — GEMINI.md

## What this project is
- 新任マネージャー向けの会計学習アプリ（システム開発費用の会計処理と財務3表の学習）
- Stack: React 18 + TypeScript, Create React App, React Context, CSS variables
- Docs: /docs（要件/機能仕様/ワイヤー等）。**まず /docs を要約してから作業**。

## Work style (for Gemini CLI)
1) **Read-only first**: /docs と /src を俯瞰し、前提と影響範囲を要約  
2) **Plan**: 触る予定ファイル・変更方針・テスト観点を先に提示  
3) **Implement**: 差分は最小・意味単位で小さくコミット  
4) **Verify**: `npm test -- --watchAll=false` / `npm run build` のログ要約  
5) **PR notes**: 目的・影響・テスト方法を3〜5行で

## Coding rules (short)
- TypeScript は strict。`any` 常用禁止。`unknown` → 絞り込み。
- 状態は React Context を優先。無駄なグローバル状態を増やさない。
- 既存 CSS 変数を再利用。余白/タイポグラフィの一貫性を維持。
- 外部依存追加は原則禁止。必要なら代替案とトレードオフを提示。

## Definition of Done
- テスト緑・型/ビルドエラーなし
- 必要な docs/README 反映あり
- PRに意図/影響/テスト手順を記載

## Common tasks (prompt samples)
- 「会計仕訳ロジックの境界値テストを追加。対象ファイル/ケース一覧と失敗時の挙動も」
- 「資産化選択時に年数未入力で計算する不具合を最小差分で修正。回帰テスト付与」
- 「/docs の仕様差分を更新。機能トグルの説明を追記」