import React from 'react';
import { DecisionCriteria, Project, AccountingTreatment } from '../../types';
import { calculateConfidenceScore } from '../../utils/accounting';

interface EnhancedDecisionGuideProps {
  criteria: DecisionCriteria;
  onCriteriaChange: (criteria: DecisionCriteria) => void;
  project: Project;
  treatment: AccountingTreatment;
}

const EnhancedDecisionGuide: React.FC<EnhancedDecisionGuideProps> = ({
  criteria,
  onCriteriaChange,
  project,
  treatment
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
      examples: [
        '業務効率化により人件費を年20%削減',
        'ECサイト改善により売上を年15%増加',
        'システム統合により運用コストを年30%削減'
      ],
      questions: [
        '定量的な効果測定は可能か？',
        '投資回収期間は妥当か？',
        '競合他社と比較して優位性があるか？'
      ]
    },
    {
      key: 'technicalFeasibility' as keyof DecisionCriteria,
      title: '技術的実現可能性がある',
      description: 'システムの完成に必要な技術やスキルが確保されている',
      examples: [
        '開発チームに必要な技術スキルが揃っている',
        '採用予定の技術スタックに十分な知見がある',
        'インフラ・セキュリティ要件をクリアできる'
      ],
      questions: [
        '技術的な困難は解決可能か？',
        '外部リソースの調達は可能か？',
        'スケジュール内での完成は現実的か？'
      ]
    },
    {
      key: 'completionIntention' as keyof DecisionCriteria,
      title: '完成・利用の意図がある',
      description: 'システムを完成させ、実際に利用する明確な意図がある',
      examples: [
        '経営陣からの正式な承認と予算配分',
        '利用部門からの明確な要件と合意',
        'プロジェクト完成後の運用体制が整備済み'
      ],
      questions: [
        '経営方針と整合しているか？',
        'ステークホルダーの合意はあるか？',
        '完成後の運用計画はあるか？'
      ]
    },
    {
      key: 'adequateResources' as keyof DecisionCriteria,
      title: '完成に必要な資源が確保されている',
      description: '開発に必要な人員、資金、時間などのリソースが確保されている',
      examples: [
        '開発予算が承認され、資金調達が完了',
        '必要な人員が配置または採用予定',
        'プロジェクトスケジュールが現実的'
      ],
      questions: [
        '追加予算の必要性はないか？',
        '人員不足のリスクはないか？',
        'スケジュール遅延の対策はあるか？'
      ]
    }
  ];

  const passedCriteria = Object.values(criteria).filter(Boolean).length;
  const totalCriteria = criteriaItems.length;
  const confidenceScore = calculateConfidenceScore(project, criteria, treatment);

  const getRecommendation = () => {
    if (passedCriteria >= 3 && confidenceScore >= 70) {
      return {
        type: 'success',
        icon: '✅',
        title: '資産計上を推奨',
        message: '多くの判断基準を満たしており、資産計上が適切と考えられます。',
        detail: `判定スコア: ${confidenceScore}点 (70点以上で推奨)`
      };
    } else if (passedCriteria >= 2 && confidenceScore >= 50) {
      return {
        type: 'warning',
        icon: '⚠️',
        title: '慎重な検討が必要',
        message: 'いくつかの基準を満たしていますが、より詳細な検討が必要です。',
        detail: `判定スコア: ${confidenceScore}点 (50-69点は要検討)`
      };
    } else {
      return {
        type: 'error',
        icon: '❌',
        title: '費用計上を推奨',
        message: '基準を満たしていない項目が多いため、費用計上が適切です。',
        detail: `判定スコア: ${confidenceScore}点 (50点未満は費用計上推奨)`
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          資産計上の判断基準（詳細分析）
        </h2>
        
        {/* 進捗とスコア表示 */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>判断基準の満足度</span>
            <span>{passedCriteria}/{totalCriteria} ({Math.round(passedCriteria/totalCriteria*100)}%)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(passedCriteria / totalCriteria) * 100}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">判定スコア</span>
            <span className={`font-bold ${
              confidenceScore >= 70 ? 'text-green-600' :
              confidenceScore >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {confidenceScore}点 / 100点
            </span>
          </div>
        </div>

        {/* 基準項目の詳細 */}
        <div className="space-y-6">
          {criteriaItems.map((item) => (
            <div
              key={item.key}
              className={`p-6 border-2 rounded-lg transition-all ${
                criteria[item.key] ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start space-x-4">
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
                    className="text-base font-medium text-gray-900 cursor-pointer block mb-2"
                  >
                    {item.title}
                  </label>
                  <p className="text-sm text-gray-600 mb-4">
                    {item.description}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* 具体例 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">具体例:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.examples.map((example, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* 確認事項 */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 mb-2">確認事項:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {item.questions.map((question, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">?</span>
                            {question}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 推奨事項 */}
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          recommendation.type === 'success' ? 'border-green-300 bg-green-50' :
          recommendation.type === 'warning' ? 'border-yellow-300 bg-yellow-50' :
          'border-red-300 bg-red-50'
        }`}>
          <div className="flex items-start space-x-3">
            <span className="text-xl">{recommendation.icon}</span>
            <div className="flex-1">
              <h3 className={`text-sm font-medium mb-1 ${
                recommendation.type === 'success' ? 'text-green-800' :
                recommendation.type === 'warning' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                {recommendation.title}
              </h3>
              <p className={`text-sm mb-2 ${
                recommendation.type === 'success' ? 'text-green-700' :
                recommendation.type === 'warning' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {recommendation.message}
              </p>
              <p className={`text-xs ${
                recommendation.type === 'success' ? 'text-green-600' :
                recommendation.type === 'warning' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {recommendation.detail}
              </p>
            </div>
          </div>
        </div>

        {/* プロジェクト特性による補正要因 */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            スコア算出に影響する要因
          </h4>
          <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">プロジェクト規模:</span>
              <span className={`ml-1 ${project.cost > 50000000 ? 'text-green-600' : 
                project.cost < 5000000 ? 'text-red-600' : 'text-gray-600'}`}>
                {project.cost > 50000000 ? '大規模 (+10)' :
                 project.cost < 5000000 ? '小規模 (-5)' : '中規模 (±0)'}
              </span>
            </div>
            <div>
              <span className="font-medium">複雑度:</span>
              <span className={`ml-1 ${project.complexity === 'high' ? 'text-red-600' :
                project.complexity === 'low' ? 'text-green-600' : 'text-gray-600'}`}>
                {project.complexity === 'high' ? '高 (-10)' :
                 project.complexity === 'low' ? '低 (+5)' : '中 (±0)'}
              </span>
            </div>
            <div>
              <span className="font-medium">リスクレベル:</span>
              <span className={`ml-1 ${project.riskLevel === 'high' ? 'text-red-600' :
                project.riskLevel === 'low' ? 'text-green-600' : 'text-gray-600'}`}>
                {project.riskLevel === 'high' ? '高 (-15)' :
                 project.riskLevel === 'low' ? '低 (+10)' : '中 (±0)'}
              </span>
            </div>
            <div>
              <span className="font-medium">開発期間:</span>
              <span className={`ml-1 ${project.duration > 12 ? 'text-green-600' :
                project.duration < 3 ? 'text-red-600' : 'text-gray-600'}`}>
                {project.duration > 12 ? '長期 (+5)' :
                 project.duration < 3 ? '短期 (-10)' : '標準 (±0)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDecisionGuide;