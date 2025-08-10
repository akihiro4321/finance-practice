-- PostgreSQL初期設定スクリプト
-- 開発環境用のデータベース初期化

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- タイムゾーン設定
SET timezone = 'Asia/Tokyo';

-- デフォルトスキーマにコメント
COMMENT ON SCHEMA public IS 'Finance Practice Application Schema';

-- 初期システム設定データの挿入準備
-- （実際の設定値はマイグレーションで挿入）

-- ログ出力
SELECT 'Database initialized successfully' AS status;