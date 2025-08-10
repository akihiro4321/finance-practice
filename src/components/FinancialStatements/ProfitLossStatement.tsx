import React from 'react';
import { ProfitLossStatement as PLType } from '../../types/financial';

interface ProfitLossStatementProps {
  statement: PLType;
  highlightChanges?: boolean;
  comparisonStatement?: PLType;
}

const ProfitLossStatement: React.FC<ProfitLossStatementProps> = ({
  statement,
  highlightChanges = false,
  comparisonStatement
}) => {
  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const getDifference = (current: number, comparison?: number) => {
    if (!comparison) return null;
    return current - comparison;
  };

  const getDifferenceClass = (difference: number | null) => {
    if (!difference || !highlightChanges) return '';
    return difference > 0 ? 'text-red-600' : difference < 0 ? 'text-green-600' : '';
  };

  const formatDifference = (difference: number | null) => {
    if (!difference || !highlightChanges) return '';
    const sign = difference > 0 ? '+' : '';
    return ` (${sign}${formatCurrency(difference)})`;
  };

  const LineItem: React.FC<{ 
    label: string; 
    amount: number; 
    indent?: number;
    bold?: boolean;
    comparisonAmount?: number;
  }> = ({ label, amount, indent = 0, bold = false, comparisonAmount }) => {
    const difference = getDifference(amount, comparisonAmount);
    const differenceClass = getDifferenceClass(difference);
    const differenceText = formatDifference(difference);

    return (
      <tr className="hover:bg-gray-50">
        <td className="px-4 py-2 text-left">
          <span 
            className={`${bold ? 'font-bold' : ''}`}
            style={{ paddingLeft: `${indent * 16}px` }}
          >
            {label}
          </span>
        </td>
        <td className={`px-4 py-2 text-right ${bold ? 'font-bold' : ''} ${differenceClass}`}>
          {formatCurrency(amount)}{differenceText}
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        損益計算書 (P/L)
        {highlightChanges && comparisonStatement && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            - 変更影響表示
          </span>
        )}
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                科目
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                金額
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <LineItem 
              label="売上高" 
              amount={statement.revenue}
              comparisonAmount={comparisonStatement?.revenue}
              bold
            />
            <LineItem 
              label="売上原価" 
              amount={statement.costOfSales}
              comparisonAmount={comparisonStatement?.costOfSales}
            />
            <LineItem 
              label="売上総利益" 
              amount={statement.grossProfit}
              comparisonAmount={comparisonStatement?.grossProfit}
              bold
            />
            
            <tr><td colSpan={2} className="py-2"><hr className="border-gray-200" /></td></tr>
            <tr><td colSpan={2} className="px-4 py-1 text-sm font-medium text-gray-700">販売費及び一般管理費</td></tr>
            
            <LineItem 
              label="人件費" 
              amount={statement.operatingExpenses.salaries}
              comparisonAmount={comparisonStatement?.operatingExpenses.salaries}
              indent={1}
            />
            <LineItem 
              label="減価償却費" 
              amount={statement.operatingExpenses.depreciation}
              comparisonAmount={comparisonStatement?.operatingExpenses.depreciation}
              indent={1}
            />
            {statement.operatingExpenses.systemDevelopment > 0 && (
              <LineItem 
                label="システム開発費" 
                amount={statement.operatingExpenses.systemDevelopment}
                comparisonAmount={comparisonStatement?.operatingExpenses.systemDevelopment}
                indent={1}
              />
            )}
            <LineItem 
              label="その他" 
              amount={statement.operatingExpenses.other}
              comparisonAmount={comparisonStatement?.operatingExpenses.other}
              indent={1}
            />
            <LineItem 
              label="販管費合計" 
              amount={statement.operatingExpenses.total}
              comparisonAmount={comparisonStatement?.operatingExpenses.total}
              bold
            />
            
            <LineItem 
              label="営業利益" 
              amount={statement.operatingProfit}
              comparisonAmount={comparisonStatement?.operatingProfit}
              bold
            />
            
            <tr><td colSpan={2} className="py-2"><hr className="border-gray-200" /></td></tr>
            
            <LineItem 
              label="営業外収益" 
              amount={statement.nonOperatingIncome}
              comparisonAmount={comparisonStatement?.nonOperatingIncome}
            />
            <LineItem 
              label="営業外費用" 
              amount={statement.nonOperatingExpenses}
              comparisonAmount={comparisonStatement?.nonOperatingExpenses}
            />
            <LineItem 
              label="経常利益" 
              amount={statement.ordinaryProfit}
              comparisonAmount={comparisonStatement?.ordinaryProfit}
              bold
            />
            
            {(statement.extraordinaryIncome > 0 || statement.extraordinaryLoss > 0) && (
              <>
                <LineItem 
                  label="特別利益" 
                  amount={statement.extraordinaryIncome}
                  comparisonAmount={comparisonStatement?.extraordinaryIncome}
                />
                <LineItem 
                  label="特別損失" 
                  amount={statement.extraordinaryLoss}
                  comparisonAmount={comparisonStatement?.extraordinaryLoss}
                />
              </>
            )}
            
            <LineItem 
              label="税引前当期純利益" 
              amount={statement.pretaxProfit}
              comparisonAmount={comparisonStatement?.pretaxProfit}
              bold
            />
            <LineItem 
              label="法人税等" 
              amount={statement.incomeTax}
              comparisonAmount={comparisonStatement?.incomeTax}
            />
            
            <tr><td colSpan={2} className="py-2"><hr className="border-gray-400" /></td></tr>
            
            <LineItem 
              label="当期純利益" 
              amount={statement.netProfit}
              comparisonAmount={comparisonStatement?.netProfit}
              bold
            />
          </tbody>
        </table>
      </div>
      
      {/* 主要指標 */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-600">売上総利益率</span>
          <div className="font-bold text-lg">
            {((statement.grossProfit / statement.revenue) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-600">営業利益率</span>
          <div className="font-bold text-lg">
            {((statement.operatingProfit / statement.revenue) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-600">当期純利益率</span>
          <div className="font-bold text-lg">
            {((statement.netProfit / statement.revenue) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossStatement;