import React, { useState, useEffect } from 'react';
import { CaseStudy, Question, CaseStudyProgress } from '../../types/learning';
import apiClient from '../../utils/api';

interface CaseStudyViewerProps {
  caseStudyId?: string;
  onProgressUpdate?: (progress: CaseStudyProgress) => void;
}

const CaseStudyViewer: React.FC<CaseStudyViewerProps> = ({
  caseStudyId = 'ecommerce-renewal',
  onProgressUpdate
}) => {
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [currentStep, setCurrentStep] = useState<'scenario' | 'questions' | 'solutions'>('scenario');
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState<CaseStudyProgress>({
    caseStudyId: caseStudyId,
    status: 'not_started',
    score: 0,
    timeSpent: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    attempts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCaseStudy = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.getCaseStudy(caseStudyId);
        if (response.success && response.data) {
          setSelectedCase(response.data);
        } else {
          setSelectedCase(null);
        }
      } catch (error) {
        console.error('Failed to fetch case study:', error);
        setSelectedCase(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaseStudy();
  }, [caseStudyId]);

  useEffect(() => {
    if (selectedCase && progress.status === 'not_started') {
      setProgress(prev => ({ ...prev, status: 'in_progress' }));
    }
  }, [selectedCase, progress.status]);

  const handleAnswerSubmit = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    const question = selectedCase?.questions.find(q => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correctAnswer === answer || 
                     (question.options && question.options.find(opt => opt.id === answer)?.isCorrect);

    setProgress(prev => ({
      ...prev,
      questionsAnswered: prev.questionsAnswered + 1,
      questionsCorrect: isCorrect ? prev.questionsCorrect + 1 : prev.questionsCorrect,
      score: prev.score + (isCorrect ? question.points : 0)
    }));

    setShowExplanations(prev => ({ ...prev, [questionId]: true }));
  };

  const handleCaseStudyComplete = () => {
    const finalProgress: CaseStudyProgress = {
      ...progress,
      status: 'completed',
      completedAt: new Date().toISOString(),
      attempts: progress.attempts + 1
    };
    
    setProgress(finalProgress);
    onProgressUpdate?.(finalProgress);
  };

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">ケーススタディを読み込み中...</div>;
  }

  if (!selectedCase) {
    return <div className="text-center py-8 text-red-600">ケーススタディが見つかりませんでした。</div>;
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedCase.title}</h1>
            <p className="text-gray-600 mt-2">{selectedCase.description}</p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedCase.difficulty)}`}>
              {selectedCase.difficulty}
            </span>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-medium">
              {selectedCase.estimatedTime}分
            </span>
          </div>
        </div>

        {/* 進捗表示 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">進捗状況</span>
            <span className="text-sm text-gray-600">
              {progress.questionsAnswered} / {selectedCase.questions.length} 問題完了
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min((progress.questionsAnswered / selectedCase.questions.length) * 100, 100)}%`
              }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            スコア: {progress.score}点 | 正答率: {
              progress.questionsAnswered > 0 
                ? Math.round((progress.questionsCorrect / progress.questionsAnswered) * 100)
                : 0
            }%
          </div>
        </div>

        {/* ナビゲーション */}
        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => setCurrentStep('scenario')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStep === 'scenario'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            シナリオ
          </button>
          <button
            onClick={() => setCurrentStep('questions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStep === 'questions'
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            問題演習
          </button>
          <button
            onClick={() => setCurrentStep('solutions')}
            disabled={progress.questionsAnswered < selectedCase.questions.length}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentStep === 'solutions'
                ? 'bg-teal-600 text-white'
                : progress.questionsAnswered < selectedCase.questions.length
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            解説・解答
          </button>
        </div>
      </div>

      {/* シナリオ表示 */}
      {currentStep === 'scenario' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">事業背景</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-700">{selectedCase.scenario}</div>
            </div>
          </div>

          {/* 企業プロファイル */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">企業情報</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">企業名:</span>
                <span className="ml-2 text-gray-900">{selectedCase.companyProfile.name}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">業界:</span>
                <span className="ml-2 text-gray-900">{selectedCase.companyProfile.industry}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">年商:</span>
                <span className="ml-2 text-gray-900">{formatCurrency(selectedCase.companyProfile.revenue)}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">従業員数:</span>
                <span className="ml-2 text-gray-900">{selectedCase.companyProfile.employees}名</span>
              </div>
              <div className="col-span-2">
                <span className="text-sm font-medium text-gray-600">ビジネスモデル:</span>
                <span className="ml-2 text-gray-900">{selectedCase.companyProfile.businessModel}</span>
              </div>
            </div>
          </div>

          {/* プロジェクト詳細 */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">プロジェクト詳細</h3>
            <div className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600">背景:</span>
                <p className="text-gray-700 mt-1">{selectedCase.projectDetails.background}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">目標:</span>
                <ul className="list-disc list-inside text-gray-700 mt-1 space-y-1">
                  {selectedCase.projectDetails.objectives.map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">予算:</span>
                  <span className="ml-2 text-gray-900">{formatCurrency(selectedCase.projectDetails.budget)}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">期間:</span>
                  <span className="ml-2 text-gray-900">{selectedCase.projectDetails.timeline}ヶ月</span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">範囲:</span>
                <p className="text-gray-700 mt-1">{selectedCase.projectDetails.scope}</p>
              </div>
            </div>
          </div>

          {/* 学習目標 */}
          <div className="bg-teal-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900 mb-3">学習目標</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              {selectedCase.learningObjectives.map((objective, index) => (
                <li key={index}>{objective}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 問題演習 */}
      {currentStep === 'questions' && (
        <div className="space-y-6">
          {selectedCase.questions.map((question, index) => (
            <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  問題 {index + 1}
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                  {question.points}点
                </span>
              </div>

              <p className="text-gray-700 mb-4">{question.question}</p>

              {/* 選択肢形式 */}
              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2 mb-4">
                  {question.options.map((option) => (
                    <label key={option.id} className="flex items-center">
                      <input
                        type="radio"
                        name={question.id}
                        value={option.id}
                        onChange={(e) => handleAnswerSubmit(question.id, e.target.value)}
                        disabled={showExplanations[question.id]}
                        className="mr-3"
                      />
                      <span className={`${
                        showExplanations[question.id] && option.isCorrect 
                          ? 'text-green-700 font-medium' 
                          : ''
                      }`}>
                        {option.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {/* 計算問題 */}
              {question.type === 'calculation' && (
                <div className="mb-4">
                  <input
                    type="number"
                    placeholder="計算結果を入力してください"
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value) {
                        handleAnswerSubmit(question.id, value);
                      }
                    }}
                    disabled={showExplanations[question.id]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* ヒント */}
              {question.hints && question.hints.length > 0 && !showExplanations[question.id] && (
                <div className="mb-4">
                  <details className="bg-yellow-50 p-3 rounded border">
                    <summary className="text-yellow-800 font-medium cursor-pointer">💡 ヒント</summary>
                    <ul className="list-disc list-inside text-yellow-700 mt-2 space-y-1">
                      {question.hints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}

              {/* 解説 */}
              {showExplanations[question.id] && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">解説</h4>
                  <div className="text-gray-700 whitespace-pre-line">
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>
          ))}

          {progress.questionsAnswered === selectedCase.questions.length && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
              <h3 className="text-lg font-medium text-green-900 mb-2">
                🎉 ケーススタディ完了！
              </h3>
              <p className="text-green-700 mb-4">
                スコア: {progress.score}点 / 正答率: {Math.round((progress.questionsCorrect / progress.questionsAnswered) * 100)}%
              </p>
              <button
                onClick={handleCaseStudyComplete}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                完了する
              </button>
            </div>
          )}
        </div>
      )}

      {/* 解説・解答 */}
      {currentStep === 'solutions' && (
        <div className="space-y-6">
          {selectedCase.solutions.map((solution) => {
            const question = selectedCase.questions.find(q => q.id === solution.questionId);
            if (!question) return null;

            return (
              <div key={solution.questionId} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {question.question}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">アプローチ</h4>
                    <p className="text-gray-700">{solution.approach}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">理由</h4>
                    <p className="text-gray-700">{solution.reasoning}</p>
                  </div>

                  {solution.calculations && solution.calculations.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">計算過程</h4>
                      <div className="space-y-2">
                        {solution.calculations.map((calc) => (
                          <div key={calc.step} className="bg-gray-50 p-3 rounded">
                            <div className="text-sm text-gray-600">ステップ {calc.step}</div>
                            <div className="font-medium text-gray-900">{calc.description}</div>
                            <div className="text-gray-700 font-mono text-sm">
                              {calc.calculation} = {formatCurrency(calc.result)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-800 mb-2">ベストプラクティス</h4>
                      <ul className="list-disc list-inside text-green-700 space-y-1">
                        {solution.bestPractices.map((practice, index) => (
                          <li key={index} className="text-sm">{practice}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-red-800 mb-2">よくある間違い</h4>
                      <ul className="list-disc list-inside text-red-700 space-y-1">
                        {solution.commonMistakes.map((mistake, index) => (
                          <li key={index} className="text-sm">{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CaseStudyViewer;