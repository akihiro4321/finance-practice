# Finance Practice — CLAUDE.md

## プロジェクト概要（要点）
- 新任マネージャー向けの会計学習アプリ。システム開発費用の会計処理と財務3表を学べる。現在はフェーズ1を完了。  
- 技術: React 18 + TypeScript、Create React App（CRA）、React Context、CSS変数。  
- ドキュメント: /docs（要件定義・機能仕様・UIワイヤー等）。まず docs を読んでから作業して。  

## 作業の基本フロー（Claude Code用）
1. **読むだけ**: 変更前に /docs と /src をざっと読み、影響範囲を把握。
2. **Plan提示**: 触る予定ファイル・変更方針・テスト観点を「Plan」として最初に出す。
3. **実装**: 最小差分でコミットを小さく（1トピック1コミット）。
4. **検証**: `npm test`（watchはOFF），`npm run build` で動作・型・ビルドを確認。
5. **PR**: 変更理由・影響範囲・テスト方法をPR説明に残す。

## コーディング規約（要点）
- TypeScript は strict 準拠。`any`の常用禁止。型の穴は `unknown`→絞り込み。
- 状態はまず **React Context** を優先。グローバル状態は安易に増やさない。
- UIは既存の **CSS変数** を再利用。テーマや余白の一貫性を壊さない。
- 外部依存の追加は原則禁止（必要時は Plan で明示し、代替案と比較）。

## 実行・テスト
- 開発: `npm start`
- テスト: `npm test -- --watchAll=false`
- ビルド: `npm run build`
- Node: READMEに合わせ **16以上**。可能なら LTS（18+）推奨。

## 変更の定義（Definition of Done）
- 仕様: docs / README の該当箇所を更新。
- 品質: `npm test` 緑 / `npm run build` 完了。型エラーなし。
- 可読性: 変更点の意図と代替案の検討をPRに記述（3〜5行でOK）。

## よくあるタスクの指示例
- 「/plan フェーズ2の“詳細な仕訳生成”を実装。影響範囲、失敗ケース、追加する型を列挙」
- 「/fix '資産化'選択時の減価償却年数が未入力でも計算してしまう件を修正。回帰テスト追加」
- 「/docs 仕様差分を docs/ と README に反映。機能トグルの説明を追記」

## 注意
- 秘密情報・鍵・.env は読み書き不可にしてある（.claude/settings.json 参照）。
- 差分は小さく、コミットメッセージは意図が伝わる英語短文（例: `feat(simulator): add depreciation schedule calc`）。