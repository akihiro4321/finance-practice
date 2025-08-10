import React, { useState } from 'react';
import { DevelopmentPhase, AccountingTreatment, DecisionCriteria } from '../../types';
import PhaseSelector from './PhaseSelector';
import DecisionGuide from './DecisionGuide';
import ResultDisplay from './ResultDisplay';

const Simulator: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<DevelopmentPhase>('development');
  const [treatment, setTreatment] = useState<AccountingTreatment | null>(null);
  const [criteria, setCriteria] = useState<DecisionCriteria>({
    futureEconomicBenefit: false,
    technicalFeasibility: false,
    completionIntention: false,
    adequateResources: false
  });
  
  const [projectCost] = useState<number>(10000000); // 1000万円の例

  const handlePhaseChange = (phase: DevelopmentPhase) => {
    setSelectedPhase(phase);
    
    // フェーズが変わったら治療方法をリセット
    if (phase === 'requirements' || phase === 'maintenance') {
      setTreatment('expense');
    } else {
      setTreatment(null);
    }
  };

  const canShowDecisionGuide = selectedPhase === 'development' && treatment === 'capitalize';

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          システム開発費用 会計処理シミュレータ
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          システム開発プロジェクトの各フェーズにおける適切な会計処理を学習できます。
          フェーズを選択し、判断基準を確認して、会計処理方法を決定してください。
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            サンプルプロジェクト: ECサイトリニューアルシステム
          </h2>
          <p className="text-sm text-gray-600">
            プロジェクト費用: ¥{projectCost.toLocaleString()} / 期間: 6ヶ月 / チーム: 8名
          </p>
        </div>
      </div>

      <PhaseSelector
        selectedPhase={selectedPhase}
        onPhaseChange={handlePhaseChange}
        treatment={treatment}
        onTreatmentChange={setTreatment}
      />

      {canShowDecisionGuide && (
        <DecisionGuide
          criteria={criteria}
          onCriteriaChange={setCriteria}
        />
      )}

      {treatment && (
        <ResultDisplay
          phase={selectedPhase}
          treatment={treatment}
          projectCost={projectCost}
        />
      )}

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          📝 学習ポイント
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 要件定義・設計段階は通常、費用として即時計上されます</li>
          <li>• 開発・テスト段階では資産計上の可能性を検討できます</li>
          <li>• 運用・保守段階は基本的に費用として計上されます</li>
          <li>• 資産計上には明確な判断基準の満足が必要です</li>
        </ul>
      </div>
    </div>
  );
};

export default Simulator;