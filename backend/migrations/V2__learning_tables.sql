-- =============================================================================
-- Finance Practice Application - Learning Tables
-- Version: 2.0
-- Description: 学習管理テーブル群の作成（ケーススタディ、演習、進捗管理）
-- =============================================================================

-- ケーススタディマスターテーブル
CREATE TABLE case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('development', 'infrastructure', 'migration', 'saas')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    estimated_time INTEGER NOT NULL CHECK (estimated_time > 0),
    scenario TEXT NOT NULL,
    company_profile JSONB NOT NULL DEFAULT '{}',
    project_details JSONB NOT NULL DEFAULT '{}',
    questions JSONB NOT NULL DEFAULT '[]',
    solutions JSONB NOT NULL DEFAULT '[]',
    learning_objectives TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ケーススタディテーブルのインデックス
CREATE INDEX idx_case_studies_category ON case_studies(category);
CREATE INDEX idx_case_studies_difficulty ON case_studies(difficulty);
CREATE INDEX idx_case_studies_active ON case_studies(is_active) WHERE is_active = true;
CREATE INDEX idx_case_studies_tags ON case_studies USING GIN(tags);
CREATE INDEX idx_case_studies_created_at ON case_studies(created_at DESC);

-- ケーススタディテーブルのコメント
COMMENT ON TABLE case_studies IS 'ケーススタディマスター';
COMMENT ON COLUMN case_studies.category IS 'カテゴリ';
COMMENT ON COLUMN case_studies.difficulty IS '難易度';
COMMENT ON COLUMN case_studies.estimated_time IS '想定所要時間（分）';
COMMENT ON COLUMN case_studies.company_profile IS '企業プロフィール情報（JSON）';
COMMENT ON COLUMN case_studies.project_details IS 'プロジェクト詳細情報（JSON）';
COMMENT ON COLUMN case_studies.questions IS '問題リスト（JSON配列）';
COMMENT ON COLUMN case_studies.solutions IS '解答・解説（JSON配列）';

-- 演習問題マスターテーブル
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    exercise_type VARCHAR(50) NOT NULL CHECK (exercise_type IN ('roi', 'irr', 'depreciation', 'budget', 'accounting')),
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    parameters JSONB NOT NULL DEFAULT '[]',
    expected_answer JSONB NOT NULL DEFAULT '{}',
    explanation TEXT NOT NULL,
    related_concepts TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 演習問題テーブルのインデックス
CREATE INDEX idx_exercises_type ON exercises(exercise_type);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
CREATE INDEX idx_exercises_active ON exercises(is_active) WHERE is_active = true;
CREATE INDEX idx_exercises_concepts ON exercises USING GIN(related_concepts);

-- 演習問題テーブルのコメント
COMMENT ON TABLE exercises IS '演習問題マスター';
COMMENT ON COLUMN exercises.exercise_type IS '演習タイプ（roi/irr等）';
COMMENT ON COLUMN exercises.parameters IS '問題パラメータ（JSON配列）';
COMMENT ON COLUMN exercises.expected_answer IS '期待回答（JSON）';
COMMENT ON COLUMN exercises.related_concepts IS '関連概念リスト';

-- 学習進捗統合テーブル
CREATE TABLE learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    overall_progress INTEGER NOT NULL DEFAULT 0 CHECK (overall_progress >= 0 AND overall_progress <= 100),
    module_progress JSONB NOT NULL DEFAULT '[]',
    weak_areas JSONB NOT NULL DEFAULT '[]',
    achievements JSONB NOT NULL DEFAULT '[]',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 学習進捗テーブルのインデックス
CREATE UNIQUE INDEX idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_overall ON learning_progress(overall_progress DESC);
CREATE INDEX idx_learning_progress_updated ON learning_progress(last_updated DESC);

-- 学習進捗テーブルのコメント
COMMENT ON TABLE learning_progress IS 'ユーザー学習進捗統合情報';
COMMENT ON COLUMN learning_progress.overall_progress IS '全体進捗パーセンテージ';
COMMENT ON COLUMN learning_progress.module_progress IS 'モジュール別進捗（JSON配列）';
COMMENT ON COLUMN learning_progress.weak_areas IS '弱点エリア（JSON配列）';
COMMENT ON COLUMN learning_progress.achievements IS '獲得実績（JSON配列）';

