-- =============================================================================
-- Finance Practice Application - Initial Schema
-- Version: 1.0
-- Description: ユーザー管理、プロジェクト管理の基本テーブル作成
-- =============================================================================

-- ユーザーテーブル
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- ユーザーテーブルのインデックス
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_last_login ON users(last_login_at DESC NULLS LAST);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- ユーザーテーブルのコメント
COMMENT ON TABLE users IS 'ユーザーアカウント情報';
COMMENT ON COLUMN users.id IS 'ユーザー一意識別子';
COMMENT ON COLUMN users.email IS 'メールアドレス（ログインID）';
COMMENT ON COLUMN users.password_hash IS 'bcryptハッシュ化パスワード';
COMMENT ON COLUMN users.display_name IS '表示名';
COMMENT ON COLUMN users.role IS 'ユーザーロール';
COMMENT ON COLUMN users.preferences IS 'ユーザー設定（JSON）';

-- プロジェクトテーブル  
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phase VARCHAR(50) NOT NULL CHECK (phase IN ('planning', 'development', 'maintenance')),
    accounting_treatment VARCHAR(20) NOT NULL CHECK (accounting_treatment IN ('expense', 'asset')),
    budget BIGINT NOT NULL CHECK (budget > 0),
    timeline_months INTEGER NOT NULL CHECK (timeline_months > 0),
    cost_breakdown JSONB DEFAULT '{}',
    decision_criteria JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- プロジェクトテーブルのインデックス
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_phase ON projects(phase);
CREATE INDEX idx_projects_accounting_treatment ON projects(accounting_treatment);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_user_created ON projects(user_id, created_at DESC);

-- プロジェクトテーブルのコメント
COMMENT ON TABLE projects IS 'ユーザープロジェクト情報';
COMMENT ON COLUMN projects.id IS 'プロジェクト一意識別子';
COMMENT ON COLUMN projects.user_id IS '作成者ユーザーID';
COMMENT ON COLUMN projects.name IS 'プロジェクト名';
COMMENT ON COLUMN projects.phase IS '開発フェーズ';
COMMENT ON COLUMN projects.accounting_treatment IS '会計処理方法';
COMMENT ON COLUMN projects.budget IS '予算額（円）';
COMMENT ON COLUMN projects.timeline_months IS '期間（月数）';
COMMENT ON COLUMN projects.cost_breakdown IS 'コスト内訳（JSON）';
COMMENT ON COLUMN projects.decision_criteria IS '判断基準チェック結果（JSON）';

-- 財務諸表テーブル
CREATE TABLE financial_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    statement_type VARCHAR(10) NOT NULL CHECK (statement_type IN ('pl', 'bs', 'cf')),
    period VARCHAR(20) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    assumptions JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 財務諸表テーブルのインデックス
CREATE INDEX idx_financial_statements_project_id ON financial_statements(project_id);
CREATE INDEX idx_financial_statements_type ON financial_statements(statement_type);
CREATE INDEX idx_financial_statements_period ON financial_statements(period);
CREATE INDEX idx_financial_statements_project_type ON financial_statements(project_id, statement_type);

-- 財務諸表テーブルのコメント
COMMENT ON TABLE financial_statements IS '財務諸表データ';
COMMENT ON COLUMN financial_statements.statement_type IS '諸表種別（pl=損益計算書, bs=貸借対照表, cf=キャッシュフロー）';
COMMENT ON COLUMN financial_statements.period IS '対象期間';
COMMENT ON COLUMN financial_statements.data IS '財務データ（JSON）';
COMMENT ON COLUMN financial_statements.assumptions IS '計算前提条件（JSON）';

-- 予算計画テーブル
CREATE TABLE budget_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    analysis JSONB DEFAULT '{}',
    roi_percentage DECIMAL(10,4),
    irr_percentage DECIMAL(10,4),
    npv_amount BIGINT,
    payback_years DECIMAL(6,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 予算計画テーブルのインデックス
CREATE INDEX idx_budget_plans_project_id ON budget_plans(project_id);
CREATE INDEX idx_budget_plans_roi ON budget_plans(roi_percentage DESC NULLS LAST);
CREATE INDEX idx_budget_plans_created_at ON budget_plans(created_at DESC);

-- 予算計画テーブルのコメント
COMMENT ON TABLE budget_plans IS 'プロジェクト予算計画';
COMMENT ON COLUMN budget_plans.items IS '予算項目リスト（JSON配列）';
COMMENT ON COLUMN budget_plans.analysis IS '分析結果（JSON）';
COMMENT ON COLUMN budget_plans.roi_percentage IS 'ROI（％）';
COMMENT ON COLUMN budget_plans.irr_percentage IS 'IRR（％）';
COMMENT ON COLUMN budget_plans.npv_amount IS 'NPV（円）';
COMMENT ON COLUMN budget_plans.payback_years IS '投資回収期間（年）';

-- システム設定テーブル
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- システム設定テーブルのコメント
COMMENT ON TABLE system_settings IS 'システム設定';
COMMENT ON COLUMN system_settings.key IS '設定キー';
COMMENT ON COLUMN system_settings.value IS '設定値（JSON）';
COMMENT ON COLUMN system_settings.description IS '設定の説明';

-- 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 更新トリガーの設定
CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER projects_updated_at_trigger
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER financial_statements_updated_at_trigger
    BEFORE UPDATE ON financial_statements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER budget_plans_updated_at_trigger
    BEFORE UPDATE ON budget_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER system_settings_updated_at_trigger
    BEFORE UPDATE ON system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 初期システム設定データ
INSERT INTO system_settings (key, value, description) VALUES
('app_version', '"1.0.0"', 'アプリケーションバージョン'),
('maintenance_mode', 'false', 'メンテナンスモードフラグ'),
('default_project_settings', '{"defaultBudget": 10000000, "defaultTimeline": 12}', 'デフォルトプロジェクト設定'),
('learning_settings', '{"defaultDifficulty": "intermediate", "timeoutMinutes": 60}', '学習関連設定');

-- マイグレーション完了ログ
INSERT INTO system_settings (key, value, description) VALUES
('migration_v1_completed_at', to_jsonb(CURRENT_TIMESTAMP), 'V1マイグレーション完了日時');