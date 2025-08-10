-- =============================================================================
-- Finance Practice Application - Indexes and Initial Data
-- Version: 3.0  
-- Description: パフォーマンス向上のためのインデックス追加と初期データ投入
-- =============================================================================

-- 複合インデックス（パフォーマンス最適化）
CREATE INDEX idx_projects_user_accounting ON projects(user_id, accounting_treatment);
CREATE INDEX idx_projects_user_phase ON projects(user_id, phase);
CREATE INDEX idx_financial_statements_project_period ON financial_statements(project_id, period);
CREATE INDEX idx_budget_plans_project_roi ON budget_plans(project_id, roi_percentage DESC NULLS LAST);

-- GIN インデックス（JSON検索用）
CREATE INDEX idx_projects_cost_breakdown ON projects USING GIN(cost_breakdown);
CREATE INDEX idx_projects_decision_criteria ON projects USING GIN(decision_criteria);
CREATE INDEX idx_case_studies_questions ON case_studies USING GIN(questions);
CREATE INDEX idx_case_study_attempts_answers ON case_study_attempts USING GIN(answers);
CREATE INDEX idx_learning_progress_achievements ON learning_progress USING GIN(achievements);

-- 部分インデックス（条件付きクエリ最適化）
CREATE INDEX idx_case_study_attempts_active_sessions ON case_study_attempts(user_id, started_at DESC) 
    WHERE status = 'in_progress';
CREATE INDEX idx_exercise_attempts_correct ON exercise_attempts(user_id, submitted_at DESC) 
    WHERE is_correct = true;
CREATE INDEX idx_learning_sessions_ongoing ON learning_sessions(user_id, started_at DESC) 
    WHERE ended_at IS NULL;

-- 統計情報収集のためのビュー
CREATE VIEW user_learning_stats AS
SELECT 
    u.id as user_id,
    u.display_name,
    u.created_at as user_created_at,
    COALESCE(lp.overall_progress, 0) as overall_progress,
    COALESCE(case_stats.total_attempts, 0) as total_case_study_attempts,
    COALESCE(case_stats.completed_attempts, 0) as completed_case_studies,
    COALESCE(case_stats.avg_score, 0) as avg_case_study_score,
    COALESCE(exercise_stats.total_attempts, 0) as total_exercise_attempts,
    COALESCE(exercise_stats.correct_attempts, 0) as correct_exercises,
    COALESCE(session_stats.total_sessions, 0) as total_sessions,
    COALESCE(session_stats.total_time, 0) as total_learning_time,
    COALESCE(achievement_stats.total_achievements, 0) as total_achievements
FROM users u
LEFT JOIN learning_progress lp ON u.id = lp.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_attempts,
        AVG(CASE WHEN status = 'completed' THEN score END) as avg_score
    FROM case_study_attempts 
    GROUP BY user_id
) case_stats ON u.id = case_stats.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN is_correct = true THEN 1 END) as correct_attempts
    FROM exercise_attempts 
    GROUP BY user_id
) exercise_stats ON u.id = exercise_stats.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_sessions,
        SUM(COALESCE(duration_minutes, 0)) as total_time
    FROM learning_sessions 
    GROUP BY user_id
) session_stats ON u.id = session_stats.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_achievements
    FROM user_achievements 
    GROUP BY user_id
) achievement_stats ON u.id = achievement_stats.user_id;

-- ケーススタディ統計ビュー
CREATE VIEW case_study_stats AS
SELECT 
    cs.id,
    cs.title,
    cs.category,
    cs.difficulty,
    COUNT(csa.id) as total_attempts,
    COUNT(CASE WHEN csa.status = 'completed' THEN 1 END) as completed_attempts,
    CASE 
        WHEN COUNT(csa.id) > 0 THEN 
            ROUND(COUNT(CASE WHEN csa.status = 'completed' THEN 1 END)::NUMERIC / COUNT(csa.id) * 100, 2)
        ELSE 0 
    END as completion_rate,
    AVG(CASE WHEN csa.status = 'completed' THEN csa.score END) as avg_score,
    AVG(CASE WHEN csa.status = 'completed' THEN csa.time_spent END) as avg_time_spent
FROM case_studies cs
LEFT JOIN case_study_attempts csa ON cs.id = csa.case_study_id
WHERE cs.is_active = true
GROUP BY cs.id, cs.title, cs.category, cs.difficulty;

-- 演習問題統計ビュー
CREATE VIEW exercise_stats AS
SELECT 
    e.id,
    e.title,
    e.exercise_type,
    e.difficulty,
    COUNT(ea.id) as total_attempts,
    COUNT(CASE WHEN ea.is_correct THEN 1 END) as correct_attempts,
    CASE 
        WHEN COUNT(ea.id) > 0 THEN 
            ROUND(COUNT(CASE WHEN ea.is_correct THEN 1 END)::NUMERIC / COUNT(ea.id) * 100, 2)
        ELSE 0 
    END as success_rate,
    AVG(ea.score) as avg_score,
    AVG(ea.time_spent) as avg_time_spent
FROM exercises e
LEFT JOIN exercise_attempts ea ON e.id = ea.exercise_id
WHERE e.is_active = true
GROUP BY e.id, e.title, e.exercise_type, e.difficulty;

-- 初期ケーススタディデータの挿入
INSERT INTO case_studies (
    title, description, category, difficulty, estimated_time, scenario,
    company_profile, project_details, questions, solutions, learning_objectives, tags
) VALUES (
    'ECサイトリニューアルプロジェクト',
    '既存ECサイトの全面リニューアルにおける会計処理判断',
    'development',
    'intermediate',
    45,
    '中堅アパレル企業のファッション通販サイトが、売上の伸び悩みと競合他社との差別化のため、ECサイトの全面リニューアルを計画しています。新システムではAI推薦機能、パーソナライゼーション、モバイル最適化を実装し、売上向上を目指しています。',
    '{"name": "ファッションライフ株式会社", "industry": "アパレル・ファッション", "size": "sme", "revenue": 2500000000, "employees": 150, "businessModel": "B2C ECコマース（自社ブランド）"}',
    '{"name": "ECサイトリニューアルプロジェクト", "budget": 12000000, "timeline": 8, "objectives": ["売上を年間15%向上", "モバイル経由売上を40%から60%に向上", "顧客満足度の改善", "システム運用コストの20%削減"]}',
    '[{"id": "q1", "type": "multiple_choice", "question": "このプロジェクトで最も重要な資産計上の判断基準は何ですか？", "options": [{"id": "a", "text": "プロジェクト予算が1000万円を超えている", "isCorrect": false}, {"id": "b", "text": "将来の経済的便益が定量的に見込める", "isCorrect": true}], "correctAnswer": "b", "explanation": "資産計上の最重要基準は将来の経済的便益です。", "points": 10}]',
    '[{"questionId": "q1", "approach": "資産計上要件の体系的検討", "reasoning": "将来の経済的便益、技術的実現可能性を確認", "bestPractices": ["定量的な効果測定指標の設定"]}]',
    ARRAY['システム開発費用の資産計上要件を理解する', '将来の経済効果を定量的に評価する方法を学ぶ'],
    ARRAY['資産計上', 'システム開発', 'ECサイト', 'ROI']
), (
    'クラウド移行プロジェクト',
    'オンプレミスシステムのクラウド移行における会計処理',
    'migration',
    'advanced',
    60,
    '製造業の中堅企業が、コスト削減と業務効率化を目的として、オンプレミスの基幹システムをクラウドに移行するプロジェクトを開始します。',
    '{"name": "高精密機器製造株式会社", "industry": "精密機器製造", "size": "large", "revenue": 8000000000, "employees": 500}',
    '{"name": "クラウド移行プロジェクト", "budget": 45000000, "timeline": 12, "objectives": ["システム運用コストを30%削減", "システム可用性を99.9%に向上"]}',
    '[{"id": "q1", "type": "multiple_choice", "question": "既存オンプレミスシステムの除却処理として適切なものは？", "options": [{"id": "a", "text": "特別損失として一括計上", "isCorrect": true}], "correctAnswer": "a", "explanation": "除却時は残存簿価を特別損失として一括計上します。", "points": 15}]',
    '[{"questionId": "q1", "approach": "資産除却の会計原則適用", "reasoning": "使用停止により経済的便益が失われたため"}]',
    ARRAY['システム除却の会計処理を理解する', 'クラウド移行特有の会計課題を理解する'],
    ARRAY['クラウド移行', '除却処理', 'システム移行']
);

-- 初期演習問題データの挿入
INSERT INTO exercises (
    title, description, exercise_type, difficulty, 
    parameters, expected_answer, explanation, related_concepts
) VALUES (
    'ROI計算の基礎',
    'プロジェクトのROI（投資収益率）を計算し、投資判断を行う',
    'roi',
    'beginner',
    '[{"name": "initialInvestment", "value": 5000000, "unit": "円", "description": "初期投資額"}, {"name": "annualRevenue", "value": 2000000, "unit": "円/年", "description": "年間売上増加"}]',
    '{"value": 90, "unit": "%", "breakdown": [{"step": 1, "description": "年間純利益の計算", "calculation": "2,000,000 - 500,000", "result": 1500000}]}',
    'ROI（Return on Investment）は投資効率を測定する重要な指標です。この例では、3年間で初期投資を90%回収できることを意味しています。',
    ARRAY['NPV', 'IRR', 'ペイバック期間', '割引現在価値']
), (
    '定額法による減価償却',
    'システム開発費の減価償却計算と会計処理を理解する',
    'depreciation',
    'beginner',
    '[{"name": "assetCost", "value": 12000000, "unit": "円", "description": "資産取得価額"}, {"name": "usefulLife", "value": 5, "unit": "年", "description": "耐用年数"}]',
    '{"value": 2400000, "unit": "円", "breakdown": [{"step": 1, "description": "年間償却額の計算", "calculation": "12,000,000 ÷ 5年", "result": 2400000}]}',
    '定額法による減価償却は、最も一般的な償却方法です。システム開発費も無形固定資産として5年間で償却するのが一般的です。',
    ARRAY['無形固定資産', '耐用年数', '残存価額', '月割計算']
);

-- データベース統計情報の更新
ANALYZE users;
ANALYZE projects;
ANALYZE financial_statements;
ANALYZE budget_plans;
ANALYZE case_studies;
ANALYZE exercises;
ANALYZE learning_progress;
ANALYZE case_study_attempts;
ANALYZE exercise_attempts;
ANALYZE learning_sessions;
ANALYZE achievements;
ANALYZE user_achievements;

-- パフォーマンス監視用の関数
CREATE OR REPLACE FUNCTION get_table_stats()
RETURNS TABLE(
    table_name TEXT,
    row_count BIGINT,
    table_size TEXT,
    index_size TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        schemaname||'.'||tablename AS table_name,
        n_tup_ins - n_tup_del AS row_count,
        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS table_size,
        pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) AS index_size
    FROM pg_stat_user_tables
    ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
END;
$$ LANGUAGE plpgsql;

-- スロークエリ検出用ビュー（PostgreSQL 13+）
CREATE VIEW slow_queries AS
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    rows,
    100.0 * shared_blks_hit / nullif(shared_blks_hit + shared_blks_read, 0) AS hit_percent
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- システム設定の更新
UPDATE system_settings SET value = '"3.0"' WHERE key = 'db_schema_version';
INSERT INTO system_settings (key, value, description) VALUES
('performance_monitoring_enabled', 'true', 'パフォーマンス監視有効フラグ'),
('data_retention_days', '365', 'データ保持期間（日）'),
('cache_ttl_seconds', '3600', 'キャッシュTTL（秒）');

-- マイグレーション完了ログ
INSERT INTO system_settings (key, value, description) VALUES
('migration_v3_completed_at', to_jsonb(CURRENT_TIMESTAMP), 'V3マイグレーション完了日時');