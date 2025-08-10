import React from 'react';
import { DevelopmentPhase, AccountingTreatment } from '../../types';

interface ResultDisplayProps {
  phase: DevelopmentPhase;
  treatment: AccountingTreatment | null;
  projectCost: number;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
  phase,
  treatment,
  projectCost
}) => {
  if (!treatment) return null;

  const phaseNames = {
    requirements: '要件定義・設計',
    development: '開発・テスト',
    maintenance: '運用・保守'
  };

  const treatmentNames = {
    expense: '費用化',
    capitalize: '資産化'
  };

  const getJournalEntries = () => {
    const formattedCost = projectCost.toLocaleString();
    
    if (treatment === 'expense') {
      return [
        { account: 'システム開発費', debit: formattedCost, credit: '-' },
        { account: '現金・預金', debit: '-', credit: formattedCost }
      ];
    } else {
      return [
        { account: 'ソフトウェア資産', debit: formattedCost, credit: '-' },
        { account: '現金・預金', debit: '-', credit: formattedCost }
      ];
    }
  };

  const journalEntries = getJournalEntries();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          会計処理結果
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">選択されたフェーズ</h3>
              <p className="text-lg text-gray-900">{phaseNames[phase]}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">会計処理方法</h3>
              <p className="text-lg text-gray-900">{treatmentNames[treatment]}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700">プロジェクト費用</h3>
              <p className="text-lg text-gray-900">¥{projectCost.toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">仕訳例</h3>
            <div className="bg-gray-50 p-4 rounded">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">勘定科目</th>
                    <th className="text-right py-2">借方</th>
                    <th className="text-right py-2">貸方</th>
                  </tr>
                </thead>
                <tbody>
                  {journalEntries.map((entry, index) => (
                    <tr key={index}>
                      <td className="py-1">{entry.account}</td>
                      <td className="text-right py-1">{entry.debit}</td>
                      <td className="text-right py-1">{entry.credit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-teal-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            💡 会計処理のポイント
          </h3>
          {treatment === 'expense' ? (
            <div className="text-sm text-blue-800 space-y-2">
              <p>• この期間に発生した費用は即座に損益計算書の費用として計上されます</p>
              <p>• 当期の利益に直接影響を与えます</p>
              <p>• 貸借対照表には資産として計上されません</p>
            </div>
          ) : (
            <div className="text-sm text-blue-800 space-y-2">
              <p>• 開発費用はソフトウェア資産として貸借対照表に計上されます</p>
              <p>• 将来にわたって減価償却により費用配分されます</p>
              <p>• 当期の利益への影響は減価償却費のみとなります</p>
            </div>
          )}
        </div>
      </div>

      {treatment === 'capitalize' && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            減価償却の見込み
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                償却期間: 5年（定額法）
              </h4>
              <p className="text-lg font-bold text-gray-900">
                年間償却費: ¥{Math.round(projectCost / 5).toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                月次償却費
              </h4>
              <p className="text-lg font-bold text-gray-900">
                ¥{Math.round(projectCost / 60).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;