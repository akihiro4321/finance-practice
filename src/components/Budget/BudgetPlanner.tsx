import React, { useState, useEffect } from 'react';
import { BudgetItem, BudgetAnalysis, BudgetCategory, ROICalculation } from '../../types/budget';
import { calculateBudgetAnalysis, calculateROI, generateBudgetTemplate } from '../../utils/budgetCalculations';

interface BudgetPlannerProps {
  initialBudget?: number;
  projectType?: 'web' | 'mobile' | 'infrastructure' | 'ai';
  onBudgetChange?: (items: BudgetItem[], analysis: BudgetAnalysis) => void;
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  initialBudget = 10000000,
  projectType = 'web',
  onBudgetChange
}) => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [analysis, setAnalysis] = useState<BudgetAnalysis | null>(null);
  const [roiCalculation, setROICalculation] = useState<ROICalculation | null>(null);
  const [activeTab, setActiveTab] = useState<'items' | 'analysis' | 'roi'>('items');
  const [newItem, setNewItem] = useState<Partial<BudgetItem>>({
    category: 'personnel',
    subcategory: '',
    description: '',
    unitPrice: 0,
    quantity: 1,
    unit: 'LS',
    isFixed: true
  });

  // ROI計算用パラメータ
  const [roiParams, setROIParams] = useState({
    annualRevenue: 5000000,
    annualCostSavings: 2000000,
    years: 5,
    discountRate: 0.1
  });

  useEffect(() => {
    if (budgetItems.length === 0) {
      // 初期テンプレートを読み込み
      const templateItems = generateBudgetTemplate(projectType, initialBudget);
      setBudgetItems(templateItems);
    }
  }, [initialBudget, projectType, budgetItems.length]);

  useEffect(() => {
    if (budgetItems.length > 0) {
      const newAnalysis = calculateBudgetAnalysis(budgetItems);
      setAnalysis(newAnalysis);
      
      // ROI計算
      const newROI = calculateROI(
        newAnalysis.totalBudget,
        roiParams.annualRevenue,
        roiParams.annualCostSavings,
        roiParams.years,
        roiParams.discountRate
      );
      setROICalculation(newROI);

      onBudgetChange?.(budgetItems, newAnalysis);
    }
  }, [budgetItems, roiParams, onBudgetChange]);

  const categoryOptions: { value: BudgetCategory; label: string }[] = [
    { value: 'personnel', label: '人件費' },
    { value: 'external', label: '外注費' },
    { value: 'infrastructure', label: 'インフラ費' },
    { value: 'software', label: 'ソフトウェア' },
    { value: 'hardware', label: 'ハードウェア' },
    { value: 'travel', label: '旅費交通費' },
    { value: 'training', label: '研修費' },
    { value: 'other', label: 'その他' }
  ];

  const addBudgetItem = () => {
    if (!newItem.description || !newItem.unitPrice) return;

    const item: BudgetItem = {
      id: `item-${Date.now()}`,
      category: newItem.category!,
      subcategory: newItem.subcategory!,
      description: newItem.description,
      unitPrice: newItem.unitPrice,
      quantity: newItem.quantity || 1,
      unit: newItem.unit || 'LS',
      totalAmount: (newItem.unitPrice || 0) * (newItem.quantity || 1),
      isFixed: newItem.isFixed || false,
      schedule: Array.from({ length: 12 }, (_, index) => ({
        month: index + 1,
        plannedAmount: Math.round(((newItem.unitPrice || 0) * (newItem.quantity || 1)) / 6), // 6ヶ月分散
      })),
      notes: newItem.notes
    };

    setBudgetItems(prev => [...prev, item]);
    setNewItem({
      category: 'personnel',
      subcategory: '',
      description: '',
      unitPrice: 0,
      quantity: 1,
      unit: 'LS',
      isFixed: true
    });
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(prev => prev.filter(item => item.id !== id));
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setBudgetItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        updatedItem.totalAmount = updatedItem.unitPrice * updatedItem.quantity;
        return updatedItem;
      }
      return item;
    }));
  };

  const loadTemplate = () => {
    const templateItems = generateBudgetTemplate(projectType, initialBudget);
    setBudgetItems(templateItems);
  };

  const formatCurrency = (amount: number) => `¥${amount.toLocaleString()}`;

  if (!analysis) return <div>読み込み中...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">プロジェクト予算策定</h2>
          <div className="flex space-x-2">
            <button
              onClick={loadTemplate}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              テンプレート読み込み
            </button>
          </div>
        </div>

        {/* 予算サマリー */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">総予算額</div>
            <div className="text-2xl font-bold text-blue-900">
              {formatCurrency(analysis.totalBudget)}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">予算項目数</div>
            <div className="text-2xl font-bold text-green-900">
              {budgetItems.length}項目
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">最大カテゴリ</div>
            <div className="text-2xl font-bold text-purple-900">
              {Object.entries(analysis.categoryBreakdown)
                .reduce((max, [category, data]) => 
                  data.amount > max.amount ? { category, amount: data.amount } : max,
                  { category: '', amount: 0 }
                ).category}
            </div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600">ROI</div>
            <div className="text-2xl font-bold text-yellow-900">
              {roiCalculation?.roi.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('items')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'items'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              予算項目管理
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analysis'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              予算分析
            </button>
            <button
              onClick={() => setActiveTab('roi')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roi'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ROI分析
            </button>
          </nav>
        </div>

        {/* 予算項目管理タブ */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            {/* 新規項目追加フォーム */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">新規予算項目追加</h3>
              <div className="grid grid-cols-6 gap-4">
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value as BudgetCategory }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  {categoryOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="詳細項目"
                  value={newItem.subcategory}
                  onChange={(e) => setNewItem(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />

                <input
                  type="text"
                  placeholder="説明"
                  value={newItem.description}
                  onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                  className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />

                <input
                  type="number"
                  placeholder="単価"
                  value={newItem.unitPrice || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseInt(e.target.value) || 0 }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />

                <button
                  onClick={addBudgetItem}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  追加
                </button>
              </div>
            </div>

            {/* 予算項目一覧 */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">カテゴリ</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">項目</th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">説明</th>
                    <th className="border border-gray-200 px-4 py-3 text-right font-medium text-gray-700">単価</th>
                    <th className="border border-gray-200 px-4 py-3 text-right font-medium text-gray-700">数量</th>
                    <th className="border border-gray-200 px-4 py-3 text-right font-medium text-gray-700">合計</th>
                    <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border border-gray-200 px-4 py-3">
                        {categoryOptions.find(opt => opt.value === item.category)?.label}
                      </td>
                      <td className="border border-gray-200 px-4 py-3">{item.subcategory}</td>
                      <td className="border border-gray-200 px-4 py-3">{item.description}</td>
                      <td className="border border-gray-200 px-4 py-3 text-right">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateBudgetItem(item.id, { unitPrice: parseInt(e.target.value) || 0 })}
                          className="w-full text-right px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateBudgetItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-full text-right px-2 py-1 border border-gray-300 rounded"
                        />
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right font-medium">
                        {formatCurrency(item.totalAmount)}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-center">
                        <button
                          onClick={() => removeBudgetItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td colSpan={5} className="border border-gray-200 px-4 py-3 text-right">合計</td>
                    <td className="border border-gray-200 px-4 py-3 text-right">
                      {formatCurrency(analysis.totalBudget)}
                    </td>
                    <td className="border border-gray-200 px-4 py-3"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* 予算分析タブ */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* カテゴリ別分析 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">カテゴリ別予算分析</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(analysis.categoryBreakdown).map(([category, data]) => {
                  const option = categoryOptions.find(opt => opt.value === category);
                  if (!option || data.amount === 0) return null;

                  return (
                    <div key={category} className="bg-white p-4 rounded-lg border">
                      <h4 className="text-sm font-medium text-gray-700">{option.label}</h4>
                      <div className="text-lg font-bold text-gray-900 mt-1">
                        {formatCurrency(data.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {data.percentage.toFixed(1)}% ({data.items}項目)
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${Math.min(data.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* リスク分析 */}
            {analysis.risks.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">リスク分析</h3>
                <div className="space-y-3">
                  {analysis.risks.map((risk) => (
                    <div
                      key={risk.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        risk.severity === 'critical'
                          ? 'border-red-500 bg-red-50'
                          : risk.severity === 'high'
                          ? 'border-orange-500 bg-orange-50'
                          : risk.severity === 'medium'
                          ? 'border-yellow-500 bg-yellow-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{risk.description}</h4>
                          <p className="text-sm text-gray-600 mt-1">{risk.impact}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>対策:</strong> {risk.mitigation}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <div className={`text-sm font-medium ${
                            risk.severity === 'critical'
                              ? 'text-red-700'
                              : risk.severity === 'high'
                              ? 'text-orange-700'
                              : risk.severity === 'medium'
                              ? 'text-yellow-700'
                              : 'text-blue-700'
                          }`}>
                            {risk.severity.toUpperCase()}
                          </div>
                          <div className="text-xs text-gray-500">
                            確率: {risk.probability}%
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 推奨事項 */}
            {analysis.recommendations.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">改善提案</h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec) => (
                    <div key={rec.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900">{rec.title}</h4>
                          <p className="text-sm text-green-700 mt-1">{rec.description}</p>
                        </div>
                        <div className="ml-4 text-right">
                          {rec.expectedSavings && (
                            <div className="text-sm font-medium text-green-700">
                              削減効果: {formatCurrency(rec.expectedSavings)}
                            </div>
                          )}
                          <div className={`text-xs ${
                            rec.priority === 'high' ? 'text-red-600' : 
                            rec.priority === 'medium' ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            優先度: {rec.priority.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROI分析タブ */}
        {activeTab === 'roi' && roiCalculation && (
          <div className="space-y-6">
            {/* ROI パラメータ入力 */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">ROI計算パラメータ</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年間売上増加</label>
                  <input
                    type="number"
                    value={roiParams.annualRevenue}
                    onChange={(e) => setROIParams(prev => ({ ...prev, annualRevenue: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">年間コスト削減</label>
                  <input
                    type="number"
                    value={roiParams.annualCostSavings}
                    onChange={(e) => setROIParams(prev => ({ ...prev, annualCostSavings: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">評価期間（年）</label>
                  <input
                    type="number"
                    value={roiParams.years}
                    onChange={(e) => setROIParams(prev => ({ ...prev, years: parseInt(e.target.value) || 5 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">割引率（%）</label>
                  <input
                    type="number"
                    step="0.1"
                    value={roiParams.discountRate * 100}
                    onChange={(e) => setROIParams(prev => ({ ...prev, discountRate: (parseFloat(e.target.value) || 10) / 100 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* ROI指標 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-medium text-gray-700">ROI</h4>
                <div className={`text-2xl font-bold ${roiCalculation.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {roiCalculation.roi.toFixed(1)}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-medium text-gray-700">NPV</h4>
                <div className={`text-2xl font-bold ${roiCalculation.npv > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(roiCalculation.npv)}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-medium text-gray-700">IRR</h4>
                <div className={`text-2xl font-bold ${roiCalculation.irr > roiParams.discountRate * 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {roiCalculation.irr.toFixed(1)}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="text-sm font-medium text-gray-700">回収期間</h4>
                <div className="text-2xl font-bold text-gray-900">
                  {roiCalculation.paybackPeriod.toFixed(1)}年
                </div>
              </div>
            </div>

            {/* 年次効果詳細 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">年次効果詳細</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-center font-medium text-gray-700">年</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-medium text-gray-700">売上増加</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-medium text-gray-700">コスト削減</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-medium text-gray-700">総効果</th>
                      <th className="border border-gray-200 px-4 py-3 text-right font-medium text-gray-700">現在価値</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roiCalculation.benefits.map((benefit) => (
                      <tr key={benefit.year} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 text-center">{benefit.year}年目</td>
                        <td className="border border-gray-200 px-4 py-3 text-right">{formatCurrency(benefit.revenue)}</td>
                        <td className="border border-gray-200 px-4 py-3 text-right">{formatCurrency(benefit.costSavings)}</td>
                        <td className="border border-gray-200 px-4 py-3 text-right font-medium">{formatCurrency(benefit.totalBenefit)}</td>
                        <td className="border border-gray-200 px-4 py-3 text-right">{formatCurrency(benefit.discountedBenefit)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-gray-200 px-4 py-3 text-center">合計</td>
                      <td className="border border-gray-200 px-4 py-3 text-right">
                        {formatCurrency(roiCalculation.benefits.reduce((sum, b) => sum + b.revenue, 0))}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right">
                        {formatCurrency(roiCalculation.benefits.reduce((sum, b) => sum + b.costSavings, 0))}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right">
                        {formatCurrency(roiCalculation.benefits.reduce((sum, b) => sum + b.totalBenefit, 0))}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-right">
                        {formatCurrency(roiCalculation.benefits.reduce((sum, b) => sum + b.discountedBenefit, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* ROI判定 */}
            <div className={`p-4 rounded-lg border ${
              roiCalculation.roi > 20 && roiCalculation.npv > 0 
                ? 'bg-green-50 border-green-200' :
              roiCalculation.roi > 10 && roiCalculation.npv > 0
                ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <h4 className={`font-medium ${
                roiCalculation.roi > 20 && roiCalculation.npv > 0 ? 'text-green-900' :
                roiCalculation.roi > 10 && roiCalculation.npv > 0 ? 'text-yellow-900' : 'text-red-900'
              }`}>
                投資判定
              </h4>
              <p className={`text-sm mt-1 ${
                roiCalculation.roi > 20 && roiCalculation.npv > 0 ? 'text-green-700' :
                roiCalculation.roi > 10 && roiCalculation.npv > 0 ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {roiCalculation.roi > 20 && roiCalculation.npv > 0
                  ? '✅ 投資効果が高く、実行を強く推奨します'
                  : roiCalculation.roi > 10 && roiCalculation.npv > 0
                  ? '⚠️ 一定の投資効果はありますが、慎重な検討が必要です'
                  : '❌ 投資効果が低く、計画の見直しを推奨します'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner;