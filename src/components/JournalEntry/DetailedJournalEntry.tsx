import React from 'react';
import { DetailedJournalEntry as DetailedJournalEntryType, JournalEntry } from '../../types';

interface DetailedJournalEntryProps {
  journalEntry: DetailedJournalEntryType;
  projectName: string;
}

const DetailedJournalEntry: React.FC<DetailedJournalEntryProps> = ({
  journalEntry,
  projectName
}) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString();
  };

  const JournalTable: React.FC<{ entries: JournalEntry[]; title: string }> = ({ entries, title }) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-700">
                勘定科目
              </th>
              <th className="border border-gray-200 px-4 py-2 text-right text-xs font-medium text-gray-700">
                借方
              </th>
              <th className="border border-gray-200 px-4 py-2 text-right text-xs font-medium text-gray-700">
                貸方
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-700">
                摘要
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-200 px-4 py-2 text-sm text-gray-900">
                  {entry.account}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-900">
                  {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-900">
                  {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                  {entry.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">詳細な会計処理</h2>
      
      {/* メイン仕訳 */}
      <JournalTable entries={journalEntry.mainEntry} title="メイン仕訳" />

      {/* 関連仕訳 */}
      {journalEntry.relatedEntries && journalEntry.relatedEntries.length > 0 && (
        <JournalTable entries={journalEntry.relatedEntries} title="関連仕訳（減価償却例）" />
      )}

      {/* 減価償却スケジュール */}
      {journalEntry.depreciationSchedule && journalEntry.depreciationSchedule.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">減価償却スケジュール（5年定額法）</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-center text-xs font-medium text-gray-700">
                    年度
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-xs font-medium text-gray-700">
                    期首簿価
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-xs font-medium text-gray-700">
                    減価償却費
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-right text-xs font-medium text-gray-700">
                    期末簿価
                  </th>
                </tr>
              </thead>
              <tbody>
                {journalEntry.depreciationSchedule.map((entry, index) => (
                  <tr key={entry.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-4 py-2 text-center text-sm font-medium text-gray-900">
                      {entry.year}年目
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-900">
                      ¥{formatCurrency(entry.beginningValue)}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right text-sm text-red-600 font-medium">
                      ¥{formatCurrency(entry.depreciationAmount)}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-right text-sm text-gray-900">
                      ¥{formatCurrency(entry.endingValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 財務影響分析 */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-3">財務影響分析</h4>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded border">
            <h5 className="text-xs font-medium text-gray-700 mb-2">当期影響</h5>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>損益への影響:</span>
                <span className={journalEntry.impact.currentYear.profitLoss < 0 ? 'text-red-600' : 'text-green-600'}>
                  ¥{formatCurrency(Math.abs(journalEntry.impact.currentYear.profitLoss))}
                  {journalEntry.impact.currentYear.profitLoss < 0 ? ' 減' : ' 増'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>キャッシュフロー:</span>
                <span className={journalEntry.impact.currentYear.cashFlow < 0 ? 'text-red-600' : 'text-green-600'}>
                  ¥{formatCurrency(Math.abs(journalEntry.impact.currentYear.cashFlow))}
                  {journalEntry.impact.currentYear.cashFlow < 0 ? ' 減' : ' 増'}
                </span>
              </div>
            </div>
          </div>

          {journalEntry.impact.futureYears.length > 0 && (
            <div className="bg-white p-3 rounded border">
              <h5 className="text-xs font-medium text-gray-700 mb-2">将来年度影響（年間）</h5>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>年間減価償却費:</span>
                  <span className="text-red-600">
                    ¥{formatCurrency(Math.abs(journalEntry.impact.futureYears[0].profitLoss))} 減
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>資産価値減少:</span>
                  <span className="text-gray-600">
                    ¥{formatCurrency(Math.abs(journalEntry.impact.futureYears[0].balanceSheet.assets))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 詳細説明 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">会計処理の解説</h4>
        <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
          {journalEntry.explanation}
        </div>
      </div>

      {/* 実務ポイント */}
      <div className="border-l-4 border-blue-500 pl-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">💡 実務での考慮点</h4>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• 税務上の取扱いは会計処理と異なる場合があります</li>
          <li>• 監査法人との事前協議が推奨されます</li>
          <li>• 社内の会計方針との整合性を確認してください</li>
          <li>• 類似プロジェクトでの前例を参考にしてください</li>
          {journalEntry.depreciationSchedule && (
            <li>• 減価償却方法（定額法・定率法）の選択は税務・会計方針に従ってください</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DetailedJournalEntry;