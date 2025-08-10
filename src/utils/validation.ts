import { Project, ValidationResult, ValidationError, ValidationWarning } from '../types';

export const validateProject = (project: Partial<Project>): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required field validations
  if (!project.name || project.name.trim().length === 0) {
    errors.push({
      field: 'name',
      message: 'プロジェクト名は必須です',
      code: 'REQUIRED_FIELD'
    });
  }

  if (!project.description || project.description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'プロジェクトの説明は必須です',
      code: 'REQUIRED_FIELD'
    });
  }

  if (!project.cost || project.cost <= 0) {
    errors.push({
      field: 'cost',
      message: 'プロジェクト費用は正の数値である必要があります',
      code: 'INVALID_VALUE'
    });
  }

  if (!project.duration || project.duration <= 0) {
    errors.push({
      field: 'duration',
      message: '期間は1ヶ月以上である必要があります',
      code: 'INVALID_VALUE'
    });
  }

  if (!project.teamSize || project.teamSize <= 0) {
    errors.push({
      field: 'teamSize',
      message: 'チーム規模は1名以上である必要があります',
      code: 'INVALID_VALUE'
    });
  }

  // Business logic validations
  if (project.cost && project.cost < 1000000) {
    warnings.push({
      field: 'cost',
      message: 'プロジェクト費用が低額です',
      suggestion: '100万円未満のプロジェクトでは資産計上の検討は通常不要です'
    });
  }

  if (project.cost && project.cost > 100000000) {
    warnings.push({
      field: 'cost',
      message: 'プロジェクト費用が高額です',
      suggestion: '1億円を超えるプロジェクトでは特に慎重な判断が必要です'
    });
  }

  if (project.duration && project.duration > 24) {
    warnings.push({
      field: 'duration',
      message: 'プロジェクト期間が長期です',
      suggestion: '2年を超えるプロジェクトでは段階的な資産計上を検討してください'
    });
  }

  // Cost breakdown validation
  if (project.costBreakdown) {
    const totalBreakdown = Object.values(project.costBreakdown).reduce((sum, cost) => sum + cost, 0);
    const tolerance = project.cost ? project.cost * 0.01 : 0; // 1% tolerance

    if (project.cost && Math.abs(totalBreakdown - project.cost) > tolerance) {
      errors.push({
        field: 'costBreakdown',
        message: '費用内訳の合計とプロジェクト総費用が一致しません',
        code: 'INCONSISTENT_DATA'
      });
    }

    // Personnel cost should be reasonable percentage
    if (project.cost && project.costBreakdown.personnel / project.cost > 0.8) {
      warnings.push({
        field: 'costBreakdown.personnel',
        message: '人件費の比率が高すぎます',
        suggestion: '人件費が80%を超える場合、外部委託の検討をお勧めします'
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const validateCostBreakdown = (
  breakdown: Partial<{ personnel: number; external: number; infrastructure: number; licenses: number; other: number }>,
  totalCost: number
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Check if all values are non-negative
  Object.entries(breakdown).forEach(([key, value]) => {
    if (value !== undefined && value < 0) {
      errors.push({
        field: key,
        message: '費用は負の値にできません',
        code: 'INVALID_VALUE'
      });
    }
  });

  // Check total consistency
  const total = Object.values(breakdown).reduce((sum, cost) => sum + (cost || 0), 0);
  const tolerance = totalCost * 0.01;

  if (Math.abs(total - totalCost) > tolerance) {
    errors.push({
      field: 'total',
      message: `費用内訳の合計(${total.toLocaleString()}円)とプロジェクト総費用(${totalCost.toLocaleString()}円)が一致しません`,
      code: 'INCONSISTENT_TOTAL'
    });
  }

  // Business logic warnings
  const personnelRatio = (breakdown.personnel || 0) / totalCost;
  const externalRatio = (breakdown.external || 0) / totalCost;
  
  if (personnelRatio > 0.7) {
    warnings.push({
      field: 'personnel',
      message: '人件費の比率が高すぎます',
      suggestion: '人件費が70%を超える場合、プロジェクト効率化を検討してください'
    });
  }

  if (externalRatio > 0.6) {
    warnings.push({
      field: 'external',
      message: '外部委託費の比率が高すぎます',
      suggestion: '外部委託費が60%を超える場合、内製化の検討をお勧めします'
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};