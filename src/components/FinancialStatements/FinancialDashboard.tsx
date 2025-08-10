import React, { useState } from 'react';
import { FinancialStatement } from '../../types/financial';
import { Project, AccountingTreatment } from '../../types';
import { generateSampleFinancialData, applyProjectImpact, calculateFinancialRatios } from '../../utils/financialData';
import ProfitLossStatement from './ProfitLossStatement';
import BalanceSheet from './BalanceSheet';
import CashFlowStatement from './CashFlowStatement';

interface FinancialDashboardProps {
  project?: Project;
  treatment?: AccountingTreatment;
  showComparison?: boolean;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  project,
  treatment,
  showComparison = true
}) => {
  const [activeTab, setActiveTab] = useState<'pl' | 'bs' | 'cf' | 'ratios'>('pl');
  
  // ベースライン財務データ
  const baselineData = generateSampleFinancialData();
  
  // プロジェクト影響適用後のデータ
  const impactedData = project && treatment 
    ? applyProjectImpact(baselineData, project, treatment)
    : baselineData;

  // 財務比率計算
  const baselineRatios = calculateFinancialRatios(baselineData);
  const impactedRatios = calculateFinancialRatios(impactedData);

  const tabs = [
    { id: 'pl', label: '損益計算書', description: '収益性を確認' },
    { id: 'bs', label: '貸借対照表', description: '財政状態を確認' },
    { id: 'cf', label: 'キャッシュフロー', description: '資金の流れを確認' },
    { id: 'ratios', label: '財務分析', description: '各種指標を比較' }
  ];

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const RatioComparison: React.FC<{ 
    label: string; 
    baseValue: number; 
    impactValue: number; 
    isPercentage?: boolean;
    higherIsBetter?: boolean;
  }> = ({ label, baseValue, impactValue, isPercentage = false, higherIsBetter = true }) => {
    const difference = impactValue - baseValue;
    const isImproved = higherIsBetter ? difference > 0 : difference < 0;
    const formatValue = isPercentage ? formatPercentage : formatCurrency;

    return (
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">{label}</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">ベースライン:</span>
            <span className="font-medium">{formatValue(baseValue)}</span>
          </div>
          {project && treatment && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">影響後:</span>
                <span className="font-medium">{formatValue(impactValue)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span className="text-gray-600">変化:</span>
                <span className={`font-bold ${
                  difference === 0 ? 'text-gray-600' :
                  isImproved ? 'text-green-600' : 'text-red-600'
                }`}>
                  {difference > 0 ? '+' : ''}{formatValue(difference)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">財務3表ダッシュボード</h2>
          {project && treatment && (
            <div className="text-right">
              <div className="text-sm text-gray-600">
                プロジェクト: {project.name}
              </div>
              <div className="text-sm text-gray-600">
                会計処理: {treatment === 'expense' ? '費用化' : '資産化'}
              </div>
            </div>
          )}
        </div>

        {/* プロジェクト影響サマリー */}
        {project && treatment && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-teal-50 p-3 rounded-lg">
              <div className="text-xs text-blue-600 font-medium">損益への影響</div>
              <div className="text-lg font-bold text-blue-900">
                {impactedData.profitLoss.netProfit - baselineData.profitLoss.netProfit > 0 ? '+' : ''}
                {formatCurrency(impactedData.profitLoss.netProfit - baselineData.profitLoss.netProfit)}
              </div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-green-600 font-medium">資産への影響</div>
              <div className="text-lg font-bold text-green-900">
                {impactedData.balanceSheet.assets.total - baselineData.balanceSheet.assets.total > 0 ? '+' : ''}
                {formatCurrency(impactedData.balanceSheet.assets.total - baselineData.balanceSheet.assets.total)}
              </div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xs text-purple-600 font-medium">キャッシュへの影響</div>
              <div className="text-lg font-bold text-purple-900">
                {impactedData.balanceSheet.assets.currentAssets.cash - baselineData.balanceSheet.assets.currentAssets.cash > 0 ? '+' : ''}
                {formatCurrency(impactedData.balanceSheet.assets.currentAssets.cash - baselineData.balanceSheet.assets.currentAssets.cash)}
              </div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-xs text-yellow-600 font-medium">ROEへの影響</div>
              <div className="text-lg font-bold text-yellow-900">
                {impactedRatios.roe - baselineRatios.roe > 0 ? '+' : ''}
                {formatPercentage(impactedRatios.roe - baselineRatios.roe)}pt
              </div>
            </div>
          </div>
        )}

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div>{tab.label}</div>
                <div className="text-xs text-gray-400">{tab.description}</div>
              </button>
            ))}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="tab-content">
          {activeTab === 'pl' && (
            <ProfitLossStatement
              statement={impactedData.profitLoss}
              highlightChanges={showComparison && project !== undefined && treatment !== undefined}
              comparisonStatement={showComparison ? baselineData.profitLoss : undefined}
            />
          )}

          {activeTab === 'bs' && (
            <BalanceSheet
              statement={impactedData.balanceSheet}
              highlightChanges={showComparison && project !== undefined && treatment !== undefined}
              comparisonStatement={showComparison ? baselineData.balanceSheet : undefined}
            />
          )}

          {activeTab === 'cf' && (
            <CashFlowStatement
              statement={impactedData.cashFlow}
              highlightChanges={showComparison && project !== undefined && treatment !== undefined}
              comparisonStatement={showComparison ? baselineData.cashFlow : undefined}
            />
          )}

          {activeTab === 'ratios' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900">財務分析・指標比較</h3>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 収益性指標 */}
                <div className="col-span-full">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">収益性指標</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <RatioComparison
                      label="売上総利益率"
                      baseValue={baselineRatios.grossProfitMargin}
                      impactValue={impactedRatios.grossProfitMargin}
                      isPercentage={true}
                    />
                    <RatioComparison
                      label="営業利益率"
                      baseValue={baselineRatios.operatingProfitMargin}
                      impactValue={impactedRatios.operatingProfitMargin}
                      isPercentage={true}
                    />
                    <RatioComparison
                      label="当期純利益率"
                      baseValue={baselineRatios.netProfitMargin}
                      impactValue={impactedRatios.netProfitMargin}
                      isPercentage={true}
                    />
                  </div>
                </div>

                {/* 効率性指標 */}
                <div className="col-span-full">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">効率性・収益力指標</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <RatioComparison
                      label="ROA（総資産利益率）"
                      baseValue={baselineRatios.roa}
                      impactValue={impactedRatios.roa}
                      isPercentage={true}
                    />
                    <RatioComparison
                      label="ROE（自己資本利益率）"
                      baseValue={baselineRatios.roe}
                      impactValue={impactedRatios.roe}
                      isPercentage={true}
                    />
                    <RatioComparison
                      label="総資産回転率"
                      baseValue={baselineRatios.totalAssetTurnover}
                      impactValue={impactedRatios.totalAssetTurnover}
                    />
                  </div>
                </div>

                {/* 安全性指標 */}
                <div className="col-span-full">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">安全性指標</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <RatioComparison
                      label="流動比率"
                      baseValue={baselineRatios.currentRatio}
                      impactValue={impactedRatios.currentRatio}
                      isPercentage={true}
                    />
                    <RatioComparison
                      label="負債比率"
                      baseValue={baselineRatios.debtRatio}
                      impactValue={impactedRatios.debtRatio}
                      isPercentage={true}
                      higherIsBetter={false}
                    />
                    <RatioComparison
                      label="自己資本比率"
                      baseValue={baselineRatios.equityRatio}
                      impactValue={impactedRatios.equityRatio}
                      isPercentage={true}
                    />
                  </div>
                </div>

                {/* IT投資関連指標 */}
                <div className="col-span-full">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">IT投資関連指標</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <RatioComparison
                      label="ソフトウェア資産比率"
                      baseValue={baselineRatios.softwareAssetRatio}
                      impactValue={impactedRatios.softwareAssetRatio}
                      isPercentage={true}
                    />
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">IT投資額</h5>
                      <div className="text-lg font-bold text-blue-600">
                        {project ? formatCurrency(project.cost) : '¥0'}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        総資産の{project ? ((project.cost / impactedData.balanceSheet.assets.total) * 100).toFixed(1) : '0'}%
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">会計処理による違い</h5>
                      {project && treatment && (
                        <div className="text-sm space-y-1">
                          <div className={`font-medium ${treatment === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                            {treatment === 'expense' ? '費用化採用' : '資産化採用'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {treatment === 'expense' 
                              ? '当期利益への一括影響' 
                              : '5年間での分割影響'
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 分析コメント */}
              {project && treatment && (
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">財務分析コメント</h4>
                  <div className="text-sm text-blue-800 space-y-2">
                    {treatment === 'expense' ? (
                      <>
                        <p>• 費用化により当期の利益は{Math.abs(impactedData.profitLoss.netProfit - baselineData.profitLoss.netProfit).toLocaleString()}円減少</p>
                        <p>• ROE・ROAは一時的に{Math.abs(impactedRatios.roe - baselineRatios.roe).toFixed(1)}pt低下するが、翌期以降は影響なし</p>
                        <p>• 保守的な会計処理により、財務の透明性が向上</p>
                      </>
                    ) : (
                      <>
                        <p>• 資産化により当期利益への影響は減価償却費{Math.round(project.cost / 5).toLocaleString()}円に限定</p>
                        <p>• ROE・ROAは年間{Math.abs(impactedRatios.roe - baselineRatios.roe).toFixed(1)}pt低下するが、5年間に分散</p>
                        <p>• ソフトウェア資産{project.cost.toLocaleString()}円が貸借対照表に計上され、資産が増加</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;