-- ケーススタディ挑戦履歴テーブル
CREATE TABLE case_study_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    case_study_id UUID NOT NULL REFERENCES case_studies(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    time_spent INTEGER NOT NULL DEFAULT 0 CHECK (time_spent >= 0),
    questions_answered INTEGER NOT NULL DEFAULT 0 CHECK (questions_answered >= 0),
    questions_correct INTEGER NOT NULL DEFAULT 0 CHECK (questions_correct >= 0),
    answers JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    attempt_number INTEGER NOT NULL DEFAULT 1 CHECK (attempt_number > 0)
);

-- ケーススタディ挑戦履歴のインデックス
CREATE INDEX idx_case_study_attempts_user_id ON case_study_attempts(user_id);
CREATE INDEX idx_case_study_attempts_case_study_id ON case_study_attempts(case_study_id);
CREATE INDEX idx_case_study_attempts_status ON case_study_attempts(status);
CREATE INDEX idx_case_study_attempts_completed_at ON case_study_attempts(completed_at DESC NULLS LAST);
CREATE INDEX idx_case_study_attempts_user_case ON case_study_attempts(user_id, case_study_id);
CREATE INDEX idx_case_study_attempts_user_status ON case_study_attempts(user_id, status);

-- ケーススタディ挑戦履歴のコメント
COMMENT ON TABLE case_study_attempts IS 'ケーススタディ挑戦履歴';
COMMENT ON COLUMN case_study_attempts.time_spent IS '所要時間（分）';
COMMENT ON COLUMN case_study_attempts.answers IS '回答データ（JSON）';
COMMENT ON COLUMN case_study_attempts.attempt_number IS '挑戦回数';

-- 演習問題挑戦履歴テーブル
CREATE TABLE exercise_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    score DECIMAL(10,4) NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    user_answer DECIMAL(20,4),
    is_correct BOOLEAN DEFAULT false,
    time_spent INTEGER NOT NULL DEFAULT 0 CHECK (time_spent >= 0),
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    attempt_number INTEGER NOT NULL DEFAULT 1 CHECK (attempt_number > 0)
);

-- 演習問題挑戦履歴のインデックス
CREATE INDEX idx_exercise_attempts_user_id ON exercise_attempts(user_id);
CREATE INDEX idx_exercise_attempts_exercise_id ON exercise_attempts(exercise_id);
CREATE INDEX idx_exercise_attempts_status ON exercise_attempts(status);
CREATE INDEX idx_exercise_attempts_submitted_at ON exercise_attempts(submitted_at DESC);
CREATE INDEX idx_exercise_attempts_user_exercise ON exercise_attempts(user_id, exercise_id);
CREATE INDEX idx_exercise_attempts_is_correct ON exercise_attempts(is_correct);

-- 演習問題挑戦履歴のコメント
COMMENT ON TABLE exercise_attempts IS '演習問題挑戦履歴';
COMMENT ON COLUMN exercise_attempts.user_answer IS 'ユーザーの回答値';
COMMENT ON COLUMN exercise_attempts.time_spent IS '所要時間（分）';

-- 学習セッションテーブル
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(20) NOT NULL CHECK (activity_type IN ('case_study', 'exercise', 'reading', 'assessment')),
    activity_id UUID,
    activity_name VARCHAR(255) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER CHECK (duration_minutes >= 0),
    score DECIMAL(10,4) CHECK (score >= 0 AND score <= 100),
    completed BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'
);

-- 学習セッションテーブルのインデックス
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_activity_type ON learning_sessions(activity_type);
CREATE INDEX idx_learning_sessions_started_at ON learning_sessions(started_at DESC);
CREATE INDEX idx_learning_sessions_user_type_date ON learning_sessions(user_id, activity_type, started_at DESC);
CREATE INDEX idx_learning_sessions_completed ON learning_sessions(completed);

-- 学習セッションテーブルのコメント
COMMENT ON TABLE learning_sessions IS '学習セッション履歴';
COMMENT ON COLUMN learning_sessions.activity_type IS '活動タイプ';
COMMENT ON COLUMN learning_sessions.activity_id IS '活動対象ID（ケーススタディID等）';
COMMENT ON COLUMN learning_sessions.duration_minutes IS '継続時間（分）';
COMMENT ON COLUMN learning_sessions.metadata IS 'セッション追加情報（JSON）';

-- 実績・バッジマスターテーブル
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('completion', 'score', 'streak', 'time', 'special')),
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    criteria JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 実績マスターテーブルのインデックス
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);
CREATE INDEX idx_achievements_active ON achievements(is_active) WHERE is_active = true;

-- 実績マスターテーブルのコメント
COMMENT ON TABLE achievements IS '実績・バッジマスター';
COMMENT ON COLUMN achievements.criteria IS '獲得条件（JSON）';

-- ユーザー実績テーブル
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

-- ユーザー実績テーブルのインデックス
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at DESC);
CREATE UNIQUE INDEX idx_user_achievements_unique ON user_achievements(user_id, achievement_id);

-- ユーザー実績テーブルのコメント
COMMENT ON TABLE user_achievements IS 'ユーザー獲得実績';
COMMENT ON COLUMN user_achievements.metadata IS '獲得時の追加情報（JSON）';

-- 制約追加：questions_correct は questions_answered 以下
ALTER TABLE case_study_attempts ADD CONSTRAINT check_questions_correct 
    CHECK (questions_correct <= questions_answered);

-- 制約追加：completed_at は started_at より後
ALTER TABLE case_study_attempts ADD CONSTRAINT check_completion_time 
    CHECK (completed_at IS NULL OR completed_at >= started_at);

-- 制約追加：ended_at は started_at より後
ALTER TABLE learning_sessions ADD CONSTRAINT check_session_end_time 
    CHECK (ended_at IS NULL OR ended_at >= started_at);

-- 更新トリガーの設定（学習関連テーブル）
CREATE TRIGGER case_studies_updated_at_trigger
    BEFORE UPDATE ON case_studies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER exercises_updated_at_trigger
    BEFORE UPDATE ON exercises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER learning_progress_updated_at_trigger
    BEFORE UPDATE ON learning_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 学習進捗更新トリガー関数（挑戦履歴更新時に進捗を自動計算）
CREATE OR REPLACE FUNCTION update_learning_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- ケーススタディ完了時の進捗更新
    IF TG_TABLE_NAME = 'case_study_attempts' AND NEW.status = 'completed' THEN
        INSERT INTO learning_progress (user_id, last_updated)
        VALUES (NEW.user_id, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) 
        DO UPDATE SET last_updated = CURRENT_TIMESTAMP;
    END IF;
    
    -- 演習問題完了時の進捗更新
    IF TG_TABLE_NAME = 'exercise_attempts' AND NEW.status = 'completed' THEN
        INSERT INTO learning_progress (user_id, last_updated)
        VALUES (NEW.user_id, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id) 
        DO UPDATE SET last_updated = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 学習進捗更新トリガー設定
CREATE TRIGGER case_study_attempts_progress_trigger
    AFTER INSERT OR UPDATE ON case_study_attempts
    FOR EACH ROW EXECUTE FUNCTION update_learning_progress();

CREATE TRIGGER exercise_attempts_progress_trigger
    AFTER INSERT OR UPDATE ON exercise_attempts
    FOR EACH ROW EXECUTE FUNCTION update_learning_progress();

-- 初期実績データの挿入
INSERT INTO achievements (name, description, icon, category, rarity, criteria) VALUES
('初回完了', '初めてのケーススタディを完了', '🏆', 'completion', 'common', '{"type": "first_case_study_completion"}'),
('パーフェクト', '演習問題で満点を獲得', '⭐', 'score', 'rare', '{"type": "perfect_score", "exercise_type": "any"}'),
('学習継続', '3日間連続で学習活動を実施', '🔥', 'streak', 'common', '{"type": "learning_streak", "days": 3}'),
('時間投資', '累計学習時間が10時間を突破', '⏰', 'time', 'rare', '{"type": "total_time", "minutes": 600}'),
('マスター', 'すべてのケーススタディを完了', '👑', 'special', 'legendary', '{"type": "all_case_studies_completed"}');

-- マイグレーション完了ログ
INSERT INTO system_settings (key, value, description) VALUES
('migration_v2_completed_at', to_jsonb(CURRENT_TIMESTAMP), 'V2マイグレーション完了日時');