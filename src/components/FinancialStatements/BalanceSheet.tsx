import React from 'react';
import { BalanceSheet as BSType } from '../../types/financial';

interface BalanceSheetProps {
  statement: BSType;
  highlightChanges?: boolean;
  comparisonStatement?: BSType;
}

const BalanceSheet: React.FC<BalanceSheetProps> = ({
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
    return difference > 0 ? 'text-blue-600' : difference < 0 ? 'text-red-600' : '';
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
        貸借対照表 (B/S)
        {highlightChanges && comparisonStatement && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            - 変更影響表示
          </span>
        )}
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* 資産の部 */}
        <div>
          <h4 className="text-md font-bold text-gray-800 mb-3">【資産の部】</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                <tr><td colSpan={2} className="px-4 py-1 text-sm font-medium text-gray-700">流動資産</td></tr>
                
                <LineItem 
                  label="現金・預金" 
                  amount={statement.assets.currentAssets.cash}
                  comparisonAmount={comparisonStatement?.assets.currentAssets.cash}
                  indent={1}
                />
                <LineItem 
                  label="売掛金" 
                  amount={statement.assets.currentAssets.accountsReceivable}
                  comparisonAmount={comparisonStatement?.assets.currentAssets.accountsReceivable}
                  indent={1}
                />
                <LineItem 
                  label="棚卸資産" 
                  amount={statement.assets.currentAssets.inventory}
                  comparisonAmount={comparisonStatement?.assets.currentAssets.inventory}
                  indent={1}
                />
                <LineItem 
                  label="その他" 
                  amount={statement.assets.currentAssets.other}
                  comparisonAmount={comparisonStatement?.assets.currentAssets.other}
                  indent={1}
                />
                <LineItem 
                  label="流動資産合計" 
                  amount={statement.assets.currentAssets.total}
                  comparisonAmount={comparisonStatement?.assets.currentAssets.total}
                  bold
                />
                
                <tr><td colSpan={2} className="py-2"></td></tr>
                <tr><td colSpan={2} className="px-4 py-1 text-sm font-medium text-gray-700">固定資産</td></tr>
                
                <LineItem 
                  label="有形固定資産" 
                  amount={statement.assets.fixedAssets.tangibleAssets}
                  comparisonAmount={comparisonStatement?.assets.fixedAssets.tangibleAssets}
                  indent={1}
                />
                
                <tr><td colSpan={2} className="px-4 py-1 text-xs text-gray-600 pl-8">無形固定資産</td></tr>
                <LineItem 
                  label="ソフトウェア" 
                  amount={statement.assets.fixedAssets.intangibleAssets.software}
                  comparisonAmount={comparisonStatement?.assets.fixedAssets.intangibleAssets.software}
                  indent={2}
                />
                <LineItem 
                  label="のれん" 
                  amount={statement.assets.fixedAssets.intangibleAssets.goodwill}
                  comparisonAmount={comparisonStatement?.assets.fixedAssets.intangibleAssets.goodwill}
                  indent={2}
                />
                <LineItem 
                  label="その他" 
                  amount={statement.assets.fixedAssets.intangibleAssets.other}
                  comparisonAmount={comparisonStatement?.assets.fixedAssets.intangibleAssets.other}
                  indent={2}
                />
                <LineItem 
                  label="無形固定資産計" 
                  amount={statement.assets.fixedAssets.intangibleAssets.total}
                  comparisonAmount={comparisonStatement?.assets.fixedAssets.intangibleAssets.total}
                  indent={1}
                />
                
                <LineItem 
                  label="投資その他の資産" 
                  amount={statement.assets.fixedAssets.investments}
                  comparisonAmount={comparisonStatement?.assets.fixedAssets.investments}
                  indent={1}
                />
                <LineItem 
                  label="固定資産合計" 
                  amount={statement.assets.fixedAssets.total}
                  comparisonAmount={comparisonStatement?.assets.fixedAssets.total}
                  bold
                />
                
                <tr><td colSpan={2} className="py-2"><hr className="border-gray-400" /></td></tr>
                <LineItem 
                  label="資産合計" 
                  amount={statement.assets.total}
                  comparisonAmount={comparisonStatement?.assets.total}
                  bold
                />
              </tbody>
            </table>
          </div>
        </div>

        {/* 負債・純資産の部 */}
        <div>
          <h4 className="text-md font-bold text-gray-800 mb-3">【負債・純資産の部】</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                <tr><td colSpan={2} className="px-4 py-1 text-sm font-medium text-gray-700">流動負債</td></tr>
                
                <LineItem 
                  label="買掛金" 
                  amount={statement.liabilities.currentLiabilities.accountsPayable}
                  comparisonAmount={comparisonStatement?.liabilities.currentLiabilities.accountsPayable}
                  indent={1}
                />
                <LineItem 
                  label="短期借入金" 
                  amount={statement.liabilities.currentLiabilities.shortTermDebt}
                  comparisonAmount={comparisonStatement?.liabilities.currentLiabilities.shortTermDebt}
                  indent={1}
                />
                <LineItem 
                  label="未払金" 
                  amount={statement.liabilities.currentLiabilities.accrued}
                  comparisonAmount={comparisonStatement?.liabilities.currentLiabilities.accrued}
                  indent={1}
                />
                <LineItem 
                  label="その他" 
                  amount={statement.liabilities.currentLiabilities.other}
                  comparisonAmount={comparisonStatement?.liabilities.currentLiabilities.other}
                  indent={1}
                />
                <LineItem 
                  label="流動負債合計" 
                  amount={statement.liabilities.currentLiabilities.total}
                  comparisonAmount={comparisonStatement?.liabilities.currentLiabilities.total}
                  bold
                />
                
                <tr><td colSpan={2} className="py-2"></td></tr>
                <tr><td colSpan={2} className="px-4 py-1 text-sm font-medium text-gray-700">固定負債</td></tr>
                
                <LineItem 
                  label="長期借入金" 
                  amount={statement.liabilities.longTermLiabilities.longTermDebt}
                  comparisonAmount={comparisonStatement?.liabilities.longTermLiabilities.longTermDebt}
                  indent={1}
                />
                <LineItem 
                  label="その他" 
                  amount={statement.liabilities.longTermLiabilities.other}
                  comparisonAmount={comparisonStatement?.liabilities.longTermLiabilities.other}
                  indent={1}
                />
                <LineItem 
                  label="固定負債合計" 
                  amount={statement.liabilities.longTermLiabilities.total}
                  comparisonAmount={comparisonStatement?.liabilities.longTermLiabilities.total}
                  bold
                />
                
                <LineItem 
                  label="負債合計" 
                  amount={statement.liabilities.total}
                  comparisonAmount={comparisonStatement?.liabilities.total}
                  bold
                />
                
                <tr><td colSpan={2} className="py-2"></td></tr>
                <tr><td colSpan={2} className="px-4 py-1 text-sm font-medium text-gray-700">純資産の部</td></tr>
                
                <LineItem 
                  label="資本金" 
                  amount={statement.equity.capital}
                  comparisonAmount={comparisonStatement?.equity.capital}
                  indent={1}
                />
                <LineItem 
                  label="利益剰余金" 
                  amount={statement.equity.retainedEarnings}
                  comparisonAmount={comparisonStatement?.equity.retainedEarnings}
                  indent={1}
                />
                <LineItem 
                  label="その他" 
                  amount={statement.equity.other}
                  comparisonAmount={comparisonStatement?.equity.other}
                  indent={1}
                />
                <LineItem 
                  label="純資産合計" 
                  amount={statement.equity.total}
                  comparisonAmount={comparisonStatement?.equity.total}
                  bold
                />
                
                <tr><td colSpan={2} className="py-2"><hr className="border-gray-400" /></td></tr>
                <LineItem 
                  label="負債・純資産合計" 
                  amount={statement.totalLiabilitiesAndEquity}
                  comparisonAmount={comparisonStatement?.totalLiabilitiesAndEquity}
                  bold
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* 主要指標 */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-600">流動比率</span>
          <div className="font-bold text-lg">
            {((statement.assets.currentAssets.total / statement.liabilities.currentLiabilities.total) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-600">負債比率</span>
          <div className="font-bold text-lg">
            {((statement.liabilities.total / statement.assets.total) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded">
          <span className="text-gray-600">自己資本比率</span>
          <div className="font-bold text-lg">
            {((statement.equity.total / statement.assets.total) * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;