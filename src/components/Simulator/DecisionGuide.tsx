import React from 'react';
import { DecisionCriteria } from '../../types';

interface DecisionGuideProps {
  criteria: DecisionCriteria;
  onCriteriaChange: (criteria: DecisionCriteria) => void;
}

const DecisionGuide: React.FC<DecisionGuideProps> = ({
  criteria,
  onCriteriaChange
}) => {
  const handleCriteriaChange = (key: keyof DecisionCriteria, value: boolean) => {
    onCriteriaChange({
      ...criteria,
      [key]: value
    });
  };

  const criteriaItems = [
    {
      key: 'futureEconomicBenefit' as keyof DecisionCriteria,
      title: '将来の経済的便益が見込める',
      description: 'このシステムにより売上増加やコスト削減などの経済的効果が期待できる',
      example: '例: 業務効率化により人件費削減、売上システム改善による売上増加'
    },
    {
      key: 'technicalFeasibility' as keyof DecisionCriteria,
      title: '技術的実現可能性がある',
      description: 'システムの完成に必要な技術やスキルが確保されている',
      example: '例: 開発チームの技術力、必要なインフラの確保'
    },
    {
      key: 'completionIntention' as keyof DecisionCriteria,
      title: '完成・利用の意図がある',
      description: 'システムを完成させ、実際に利用する明確な意図がある',
      example: '例: 経営陣の承認、利用部門の合意、予算の確保'
    },
    {
      key: 'adequateResources' as keyof DecisionCriteria,
      title: '完成に必要な資源が確保されている',
      description: '開発に必要な人員、資金、時間などのリソースが確保されている',
      example: '例: 開発予算の承認、必要な人員の配置、適切なスケジュール'
    }
  ];

  const passedCriteria = Object.values(criteria).filter(Boolean).length;
  const totalCriteria = criteriaItems.length;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          資産計上の判断基準
        </h2>
        
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>判断基準の満足度</span>
            <span>{passedCriteria}/{totalCriteria}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(passedCriteria / totalCriteria) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {criteriaItems.map((item) => (
            <div
              key={item.key}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id={item.key}
                  checked={criteria[item.key]}
                  onChange={(e) => handleCriteriaChange(item.key, e.target.checked)}
                  className="mt-1 h-5 w-5 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <label
                    htmlFor={item.key}
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    {item.title}
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {item.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gray-50">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            推奨事項:
          </h3>
          {passedCriteria >= 3 ? (
            <p className="text-sm text-green-700">
              ✅ 多くの基準を満たしているため、
              <strong>資産計上</strong>を検討することをお勧めします。
            </p>
          ) : passedCriteria >= 2 ? (
            <p className="text-sm text-yellow-700">
              ⚠️ いくつかの基準を満たしていますが、より慎重な検討が必要です。
              会計基準や社内規定を確認することをお勧めします。
            </p>
          ) : (
            <p className="text-sm text-red-700">
              ❌ 基準を満たしていない項目が多いため、
              <strong>費用計上</strong>が適切と考えられます。
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecisionGuide;