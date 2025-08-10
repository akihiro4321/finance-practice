import React from 'react';
import { CashFlowStatement as CFType } from '../../types/financial';

interface CashFlowStatementProps {
  statement: CFType;
  highlightChanges?: boolean;
  comparisonStatement?: CFType;
}

const CashFlowStatement: React.FC<CashFlowStatementProps> = ({
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
    return difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : '';
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
        キャッシュフロー計算書 (C/F)
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
            {/* 営業活動によるキャッシュフロー */}
            <tr><td colSpan={2} className="px-4 py-2 text-sm font-bold text-gray-800 bg-teal-50">営業活動によるキャッシュフロー</td></tr>
            
            <LineItem 
              label="当期純利益" 
              amount={statement.operatingActivities.netIncome}
              comparisonAmount={comparisonStatement?.operatingActivities.netIncome}
              indent={1}
            />
            <LineItem 
              label="減価償却費" 
              amount={statement.operatingActivities.depreciation}
              comparisonAmount={comparisonStatement?.operatingActivities.depreciation}
              indent={1}
            />
            <LineItem 
              label="売掛金の増減額" 
              amount={statement.operatingActivities.accountsReceivableChange}
              comparisonAmount={comparisonStatement?.operatingActivities.accountsReceivableChange}
              indent={1}
            />
            <LineItem 
              label="棚卸資産の増減額" 
              amount={statement.operatingActivities.inventoryChange}
              comparisonAmount={comparisonStatement?.operatingActivities.inventoryChange}
              indent={1}
            />
            <LineItem 
              label="買掛金の増減額" 
              amount={statement.operatingActivities.accountsPayableChange}
              comparisonAmount={comparisonStatement?.operatingActivities.accountsPayableChange}
              indent={1}
            />
            <LineItem 
              label="その他" 
              amount={statement.operatingActivities.other}
              comparisonAmount={comparisonStatement?.operatingActivities.other}
              indent={1}
            />
            
            <tr><td colSpan={2} className="py-1"><hr className="border-gray-300" /></td></tr>
            <LineItem 
              label="営業活動によるキャッシュフロー" 
              amount={statement.operatingActivities.total}
              comparisonAmount={comparisonStatement?.operatingActivities.total}
              bold
            />
            
            <tr><td colSpan={2} className="py-2"></td></tr>

            {/* 投資活動によるキャッシュフロー */}
            <tr><td colSpan={2} className="px-4 py-2 text-sm font-bold text-gray-800 bg-purple-50">投資活動によるキャッシュフロー</td></tr>
            
            <LineItem 
              label="設備投資による支出" 
              amount={statement.investingActivities.equipmentPurchase}
              comparisonAmount={comparisonStatement?.investingActivities.equipmentPurchase}
              indent={1}
            />
            {statement.investingActivities.softwareDevelopment !== 0 && (
              <LineItem 
                label="ソフトウェア開発による支出" 
                amount={statement.investingActivities.softwareDevelopment}
                comparisonAmount={comparisonStatement?.investingActivities.softwareDevelopment}
                indent={1}
              />
            )}
            <LineItem 
              label="その他" 
              amount={statement.investingActivities.other}
              comparisonAmount={comparisonStatement?.investingActivities.other}
              indent={1}
            />
            
            <tr><td colSpan={2} className="py-1"><hr className="border-gray-300" /></td></tr>
            <LineItem 
              label="投資活動によるキャッシュフロー" 
              amount={statement.investingActivities.total}
              comparisonAmount={comparisonStatement?.investingActivities.total}
              bold
            />
            
            <tr><td colSpan={2} className="py-2"></td></tr>

            {/* 財務活動によるキャッシュフロー */}
            <tr><td colSpan={2} className="px-4 py-2 text-sm font-bold text-gray-800 bg-green-50">財務活動によるキャッシュフロー</td></tr>
            
            {statement.financingActivities.debtIssuance !== 0 && (
              <LineItem 
                label="借入れによる収入" 
                amount={statement.financingActivities.debtIssuance}
                comparisonAmount={comparisonStatement?.financingActivities.debtIssuance}
                indent={1}
              />
            )}
            <LineItem 
              label="借入金の返済による支出" 
              amount={statement.financingActivities.debtRepayment}
              comparisonAmount={comparisonStatement?.financingActivities.debtRepayment}
              indent={1}
            />
            <LineItem 
              label="配当金の支払額" 
              amount={statement.financingActivities.dividends}
              comparisonAmount={comparisonStatement?.financingActivities.dividends}
              indent={1}
            />
            {statement.financingActivities.other !== 0 && (
              <LineItem 
                label="その他" 
                amount={statement.financingActivities.other}
                comparisonAmount={comparisonStatement?.financingActivities.other}
                indent={1}
              />
            )}
            
            <tr><td colSpan={2} className="py-1"><hr className="border-gray-300" /></td></tr>
            <LineItem 
              label="財務活動によるキャッシュフロー" 
              amount={statement.financingActivities.total}
              comparisonAmount={comparisonStatement?.financingActivities.total}
              bold
            />
            
            <tr><td colSpan={2} className="py-3"><hr className="border-gray-400" /></td></tr>

            {/* キャッシュフローのまとめ */}
            <LineItem 
              label="現金及び現金同等物の増減額" 
              amount={statement.netCashFlow}
              comparisonAmount={comparisonStatement?.netCashFlow}
              bold
            />
            <LineItem 
              label="現金及び現金同等物の期首残高" 
              amount={statement.beginningCash}
              comparisonAmount={comparisonStatement?.beginningCash}
            />
            
            <tr><td colSpan={2} className="py-1"><hr className="border-gray-400" /></td></tr>
            <LineItem 
              label="現金及び現金同等物の期末残高" 
              amount={statement.endingCash}
              comparisonAmount={comparisonStatement?.endingCash}
              bold
            />
          </tbody>
        </table>
      </div>
      
      {/* 主要指標とフリーキャッシュフロー */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded">
          <h4 className="text-sm font-medium text-gray-700 mb-3">キャッシュフロー分析</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>営業CF:</span>
              <span className={statement.operatingActivities.total >= 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {formatCurrency(statement.operatingActivities.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>投資CF:</span>
              <span className="font-bold">
                {formatCurrency(statement.investingActivities.total)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>財務CF:</span>
              <span className="font-bold">
                {formatCurrency(statement.financingActivities.total)}
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span>フリーCF:</span>
              <span className={
                (statement.operatingActivities.total + statement.investingActivities.total) >= 0 
                  ? 'text-green-600 font-bold' : 'text-red-600 font-bold'
              }>
                {formatCurrency(statement.operatingActivities.total + statement.investingActivities.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <h4 className="text-sm font-medium text-gray-700 mb-3">キャッシュフロー パターン</h4>
          <div className="text-sm">
            {statement.operatingActivities.total > 0 && statement.investingActivities.total < 0 && statement.financingActivities.total <= 0 ? (
              <div className="text-green-700">
                <span className="font-bold">成長期</span>
                <p className="text-xs mt-1">営業でキャッシュを稼ぎ、投資に活用している健全な状態</p>
              </div>
            ) : statement.operatingActivities.total > 0 && statement.investingActivities.total >= 0 ? (
              <div className="text-blue-700">
                <span className="font-bold">成熟期</span>
                <p className="text-xs mt-1">安定したキャッシュフローを維持</p>
              </div>
            ) : statement.operatingActivities.total < 0 ? (
              <div className="text-red-700">
                <span className="font-bold">注意が必要</span>
                <p className="text-xs mt-1">営業活動がマイナス、事業の見直しが必要</p>
              </div>
            ) : (
              <div className="text-gray-700">
                <span className="font-bold">その他</span>
                <p className="text-xs mt-1">特殊な状況、詳細な分析が必要</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlowStatement;