import type { CaseInput, Heir, HeirType } from '../../types/inheritance';
import { explainProspectiveBlock } from '../runtime/baseCalculator';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  code: string;
  severity: ValidationSeverity;
  message: string;
  heirType?: HeirType;
}

const UNIQUE_HEIRS = new Set<HeirType>([
  'husband',
  'father',
  'mother',
  'grandfather_paternal',
  'grandfather_maternal',
  'grandmother_paternal',
  'grandmother_maternal',
]);

function enabledAdvanced(caseInput: CaseInput) {
  const ctx = caseInput.deceased.caseContext;
  return Boolean(
    ctx?.pregnancyConfig?.enabled ||
    ctx?.khunsaConfig?.enabled ||
    ctx?.mafqudConfig?.enabled ||
    ctx?.munasakhatConfig?.enabled,
  );
}

function sumImpediments(heir: Heir) {
  return Object.values(heir.impediments || {}).reduce((sum, value) => sum + (value || 0), 0);
}

export function validateCaseInput(caseInput: CaseInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const heirs = caseInput.heirs || [];
  const deceasedGender = caseInput.deceased.gender;

  if (heirs.length === 0 && !enabledAdvanced(caseInput)) {
    issues.push({
      code: 'EMPTY_CASE',
      severity: 'error',
      message: 'En az bir mirasçı seçin veya ileri durumları etkinleştirin.',
    });
  }

  const seen = new Set<HeirType>();

  heirs.forEach((heir) => {
    if (!Number.isFinite(heir.count) || heir.count < 0) {
      issues.push({
        code: 'INVALID_COUNT',
        severity: 'error',
        message: `${heir.label} için sayı geçersiz.`,
        heirType: heir.type,
      });
    }

    if (seen.has(heir.type)) {
      issues.push({
        code: 'DUPLICATE_HEIR',
        severity: 'error',
        message: `${heir.label} birden fazla kez eklenmiş görünüyor.`,
        heirType: heir.type,
      });
    }
    seen.add(heir.type);

    if (UNIQUE_HEIRS.has(heir.type) && heir.count > 1) {
      issues.push({
        code: 'UNIQUE_HEIR_OVERFLOW',
        severity: 'error',
        message: `${heir.label} için en fazla 1 kişi girilebilir.`,
        heirType: heir.type,
      });
    }

    if (heir.type === 'wife' && heir.count > 4) {
      issues.push({
        code: 'WIFE_COUNT_OVERFLOW',
        severity: 'error',
        message: 'Eş (karı) sayısı 4’ten büyük olamaz.',
        heirType: heir.type,
      });
    }

    if (sumImpediments(heir) > heir.count) {
      issues.push({
        code: 'IMPEDIMENT_OVERFLOW',
        severity: 'error',
        message: `${heir.label} için girilen engel toplamı kişi sayısını aşıyor.`,
        heirType: heir.type,
      });
    }
  });

  if (deceasedGender === 'male' && heirs.some((heir) => heir.type === 'husband')) {
    issues.push({
      code: 'SPOUSE_GENDER_MISMATCH',
      severity: 'error',
      message: 'Erkek müteveffada “koca” seçilemez; burada “karı” kullanılmalıdır.',
      heirType: 'husband',
    });
  }

  if (deceasedGender === 'female' && heirs.some((heir) => heir.type === 'wife')) {
    issues.push({
      code: 'SPOUSE_GENDER_MISMATCH',
      severity: 'error',
      message: 'Kadın müteveffada “karı” seçilemez; burada “koca” kullanılmalıdır.',
      heirType: 'wife',
    });
  }

  heirs.forEach((heir) => {
    const others = heirs.filter((candidate) => candidate.type !== heir.type && candidate.count > 0);
    const blockInfo = explainProspectiveBlock(heir.type, others);
    if (blockInfo.blocked) {
      issues.push({
        code: 'LIKELY_BLOCKED',
        severity: 'warning',
        message: `${heir.label} mevcut kombinasyonda büyük ihtimalle hacbedilecektir: ${blockInfo.reason}`,
        heirType: heir.type,
      });
    }
  });

  const ctx = caseInput.deceased.caseContext;
  if (ctx?.pregnancyConfig?.enabled && heirs.some((heir) => heir.type === 'son' || heir.type === 'daughter')) {
    issues.push({
      code: 'PREGNANCY_DOUBLE_COUNT',
      severity: 'warning',
      message: 'Haml senaryosu açıksa ana listede çocuk eklenmiş olabilir; aynı kişi iki kez sayılmadığından emin olun.',
    });
  }

  if (ctx?.munasakhatConfig?.enabled && !ctx.munasakhatConfig.sourceHeirType) {
    issues.push({
      code: 'MUNASAKHAT_SOURCE_MISSING',
      severity: 'warning',
      message: 'Münâsehat açık ama ikinci ölen mirasçı seçilmemiş.',
    });
  }

  return issues;
}
