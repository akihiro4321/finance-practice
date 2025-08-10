import React, { useState, useEffect } from 'react';
import { 
  LearningProgress, 
  ModuleProgress, 
  CaseStudyProgress, 
  ExerciseProgress,
  Achievement,
  LearningAnalytics,
  WeakArea,
  LearningRecommendation
} from '../../types/learning';

interface ProgressDashboardProps {
  userId?: string;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  userId = 'demo-user'
}) => {
  const [progress, setProgress] = useState<LearningProgress>({
    userId,
    overallProgress: 65,
    moduleProgress: [
      {
        moduleId: 'system-development-accounting',
        moduleName: 'システム開発会計の基礎',
        progress: 80,
        timeSpent: 240,
        completedItems: 4,
        totalItems: 5,
        lastAccessed: '2024-01-15T10:30:00Z',
        score: 85
      },
      {
        moduleId: 'budget-planning',
        moduleName: '予算策定とROI分析',
        progress: 75,
        timeSpent: 180,
        completedItems: 6,
        totalItems: 8,
        lastAccessed: '2024-01-14T14:20:00Z',
        score: 78
      },
      {
        moduleId: 'financial-statements',
        moduleName: '財務三表の理解と分析',
        progress: 45,
        timeSpent: 90,
        completedItems: 3,
        totalItems: 7,
        lastAccessed: '2024-01-13T09:15:00Z',
        score: 72
      }
    ],
    caseStudyProgress: [
      {
        caseStudyId: 'ecommerce-renewal',
        status: 'completed',
        score: 85,
        timeSpent: 45,
        questionsAnswered: 3,
        questionsCorrect: 2,
        completedAt: '2024-01-15T11:30:00Z',
        attempts: 1
      },
      {
        caseStudyId: 'cloud-migration',
        status: 'in_progress',
        score: 60,
        timeSpent: 30,
        questionsAnswered: 2,
        questionsCorrect: 1,
        attempts: 1
      },
      {
        caseStudyId: 'ai-development',
        status: 'not_started',
        score: 0,
        timeSpent: 0,
        questionsAnswered: 0,
        questionsCorrect: 0,
        attempts: 0
      }
    ],
    exerciseProgress: [
      {
        exerciseId: 'roi-calculation-basic',
        status: 'completed',
        score: 95,
        attempts: 2,
        bestScore: 95,
        averageScore: 87,
        timeSpent: 25,
        lastAttempted: '2024-01-15T16:45:00Z'
      },
      {
        exerciseId: 'depreciation-straight-line',
        status: 'completed',
        score: 88,
        attempts: 1,
        bestScore: 88,
        averageScore: 88,
        timeSpent: 15,
        lastAttempted: '2024-01-14T13:20:00Z'
      }
    ],
    assessmentResults: [
      {
        id: 'assessment-1',
        type: 'module',
        moduleName: 'システム開発会計の基礎',
        score: 85,
        maxScore: 100,
        percentage: 85,
        passed: true,
        passThreshold: 70,
        timeSpent: 30,
        completedAt: '2024-01-15T12:00:00Z',
        breakdown: [
          { category: '基本概念', score: 90, maxScore: 100, percentage: 90 },
          { category: '会計処理', score: 80, maxScore: 100, percentage: 80 },
          { category: '実務適用', score: 85, maxScore: 100, percentage: 85 }
        ]
      }
    ],
    learningHistory: [],
    achievements: [
      {
        id: 'first-completion',
        name: '初回完了',
        description: '初めてのケーススタディを完了',
        icon: '🏆',
        category: 'completion',
        unlockedAt: '2024-01-15T11:30:00Z',
        rarity: 'common'
      },
      {
        id: 'perfect-score',
        name: 'パーフェクト',
        description: 'ROI計算で満点を獲得',
        icon: '⭐',
        category: 'score',
        unlockedAt: '2024-01-15T16:45:00Z',
        rarity: 'rare'
      }
    ],
    weakAreas: [
      {
        concept: 'IRR計算',
        category: 'ROI分析',
        confidence: 45,
        practiceNeeded: 2,
        recommendedActivities: ['irr-calculation-intermediate', 'irr-vs-npv-comparison']
      },
      {
        concept: '減価償却方法の選択',
        category: '会計処理',
        confidence: 60,
        practiceNeeded: 1,
        recommendedActivities: ['depreciation-methods-comparison']
      }
    ],
    recommendations: [
      {
        id: 'rec-1',
        type: 'practice',
        priority: 'high',
        title: 'IRR計算の強化',
        description: 'IRR計算の理解を深めるための演習を推奨します',
        estimatedTime: 45,
        activities: [
          { type: 'exercise', id: 'irr-calculation-intermediate', name: 'IRR計算と意思決定', estimatedTime: 25 },
          { type: 'case_study', id: 'investment-comparison', name: '投資案比較検討', estimatedTime: 20 }
        ],
        reason: 'IRR計算での正答率が低いため'
      }
    ],
    lastUpdated: '2024-01-15T17:00:00Z'
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'achievements' | 'analytics'>('overview');
  const [analytics, setAnalytics] = useState<LearningAnalytics>({
    totalTimeSpent: 570,
    averageSessionTime: 38,
    longestStreak: 7,
    currentStreak: 3,
    activeDays: 12,
    totalActivities: 15,
    averageScore: 82,
    improvementRate: 8,
    strongestAreas: ['ROI計算', '予算策定', '基本会計処理'],
    weakestAreas: ['IRR計算', '複合的判断', '特殊な会計処理'],
    learningVelocity: 3.5,
    retentionRate: 88
  });

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'not_started': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'completed': '完了',
      'in_progress': '進行中',
      'not_started': '未開始'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-500';
      case 'epic': return 'text-purple-500';
      case 'rare': return 'text-teal-500'; // Changed from text-blue-500
      case 'common': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">学習進捗ダッシュボード</h1>
            <p className="text-gray-600 mt-2">あなたの学習状況と成果を確認できます</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-teal-600">{progress.overallProgress}%</div>
            <div className="text-sm text-gray-600">総合進捗</div>
          </div>
        </div>

        {/* 進捗バー */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-teal-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress.overallProgress}%` }}
            />
          </div>
        </div>

        {/* クイック統計 */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.totalTimeSpent}</div>
            <div className="text-sm text-gray-600">総学習時間（分）</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.currentStreak}</div>
            <div className="text-sm text-gray-600">連続学習日数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{analytics.averageScore}</div>
            <div className="text-sm text-gray-600">平均スコア</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{progress.achievements.length}</div>
            <div className="text-sm text-gray-600">獲得実績</div>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: '概要' },
            { id: 'modules', label: 'モジュール進捗' },
            { id: 'achievements', label: '実績' },
            { id: 'analytics', label: '分析' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 概要タブ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* ケーススタディ進捗 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ケーススタディ進捗</h2>
            <div className="space-y-3">
              {progress.caseStudyProgress.map((caseStudy) => (
                <div key={caseStudy.caseStudyId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{caseStudy.caseStudyId}</div>
                    <div className="text-sm text-gray-600">
                      {caseStudy.questionsAnswered > 0 && (
                        <>正答率: {Math.round((caseStudy.questionsCorrect / caseStudy.questionsAnswered) * 100)}% | </>
                      )}
                      時間: {formatTime(caseStudy.timeSpent)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-900">{caseStudy.score}点</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseStudy.status)}`}>
                      {getStatusLabel(caseStudy.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 演習問題進捗 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">演習問題進捗</h2>
            <div className="space-y-3">
              {progress.exerciseProgress.map((exercise) => (
                <div key={exercise.exerciseId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{exercise.exerciseId}</div>
                    <div className="text-sm text-gray-600">
                      挑戦回数: {exercise.attempts}回 | 最高得点: {exercise.bestScore.toFixed(0)}点
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-gray-900">{exercise.score.toFixed(0)}点</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(exercise.status)}`}>
                      {getStatusLabel(exercise.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 推奨事項 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">学習推奨事項</h2>
            <div className="space-y-3">
              {progress.recommendations.map((rec) => (
                <div key={rec.id} className={`p-4 rounded-lg border ${
                  rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                  rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-teal-200 bg-teal-50' // Changed from border-blue-200 bg-blue-50
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        rec.priority === 'high' ? 'text-red-900' :
                        rec.priority === 'medium' ? 'text-yellow-900' :
                        'text-teal-900' // Changed from text-blue-900
                      }`}>{rec.title}</h3>
                      <p className={`text-sm mt-1 ${
                        rec.priority === 'high' ? 'text-red-700' :
                        rec.priority === 'medium' ? 'text-yellow-700' :
                        'text-teal-700' // Changed from text-blue-700
                      }`}>{rec.description}</p>
                      <div className="text-xs text-gray-600 mt-2">推定時間: {rec.estimatedTime}分</div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      rec.priority === 'high' ? 'bg-red-200 text-red-800' :
                      rec.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-teal-200 text-teal-800' // Changed from bg-blue-200 text-blue-800
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* モジュール進捗タブ */}
      {activeTab === 'modules' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">モジュール別進捗</h2>
          <div className="space-y-6">
            {progress.moduleProgress.map((module) => (
              <div key={module.moduleId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{module.moduleName}</h3>
                    <p className="text-sm text-gray-600">
                      最終アクセス: {formatDate(module.lastAccessed)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{module.progress}%</div>
                    <div className="text-sm text-gray-600">
                      {module.completedItems} / {module.totalItems} 完了
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">学習時間:</span>
                    <span className="ml-2 font-medium">{formatTime(module.timeSpent)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">スコア:</span>
                    <span className="ml-2 font-medium">{module.score || 0}点</span>
                  </div>
                  <div>
                    <span className="text-gray-600">完了率:</span>
                    <span className="ml-2 font-medium">
                      {Math.round((module.completedItems / module.totalItems) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 実績タブ */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          {/* 獲得実績 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">獲得実績</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {progress.achievements.map((achievement) => (
                <div key={achievement.id} className="p-4 border border-gray-200 rounded-lg text-center">
                  <div className={`text-3xl mb-2 ${getRarityColor(achievement.rarity)}`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{achievement.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
                  <div className="text-xs text-gray-500">
                    {formatDate(achievement.unlockedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 弱点エリア */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">改善が必要なエリア</h2>
            <div className="space-y-4">
              {progress.weakAreas.map((area, index) => (
                <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-red-900">{area.concept}</h3>
                      <p className="text-sm text-red-700">{area.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-900">{area.confidence}%</div>
                      <div className="text-xs text-red-600">理解度</div>
                    </div>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${area.confidence}%` }}
                    />
                  </div>
                  <div className="text-sm text-red-700">
                    推奨練習時間: {area.practiceNeeded}時間
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 分析タブ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* 学習分析 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">学習分析</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-teal-50 rounded-lg"> {/* Changed from bg-blue-50 */}
                <div className="text-2xl font-bold text-teal-900">{formatTime(analytics.totalTimeSpent)}</div> {/* Changed from text-blue-900 */}
                <div className="text-sm text-teal-700">総学習時間</div> {/* Changed from text-blue-700 */}
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{formatTime(analytics.averageSessionTime)}</div>
                <div className="text-sm text-green-700">平均セッション時間</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{analytics.longestStreak}</div>
                <div className="text-sm text-purple-700">最長連続日数</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-900">{analytics.learningVelocity}</div>
                <div className="text-sm text-yellow-700">週間活動数</div>
              </div>
            </div>
          </div>

          {/* 強みと弱み */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">得意分野</h3>
              <div className="space-y-2">
                {analytics.strongestAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-green-800">{area}</span>
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">苦手分野</h3>
              <div className="space-y-2">
                {analytics.weakestAreas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                    <span className="text-red-800">{area}</span>
                    <span className="text-red-600 text-sm">!</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressDashboard;