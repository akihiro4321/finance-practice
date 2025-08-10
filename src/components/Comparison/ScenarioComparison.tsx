import React, { useState } from 'react';
import { Project, AccountingTreatment } from '../../types';
import { generateSampleFinancialData, applyProjectImpact, calculateFinancialRatios } from '../../utils/financialData';

interface Scenario {
  id: string;
  name: string;
  treatment: AccountingTreatment;
  color: string;
}

interface ScenarioComparisonProps {
  project: Project;
}

const ScenarioComparison: React.FC<ScenarioComparisonProps> = ({ project }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    'netProfit', 'operatingProfit', 'totalAssets', 'currentRatio'
  ]);

  const scenarios: Scenario[] = [
    { id: 'baseline', name: 'プロジェクト実施前', treatment: 'expense', color: 'bg-gray-500' },
    { id: 'expense', name: '費用化', treatment: 'expense', color: 'bg-red-500' },
    { id: 'capitalize', name: '資産化', treatment: 'capitalize', color: 'bg-blue-500' }
  ];

  // 各シナリオのデータ生成
  const baselineData = generateSampleFinancialData();
  const expenseData = applyProjectImpact(baselineData, project, 'expense');
  const capitalizeData = applyProjectImpact(baselineData, project, 'capitalize');

  const scenarioData = {
    baseline: { statements: baselineData, ratios: calculateFinancialRatios(baselineData) },
    expense: { statements: expenseData, ratios: calculateFinancialRatios(expenseData) },
    capitalize: { statements: capitalizeData, ratios: calculateFinancialRatios(capitalizeData) }
  };

  const metrics = [
    { 
      id: 'netProfit', 
      name: '当期純利益', 
      getValue: (data: any) => data.statements.profitLoss.netProfit,
      format: (val: number) => `¥${val.toLocaleString()}`,
      higherIsBetter: true
    },
    { 
      id: 'operatingProfit', 
      name: '営業利益', 
      getValue: (data: any) => data.statements.profitLoss.operatingProfit,
      format: (val: number) => `¥${val.toLocaleString()}`,
      higherIsBetter: true
    },
    { 
      id: 'totalAssets', 
      name: '総資産', 
      getValue: (data: any) => data.statements.balanceSheet.assets.total,
      format: (val: number) => `¥${val.toLocaleString()}`,
      higherIsBetter: true
    },
    { 
      id: 'currentRatio', 
      name: '流動比率', 
      getValue: (data: any) => data.ratios.currentRatio,
      format: (val: number) => `${val.toFixed(1)}%`,
      higherIsBetter: true
    },
    { 
      id: 'roe', 
      name: 'ROE', 
      getValue: (data: any) => data.ratios.roe,
      format: (val: number) => `${val.toFixed(1)}%`,
      higherIsBetter: true
    },
    { 
      id: 'debtRatio', 
      name: '負債比率', 
      getValue: (data: any) => data.ratios.debtRatio,
      format: (val: number) => `${val.toFixed(1)}%`,
      higherIsBetter: false
    },
    {
      id: 'softwareAssets',
      name: 'ソフトウェア資産',
      getValue: (data: any) => data.statements.balanceSheet.assets.fixedAssets.intangibleAssets.software,
      format: (val: number) => `¥${val.toLocaleString()}`,
      higherIsBetter: true
    },
    {
      id: 'operatingCashFlow',
      name: '営業CF',
      getValue: (data: any) => data.statements.cashFlow.operatingActivities.total,
      format: (val: number) => `¥${val.toLocaleString()}`,
      higherIsBetter: true
    }
  ];

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const getChangeIndicator = (baseValue: number, compareValue: number, higherIsBetter: boolean) => {
    const change = compareValue - baseValue;
    const isPositive = change > 0;
    const isImprovement = higherIsBetter ? isPositive : !isPositive;
    
    if (Math.abs(change) < 0.01) return { icon: '→', class: 'text-gray-500' };
    
    return {
      icon: isPositive ? '↑' : '↓',
      class: isImprovement ? 'text-green-600' : 'text-red-600'
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">シナリオ比較分析</h2>
        <div className="text-sm text-gray-600">
          プロジェクト: {project.name}
        </div>
      </div>

      {/* メトリクス選択 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">比較項目の選択</h3>
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedMetrics.includes(metric.id)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {metric.name}
            </button>
          ))}
        </div>
      </div>

      {/* 比較テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">
                指標
              </th>
              {scenarios.map(scenario => (
                <th key={scenario.id} className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${scenario.color}`}></div>
                    <span>{scenario.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.filter(metric => selectedMetrics.includes(metric.id)).map(metric => {
              const baseValue = metric.getValue(scenarioData.baseline);
              const expenseValue = metric.getValue(scenarioData.expense);
              const capitalizeValue = metric.getValue(scenarioData.capitalize);

              const expenseIndicator = getChangeIndicator(baseValue, expenseValue, metric.higherIsBetter);
              const capitalizeIndicator = getChangeIndicator(baseValue, capitalizeValue, metric.higherIsBetter);

              return (
                <tr key={metric.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-3 font-medium text-gray-900">
                    {metric.name}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center">
                    {metric.format(baseValue)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{metric.format(expenseValue)}</span>
                      <span className={`font-bold ${expenseIndicator.class}`}>
                        {expenseIndicator.icon}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      差額: {expenseValue > baseValue ? '+' : ''}{metric.format(expenseValue - baseValue)}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <span>{metric.format(capitalizeValue)}</span>
                      <span className={`font-bold ${capitalizeIndicator.class}`}>
                        {capitalizeIndicator.icon}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      差額: {capitalizeValue > baseValue ? '+' : ''}{metric.format(capitalizeValue - baseValue)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* シナリオ分析サマリー */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <h4 className="font-medium text-red-900">費用化の場合</h4>
          </div>
          <div className="text-sm text-red-800 space-y-1">
            <p>• 当期純利益: {((expenseData.profitLoss.netProfit - baselineData.profitLoss.netProfit) / 1000000).toFixed(0)}百万円減</p>
            <p>• ROE: {(scenarioData.expense.ratios.roe - scenarioData.baseline.ratios.roe).toFixed(1)}pt低下</p>
            <p>• 資産への影響: なし（現金のみ減少）</p>
            <p>• 翌期以降: 追加影響なし</p>
          </div>
          <div className="mt-3 text-xs text-red-700">
            <strong>適用シーン:</strong> 保守的な会計処理、短期的な税務メリット
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <h4 className="font-medium text-blue-900">資産化の場合</h4>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• 当期純利益: {((capitalizeData.profitLoss.netProfit - baselineData.profitLoss.netProfit) / 1000000).toFixed(0)}百万円減</p>
            <p>• ROE: {(scenarioData.capitalize.ratios.roe - scenarioData.baseline.ratios.roe).toFixed(1)}pt低下</p>
            <p>• ソフトウェア資産: {(project.cost / 1000000).toFixed(0)}百万円増加</p>
            <p>• 今後5年間: 年{Math.round(project.cost/5/1000000)}百万円の償却</p>
          </div>
          <div className="mt-3 text-xs text-blue-700">
            <strong>適用シーン:</strong> 将来便益の明確化、期間損益の平準化
          </div>
        </div>
      </div>

      {/* 推奨事項 */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-900 mb-2">💡 選択の指針</h4>
        <div className="text-sm text-yellow-800 space-y-2">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <strong>費用化を推奨する場合:</strong>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                <li>将来の経済効果が不確実</li>
                <li>プロジェクト規模が小さい</li>
                <li>保守的な会計方針を採用</li>
                <li>短期的な税務メリットを重視</li>
              </ul>
            </div>
            <div>
              <strong>資産化を推奨する場合:</strong>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1">
                <li>明確な将来便益が期待できる</li>
                <li>大規模なシステム投資</li>
                <li>期間損益の適切な表示を重視</li>
                <li>株主への説明責任を重視</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* エクスポート機能 */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const data = {
              project: project.name,
              comparison: selectedMetrics.map(metricId => {
                const metric = metrics.find(m => m.id === metricId)!;
                return {
                  metric: metric.name,
                  baseline: metric.getValue(scenarioData.baseline),
                  expense: metric.getValue(scenarioData.expense),
                  capitalize: metric.getValue(scenarioData.capitalize)
                };
              })
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `scenario-comparison-${project.name}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
        >
          比較データをエクスポート
        </button>
      </div>
    </div>
  );
};

export default ScenarioComparison;