import React, { useState, useEffect } from 'react';
import { CostBreakdown as CostBreakdownType, ValidationResult } from '../../types';
import { validateCostBreakdown } from '../../utils/validation';

interface CostBreakdownProps {
  totalCost: number;
  costBreakdown: CostBreakdownType;
  onCostBreakdownChange: (breakdown: CostBreakdownType) => void;
  onValidationChange: (validation: ValidationResult) => void;
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({
  totalCost,
  costBreakdown,
  onCostBreakdownChange,
  onValidationChange
}) => {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });

  const costItems = [
    {
      key: 'personnel' as keyof CostBreakdownType,
      label: '人件費',
      description: '開発チームの給与・賞与等',
      placeholder: '6000000',
      color: 'bg-teal-100 border-teal-300'
    },
    {
      key: 'external' as keyof CostBreakdownType,
      label: '外注費',
      description: '外部委託・協力会社への支払い',
      placeholder: '3000000',
      color: 'bg-green-100 border-green-300'
    },
    {
      key: 'infrastructure' as keyof CostBreakdownType,
      label: 'インフラ・サーバー費',
      description: 'クラウド、サーバー、ネットワーク費用',
      placeholder: '500000',
      color: 'bg-purple-100 border-purple-300'
    },
    {
      key: 'licenses' as keyof CostBreakdownType,
      label: 'ライセンス費',
      description: 'ソフトウェア、ツールライセンス',
      placeholder: '300000',
      color: 'bg-yellow-100 border-yellow-300'
    },
    {
      key: 'other' as keyof CostBreakdownType,
      label: 'その他経費',
      description: '研修費、交通費、雑費等',
      placeholder: '200000',
      color: 'bg-gray-100 border-gray-300'
    }
  ];

  const handleCostChange = (key: keyof CostBreakdownType, value: number) => {
    const updatedBreakdown = { ...costBreakdown, [key]: value };
    onCostBreakdownChange(updatedBreakdown);
    
    // バリデーション実行
    const validationResult = validateCostBreakdown(updatedBreakdown, totalCost);
    setValidation(validationResult);
    onValidationChange(validationResult);
  };

  const autoDistribute = () => {
    if (totalCost <= 0) return;
    
    // 標準的な配分比率
    const distribution = {
      personnel: 0.60,    // 60%
      external: 0.20,     // 20%
      infrastructure: 0.08, // 8%
      licenses: 0.07,     // 7%
      other: 0.05        // 5%
    };

    const newBreakdown = {
      personnel: Math.round(totalCost * distribution.personnel),
      external: Math.round(totalCost * distribution.external),
      infrastructure: Math.round(totalCost * distribution.infrastructure),
      licenses: Math.round(totalCost * distribution.licenses),
      other: Math.round(totalCost * distribution.other)
    };

    // 端数調整
    const total = Object.values(newBreakdown).reduce((sum, cost) => sum + cost, 0);
    const diff = totalCost - total;
    newBreakdown.personnel += diff; // 人件費で調整

    onCostBreakdownChange(newBreakdown);
  };

  const calculateTotal = () => {
    return Object.values(costBreakdown).reduce((sum, cost) => sum + (cost || 0), 0);
  };

  const calculatePercentage = (value: number) => {
    return totalCost > 0 ? ((value / totalCost) * 100).toFixed(1) : '0';
  };

  const total = calculateTotal();
  const difference = total - totalCost;

  useEffect(() => {
    // 初期バリデーション
    const validationResult = validateCostBreakdown(costBreakdown, totalCost);
    setValidation(validationResult);
    onValidationChange(validationResult);
  }, [totalCost]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">費用内訳</h3>
        <button
          onClick={autoDistribute}
          disabled={totalCost <= 0}
          className="px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          標準配分で自動入力
        </button>
      </div>

      <div className="space-y-4">
        {costItems.map((item) => (
          <div key={item.key} className={`p-4 rounded-lg border ${item.color}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-900">
                  {item.label}
                </label>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
              <div className="text-right ml-4">
                <span className="text-sm font-medium text-gray-900">
                  {calculatePercentage(costBreakdown[item.key] || 0)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">¥</span>
              <input
                type="number"
                value={costBreakdown[item.key] || ''}
                onChange={(e) => handleCostChange(item.key, parseInt(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                placeholder={item.placeholder}
                min="0"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 合計と差額表示 */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">内訳合計:</span>
          <span className="text-lg font-bold text-gray-900">
            ¥{total.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">プロジェクト総費用:</span>
          <span className="text-lg font-bold text-gray-900">
            ¥{totalCost.toLocaleString()}
          </span>
        </div>
        
        {difference !== 0 && (
          <div className={`flex justify-between items-center p-2 rounded ${
            Math.abs(difference) > totalCost * 0.01 ? 'bg-red-50' : 'bg-yellow-50'
          }`}>
            <span className={`text-sm font-medium ${
              Math.abs(difference) > totalCost * 0.01 ? 'text-red-700' : 'text-yellow-700'
            }`}>
              差額:
            </span>
            <span className={`text-sm font-bold ${
              Math.abs(difference) > totalCost * 0.01 ? 'text-red-700' : 'text-yellow-700'
            }`}>
              {difference > 0 ? '+' : ''}¥{difference.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* 費用分析 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">費用分析</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-600">人件費比率:</span>
            <span className={`ml-1 font-medium ${
              (costBreakdown.personnel || 0) / totalCost > 0.7 ? 'text-red-600' : 'text-gray-900'
            }`}>
              {calculatePercentage(costBreakdown.personnel || 0)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">外注比率:</span>
            <span className={`ml-1 font-medium ${
              (costBreakdown.external || 0) / totalCost > 0.5 ? 'text-yellow-600' : 'text-gray-900'
            }`}>
              {calculatePercentage(costBreakdown.external || 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* バリデーション結果 */}
      {validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">入力エラー</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">注意事項</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>
                • {warning.message}
                {warning.suggestion && (
                  <div className="text-xs text-yellow-600 mt-1 ml-2">
                    💡 {warning.suggestion}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CostBreakdown;