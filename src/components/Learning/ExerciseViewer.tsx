import React, { useState, useEffect } from 'react';
import { Exercise, ExerciseProgress } from '../../types/learning';
import apiClient from '../../utils/api';

interface ExerciseViewerProps {
  exerciseId?: string;
  onProgressUpdate?: (progress: ExerciseProgress) => void;
}

const ExerciseViewer: React.FC<ExerciseViewerProps> = ({
  exerciseId = 'roi-calculation-basic',
  onProgressUpdate
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState<ExerciseProgress>({
    exerciseId: exerciseId,
    status: 'not_started',
    score: 0,
    attempts: 0,
    bestScore: 0,
    averageScore: 0,
    timeSpent: 0,
    lastAttempted: new Date().toISOString()
  });
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExerciseData = async () => {
      setIsLoading(true);
      try {
        const exerciseResponse = await apiClient.getExercise(exerciseId);
        if (exerciseResponse.success && exerciseResponse.data) {
          setSelectedExercise(exerciseResponse.data);
        } else {
          setSelectedExercise(null);
        }

        const allExercisesResponse = await apiClient.getExercises();
        if (allExercisesResponse.success && allExercisesResponse.data) {
          setAllExercises(allExercisesResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch exercise data:', error);
        setSelectedExercise(null);
        setAllExercises([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExerciseData();
  }, [exerciseId]);

  useEffect(() => {
    if (selectedExercise && progress.status === 'not_started') {
      setProgress(prev => ({ ...prev, status: 'in_progress' }));
    }
  }, [selectedExercise, progress.status]);

  const handleSubmitAnswer = () => {
    if (!selectedExercise || !userAnswer) return;

    const userValue = parseFloat(userAnswer);
    const expectedValue = selectedExercise.expectedAnswer.value;
    const tolerance = expectedValue * 0.05; // 5%の許容範囲

    const correct = Math.abs(userValue - expectedValue) <= tolerance;
    setIsCorrect(correct);
    setShowSolution(true);

    const newScore = correct ? 100 : Math.max(0, 100 - Math.abs(userValue - expectedValue) / expectedValue * 100);
    
    setProgress(prev => {
      const newProgress: ExerciseProgress = {
        ...prev,
        status: 'completed',
        attempts: prev.attempts + 1,
        score: newScore,
        bestScore: Math.max(prev.bestScore, newScore),
        averageScore: ((prev.averageScore * prev.attempts) + newScore) / (prev.attempts + 1),
        lastAttempted: new Date().toISOString()
      };
      
      onProgressUpdate?.(newProgress);
      return newProgress;
    });
  };

  const handleReset = () => {
    setUserAnswer('');
    setShowSolution(false);
    setIsCorrect(null);
    setProgress(prev => ({ ...prev, status: 'in_progress' }));
  };

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;
  const formatNumber = (num: number) => num.toLocaleString();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'roi': return 'bg-teal-100 text-teal-800';
      case 'irr': return 'bg-purple-100 text-purple-800';
      case 'depreciation': return 'bg-orange-100 text-orange-800';
      case 'budget': return 'bg-teal-100 text-teal-800';
      case 'accounting': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      'roi': 'ROI計算',
      'irr': 'IRR計算',
      'depreciation': '減価償却',
      'budget': '予算管理',
      'accounting': '会計処理'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">演習問題を読み込み中...</div>;
  }

  if (!selectedExercise) {
    return <div className="text-center py-8 text-red-600">演習問題が見つかりませんでした。</div>;
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedExercise.title}</h1>
            <p className="text-gray-600 mt-2">{selectedExercise.description}</p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedExercise.difficulty)}`}>
              {selectedExercise.difficulty}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedExercise.type)}`}>
              {getTypeLabel(selectedExercise.type)}
            </span>
          </div>
        </div>

        {/* 進捗情報 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">挑戦回数</span>
              <div className="text-lg font-bold text-gray-900">{progress.attempts}回</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">最高得点</span>
              <div className="text-lg font-bold text-gray-900">{progress.bestScore.toFixed(0)}点</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">平均得点</span>
              <div className="text-lg font-bold text-gray-900">{progress.averageScore.toFixed(0)}点</div>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">状態</span>
              <div className={`text-lg font-bold ${
                progress.status === 'completed' ? 'text-green-600' :
                progress.status === 'in_progress' ? 'text-yellow-600' : 'text-gray-600'
              }`}>
                {progress.status === 'completed' ? '完了' :
                 progress.status === 'in_progress' ? '進行中' : '未開始'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* パラメータ表示 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">与えられた情報</h2>
        <div className="grid grid-cols-2 gap-4">
          {selectedExercise.parameters.map((param, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{param.description}</span>
                <span className="text-lg font-bold text-gray-900">
                  {param.unit === '円' ? formatCurrency(param.value) : 
                   param.unit === '%' ? `${param.value}%` : 
                   `${formatNumber(param.value)} ${param.unit}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 回答入力 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">回答入力</h2>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={`答えを${selectedExercise.expectedAnswer.unit}で入力してください`}
            disabled={showSolution}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
          />
          <span className="text-gray-600">{selectedExercise.expectedAnswer.unit}</span>
          {!showSolution ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!userAnswer}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              回答する
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              再挑戦
            </button>
          )}
        </div>

        {/* 結果表示 */}
        {showSolution && (
          <div className={`mt-4 p-4 rounded-lg border ${
            isCorrect 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center mb-2">
              <span className={`text-lg font-bold ${
                isCorrect ? 'text-green-800' : 'text-red-800'
              }`}>
                {isCorrect ? '🎉 正解！' : '❌ 不正解'}
              </span>
              <span className="ml-4 text-sm text-gray-600">
                得点: {progress.score.toFixed(0)}点
              </span>
            </div>
            <div className={`text-sm ${
              isCorrect ? 'text-green-700' : 'text-red-700'
            }`}>
              正解: {selectedExercise.expectedAnswer.value}{selectedExercise.expectedAnswer.unit}
              {!isCorrect && (
                <>
                  {' / '}あなたの回答: {userAnswer}{selectedExercise.expectedAnswer.unit}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 解説表示 */}
      {showSolution && (
        <div className="space-y-6">
          {/* 計算過程 */}
          {selectedExercise.expectedAnswer.breakdown && (
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-4">計算過程</h2>
              <div className="space-y-4">
                {selectedExercise.expectedAnswer.breakdown.map((step) => (
                  <div key={step.step} className="bg-teal-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm text-teal-600 font-medium">
                          ステップ {step.step}
                        </div>
                        <div className="text-gray-900 font-medium mt-1">
                          {step.description}
                        </div>
                        <div className="text-gray-700 font-mono text-sm mt-2 bg-white p-2 rounded border">
                          {step.calculation}
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-lg font-bold text-teal-900">
                          {step.result.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 解説 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">解説</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-line text-gray-700">
                {selectedExercise.explanation}
              </div>
            </div>
          </div>

          {/* 関連概念 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-bold text-gray-900 mb-4">関連概念</h2>
            <div className="flex flex-wrap gap-2">
              {selectedExercise.relatedConcepts.map((concept, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 演習選択 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 mb-4">その他の演習問題</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allExercises
            .filter(ex => ex.id !== selectedExercise.id)
            .map((exercise) => (
              <div
                key={exercise.id}
                onClick={() => {
                  setSelectedExercise(exercise);
                  setUserAnswer('');
                  setShowSolution(false);
                  setIsCorrect(null);
                  setProgress({
                    exerciseId: exercise.id,
                    status: 'in_progress',
                    score: 0,
                    attempts: 0,
                    bestScore: 0,
                    averageScore: 0,
                    timeSpent: 0,
                    lastAttempted: new Date().toISOString()
                  });
                }}
                className="p-4 border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{exercise.title}</h3>
                  <div className="flex space-x-1">
                    <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(exercise.difficulty)}`}>
                      {exercise.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getTypeColor(exercise.type)}`}>
                      {getTypeLabel(exercise.type)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{exercise.description}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default ExerciseViewer;