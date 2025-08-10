import React from 'react';
import { DevelopmentPhase, AccountingTreatment } from '../../types';

interface PhaseSelectorProps {
  selectedPhase: DevelopmentPhase;
  onPhaseChange: (phase: DevelopmentPhase) => void;
  treatment: AccountingTreatment | null;
  onTreatmentChange: (treatment: AccountingTreatment) => void;
}

const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  selectedPhase,
  onPhaseChange,
  treatment,
  onTreatmentChange
}) => {
  const phases = [
    {
      id: 'requirements' as DevelopmentPhase,
      name: '要件定義・設計',
      description: 'システムの要件を定義し、設計を行う段階',
      fixedTreatment: 'expense' as AccountingTreatment,
      canChoose: false
    },
    {
      id: 'development' as DevelopmentPhase,
      name: '開発・テスト',
      description: 'システムの開発とテストを行う段階',
      fixedTreatment: null,
      canChoose: true
    },
    {
      id: 'maintenance' as DevelopmentPhase,
      name: '運用・保守',
      description: 'システムの運用・保守を行う段階',
      fixedTreatment: 'expense' as AccountingTreatment,
      canChoose: false
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">開発フェーズの選択</h2>
      
      <div className="grid gap-4">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
              selectedPhase === phase.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPhaseChange(phase.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {phase.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {phase.description}
                </p>
              </div>
              <div className="ml-4">
                <input
                  type="radio"
                  checked={selectedPhase === phase.id}
                  onChange={() => onPhaseChange(phase.id)}
                  className="h-4 w-4 text-primary-600"
                />
              </div>
            </div>
            
            {selectedPhase === phase.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  会計処理の選択:
                </h4>
                
                {phase.canChoose ? (
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="treatment"
                        value="expense"
                        checked={treatment === 'expense'}
                        onChange={(e) => onTreatmentChange(e.target.value as AccountingTreatment)}
                        className="h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        費用化 (即時に費用として計上)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="treatment"
                        value="capitalize"
                        checked={treatment === 'capitalize'}
                        onChange={(e) => onTreatmentChange(e.target.value as AccountingTreatment)}
                        className="h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        資産化 (ソフトウェア資産として計上)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="bg-gray-100 p-3 rounded">
                    <span className="text-sm text-gray-600">
                      この段階では
                      <strong className="text-gray-900">
                        {phase.fixedTreatment === 'expense' ? '費用化' : '資産化'}
                      </strong>
                      が基本となります
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseSelector;