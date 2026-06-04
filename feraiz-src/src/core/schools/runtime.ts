import type {
  BlockageDetail,
  CalculationTraceStep,
  CaseInput,
  Fraction,
  HeirShare,
  HeirType,
  InheritanceResult,
  MadhhabDistributionRow,
  MadhhabKey,
  SchoolResultSnapshot,
} from '../../types/inheritance';
import { ALL_HEIRS, SHARES } from '../../types/inheritance';
import { runBaseCalculator } from '../runtime/baseCalculator';
import {
  addFractions,
  divideFractionByNumber,
  fractionToDecimal,
  isZero,
  lcmMultiple,
  multiplyFractionByNumber,
  simplifyFraction,
  subtractFractions,
  sumFractions,
} from '../../utils/fractionUtils';
import type { SchoolKey, SchoolPolicy, ZawilArhamMethod } from './common';
import { getSchoolPolicy } from './index';

export interface SchoolEngineOptions {
  baitAlMalOperational?: boolean;
  zawilArhamMethod?: ZawilArhamMethod;
  includeComparison?: boolean;
}

export interface ResolvedSchoolEngineOptions {
  school: SchoolKey;
  baitAlMalOperational: boolean;
  zawilArhamMethod: ZawilArhamMethod;
  includeComparison: boolean;
}

interface ZawilProfile {
  level: number;
  branch: number;
  agnaticWeight: number;
  tanzilWeight: number;
}

const ZAWIL_PROFILES: Partial<Record<HeirType, ZawilProfile>> = {
  daughter_son: { level: 1, branch: 1, agnaticWeight: 2, tanzilWeight: 2 },
  daughter_daughter: { level: 1, branch: 1, agnaticWeight: 1, tanzilWeight: 2 },
  daughter_son_son: { level: 2, branch: 1, agnaticWeight: 2, tanzilWeight: 2 },
  daughter_son_daughter: { level: 2, branch: 1, agnaticWeight: 1, tanzilWeight: 2 },
  daughter_daughter_son: { level: 2, branch: 2, agnaticWeight: 2, tanzilWeight: 1 },
  daughter_daughter_daughter: { level: 2, branch: 2, agnaticWeight: 1, tanzilWeight: 1 },
  grandfather_maternal: { level: 2, branch: 3, agnaticWeight: 1, tanzilWeight: 1 },
  sister_full_son: { level: 3, branch: 1, agnaticWeight: 2, tanzilWeight: 2 },
  sister_full_daughter: { level: 3, branch: 1, agnaticWeight: 1, tanzilWeight: 2 },
  sister_full_son_son: { level: 4, branch: 1, agnaticWeight: 2, tanzilWeight: 2 },
  sister_full_son_daughter: { level: 4, branch: 1, agnaticWeight: 1, tanzilWeight: 2 },
  sister_full_daughter_son: { level: 4, branch: 2, agnaticWeight: 2, tanzilWeight: 1 },
  sister_full_daughter_daughter: { level: 4, branch: 2, agnaticWeight: 1, tanzilWeight: 1 },
  sister_paternal_son: { level: 3, branch: 3, agnaticWeight: 2, tanzilWeight: 2 },
  sister_paternal_daughter: { level: 3, branch: 3, agnaticWeight: 1, tanzilWeight: 2 },
  sister_paternal_son_son: { level: 4, branch: 3, agnaticWeight: 2, tanzilWeight: 2 },
  sister_paternal_son_daughter: { level: 4, branch: 3, agnaticWeight: 1, tanzilWeight: 2 },
  sister_paternal_daughter_son: { level: 4, branch: 4, agnaticWeight: 2, tanzilWeight: 1 },
  sister_paternal_daughter_daughter: { level: 4, branch: 4, agnaticWeight: 1, tanzilWeight: 1 },
  brother_maternal_son: { level: 5, branch: 1, agnaticWeight: 2, tanzilWeight: 1 },
  brother_maternal_daughter: { level: 5, branch: 1, agnaticWeight: 1, tanzilWeight: 1 },
  brother_maternal_son_son: { level: 6, branch: 1, agnaticWeight: 2, tanzilWeight: 1 },
  brother_maternal_son_daughter: { level: 6, branch: 1, agnaticWeight: 1, tanzilWeight: 1 },
  brother_maternal_daughter_son: { level: 6, branch: 2, agnaticWeight: 2, tanzilWeight: 1 },
  brother_maternal_daughter_daughter: { level: 6, branch: 2, agnaticWeight: 1, tanzilWeight: 1 },
  nephew_full_daughter: { level: 5, branch: 3, agnaticWeight: 1, tanzilWeight: 2 },
  nephew_full_daughter_son: { level: 6, branch: 3, agnaticWeight: 2, tanzilWeight: 2 },
  nephew_full_daughter_daughter: { level: 6, branch: 3, agnaticWeight: 1, tanzilWeight: 2 },
  nephew_paternal_daughter: { level: 5, branch: 4, agnaticWeight: 1, tanzilWeight: 1 },
  nephew_paternal_daughter_son: { level: 6, branch: 4, agnaticWeight: 2, tanzilWeight: 1 },
  nephew_paternal_daughter_daughter: { level: 6, branch: 4, agnaticWeight: 1, tanzilWeight: 1 },
  uncle_maternal: { level: 7, branch: 1, agnaticWeight: 2, tanzilWeight: 1 },
  uncle_maternal_son: { level: 8, branch: 1, agnaticWeight: 2, tanzilWeight: 1 },
  uncle_maternal_daughter: { level: 8, branch: 1, agnaticWeight: 1, tanzilWeight: 1 },
  uncle_maternal_son_son: { level: 9, branch: 1, agnaticWeight: 2, tanzilWeight: 1 },
  uncle_maternal_son_daughter: { level: 9, branch: 1, agnaticWeight: 1, tanzilWeight: 1 },
  uncle_maternal_daughter_son: { level: 9, branch: 2, agnaticWeight: 2, tanzilWeight: 1 },
  uncle_maternal_daughter_daughter: { level: 9, branch: 2, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_paternal: { level: 7, branch: 2, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_paternal_son: { level: 8, branch: 2, agnaticWeight: 2, tanzilWeight: 1 },
  aunt_paternal_daughter: { level: 8, branch: 2, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_paternal_son_son: { level: 9, branch: 2, agnaticWeight: 2, tanzilWeight: 1 },
  aunt_paternal_son_daughter: { level: 9, branch: 2, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_paternal_daughter_son: { level: 9, branch: 3, agnaticWeight: 2, tanzilWeight: 1 },
  aunt_paternal_daughter_daughter: { level: 9, branch: 3, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_maternal: { level: 7, branch: 4, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_maternal_son: { level: 8, branch: 4, agnaticWeight: 2, tanzilWeight: 1 },
  aunt_maternal_daughter: { level: 8, branch: 4, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_maternal_son_son: { level: 9, branch: 4, agnaticWeight: 2, tanzilWeight: 1 },
  aunt_maternal_son_daughter: { level: 9, branch: 4, agnaticWeight: 1, tanzilWeight: 1 },
  aunt_maternal_daughter_son: { level: 9, branch: 5, agnaticWeight: 2, tanzilWeight: 1 },
  aunt_maternal_daughter_daughter: { level: 9, branch: 5, agnaticWeight: 1, tanzilWeight: 1 },
  cousin_paternal_full_daughter: { level: 8, branch: 5, agnaticWeight: 1, tanzilWeight: 1 },
  cousin_paternal_half_daughter: { level: 8, branch: 6, agnaticWeight: 1, tanzilWeight: 1 },
};

const ZAWIL_TYPES = new Set(
  Object.entries(ZAWIL_PROFILES)
    .filter(([, profile]) => Boolean(profile))
    .map(([type]) => type as HeirType),
);

const SPOUSE_TYPES = new Set<HeirType>(['husband', 'wife']);

const cloneFraction = (fraction: Fraction): Fraction => ({ numerator: fraction.numerator, denominator: fraction.denominator });

const cloneShare = (row: HeirShare): HeirShare => ({
  ...row,
  heir: { ...row.heir, impediments: row.heir.impediments ? { ...row.heir.impediments } : undefined },
  originalShare: cloneFraction(row.originalShare),
  adjustedShare: cloneFraction(row.adjustedShare),
  blockedBy: row.blockedBy ? [...row.blockedBy] : undefined,
  blockedByNames: row.blockedByNames ? [...row.blockedByNames] : undefined,
});

function cloneResult(result: InheritanceResult): InheritanceResult {
  return {
    ...result,
    heirs: result.heirs.map(cloneShare),
    calculationWarnings: [...result.calculationWarnings],
    calculationSteps: [...result.calculationSteps],
    excludedSummaries: result.excludedSummaries.map((row) => ({
      ...row,
      impediments: { ...row.impediments },
    })),
    blockageDetails: result.blockageDetails?.map((row) => ({ ...row, blockedBy: [...row.blockedBy] })),
    trace: result.trace?.map((row) => ({ ...row } as CalculationTraceStep)),
    advancedAdjustments: result.advancedAdjustments
      ? {
          ...result.advancedAdjustments,
          reservedShare: cloneFraction(result.advancedAdjustments.reservedShare),
          notes: [...result.advancedAdjustments.notes],
          guaranteedHeirs: result.advancedAdjustments.guaranteedHeirs.map((row) => ({
            ...row,
            guaranteedShare: cloneFraction(row.guaranteedShare),
            maxPossibleShare: cloneFraction(row.maxPossibleShare),
          })),
          scenarioSummaries: result.advancedAdjustments.scenarioSummaries.map((row) => ({
            ...row,
            reservedShare: cloneFraction(row.reservedShare),
            allocations: row.allocations.map((allocation) => ({
              ...allocation,
              groupShare: cloneFraction(allocation.groupShare),
              perPersonShare: cloneFraction(allocation.perPersonShare),
            })),
          })),
        }
      : undefined,
    munasakhatOutcome: result.munasakhatOutcome
      ? {
          ...result.munasakhatOutcome,
          heirs: result.munasakhatOutcome.heirs.map(cloneShare),
          calculationWarnings: [...result.munasakhatOutcome.calculationWarnings],
        }
      : undefined,
  };
}

function isZawilType(type: HeirType): boolean {
  return ZAWIL_TYPES.has(type);
}

function getRow(result: InheritanceResult, type: HeirType): HeirShare | undefined {
  return result.heirs.find((row) => row.heir.type === type);
}

function clearRow(row: HeirShare, note: string, blocked: boolean) {
  row.originalShare = SHARES.ZERO;
  row.adjustedShare = SHARES.ZERO;
  row.amount = 0;
  row.shareInBase = 0;
  row.adjustedShareInBase = 0;
  row.shareType = blocked ? 'blocked' : 'zawil_arham';
  row.blocked = blocked;
  row.note = note;
  row.blockedBy = blocked ? row.blockedBy || [] : undefined;
  row.blockedByNames = blocked ? row.blockedByNames || [] : undefined;
}

function setRowShare(row: HeirShare, share: Fraction, shareType: HeirShare['shareType'], note: string) {
  const clean = simplifyFraction(share);
  row.originalShare = clean;
  row.adjustedShare = clean;
  row.shareType = shareType;
  row.blocked = false;
  row.blockedBy = undefined;
  row.blockedByNames = undefined;
  row.note = note;
}

function resultTotalShare(result: InheritanceResult): Fraction {
  return sumFractions(result.heirs.filter((row) => !row.blocked).map((row) => row.adjustedShare));
}

function recomputeResultBases(result: InheritanceResult) {
  const originalFractions = result.heirs.filter((row) => !row.blocked && !isZero(row.originalShare)).map((row) => row.originalShare.denominator);
  const adjustedFractions = result.heirs.filter((row) => !row.blocked && !isZero(row.adjustedShare)).map((row) => row.adjustedShare.denominator);
  result.baseShare = originalFractions.length ? lcmMultiple(originalFractions) : 1;
  result.adjustedBase = adjustedFractions.length ? lcmMultiple(adjustedFractions) : result.baseShare;
  result.heirs.forEach((row) => {
    row.shareInBase = row.blocked || isZero(row.originalShare) ? 0 : row.originalShare.numerator * (result.baseShare / row.originalShare.denominator);
    row.adjustedShareInBase = row.blocked || isZero(row.adjustedShare) ? 0 : row.adjustedShare.numerator * (result.adjustedBase / row.adjustedShare.denominator);
    row.amount = result.totalEstate * fractionToDecimal(row.adjustedShare);
  });
  result.hasAvl = fractionToDecimal(sumFractions(result.heirs.filter((row) => !row.blocked).map((row) => row.originalShare))) > 1;
  result.hasRadd = result.heirs.some((row) => row.shareType === 'radd');
}

function buildSchoolSnapshot(school: SchoolKey, result: InheritanceResult): SchoolResultSnapshot {
  return {
    school,
    specialCase: result.specialCase,
    hasAvl: result.hasAvl,
    hasRadd: result.hasRadd,
    baseShare: result.baseShare,
    adjustedBase: result.adjustedBase,
    calculationWarnings: [...result.calculationWarnings],
    calculationSteps: [...result.calculationSteps],
    heirs: result.heirs.map((row) => ({
      heirType: row.heir.type,
      label: row.heir.label,
      count: row.heir.count,
      share: cloneFraction(row.adjustedShare),
      blocked: row.blocked,
      note: row.note,
    })),
  };
}

function fractionToBaseText(fraction: Fraction, base: number): string {
  const safeBase = base > 0 ? base : 1;
  if (isZero(fraction)) return `0/${safeBase}`;
  return `${Math.round(fraction.numerator * (safeBase / fraction.denominator))}/${safeBase}`;
}

function buildDistributionRows(heirs: typeof ALL_HEIRS, schoolResults: Record<SchoolKey, InheritanceResult>): { madhhabBases: Record<MadhhabKey, number>; madhhabDistributionRows: MadhhabDistributionRow[] } {
  const madhhabBases: Record<MadhhabKey, number> = {
    default: schoolResults.hanafi.adjustedBase || schoolResults.hanafi.baseShare || 1,
    hanafi: schoolResults.hanafi.adjustedBase || schoolResults.hanafi.baseShare || 1,
    maliki: schoolResults.maliki.adjustedBase || schoolResults.maliki.baseShare || 1,
    shafii: schoolResults.shafii.adjustedBase || schoolResults.shafii.baseShare || 1,
    hanbali: schoolResults.hanbali.adjustedBase || schoolResults.hanbali.baseShare || 1,
  };

  const pick = (school: SchoolKey, heirType: HeirType) => schoolResults[school].heirs.find((row) => row.heir.type === heirType);

  const rows = heirs.map((heir) => {
    const hanafiRow = pick('hanafi', heir.type);
    const malikiRow = pick('maliki', heir.type);
    const shafiiRow = pick('shafii', heir.type);
    const hanbaliRow = pick('hanbali', heir.type);
    const render = (school: SchoolKey, row?: HeirShare) => (row ? (row.blocked ? `${fractionToBaseText(row.adjustedShare, madhhabBases[school])} · hacb` : fractionToBaseText(row.adjustedShare, madhhabBases[school])) : `0/${madhhabBases[school]} · hacb`);

    const payState = {
      default: !!hanafiRow && !hanafiRow.blocked && !isZero(hanafiRow.adjustedShare),
      hanafi: !!hanafiRow && !hanafiRow.blocked && !isZero(hanafiRow.adjustedShare),
      maliki: !!malikiRow && !malikiRow.blocked && !isZero(malikiRow.adjustedShare),
      shafii: !!shafiiRow && !shafiiRow.blocked && !isZero(shafiiRow.adjustedShare),
      hanbali: !!hanbaliRow && !hanbaliRow.blocked && !isZero(hanbaliRow.adjustedShare),
    };

    return {
      heirType: heir.type,
      label: heir.label,
      labelArabic: heir.labelArabic,
      count: heir.count,
      defaultView: render('hanafi', hanafiRow),
      hanafi: render('hanafi', hanafiRow),
      maliki: render('maliki', malikiRow),
      shafii: render('shafii', shafiiRow),
      hanbali: render('hanbali', hanbaliRow),
      fractions: {
        default: cloneFraction(hanafiRow?.adjustedShare || SHARES.ZERO),
        hanafi: cloneFraction(hanafiRow?.adjustedShare || SHARES.ZERO),
        maliki: cloneFraction(malikiRow?.adjustedShare || SHARES.ZERO),
        shafii: cloneFraction(shafiiRow?.adjustedShare || SHARES.ZERO),
        hanbali: cloneFraction(hanbaliRow?.adjustedShare || SHARES.ZERO),
      },
      blockedStates: {
        default: hanafiRow?.blocked ?? true,
        hanafi: hanafiRow?.blocked ?? true,
        maliki: malikiRow?.blocked ?? true,
        shafii: shafiiRow?.blocked ?? true,
        hanbali: hanbaliRow?.blocked ?? true,
      },
      changedIn: {
        default: false,
        hanafi: false,
        maliki: render('maliki', malikiRow) !== render('hanafi', hanafiRow),
        shafii: render('shafii', shafiiRow) !== render('hanafi', hanafiRow),
        hanbali: render('hanbali', hanbaliRow) !== render('hanafi', hanafiRow),
      },
      payState,
      hasAnyPay: Object.values(payState).some(Boolean),
    } satisfies MadhhabDistributionRow;
  });

  return { madhhabBases, madhhabDistributionRows: rows };
}

export function resolveSchoolEngineOptions(school: SchoolKey, overrides?: Partial<SchoolEngineOptions>): ResolvedSchoolEngineOptions {
  const policy = getSchoolPolicy(school);
  const requestedMethod = overrides?.zawilArhamMethod ?? policy.zawilArhamMethod;
  const zawilArhamMethod = policy.supportedZawilArhamMethods.includes(requestedMethod)
    ? requestedMethod
    : policy.zawilArhamMethod;
  const requestedBaitAlMal = overrides?.baitAlMalOperational;
  const baitAlMalOperational = typeof requestedBaitAlMal === 'boolean' && policy.supportedBaitAlMalModes.includes(requestedBaitAlMal)
    ? requestedBaitAlMal
    : policy.baitAlMalOperationalByDefault;

  return {
    school,
    baitAlMalOperational,
    zawilArhamMethod,
    includeComparison: overrides?.includeComparison ?? true,
  };
}

function selectAhlAlQarabaCandidates(rows: HeirShare[]): HeirShare[] {
  const active = rows.filter((row) => row.heir.count > 0);
  if (!active.length) return [];
  const nearestLevel = Math.min(...active.map((row) => ZAWIL_PROFILES[row.heir.type]?.level ?? 99));
  const sameLevel = active.filter((row) => (ZAWIL_PROFILES[row.heir.type]?.level ?? 99) === nearestLevel);
  const bestBranch = Math.min(...sameLevel.map((row) => ZAWIL_PROFILES[row.heir.type]?.branch ?? 99));
  return sameLevel.filter((row) => (ZAWIL_PROFILES[row.heir.type]?.branch ?? 99) === bestBranch);
}

function selectTanzilCandidates(rows: HeirShare[]): HeirShare[] {
  const active = rows.filter((row) => row.heir.count > 0);
  if (!active.length) return [];
  const nearestLevel = Math.min(...active.map((row) => ZAWIL_PROFILES[row.heir.type]?.level ?? 99));
  const sameLevel = active.filter((row) => (ZAWIL_PROFILES[row.heir.type]?.level ?? 99) === nearestLevel);
  const bestWeight = Math.max(...sameLevel.map((row) => ZAWIL_PROFILES[row.heir.type]?.tanzilWeight ?? 0));
  return sameLevel.filter((row) => (ZAWIL_PROFILES[row.heir.type]?.tanzilWeight ?? 0) === bestWeight);
}

function applySupportedZawilArham(result: InheritanceResult, policy: SchoolPolicy, options: ResolvedSchoolEngineOptions) {
  const zawilRows = result.heirs.filter((row) => isZawilType(row.heir.type));
  if (!zawilRows.length) return;

  const nonSpousePrimary = result.heirs.filter((row) => !row.blocked && !isZero(row.adjustedShare) && !isZawilType(row.heir.type) && !SPOUSE_TYPES.has(row.heir.type));
  const spouseRows = result.heirs.filter((row) => !row.blocked && !isZero(row.adjustedShare) && SPOUSE_TYPES.has(row.heir.type));
  const currentZawilShare = sumFractions(zawilRows.filter((row) => !row.blocked).map((row) => row.adjustedShare));
  const remainder = subtractFractions(SHARES.FULL, resultTotalShare(result));
  const distributable = addFractions(currentZawilShare, remainder);

  if (!nonSpousePrimary.length && options.baitAlMalOperational) {
    zawilRows.forEach((row) => {
      clearRow(row, 'Bu mezhep ayarında zevi’l-erhâm yerine bakiye beytülmâle bırakıldı.', true);
      row.blockedBy = spouseRows.map((entry) => entry.heir.type);
      row.blockedByNames = spouseRows.map((entry) => entry.heir.label);
    });
    result.calculationWarnings.push('Seçilen mezhep ayarında zevi’l-erhâm bakiyesi beytülmâle bırakıldı.');
    result.calculationSteps.push(`${policy.displayName} çizgisinde beytülmâl faal kabul edildiği için zevi’l-erhâm satırları pasif bırakıldı.`);
    recomputeResultBases(result);
    return;
  }

  if (fractionToDecimal(distributable) <= 0) {
    return;
  }

  const candidates = options.zawilArhamMethod === 'tanzil'
    ? selectTanzilCandidates(zawilRows)
    : selectAhlAlQarabaCandidates(zawilRows);

  if (!candidates.length) return;

  zawilRows.forEach((row) => clearRow(row, 'Daha yakın zevi’l-erhâm kolu bulunduğu için bu satır alt sırada kaldı.', true));

  if (options.zawilArhamMethod === 'ahl_al_qaraba') {
    const totalUnits = candidates.reduce((sum, row) => sum + (ZAWIL_PROFILES[row.heir.type]?.agnaticWeight ?? 1) * row.heir.count, 0);
    candidates.forEach((row) => {
      const unitShare = divideFractionByNumber(distributable, totalUnits);
      const rowShare = multiplyFractionByNumber(unitShare, (ZAWIL_PROFILES[row.heir.type]?.agnaticWeight ?? 1) * row.heir.count);
      setRowShare(row, rowShare, 'zawil_arham', 'Zevi’l-erhâm, ahl al-qarâba yöntemine göre en yakın ve en kuvvetli koldan dağıtıldı.');
    });
  } else {
    const totalWeights = candidates.reduce((sum, row) => sum + (ZAWIL_PROFILES[row.heir.type]?.tanzilWeight ?? 1) * row.heir.count, 0);
    candidates.forEach((row) => {
      const unitShare = divideFractionByNumber(distributable, totalWeights);
      const rowShare = multiplyFractionByNumber(unitShare, (ZAWIL_PROFILES[row.heir.type]?.tanzilWeight ?? 1) * row.heir.count);
      setRowShare(row, rowShare, 'zawil_arham', 'Zevi’l-erhâm, tanzîl yöntemiyle bağlı oldukları kök mirasçı koluna göre dağıtıldı.');
    });
  }

  result.calculationSteps.push(`Zevi’l-erhâm dağıtımı ${options.zawilArhamMethod === 'tanzil' ? 'tanzîl' : 'ahl al-qarâba'} yöntemine göre yeniden dengelendi.`);
  recomputeResultBases(result);
}

function enrichSchoolNotes(result: InheritanceResult, policy: SchoolPolicy, options: ResolvedSchoolEngineOptions) {
  const activeSubView = options.baitAlMalOperational ? 'beytülmâl aktif' : 'beytülmâl pasif';
  const suffix = `Seçilen ana mezhep: ${policy.displayName}. Zevi’l-erhâm yöntemi: ${options.zawilArhamMethod === 'tanzil' ? 'Tanzîl' : 'Ahl al-qarâba'}. Alt görünüm: ${activeSubView}.`;
  if (!result.calculationSteps.includes(suffix)) {
    result.calculationSteps.unshift(suffix);
  }
  if (!result.calculationWarnings.includes('')) {
    result.schoolPolicy = {
      key: policy.key,
      label: policy.label,
      displayName: policy.displayName,
      notes: [...policy.notes],
      zawilArhamMethod: options.zawilArhamMethod,
      baitAlMalOperational: options.baitAlMalOperational,
      supportedZawilArhamMethods: [...policy.supportedZawilArhamMethods],
      supportedBaitAlMalModes: [...policy.supportedBaitAlMalModes],
    };
  }
}

function buildSimpleBlockageDetails(result: InheritanceResult): BlockageDetail[] {
  return result.heirs
    .filter((row) => row.blocked)
    .map((row) => ({
      heirType: row.heir.type,
      label: row.heir.label,
      kind: isZawilType(row.heir.type) ? 'dhawu_al_arham_deferred' : 'hajb_hirman',
      blockedBy: row.blockedBy || [],
      explanation: row.note || 'Daha güçlü mirasçılar bulunduğu için bu satır pay alamadı.',
    }));
}

export function runSingleSchoolCase(input: CaseInput, school: SchoolKey, overrides?: Partial<SchoolEngineOptions>): InheritanceResult {
  const resolved = resolveSchoolEngineOptions(school, overrides);
  const policy = getSchoolPolicy(school);
  const raw = runBaseCalculator(input.heirs, input.deceased, school);
  const result = cloneResult(raw);
  applySupportedZawilArham(result, policy, resolved);
  enrichSchoolNotes(result, policy, resolved);
  result.displaySchool = school;
  result.blockageDetails = buildSimpleBlockageDetails(result);
  return result;
}

export function runSchoolMatrix(input: CaseInput, overridesBySchool?: Partial<Record<SchoolKey, Partial<SchoolEngineOptions>>>) {
  const results = {
    hanafi: runSingleSchoolCase(input, 'hanafi', overridesBySchool?.hanafi),
    maliki: runSingleSchoolCase(input, 'maliki', overridesBySchool?.maliki),
    shafii: runSingleSchoolCase(input, 'shafii', overridesBySchool?.shafii),
    hanbali: runSingleSchoolCase(input, 'hanbali', overridesBySchool?.hanbali),
  } satisfies Record<SchoolKey, InheritanceResult>;

  const snapshots = {
    hanafi: buildSchoolSnapshot('hanafi', results.hanafi),
    maliki: buildSchoolSnapshot('maliki', results.maliki),
    shafii: buildSchoolSnapshot('shafii', results.shafii),
    hanbali: buildSchoolSnapshot('hanbali', results.hanbali),
  } satisfies Partial<Record<SchoolKey, SchoolResultSnapshot>>;

  const uniqueHeirs = input.heirs.length ? input.heirs : ALL_HEIRS.map((row) => ({ ...row, count: 0 }));
  const { madhhabBases, madhhabDistributionRows } = buildDistributionRows(uniqueHeirs, results);

  return {
    results,
    snapshots,
    madhhabBases,
    madhhabDistributionRows,
  };
}
