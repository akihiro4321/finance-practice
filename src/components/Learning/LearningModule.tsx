import React, { useState } from 'react';
import CaseStudyViewer from './CaseStudyViewer';
import ExerciseViewer from './ExerciseViewer';
import ProgressDashboard from './ProgressDashboard';
import { CaseStudyProgress, ExerciseProgress } from '../../types/learning';

interface LearningModuleProps {
  initialModule?: 'dashboard' | 'case-study' | 'exercise';
}

const LearningModule: React.FC<LearningModuleProps> = ({
  initialModule = 'dashboard'
}) => {
  const [activeModule, setActiveModule] = useState<'dashboard' | 'case-study' | 'exercise'>(initialModule);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState('ecommerce-renewal');
  const [selectedExercise, setSelectedExercise] = useState('roi-calculation-basic');

  const handleCaseStudyProgress = (progress: CaseStudyProgress) => {
    console.log('Case study progress updated:', progress);
    // ここで実際のアプリケーションでは進捗をサーバーに保存したり、
    // ローカルストレージに保存したりする
  };

  const handleExerciseProgress = (progress: ExerciseProgress) => {
    console.log('Exercise progress updated:', progress);
    // ここで実際のアプリケーションでは進捗をサーバーに保存したり、
    // ローカルストレージに保存したりする
  };

  const moduleOptions = [
    { id: 'dashboard', label: '学習ダッシュボード', icon: '📊' },
    { id: 'case-study', label: 'ケーススタディ', icon: '📚' },
    { id: 'exercise', label: '演習問題', icon: '✏️' }
  ];

  const caseStudyOptions = [
    { id: 'ecommerce-renewal', label: 'ECサイトリニューアル', difficulty: 'intermediate' },
    { id: 'cloud-migration', label: 'クラウド移行', difficulty: 'advanced' },
    { id: 'ai-development', label: 'AI システム開発', difficulty: 'advanced' }
  ];

  const exerciseOptions = [
    { id: 'roi-calculation-basic', label: 'ROI計算の基礎', type: 'ROI' },
    { id: 'irr-calculation-intermediate', label: 'IRR計算と意思決定', type: 'IRR' },
    { id: 'depreciation-straight-line', label: '定額法による減価償却', type: '減価償却' },
    { id: 'budget-variance-analysis', label: '予算差異分析', type: '予算管理' },
    { id: 'accounting-asset-vs-expense', label: '資産化vs費用化の判定', type: '会計処理' }
  ];

  return (
    <div className="space-y-6">
      {/* ナビゲーションヘッダー */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">実践学習モジュール</h1>
          <div className="text-sm text-gray-600">
            会計知識を実践的なケースと演習で身につけましょう
          </div>
        </div>

        {/* モジュール選択 */}
        <div className="flex space-x-4 mb-4">
          {moduleOptions.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id as any)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeModule === module.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{module.icon}</span>
              {module.label}
            </button>
          ))}
        </div>

        {/* サブナビゲーション */}
        {activeModule === 'case-study' && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">ケーススタディ選択:</span>
              <select
                value={selectedCaseStudy}
                onChange={(e) => setSelectedCaseStudy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {caseStudyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} ({option.difficulty})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeModule === 'exercise' && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">演習問題選択:</span>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {exerciseOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label} ({option.type})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* モジュールコンテンツ */}
      <div>
        {activeModule === 'dashboard' && (
          <ProgressDashboard />
        )}

        {activeModule === 'case-study' && (
          <CaseStudyViewer 
            caseStudyId={selectedCaseStudy}
            onProgressUpdate={handleCaseStudyProgress}
          />
        )}

        {activeModule === 'exercise' && (
          <ExerciseViewer 
            exerciseId={selectedExercise}
            onProgressUpdate={handleExerciseProgress}
          />
        )}
      </div>

      {/* ヘルプ・ガイダンス */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="text-blue-500 mr-3">💡</div>
          <div>
            <h3 className="text-blue-900 font-medium mb-2">学習のコツ</h3>
            <div className="text-blue-800 text-sm space-y-1">
              {activeModule === 'dashboard' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>定期的に進捗を確認し、弱点エリアを把握しましょう</li>
                  <li>推奨事項に従って効率的に学習を進めましょう</li>
                  <li>連続学習記録を維持してモチベーションを保ちましょう</li>
                </ul>
              )}
              {activeModule === 'case-study' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>まずシナリオを十分に読み込み、企業の背景を理解しましょう</li>
                  <li>問題に取り組む前に、学習目標を確認しましょう</li>
                  <li>間違えた問題は解説をよく読み、理解を深めましょう</li>
                </ul>
              )}
              {activeModule === 'exercise' && (
                <ul className="list-disc list-inside space-y-1">
                  <li>計算過程を理解することが重要です</li>
                  <li>関連概念も併せて学習し、知識を体系化しましょう</li>
                  <li>複数回挑戦して理解を深めましょう</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;