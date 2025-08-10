import React, { useState } from 'react';
import { Project, ProjectComplexity, RiskLevel, ValidationResult } from '../../types';
import { validateProject } from '../../utils/validation';

interface ProjectFormProps {
  project: Partial<Project>;
  onProjectChange: (project: Partial<Project>) => void;
  onValidationChange: (validation: ValidationResult) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  project,
  onProjectChange,
  onValidationChange
}) => {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [], warnings: [] });

  const handleInputChange = (field: keyof Project, value: any) => {
    const updatedProject = { ...project, [field]: value };
    onProjectChange(updatedProject);
    
    // バリデーション実行
    const validationResult = validateProject(updatedProject);
    setValidation(validationResult);
    onValidationChange(validationResult);
  };

  const complexityOptions = [
    { value: 'low', label: '低', description: '標準的な機能、既存技術の活用' },
    { value: 'medium', label: '中', description: '一部新規機能、技術的検討必要' },
    { value: 'high', label: '高', description: '革新的機能、技術的挑戦が多い' }
  ];

  const riskOptions = [
    { value: 'low', label: '低', description: '確立された技術、安定した要件' },
    { value: 'medium', label: '中', description: '一部不確実性、適度なリスク管理必要' },
    { value: 'high', label: '高', description: '高い不確実性、慎重なリスク管理必要' }
  ];

  const industryOptions = [
    'IT・ソフトウェア',
    '製造業',
    '金融・保険',
    '小売・EC',
    'ヘルスケア',
    '教育',
    '公共・自治体',
    'その他'
  ];

  const getFieldError = (field: string) => {
    return validation.errors.find(error => error.field === field);
  };

  const getFieldWarning = (field: string) => {
    return validation.warnings.find(warning => warning.field === field);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">プロジェクト詳細情報</h2>
      
      {/* 基本情報 */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            プロジェクト名 *
          </label>
          <input
            type="text"
            id="name"
            value={project.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
              getFieldError('name') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="例: ECサイトリニューアル"
          />
          {getFieldError('name') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('name')?.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            業界
          </label>
          <select
            id="industry"
            value={project.industry || ''}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">選択してください</option>
            {industryOptions.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 説明 */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          プロジェクト説明 *
        </label>
        <textarea
          id="description"
          rows={3}
          value={project.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
            getFieldError('description') ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="プロジェクトの目的や主要機能を記載してください"
        />
        {getFieldError('description') && (
          <p className="mt-1 text-sm text-red-600">{getFieldError('description')?.message}</p>
        )}
      </div>

      {/* プロジェクト規模 */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-2">
            プロジェクト費用 (円) *
          </label>
          <input
            type="number"
            id="cost"
            value={project.cost || ''}
            onChange={(e) => handleInputChange('cost', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
              getFieldError('cost') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="10000000"
            min="0"
          />
          {getFieldError('cost') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('cost')?.message}</p>
          )}
          {getFieldWarning('cost') && (
            <p className="mt-1 text-sm text-yellow-600">
              ⚠️ {getFieldWarning('cost')?.message}
              <br />
              <span className="text-xs">{getFieldWarning('cost')?.suggestion}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            期間 (ヶ月) *
          </label>
          <input
            type="number"
            id="duration"
            value={project.duration || ''}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
              getFieldError('duration') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="6"
            min="1"
          />
          {getFieldError('duration') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('duration')?.message}</p>
          )}
          {getFieldWarning('duration') && (
            <p className="mt-1 text-sm text-yellow-600">
              ⚠️ {getFieldWarning('duration')?.message}
              <br />
              <span className="text-xs">{getFieldWarning('duration')?.suggestion}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
            チーム規模 (名) *
          </label>
          <input
            type="number"
            id="teamSize"
            value={project.teamSize || ''}
            onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 ${
              getFieldError('teamSize') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="8"
            min="1"
          />
          {getFieldError('teamSize') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('teamSize')?.message}</p>
          )}
        </div>
      </div>

      {/* 複雑度とリスク */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            プロジェクト複雑度
          </label>
          <div className="space-y-2">
            {complexityOptions.map((option) => (
              <label key={option.value} className="flex items-start">
                <input
                  type="radio"
                  name="complexity"
                  value={option.value}
                  checked={project.complexity === option.value}
                  onChange={(e) => handleInputChange('complexity', e.target.value as ProjectComplexity)}
                  className="mt-1 h-4 w-4 text-primary-600"
                />
                <div className="ml-2">
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            リスクレベル
          </label>
          <div className="space-y-2">
            {riskOptions.map((option) => (
              <label key={option.value} className="flex items-start">
                <input
                  type="radio"
                  name="riskLevel"
                  value={option.value}
                  checked={project.riskLevel === option.value}
                  onChange={(e) => handleInputChange('riskLevel', e.target.value as RiskLevel)}
                  className="mt-1 h-4 w-4 text-primary-600"
                />
                <div className="ml-2">
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* バリデーション結果表示 */}
      {validation.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-red-800 mb-2">入力エラー</h3>
          <ul className="text-sm text-red-700 space-y-1">
            {validation.errors.map((error, index) => (
              <li key={index}>• {error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">注意事項</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {validation.warnings.map((warning, index) => (
              <li key={index}>• {warning.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectForm;