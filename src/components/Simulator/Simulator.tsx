import React, { useState, useEffect } from 'react';
import { DevelopmentPhase, AccountingTreatment, DecisionCriteria, Project, ValidationResult, DetailedJournalEntry, AccountingDecision, CostBreakdown } from '../../types';
import PhaseSelector from './PhaseSelector';
import DecisionGuide from './DecisionGuide';
import EnhancedDecisionGuide from './EnhancedDecisionGuide';
import ResultDisplay from './ResultDisplay';
import ProjectForm from '../ProjectForm/ProjectForm';
import CostBreakdownComponent from '../ProjectForm/CostBreakdown';
import DetailedJournalEntryComponent from '../JournalEntry/DetailedJournalEntry';
import { generateJournalEntries, calculateConfidenceScore } from '../../utils/accounting';
import apiClient from '../../utils/api';

const Simulator: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<DevelopmentPhase>('development');
  const [treatment, setTreatment] = useState<AccountingTreatment | null>(null);
  const [criteria, setCriteria] = useState<DecisionCriteria>({
    futureEconomicBenefit: false,
    technicalFeasibility: false,
    completionIntention: false,
    adequateResources: false
  });

  const defaultProject: Partial<Project> = {
    id: 'demo-project',
    name: 'ECサイトリニューアルシステム',
    description: '既存ECサイトの全面リニューアル。レスポンシブ対応、決済機能強化、管理画面刷新を実施。',
    cost: 10000000,
    duration: 6,
    teamSize: 8,
    industry: 'IT・ソフトウェア',
    complexity: 'medium',
    riskLevel: 'low',
    costBreakdown: {
      personnel: 6000000,
      external: 3000000,
      infrastructure: 500000,
      licenses: 300000,
      other: 200000
    }
  };

  const [project, setProject] = useState<Partial<Project>>(defaultProject);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiClient.getProjects();
        if (response.success && response.data && response.data.length > 0) {
          setProject(response.data[0]); // Load the first project
        } else {
          setProject(defaultProject); // Use default if no projects found
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setProject(defaultProject); // Fallback to default on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const [projectValidation, setProjectValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });
  const [costValidation, setCostValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });
  const [detailedJournal, setDetailedJournal] = useState<DetailedJournalEntry | null>(null);
  const [activeTab, setActiveTab] = useState<'setup' | 'analysis'>('setup');

  const handlePhaseChange = (phase: DevelopmentPhase) => {
    setSelectedPhase(phase);
    
    // フェーズが変わったら治療方法をリセット
    if (phase === 'requirements' || phase === 'maintenance') {
      setTreatment('expense');
    } else {
      setTreatment(null);
    }

    // プロジェクトフェーズを更新
    setProject(prev => ({ ...prev, phase }));
  };

  const handleTreatmentChange = (newTreatment: AccountingTreatment) => {
    setTreatment(newTreatment);
    generateDetailedJournal(newTreatment);
  };

  const generateDetailedJournal = (currentTreatment: AccountingTreatment) => {
    if (!project.cost || !project.name) return;

    const completeProject = project as Project;
    const decision: AccountingDecision = {
      phase: selectedPhase,
      treatment: currentTreatment,
      criteria,
      reasoning: 'User selection',
      confidence: calculateConfidenceScore(completeProject, criteria, currentTreatment)
    };

    const journal = generateJournalEntries(completeProject, currentTreatment, decision);
    setDetailedJournal(journal);
  };

  const handleProjectChange = (updatedProject: Partial<Project>) => {
    setProject(updatedProject);
    
    // 会計処理結果を再生成
    if (treatment) {
      setTimeout(() => generateDetailedJournal(treatment), 100);
    }
  };

  const handleCostBreakdownChange = (breakdown: CostBreakdown) => {
    setProject(prev => ({ ...prev, costBreakdown: breakdown }));
  };

  const canShowDecisionGuide = selectedPhase === 'development' && treatment === 'capitalize';
  const isFormValid = projectValidation.isValid && costValidation.isValid;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600 text-lg">プロジェクトデータを読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          システム開発費用 会計処理シミュレータ
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          プロジェクト情報を入力し、適切な会計処理方法を学習できます。
          詳細な仕訳生成と財務影響分析が可能です。
        </p>
      </div>

      {/* タブナビゲーション */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('setup')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'setup'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            プロジェクト設定
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            disabled={!isFormValid}
          >
            会計処理分析
          </button>
        </nav>
      </div>

      {activeTab === 'setup' && (
        <div className="space-y-8">
          {/* プロジェクト情報入力フォーム */}
          <ProjectForm
            project={project}
            onProjectChange={handleProjectChange}
            onValidationChange={setProjectValidation}
          />

          {/* 費用内訳 */}
          {project.cost && project.cost > 0 && (
            <CostBreakdownComponent
              totalCost={project.cost}
              costBreakdown={project.costBreakdown || { personnel: 0, external: 0, infrastructure: 0, licenses: 0, other: 0 }}
              onCostBreakdownChange={handleCostBreakdownChange}
              onValidationChange={setCostValidation}
            />
          )}

          {/* 次のステップへのガイド */}
          {isFormValid && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                ✅ プロジェクト情報の入力が完了しました
              </h3>
              <p className="text-sm text-green-700 mb-3">
                「会計処理分析」タブで開発フェーズの選択と詳細な会計処理を確認できます。
              </p>
              <button
                onClick={() => setActiveTab('analysis')}
                className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                会計処理分析に進む
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analysis' && isFormValid && (
        <div className="space-y-8">
          {/* プロジェクト概要 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-medium text-gray-900 mb-4">プロジェクト概要</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">プロジェクト名:</span>
                <span className="ml-2 font-medium text-gray-900">{project.name}</span>
              </div>
              <div>
                <span className="text-gray-600">総費用:</span>
                <span className="ml-2 font-medium text-gray-900">¥{project.cost?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">期間:</span>
                <span className="ml-2 font-medium text-gray-900">{project.duration}ヶ月</span>
              </div>
              <div>
                <span className="text-gray-600">チーム規模:</span>
                <span className="ml-2 font-medium text-gray-900">{project.teamSize}名</span>
              </div>
            </div>
          </div>

          {/* フェーズ選択 */}
          <PhaseSelector
            selectedPhase={selectedPhase}
            onPhaseChange={handlePhaseChange}
            treatment={treatment}
            onTreatmentChange={handleTreatmentChange}
          />

          {/* 判断基準ガイド */}
          {canShowDecisionGuide && (
            <EnhancedDecisionGuide
              criteria={criteria}
              onCriteriaChange={setCriteria}
              project={project as Project}
              treatment={treatment}
            />
          )}

          {/* 基本結果表示 */}
          {treatment && (
            <ResultDisplay
              phase={selectedPhase}
              treatment={treatment}
              projectCost={project.cost || 0}
            />
          )}

          {/* 詳細な仕訳と分析 */}
          {detailedJournal && (
            <DetailedJournalEntryComponent
              journalEntry={detailedJournal}
              projectName={project.name || ''}
            />
          )}
        </div>
      )}

      {/* 学習ポイント */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">
          📝 学習ポイント
        </h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• プロジェクト情報の詳細入力により、より実践的な会計判断を学習できます</li>
          <li>• 費用内訳により、会計処理への影響をより具体的に理解できます</li>
          <li>• 詳細な仕訳と減価償却スケジュールで実務レベルの知識が身につきます</li>
          <li>• 財務影響分析により、経営判断への影響を数値で確認できます</li>
        </ul>
      </div>
    </div>
  );
};

export default Simulator;