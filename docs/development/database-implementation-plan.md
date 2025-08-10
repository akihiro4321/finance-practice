# データベース永続化実装計画

## 🎯 実装目標

現在ローカルストレージとメモリで管理しているデータを、PostgreSQLデータベースに永続化し、スケーラブルで信頼性の高いデータ管理システムを構築する。

## 📋 実装ステップ

### Phase 1: 環境構築とデータベース設計 🏗️

#### Step 1.1: Docker環境構築
- [ ] Docker Compose設定ファイル作成
- [ ] PostgreSQL コンテナ設定
- [ ] 開発用データベース初期化
- [ ] 環境変数設定

#### Step 1.2: Flyway マイグレーション設定
- [ ] Flywayの依存関係追加
- [ ] マイグレーションファイル用ディレクトリ作成
- [ ] 初期スキーマ設計
- [ ] マイグレーション実行環境構築

#### Step 1.3: ER図設計と文書化
- [ ] 現在のデータ構造分析
- [ ] ER図作成（Mermaid記法）
- [ ] データベーススキーマ設計書作成
- [ ] テーブル関係定義

### Phase 2: バックエンド API 構築 ⚙️

#### Step 2.1: Node.js + Express セットアップ
- [ ] Express サーバー構築
- [ ] TypeScript設定
- [ ] PostgreSQL接続設定（pg）
- [ ] CORS設定

#### Step 2.2: データアクセス層実装
- [ ] データベース接続プール設定
- [ ] Repository パターン実装
- [ ] クエリビルダー作成
- [ ] トランザクション管理

#### Step 2.3: REST API エンドポイント作成
- [ ] ユーザー管理 API
- [ ] プロジェクト管理 API
- [ ] 学習進捗管理 API
- [ ] 設定データ管理 API

### Phase 3: フロントエンド統合 🖥️

#### Step 3.1: API クライアント実装
- [ ] Axios または Fetch ラッパー作成
- [ ] API型定義作成
- [ ] エラーハンドリング実装
- [ ] ローディング状態管理

#### Step 3.2: 状態管理の更新
- [ ] React Query / SWR 導入検討
- [ ] キャッシュ戦略実装
- [ ] オフライン対応（Service Worker）
- [ ] 楽観的更新実装

#### Step 3.3: 認証・認可システム
- [ ] JWT認証実装
- [ ] ユーザーセッション管理
- [ ] ロールベースアクセス制御
- [ ] セキュリティヘッダー設定

### Phase 4: データ移行と最適化 🔄

#### Step 4.1: 既存データマイグレーション
- [ ] ローカルストレージからDB移行スクリプト
- [ ] データバリデーション
- [ ] 移行テストケース作成
- [ ] ロールバック戦略

#### Step 4.2: パフォーマンス最適化
- [ ] インデックス設計
- [ ] クエリ最適化
- [ ] 接続プーリング調整
- [ ] キャッシュ戦略実装

#### Step 4.3: 監視・ログ設定
- [ ] データベースメトリクス監視
- [ ] APM（Application Performance Monitoring）
- [ ] エラーログ集約
- [ ] アラート設定

### Phase 5: テスト・デプロイ・運用 🚀

#### Step 5.1: テスト実装
- [ ] 単体テスト（Jest）
- [ ] 統合テスト（API）
- [ ] E2Eテスト（Playwright/Cypress）
- [ ] データベーステスト

#### Step 5.2: CI/CD パイプライン
- [ ] GitHub Actions設定
- [ ] 自動テスト実行
- [ ] マイグレーション自動化
- [ ] デプロイメント自動化

#### Step 5.3: 本番環境準備
- [ ] 本番用Docker Compose
- [ ] 環境設定管理
- [ ] バックアップ戦略
- [ ] 災害復旧計画

## 🗂️ ディレクトリ構造（完成形）

```
finance-practice/
├── backend/                     # バックエンドAPI
│   ├── src/
│   │   ├── controllers/         # APIコントローラー
│   │   ├── services/           # ビジネスロジック
│   │   ├── repositories/       # データアクセス
│   │   ├── models/             # データモデル
│   │   ├── middleware/         # Express ミドルウェア
│   │   ├── utils/              # ユーティリティ
│   │   └── app.ts              # Express アプリ
│   ├── migrations/             # Flyway マイグレーション
│   │   ├── V1__initial_schema.sql
│   │   ├── V2__add_learning_tables.sql
│   │   └── V3__add_indexes.sql
│   ├── tests/                  # バックエンドテスト
│   ├── package.json
│   └── tsconfig.json
├── frontend/                   # 既存フロントエンド（src/）
├── docker/                     # Docker設定
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── postgres/
│   │   └── init.sql
│   └── flyway/
│       └── flyway.conf
├── docs/
│   └── database/               # データベース設計書
│       ├── er-diagram.md       # ER図
│       ├── schema-design.md    # スキーマ設計
│       └── migration-guide.md  # マイグレーションガイド
└── scripts/                    # 開発・運用スクリプト
    ├── setup-db.sh
    ├── migrate.sh
    └── seed-data.sh
```

## 🛠️ 技術スタック

### バックエンド
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **Migration**: Flyway
- **ORM/Query Builder**: 検討中（Prisma / Knex.js / 生SQL）
- **Authentication**: JWT
- **Validation**: Zod / Joi

### インフラ・DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: 検討中（Prometheus + Grafana）
- **Logging**: Winston + ELK Stack（将来）

### 開発ツール
- **API Documentation**: OpenAPI/Swagger
- **Testing**: Jest + Supertest
- **Code Quality**: ESLint + Prettier
- **Database Tools**: pgAdmin / DBeaver

## ⏱️ 実装スケジュール

| Phase | 期間 | 主要成果物 |
|-------|------|------------|
| Phase 1 | 3-4日 | Docker環境、ER図、初期マイグレーション |
| Phase 2 | 5-7日 | バックエンドAPI、データアクセス層 |
| Phase 3 | 4-5日 | フロントエンド統合、認証システム |
| Phase 4 | 3-4日 | データ移行、パフォーマンス最適化 |
| Phase 5 | 4-5日 | テスト、CI/CD、本番準備 |
| **合計** | **19-25日** | **完全な永続化システム** |

## 🔒 セキュリティ考慮事項

### データベースセキュリティ
- [ ] 接続文字列の暗号化
- [ ] データベースユーザー権限最小化
- [ ] SSL/TLS接続強制
- [ ] SQL インジェクション対策

### API セキュリティ
- [ ] 入力値検証・サニタイゼーション
- [ ] レート制限実装
- [ ] CORS適切設定
- [ ] セキュリティヘッダー設定

### 認証・認可
- [ ] JWT秘密鍵管理
- [ ] パスワードハッシュ化（bcrypt）
- [ ] セッション管理
- [ ] RBAC実装

## 📊 データ移行戦略

### 既存データの分析
1. **ローカルストレージデータ**
   - プロジェクト設定
   - 学習進捗
   - ユーザー設定

2. **静的データ**
   - ケーススタディ
   - 演習問題
   - テンプレート

### 移行アプローチ
1. **段階的移行**
   - 新規データは即座にDB保存
   - 既存データは徐々に移行
   - 互換性維持期間設定

2. **データ整合性**
   - 移行前後の検証
   - ロールバック機能
   - データ重複チェック

## 🎯 成功指標

### パフォーマンス
- [ ] API レスポンス時間 < 200ms
- [ ] データベースクエリ時間 < 100ms
- [ ] 同時接続数 > 100

### 信頼性
- [ ] アップタイム > 99.9%
- [ ] データ整合性 100%
- [ ] 自動バックアップ実行

### 開発効率
- [ ] マイグレーション自動実行
- [ ] テストカバレッジ > 80%
- [ ] CI/CD パイプライン < 10分

この実装計画に沿って、段階的にデータベース永続化システムを構築していきます。各フェーズで実装と検証を行い、安定性と拡張性を確保したシステムを目指します。