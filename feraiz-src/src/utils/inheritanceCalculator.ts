import {
  AdvancedCaseContext,
  ALL_HEIRS,
  BlockageDetail,
  CalculationTraceStep,
  DeceasedInfo,
  ExcludedHeirSummary,
  Fraction,
  Heir,
  HeirShare,
  HeirType,
  IMPEDIMENT_LABELS,
  InheritanceResult,
  MadhhabComparisonRow,
  MadhhabDistributionRow,
  MadhhabKey,
  SchoolResultSnapshot,
  SHARES,
  ShareType,
} from '../types/inheritance';
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
} from './fractionUtils';
import { ENGINE_SCOPE, REFERENCE_MATRIX } from './faraidReferenceMatrix';

const SPOUSE_TYPES: HeirType[] = ['husband', 'wife'];
const ZAWIL_ARHAM_TYPES = new Set<HeirType>([
  'grandfather_maternal',
  'daughter_son',
  'daughter_daughter',
  'daughter_son_son',
  'daughter_son_daughter',
  'daughter_daughter_son',
  'daughter_daughter_daughter',
  'sister_full_son',
  'sister_full_daughter',
  'sister_full_son_son',
  'sister_full_son_daughter',
  'sister_full_daughter_son',
  'sister_full_daughter_daughter',
  'sister_paternal_son',
  'sister_paternal_daughter',
  'sister_paternal_son_son',
  'sister_paternal_son_daughter',
  'sister_paternal_daughter_son',
  'sister_paternal_daughter_daughter',
  'brother_maternal_son',
  'brother_maternal_daughter',
  'brother_maternal_son_son',
  'brother_maternal_son_daughter',
  'brother_maternal_daughter_son',
  'brother_maternal_daughter_daughter',
  'nephew_full_daughter',
  'nephew_full_daughter_son',
  'nephew_full_daughter_daughter',
  'nephew_paternal_daughter',
  'nephew_paternal_daughter_son',
  'nephew_paternal_daughter_daughter',
  'uncle_maternal',
  'uncle_maternal_son',
  'uncle_maternal_daughter',
  'uncle_maternal_son_son',
  'uncle_maternal_son_daughter',
  'uncle_maternal_daughter_son',
  'uncle_maternal_daughter_daughter',
  'aunt_paternal',
  'aunt_paternal_son',
  'aunt_paternal_daughter',
  'aunt_paternal_son_son',
  'aunt_paternal_son_daughter',
  'aunt_paternal_daughter_son',
  'aunt_paternal_daughter_daughter',
  'aunt_maternal',
  'aunt_maternal_son',
  'aunt_maternal_daughter',
  'aunt_maternal_son_son',
  'aunt_maternal_son_daughter',
  'aunt_maternal_daughter_son',
  'aunt_maternal_daughter_daughter',
  'cousin_paternal_full_daughter',
  'cousin_paternal_half_daughter',
]);

const ZAWIL_ARHAM_ORDER: Partial<Record<HeirType, number>> = {
  daughter_son: 1,
  daughter_daughter: 1,
  daughter_son_son: 2,
  daughter_son_daughter: 2,
  daughter_daughter_son: 2,
  daughter_daughter_daughter: 2,
  grandfather_maternal: 2,
  sister_full_son: 3,
  sister_full_daughter: 3,
  sister_full_son_son: 4,
  sister_full_son_daughter: 4,
  sister_full_daughter_son: 4,
  sister_full_daughter_daughter: 4,
  sister_paternal_son: 3,
  sister_paternal_daughter: 3,
  sister_paternal_son_son: 4,
  sister_paternal_son_daughter: 4,
  sister_paternal_daughter_son: 4,
  sister_paternal_daughter_daughter: 4,
  brother_maternal_son: 5,
  brother_maternal_daughter: 5,
  brother_maternal_son_son: 6,
  brother_maternal_son_daughter: 6,
  brother_maternal_daughter_son: 6,
  brother_maternal_daughter_daughter: 6,
  nephew_full_daughter: 6,
  nephew_full_daughter_son: 7,
  nephew_full_daughter_daughter: 7,
  nephew_paternal_daughter: 6,
  nephew_paternal_daughter_son: 7,
  nephew_paternal_daughter_daughter: 7,
  uncle_maternal: 7,
  uncle_maternal_son: 8,
  uncle_maternal_daughter: 8,
  uncle_maternal_son_son: 9,
  uncle_maternal_son_daughter: 9,
  uncle_maternal_daughter_son: 9,
  uncle_maternal_daughter_daughter: 9,
  aunt_paternal: 7,
  aunt_paternal_son: 8,
  aunt_paternal_daughter: 8,
  aunt_paternal_son_son: 9,
  aunt_paternal_son_daughter: 9,
  aunt_paternal_daughter_son: 9,
  aunt_paternal_daughter_daughter: 9,
  aunt_maternal: 7,
  aunt_maternal_son: 8,
  aunt_maternal_daughter: 8,
  aunt_maternal_son_son: 9,
  aunt_maternal_son_daughter: 9,
  aunt_maternal_daughter_son: 9,
  aunt_maternal_daughter_daughter: 9,
  cousin_paternal_full_daughter: 8,
  cousin_paternal_half_daughter: 8,
};

function getHeirName(type: HeirType): string {
  return ALL_HEIRS.find((heir) => heir.type === type)?.label || type;
}

function cloneFraction(fraction: Fraction): Fraction {
  return { numerator: fraction.numerator, denominator: fraction.denominator };
}

function divideFractions(a: Fraction, b: Fraction): Fraction {
  if (b.numerator === 0) return SHARES.ZERO;
  return simplifyFraction({
    numerator: a.numerator * b.denominator,
    denominator: a.denominator * b.numerator,
  });
}

function multiplyFractions(a: Fraction, b: Fraction): Fraction {
  return simplifyFraction({
    numerator: a.numerator * b.numerator,
    denominator: a.denominator * b.denominator,
  });
}

function maxFraction(...fractions: Fraction[]): Fraction {
  return fractions.reduce((current, candidate) =>
    fractionToDecimal(candidate) > fractionToDecimal(current) ? candidate : current,
  );
}

function isPositiveFraction(fraction: Fraction): boolean {
  return fractionToDecimal(fraction) > 1e-12;
}

function isSpouse(type: HeirType): boolean {
  return SPOUSE_TYPES.includes(type);
}

function isZawilArham(type: HeirType): boolean {
  return ZAWIL_ARHAM_TYPES.has(type);
}

function hasHeir(heirs: Heir[], type: HeirType): boolean {
  return heirs.some((heir) => heir.type === type && heir.count > 0);
}

function getHeirCount(heirs: Heir[], type: HeirType): number {
  return heirs.find((heir) => heir.type === type)?.count || 0;
}

function hasFar(heirs: Heir[]): boolean {
  return ['son', 'daughter', 'grandson', 'granddaughter'].some((type) => hasHeir(heirs, type as HeirType));
}

function hasMaleFar(heirs: Heir[]): boolean {
  return hasHeir(heirs, 'son') || hasHeir(heirs, 'grandson');
}

function hasFemaleFar(heirs: Heir[]): boolean {
  return hasHeir(heirs, 'daughter') || hasHeir(heirs, 'granddaughter');
}

function hasMultipleSiblings(heirs: Heir[]): boolean {
  const total =
    getHeirCount(heirs, 'brother_full') +
    getHeirCount(heirs, 'sister_full') +
    getHeirCount(heirs, 'brother_paternal') +
    getHeirCount(heirs, 'sister_paternal') +
    getHeirCount(heirs, 'brother_maternal') +
    getHeirCount(heirs, 'sister_maternal');

  return total >= 2;
}

function getExcludedCount(heir: Heir): number {
  return Object.values(heir.impediments || {}).reduce((sum, value) => sum + (value || 0), 0);
}

function clampImpediments(heir: Heir): Heir {
  const totalCount = heir.count;
  const next = { ...(heir.impediments || {}) };
  let used = 0;

  (Object.keys(IMPEDIMENT_LABELS) as Array<keyof typeof IMPEDIMENT_LABELS>).forEach((key) => {
    const raw = Math.max(0, Math.min(totalCount, next[key] || 0));
    const allowed = Math.max(0, totalCount - used);
    const clamped = Math.min(raw, allowed);
    if (clamped > 0) {
      next[key] = clamped;
      used += clamped;
    } else {
      delete next[key];
    }
  });

  return { ...heir, impediments: next };
}

function normalizeHeirs(heirs: Heir[]): {
  effectiveHeirs: Heir[];
  excludedSummaries: ExcludedHeirSummary[];
  warnings: string[];
} {
  const effectiveHeirs: Heir[] = [];
  const excludedSummaries: ExcludedHeirSummary[] = [];
  const warnings: string[] = [];

  for (const heir of heirs) {
    if (heir.count <= 0) continue;

    const normalizedHeir = clampImpediments(heir);
    const excludedCount = getExcludedCount(normalizedHeir);
    const effectiveCount = Math.max(0, normalizedHeir.count - excludedCount);

    if (excludedCount > 0) {
      const summary: ExcludedHeirSummary = {
        heirType: normalizedHeir.type,
        label: normalizedHeir.label,
        originalCount: normalizedHeir.count,
        excludedCount,
        effectiveCount,
        impediments: normalizedHeir.impediments || {},
      };
      excludedSummaries.push(summary);

      const reasons = Object.entries(summary.impediments)
        .filter(([, value]) => (value || 0) > 0)
        .map(([key, value]) => `${IMPEDIMENT_LABELS[key as keyof typeof IMPEDIMENT_LABELS]}: ${value}`)
        .join(', ');

      warnings.push(`${summary.label} için ${excludedCount} kişi miras engeli nedeniyle dağıtım dışında bırakıldı (${reasons}).`);
    }

    if (effectiveCount > 0) {
      effectiveHeirs.push({ ...normalizedHeir, count: effectiveCount });
    }
  }

  return { effectiveHeirs, excludedSummaries, warnings };
}

function buildEmptyShare(
  heir: Heir,
  share: Fraction,
  shareType: ShareType,
  blocked = false,
  note?: string,
): HeirShare {
  return {
    heir,
    originalShare: cloneFraction(share),
    adjustedShare: cloneFraction(share),
    shareType,
    blocked,
    blockedBy: blocked ? [] : undefined,
    blockedByNames: blocked ? [] : undefined,
    amount: 0,
    note,
  };
}

function markBlocked(target: HeirShare, blockedBy: HeirType[], note?: string) {
  target.originalShare = SHARES.ZERO;
  target.adjustedShare = SHARES.ZERO;
  target.shareType = 'blocked';
  target.blocked = true;
  target.blockedBy = blockedBy;
  target.blockedByNames = blockedBy.map(getHeirName);
  target.note = note || `${target.blockedByNames.join(', ')} tarafından hacb edildi.`;
}

function setShare(
  target: HeirShare | undefined,
  share: Fraction,
  shareType: ShareType,
  note?: string,
  asabaType?: 'binefsihi' | 'bigayrihi' | 'maagayrihi',
) {
  if (!target) return;
  target.originalShare = simplifyFraction(share);
  target.adjustedShare = simplifyFraction(share);
  target.shareType = shareType;
  target.blocked = false;
  target.blockedBy = undefined;
  target.blockedByNames = undefined;
  target.note = note;
  target.asabaType = asabaType;
}

function getBlockedInfo(heir: Heir, heirs: Heir[]): { blocked: boolean; blockedBy: HeirType[]; reason?: string } {
  const blockedBy: HeirType[] = [];
  let reason = '';

  switch (heir.type) {
    case 'grandfather_paternal':
      if (hasHeir(heirs, 'father')) {
        blockedBy.push('father');
        reason = 'Baba varken baba tarafından dede mirastan pay alamaz.';
      }
      break;

    case 'grandmother_paternal':
      if (hasHeir(heirs, 'mother')) {
        blockedBy.push('mother');
        reason = 'Anne varken baba tarafından nine mirastan pay alamaz.';
      }
      if (hasHeir(heirs, 'father')) {
        blockedBy.push('father');
        reason = 'Baba varken baba tarafından nine mirastan pay alamaz.';
      }
      break;

    case 'grandmother_maternal':
      if (hasHeir(heirs, 'mother')) {
        blockedBy.push('mother');
        reason = 'Anne varken anne tarafından nine mirastan pay alamaz.';
      }
      break;

    case 'grandson':
    case 'granddaughter':
      if (hasHeir(heirs, 'son')) {
        blockedBy.push('son');
        reason = 'Oğul varken oğlun çocukları hacb edilir.';
      }
      break;

    case 'brother_full':
    case 'sister_full':
      if (hasHeir(heirs, 'son')) blockedBy.push('son');
      if (hasHeir(heirs, 'grandson')) blockedBy.push('grandson');
      if (hasHeir(heirs, 'father')) blockedBy.push('father');
      if (blockedBy.length > 0) {
        reason = 'Füru veya baba varken öz kardeşler mirastan pay alamaz.';
      }
      break;

    case 'brother_paternal':
      if (hasHeir(heirs, 'son')) blockedBy.push('son');
      if (hasHeir(heirs, 'grandson')) blockedBy.push('grandson');
      if (hasHeir(heirs, 'father')) blockedBy.push('father');
      if (hasHeir(heirs, 'brother_full')) blockedBy.push('brother_full');
      if (blockedBy.length > 0) {
        reason = 'Daha yakın füru, baba veya öz erkek kardeş varken baba bir erkek kardeş pay alamaz.';
      }
      break;

    case 'sister_paternal':
      if (hasHeir(heirs, 'son')) blockedBy.push('son');
      if (hasHeir(heirs, 'grandson')) blockedBy.push('grandson');
      if (hasHeir(heirs, 'father')) blockedBy.push('father');
      if (hasHeir(heirs, 'brother_full')) blockedBy.push('brother_full');
      if (getHeirCount(heirs, 'sister_full') >= 2) blockedBy.push('sister_full');
      if (blockedBy.length > 0) {
        reason = 'Daha yakın füru, baba, öz erkek kardeş veya iki öz kız kardeş varken baba bir kız kardeş pay alamaz.';
      }
      break;

    case 'brother_maternal':
    case 'sister_maternal':
      if (hasHeir(heirs, 'son')) blockedBy.push('son');
      if (hasHeir(heirs, 'daughter')) blockedBy.push('daughter');
      if (hasHeir(heirs, 'grandson')) blockedBy.push('grandson');
      if (hasHeir(heirs, 'granddaughter')) blockedBy.push('granddaughter');
      if (hasHeir(heirs, 'father')) blockedBy.push('father');
      if (hasHeir(heirs, 'grandfather_paternal')) blockedBy.push('grandfather_paternal');
      if (blockedBy.length > 0) {
        reason = 'Füru veya erkek usul bulunduğunda anne bir kardeşler mirastan pay alamaz.';
      }
      break;

    case 'nephew_full':
      ['son', 'grandson', 'father', 'grandfather_paternal', 'brother_full', 'brother_paternal'].forEach((type) => {
        if (hasHeir(heirs, type as HeirType)) blockedBy.push(type as HeirType);
      });
      if (blockedBy.length > 0) {
        reason = 'Daha yakın asabe varken öz erkek kardeşin oğlu pay alamaz.';
      }
      break;

    case 'nephew_paternal':
      ['son', 'grandson', 'father', 'grandfather_paternal', 'brother_full', 'brother_paternal', 'nephew_full'].forEach((type) => {
        if (hasHeir(heirs, type as HeirType)) blockedBy.push(type as HeirType);
      });
      if (blockedBy.length > 0) {
        reason = 'Daha yakın asabe varken baba bir erkek kardeşin oğlu pay alamaz.';
      }
      break;

    case 'uncle_paternal_full':
      ['son', 'grandson', 'father', 'grandfather_paternal', 'brother_full', 'brother_paternal', 'nephew_full', 'nephew_paternal'].forEach((type) => {
        if (hasHeir(heirs, type as HeirType)) blockedBy.push(type as HeirType);
      });
      if (blockedBy.length > 0) {
        reason = 'Daha yakın asabe varken öz amca pay alamaz.';
      }
      break;

    case 'uncle_paternal_half':
      ['son', 'grandson', 'father', 'grandfather_paternal', 'brother_full', 'brother_paternal', 'nephew_full', 'nephew_paternal', 'uncle_paternal_full'].forEach((type) => {
        if (hasHeir(heirs, type as HeirType)) blockedBy.push(type as HeirType);
      });
      if (blockedBy.length > 0) {
        reason = 'Daha yakın asabe veya öz amca varken baba bir amca pay alamaz.';
      }
      break;

    case 'cousin_paternal_full':
      [
        'son',
        'grandson',
        'father',
        'grandfather_paternal',
        'brother_full',
        'brother_paternal',
        'nephew_full',
        'nephew_paternal',
        'uncle_paternal_full',
        'uncle_paternal_half',
      ].forEach((type) => {
        if (hasHeir(heirs, type as HeirType)) blockedBy.push(type as HeirType);
      });
      if (blockedBy.length > 0) {
        reason = 'Daha yakın asabe varken öz amca oğlu pay alamaz.';
      }
      break;

    case 'cousin_paternal_half':
      [
        'son',
        'grandson',
        'father',
        'grandfather_paternal',
        'brother_full',
        'brother_paternal',
        'nephew_full',
        'nephew_paternal',
        'uncle_paternal_full',
        'uncle_paternal_half',
        'cousin_paternal_full',
      ].forEach((type) => {
        if (hasHeir(heirs, type as HeirType)) blockedBy.push(type as HeirType);
      });
      if (blockedBy.length > 0) {
        reason = 'Daha yakın asabe varken baba bir amca oğlu pay alamaz.';
      }
      break;

    default:
      break;
  }

  return { blocked: blockedBy.length > 0, blockedBy, reason };
}

function calculateShareTemplate(
  heir: Heir,
  heirs: Heir[],
): { share: Fraction; shareType: ShareType; note?: string; asabaType?: 'binefsihi' | 'bigayrihi' | 'maagayrihi'; forcedBlockedBy?: HeirType[] } {
  if (isZawilArham(heir.type)) {
    return {
      share: SHARES.ZERO,
      shareType: 'zawil_arham',
      note: 'Zevi’l-erhâm yalnızca ashâb-ı furûz ve asabe tamamen tükendiğinde devreye girer.',
    };
  }

  switch (heir.type) {
    case 'husband':
      return hasFar(heirs)
        ? { share: SHARES.QUARTER, shareType: 'fard', note: 'Çocuk veya torun bulunduğu için koca 1/4 alır.' }
        : { share: SHARES.HALF, shareType: 'fard', note: 'Çocuk veya torun bulunmadığı için koca 1/2 alır.' };

    case 'wife':
      return hasFar(heirs)
        ? { share: SHARES.EIGHTH, shareType: 'fard', note: 'Çocuk veya torun bulunduğu için eşler toplam 1/8 alır.' }
        : { share: SHARES.QUARTER, shareType: 'fard', note: 'Çocuk veya torun bulunmadığı için eşler toplam 1/4 alır.' };

    case 'father':
      if (hasMaleFar(heirs)) {
        return { share: SHARES.ONE_SIXTH, shareType: 'fard', note: 'Erkek füru bulunduğu için baba 1/6 alır.' };
      }
      if (hasFemaleFar(heirs)) {
        return { share: SHARES.ONE_SIXTH, shareType: 'fard', note: 'Kız füru bulunduğu için baba 1/6 farz alır; kalan ayrıca babaya döner.' };
      }
      return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'binefsihi', note: 'Füru bulunmadığı için baba kalanı asabe olarak alır.' };

    case 'mother':
      if (hasFar(heirs) || hasMultipleSiblings(heirs)) {
        return { share: SHARES.ONE_SIXTH, shareType: 'fard', note: 'Füru veya iki ve daha fazla kardeş bulunduğu için anne 1/6 alır.' };
      }
      if ((hasHeir(heirs, 'husband') || hasHeir(heirs, 'wife')) && hasHeir(heirs, 'father') && !hasFar(heirs)) {
        return { share: SHARES.ONE_THIRD, shareType: 'fard', note: 'Ömeriyyeteyn halinde anne kalanın üçte birine dönüşür.' };
      }
      return { share: SHARES.ONE_THIRD, shareType: 'fard', note: 'Anne 1/3 alır.' };

    case 'grandfather_paternal':
      if (hasMaleFar(heirs)) {
        return { share: SHARES.ONE_SIXTH, shareType: 'fard', note: 'Erkek füru bulunduğu için dede 1/6 alır.' };
      }
      if (hasFemaleFar(heirs)) {
        return { share: SHARES.ONE_SIXTH, shareType: 'fard', note: 'Kız füru bulunduğu için dede 1/6 farz alır; kalan ayrıca dedeye döner.' };
      }
      return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'binefsihi', note: 'Füru bulunmadığında dede kalanı asabe olarak alır.' };

    case 'grandmother_paternal':
    case 'grandmother_maternal':
      return { share: SHARES.ZERO, shareType: 'fard', note: 'Aktif nineler müştereken 1/6 paylaşır.' };

    case 'son':
      return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'binefsihi', note: 'Oğul kalanı asabe bi-nefsihi olarak alır.' };

    case 'daughter': {
      if (getHeirCount(heirs, 'son') > 0) {
        return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'bigayrihi', note: 'Oğul ile birlikte kız asabe bi-gayrihi olur.' };
      }
      return getHeirCount(heirs, 'daughter') === 1
        ? { share: SHARES.HALF, shareType: 'fard', note: 'Tek kız 1/2 alır.' }
        : { share: SHARES.TWO_THIRDS, shareType: 'fard', note: 'İki veya daha fazla kız toplam 2/3 alır.' };
    }

    case 'grandson':
      return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'binefsihi', note: 'Oğlun oğlu kalanı asabe olarak alır.' };

    case 'granddaughter': {
      if (hasHeir(heirs, 'grandson')) {
        return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'bigayrihi', note: 'Oğlun oğlu ile birlikte asabe olur.' };
      }
      if (hasHeir(heirs, 'son')) {
        return { share: SHARES.ZERO, shareType: 'blocked', note: 'Oğul varken oğlun kızı hacb edilir.', forcedBlockedBy: ['son'] };
      }
      const daughterCount = getHeirCount(heirs, 'daughter');
      if (daughterCount === 1) {
        return { share: SHARES.ONE_SIXTH, shareType: 'fard', note: 'Tek kızla tamamlayıcı olarak 1/6 alır.' };
      }
      if (daughterCount >= 2) {
        return { share: SHARES.ZERO, shareType: 'blocked', note: 'İki veya daha fazla kız varken oğlun kızı hacb edilir.', forcedBlockedBy: ['daughter'] };
      }
      return getHeirCount(heirs, 'granddaughter') === 1
        ? { share: SHARES.HALF, shareType: 'fard', note: 'Tek oğlun kızı 1/2 alır.' }
        : { share: SHARES.TWO_THIRDS, shareType: 'fard', note: 'İki veya daha fazla oğlun kızı toplam 2/3 alır.' };
    }

    case 'brother_full':
      return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'binefsihi', note: 'Öz erkek kardeş kalanı asabe olarak alır.' };

    case 'sister_full':
      if (hasHeir(heirs, 'brother_full')) {
        return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'bigayrihi', note: 'Öz erkek kardeşle birlikte asabe olur.' };
      }
      if (hasHeir(heirs, 'daughter') || hasHeir(heirs, 'granddaughter')) {
        return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'maagayrihi', note: 'Kız füru ile birlikte asabe maa-gayrihi olur.' };
      }
      return getHeirCount(heirs, 'sister_full') === 1
        ? { share: SHARES.HALF, shareType: 'fard', note: 'Tek öz kız kardeş 1/2 alır.' }
        : { share: SHARES.TWO_THIRDS, shareType: 'fard', note: 'İki veya daha fazla öz kız kardeş toplam 2/3 alır.' };

    case 'brother_paternal':
      return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'binefsihi', note: 'Baba bir erkek kardeş kalanı asabe olarak alır.' };

    case 'sister_paternal':
      if (hasHeir(heirs, 'brother_paternal')) {
        return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'bigayrihi', note: 'Baba bir erkek kardeşle birlikte asabe olur.' };
      }
      if (hasHeir(heirs, 'daughter') || hasHeir(heirs, 'granddaughter')) {
        return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'maagayrihi', note: 'Kız füru ile birlikte asabe maa-gayrihi olur.' };
      }
      if (getHeirCount(heirs, 'sister_full') === 1) {
        return { share: SHARES.ONE_SIXTH, shareType: 'fard', note: 'Tek öz kız kardeş varsa tamamlayıcı 1/6 alır.' };
      }
      if (getHeirCount(heirs, 'sister_full') >= 2) {
        return { share: SHARES.ZERO, shareType: 'blocked', note: 'İki veya daha fazla öz kız kardeş varken baba bir kız kardeş hacb edilir.', forcedBlockedBy: ['sister_full'] };
      }
      return getHeirCount(heirs, 'sister_paternal') === 1
        ? { share: SHARES.HALF, shareType: 'fard', note: 'Tek baba bir kız kardeş 1/2 alır.' }
        : { share: SHARES.TWO_THIRDS, shareType: 'fard', note: 'İki veya daha fazla baba bir kız kardeş toplam 2/3 alır.' };

    case 'brother_maternal':
    case 'sister_maternal':
      return { share: SHARES.ZERO, shareType: 'fard', note: 'Anne bir kardeşler müşterek grup payı alır.' };

    case 'nephew_full':
    case 'nephew_paternal':
    case 'uncle_paternal_full':
    case 'uncle_paternal_half':
    case 'cousin_paternal_full':
    case 'cousin_paternal_half':
      return { share: SHARES.ZERO, shareType: 'asaba', asabaType: 'binefsihi', note: 'Yakın asabe bulunmazsa kalanı alır.' };

    default:
      return { share: SHARES.ZERO, shareType: 'blocked', note: 'Bu mirasçı tipi mevcut çekirdekte dağıtım dışı kaldı.' };
  }
}

function getAsabaOrder(type: HeirType): number {
  const order: Partial<Record<HeirType, number>> = {
    son: 1,
    daughter: 1,
    grandson: 2,
    granddaughter: 2,
    father: 3,
    grandfather_paternal: 4,
    brother_full: 5,
    sister_full: 5,
    brother_paternal: 6,
    sister_paternal: 6,
    nephew_full: 7,
    nephew_paternal: 8,
    uncle_paternal_full: 9,
    uncle_paternal_half: 10,
    cousin_paternal_full: 11,
    cousin_paternal_half: 12,
  };

  return order[type] || 99;
}

function getAsabaGroup(type: HeirType): HeirType[] {
  const groups: HeirType[][] = [
    ['son', 'daughter'],
    ['grandson', 'granddaughter'],
    ['brother_full', 'sister_full'],
    ['brother_paternal', 'sister_paternal'],
  ];

  return groups.find((group) => group.includes(type)) || [type];
}

function detectSpecialCase(heirs: Heir[]): string | undefined {
  if ((hasHeir(heirs, 'husband') || hasHeir(heirs, 'wife')) && hasHeir(heirs, 'mother') && hasHeir(heirs, 'father') && !hasFar(heirs)) {
    return 'Ömeriyyeteyn (Garraveyn)';
  }

  if (
    hasHeir(heirs, 'husband') &&
    hasHeir(heirs, 'mother') &&
    !hasFar(heirs) &&
    !hasHeir(heirs, 'father') &&
    !hasHeir(heirs, 'grandfather_paternal') &&
    (getHeirCount(heirs, 'brother_maternal') + getHeirCount(heirs, 'sister_maternal')) >= 2 &&
    (hasHeir(heirs, 'brother_full') || hasHeir(heirs, 'sister_full'))
  ) {
    return 'Müşerrike (Himariyye)';
  }

  const onlyAkdariyyaHeirs = heirs.every((heir) =>
    ['husband', 'mother', 'grandfather_paternal', 'sister_full'].includes(heir.type),
  );
  if (
    onlyAkdariyyaHeirs &&
    hasHeir(heirs, 'husband') &&
    hasHeir(heirs, 'mother') &&
    hasHeir(heirs, 'grandfather_paternal') &&
    getHeirCount(heirs, 'sister_full') === 1
  ) {
    return 'Akdariyye';
  }

  return undefined;
}

function buildComparisonRows(
  heirs: Heir[],
  specialCase: string | undefined,
  hasRadd: boolean,
  excludedSummaries: ExcludedHeirSummary[],
  caseContext?: AdvancedCaseContext,
): MadhhabComparisonRow[] {
  const hasGrandfatherSibling =
    hasHeir(heirs, 'grandfather_paternal') &&
    ['brother_full', 'sister_full', 'brother_paternal', 'sister_paternal'].some((type) => hasHeir(heirs, type as HeirType));
  const hasZawilArhamInput = heirs.some((heir) => isZawilArham(heir.type));
  const tentative =
    (caseContext?.pregnancyConfig?.enabled || (caseContext?.pregnancy || 'none') === 'possible') ||
    (caseContext?.khunsaConfig?.enabled || (caseContext?.khunsaCount || 0) > 0) ||
    (caseContext?.mafqudConfig?.enabled || (caseContext?.mafqudCount || 0) > 0) ||
    caseContext?.munasakhatConfig?.enabled ||
    caseContext?.munasakhatNote.trim();

  return [
    {
      issue: 'Müşerrike',
      defaultView: specialCase === 'Müşerrike (Himariyye)' ? 'Bu vakada eş ve anne payını aldıktan sonra kalan bölüm kardeşler arasında nasıl paylaşılacağı mezheplere göre değişir.' : 'Bu vakada Müşerrike denilen özel kardeş meselesi oluşmadı.',
      hanafi: 'Hanefî görüşte anne bir kardeşler kendi payını alır. Öz kardeşler bu bölüme ortak edilmez.',
      maliki: 'Mâlikî görüşte öz kardeşler de aynı kalan bölüme dahil edilir.',
      shafii: 'Şâfiî görüşte de öz kardeşler dışarıda bırakılmaz; kalan bölüm birlikte paylaşılır.',
      hanbali: 'Hanbelî görüşte de kardeşler aynı kalan bölüm içinde birlikte değerlendirilir.',
      relevant: specialCase === 'Müşerrike (Himariyye)',
    },
    {
      issue: 'Akdariyye',
      defaultView: specialCase === 'Akdariyye' ? 'Bu vakada koca, anne, dede ve öz kız kardeş birlikte bulunduğu için dedenin kardeşle ilişkisi mezheplere göre değişir.' : 'Bu vakada Akdariyye denilen özel dede-kız kardeş meselesi oluşmadı.',
      hanafi: 'Hanefî görüşte dede daha güçlü kabul edilir ve öz kız kardeş pay alamaz.',
      maliki: 'Mâlikî görüşte öz kız kardeş tamamen düşmez; özel hesapla pay alır.',
      shafii: 'Şâfiî görüşte de öz kız kardeş pay almaya devam eder; mesele özel bir hesapla çözülür.',
      hanbali: 'Hanbelî görüşte de öz kız kardeş tamamen düşmez; özel hesapla pay alır.',
      relevant: specialCase === 'Akdariyye',
    },
    {
      issue: 'Dede ve kardeşler',
      defaultView: hasGrandfatherSibling ? 'Bu vakada dede ile kardeşler birlikte bulunduğu için mezheplere göre sonuç değişebilir.' : 'Bu vakada dede ile kardeşlerin birlikte olduğu bir ihtilaf oluşmadı.',
      hanafi: 'Hanefî görüşte dede çoğu zaman baba gibi güçlü kabul edilir ve kardeşleri devre dışı bırakır.',
      maliki: 'Mâlikî görüşte dede her vakada baba gibi sayılmaz; kardeşlerle birlikte değerlendirilmesi mümkündür.',
      shafii: 'Şâfiî görüşte dede ile kardeşler birlikte hesaplanabilir; sonuç vakadaki mirasçılara göre değişir.',
      hanbali: 'Hanbelî görüşte de dede-kardeş meselesi tek kalıplı değildir; özel hesap gerekir.',
      relevant: hasGrandfatherSibling,
    },
    {
      issue: 'Zevi’l-erhâm',
      defaultView: hasZawilArhamInput ? 'Bu vakada daha uzak akrabalar seçildi. Bunlar ancak daha yakın mirasçılar kalmadığında devreye girer.' : 'Bu vakada zevi’l-erhâm türünden bir mirasçı seçilmedi.',
      hanafi: 'Hanefî görüşte daha yakın furûz ve asabe kalmadığında bu uzak akrabalar da pay alabilir.',
      maliki: 'Mâlikî görüşte bu başlıkta beytülmâl ve kamu hakkı tartışması daha belirgindir.',
      shafii: 'Şâfiî görüşte zevi’l-erhâm konusunda eski ve yeni görüşler arasında fark bulunabilir.',
      hanbali: 'Hanbelî görüşte de uygun durumda zevi’l-erhâma pay verilmesini kabul eden çizgi vardır.',
      relevant: hasZawilArhamInput,
    },
    {
      issue: 'Redd',
      defaultView: hasRadd ? 'Bu vakada belirli paylar dağıtıldıktan sonra kalan bölüm uygun mirasçılara geri döndü.' : 'Bu vakada artan payı geri döndürmeyi gerektiren bir redd durumu oluşmadı.',
      hanafi: 'Hanefî görüşte artan pay genelde eş dışındaki uygun mirasçılara döner.',
      maliki: 'Mâlikî görüşte de yaygın uygulama, eşlerin redd paylaşımına katılmamasıdır.',
      shafii: 'Şâfiî görüşte de artan kısım çoğunlukla eş dışındaki hak sahiplerine verilir.',
      hanbali: 'Hanbelî görüşte de redd yapılırken eşler genelde ayrıca artış almaz.',
      relevant: hasRadd,
    },
    {
      issue: 'Miras engelleri',
      defaultView: excludedSummaries.length > 0 ? 'Bu vakada bazı kişiler miras engeli sebebiyle hesap dışında bırakıldı.' : 'Bu vakada ayrıca kaydedilmiş bir miras engeli yok.',
      hanafi: 'Bir kişi mirasa engel taşıyorsa önce listeden çıkarılır, sonra dağıtım yapılır.',
      maliki: 'Miras engeli bulunan kişi hak sahibi sayılmaz; pay doğrudan diğer uygun mirasçılar arasında hesaplanır.',
      shafii: 'Engel sebebi sabitse kişi hiç pay almaz ve hesap kalan mirasçılarla sürdürülür.',
      hanbali: 'Önce mirasa ehliyet kontrol edilir; engeli olan kişi dağıtıma katılmaz.',
      relevant: excludedSummaries.length > 0,
    },
    {
      issue: 'Haml, hünsâ, mefkud ve münâsehat',
      defaultView: tentative ? 'Bu vakada doğmamış çocuk, cinsiyeti belirsiz kişi, kayıp kişi veya ardışık ölüm bulunduğu için sistem temkinli sonuç verir.' : 'Bu vakada ayrıca temkinli sonuç gerektiren ileri bir durum seçilmedi.',
      hanafi: 'Belirsizlik varsa kesin olan paylar verilir, kesinleşmeyen bölüm bekletilir.',
      maliki: 'Kesinleşmemiş durumlarda bütün paylar hemen dağıtılmaz; güvenli olan kısım verilir.',
      shafii: 'Doğmamış çocuk veya kayıp kişi varsa, sonuç kesinleşene kadar temkinli dağıtım yapılır.',
      hanbali: 'Belirsizlik bulunan vakalarda en güvenli dağıtım esas alınır ve rezerv tutulur.',
      relevant: Boolean(tentative),
    },
  ];
}

type SchoolDistributionEntry = {
  fraction: Fraction;
  blocked: boolean;
  note?: string;
};

type SchoolDistribution = {
  base: number;
  rows: Map<HeirType, SchoolDistributionEntry>;
};

const MADHHAB_KEYS: MadhhabKey[] = ['default', 'hanafi', 'maliki', 'shafii', 'hanbali'];

type CalcOptions = {
  skipMadhhab?: boolean;
  skipAdvanced?: boolean;
  school?: Exclude<MadhhabKey, 'default'>;
};

function cloneHeirsForRecalculation(heirs: Heir[]): Heir[] {
  return heirs.map((heir) => ({
    ...heir,
    impediments: heir.impediments ? { ...heir.impediments } : undefined,
  }));
}

function cloneSchoolDistribution(source: SchoolDistribution): SchoolDistribution {
  return {
    base: source.base,
    rows: new Map(
      Array.from(source.rows.entries()).map(([type, entry]) => [
        type,
        {
          fraction: cloneFraction(entry.fraction),
          blocked: entry.blocked,
          note: entry.note,
        },
      ]),
    ),
  };
}

function rebaseSchoolDistribution(distribution: SchoolDistribution): SchoolDistribution {
  const denominators = Array.from(distribution.rows.values())
    .filter((entry) => !isZero(entry.fraction))
    .map((entry) => entry.fraction.denominator);

  return {
    ...distribution,
    base: lcmMultiple(denominators) || 1,
  };
}

function buildDistributionFromResult(result: InheritanceResult): SchoolDistribution {
  return rebaseSchoolDistribution({
    base: result.adjustedBase || result.baseShare || 1,
    rows: new Map(
      result.heirs.map((row) => [
        row.heir.type,
        {
          fraction: cloneFraction(row.adjustedShare),
          blocked: row.blocked,
          note: row.note,
        },
      ]),
    ),
  });
}

function fractionToBaseText(fraction: Fraction, base: number): string {
  const safeBase = base > 0 ? base : 1;
  const normalizedNumerator = isZero(fraction)
    ? 0
    : Math.round(fraction.numerator * (safeBase / fraction.denominator));
  return `${normalizedNumerator}/${safeBase}`;
}

function buildDistributionCell(distribution: SchoolDistribution, heirType: HeirType): string {
  const entry = distribution.rows.get(heirType) || { fraction: SHARES.ZERO, blocked: true };
  const shareText = fractionToBaseText(entry.fraction, distribution.base);
  return entry.blocked ? `${shareText} · hacb` : shareText;
}


function buildSchoolSnapshot(school: Exclude<MadhhabKey, 'default'>, result: InheritanceResult): SchoolResultSnapshot {
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

function buildBlockageDetails(results: HeirShare[], excludedSummaries: ExcludedHeirSummary[]): BlockageDetail[] {
  const blockedRows = results
    .filter((row) => row.blocked)
    .map((row) => ({
      heirType: row.heir.type,
      label: row.heir.label,
      kind: isZawilArham(row.heir.type)
        ? 'dhawu_al_arham_deferred'
        : row.shareType === 'blocked'
        ? 'hajb_hirman'
        : 'residue_exhausted',
      blockedBy: row.blockedBy || [],
      explanation: row.note || 'Daha güçlü mirasçı bulunduğu için bu satıra pay düşmedi.',
    } as BlockageDetail));

  const impedimentRows = excludedSummaries.map((summary) => ({
    heirType: summary.heirType,
    label: summary.label,
    kind: 'impediment' as const,
    blockedBy: [],
    explanation: `${summary.excludedCount} kişi miras engeli sebebiyle etkin dağıtım dışında kaldı.`,
  }));

  return [...blockedRows, ...impedimentRows];
}

function buildTrace(
  heirs: Heir[],
  result: InheritanceResult,
  excludedSummaries: ExcludedHeirSummary[],
  specialCase: string | undefined,
  hasAdvanced: boolean,
  hasSecondary: boolean,
): CalculationTraceStep[] {
  const traces: CalculationTraceStep[] = [];
  traces.push({
    stage: 'input',
    title: 'Etkin mirasçılar belirlendi',
    detail: `${heirs.length} etkin mirasçı satırı hesaplamaya alındı.`,
  });
  if (excludedSummaries.length > 0) {
    traces.push({
      stage: 'impediments',
      title: 'Miras engelleri düşüldü',
      detail: `${excludedSummaries.length} satırda katl, din farkı, kölelik veya liân kaydı sebebiyle sayısal düşüm uygulandı.`,
    });
  }
  traces.push({
    stage: 'hajb',
    title: 'Hajb katmanı çalıştırıldı',
    detail: `${result.heirs.filter((row) => row.blocked).length} satır mahcûb olarak sınıflandırıldı.`,
  });
  traces.push({
    stage: 'furud',
    title: 'Farz paylar çıkarıldı',
    detail: 'Ashab al-furud satırları pay tablosuna yerleştirildi ve müşterek paylar toplulaştırıldı.',
  });
  traces.push({
    stage: 'asaba',
    title: 'Asabe hattı uygulandı',
    detail: 'Kalan pay varsa asabe öncelik sırasına göre dağıtıldı; gerekirse dede-kardeşler dalı devreye alındı.',
  });
  if (result.hasAvl || result.hasRadd) {
    traces.push({
      stage: 'adjustment',
      title: 'Avl / radd ayarı yapıldı',
      detail: result.hasAvl && result.hasRadd
        ? 'Bu dosyada hem avl hem redd tetiklenen adımlar izlendi.'
        : result.hasAvl
        ? 'Farz paylar terekeyi aştığı için avl uygulandı.'
        : 'Asabe kalmadığı için redd ile iade yapıldı.',
    });
  }
  if (specialCase) {
    traces.push({
      stage: 'special_case',
      title: 'Özel mesele tetiklendi',
      detail: `${specialCase} için okul bazlı çözüm dalı kullanıldı.`,
    });
  }
  if (hasAdvanced) {
    traces.push({
      stage: 'advanced',
      title: 'Belirsizlik senaryoları işlendi',
      detail: 'Haml, khunsa veya mafqud için senaryolar çalıştırıldı; güvenli pay ve bekletilen pay birlikte üretildi.',
    });
  }
  if (hasSecondary) {
    traces.push({
      stage: 'secondary',
      title: 'İkinci tereke üretildi',
      detail: 'Munasakhat zinciri için ilk mirastan gelen pay üzerinden ikinci dağıtım yapıldı.',
    });
  }
  traces.push({
    stage: 'output',
    title: 'Standart sonuç nesnesi üretildi',
    detail: 'Ana özet, pay tablosu ve mezhep kıyası aynı yapılandırılmış sonuç nesnesinden beslendi.',
  });
  return traces;
}

function buildSchoolBundle(
  heirs: Heir[],
  deceased: DeceasedInfo,
): {
  schoolResults: Partial<Record<Exclude<MadhhabKey, 'default'>, SchoolResultSnapshot>>;
  madhhabBases: Record<MadhhabKey, number>;
  madhhabDistributionRows: MadhhabDistributionRow[];
} {
  const rawResults = {
    hanafi: calculateInheritance(cloneHeirsForRecalculation(heirs), { ...deceased, caseContext: undefined }, { skipMadhhab: true, skipAdvanced: true, school: 'hanafi' }),
    maliki: calculateInheritance(cloneHeirsForRecalculation(heirs), { ...deceased, caseContext: undefined }, { skipMadhhab: true, skipAdvanced: true, school: 'maliki' }),
    shafii: calculateInheritance(cloneHeirsForRecalculation(heirs), { ...deceased, caseContext: undefined }, { skipMadhhab: true, skipAdvanced: true, school: 'shafii' }),
    hanbali: calculateInheritance(cloneHeirsForRecalculation(heirs), { ...deceased, caseContext: undefined }, { skipMadhhab: true, skipAdvanced: true, school: 'hanbali' }),
  };

  const schoolResults: Partial<Record<Exclude<MadhhabKey, 'default'>, SchoolResultSnapshot>> = {
    hanafi: buildSchoolSnapshot('hanafi', rawResults.hanafi),
    maliki: buildSchoolSnapshot('maliki', rawResults.maliki),
    shafii: buildSchoolSnapshot('shafii', rawResults.shafii),
    hanbali: buildSchoolSnapshot('hanbali', rawResults.hanbali),
  };

  const { madhhabBases, madhhabDistributionRows } = buildMadhhabDistributionRowsFromSchoolResults(heirs, rawResults);
  return { schoolResults, madhhabBases, madhhabDistributionRows };
}

function chooseDisplaySchool(preferred?: Exclude<MadhhabKey, 'default'>): Exclude<MadhhabKey, 'default'> {
  return preferred || 'hanafi';
}

function syncResultsWithSchoolDistribution(
  results: HeirShare[],
  distribution: SchoolDistribution,
  schoolLabel: string,
  steps: string[],
) {
  let changed = 0;

  results.forEach((result) => {
    const entry = distribution.rows.get(result.heir.type);
    if (!entry) return;

    const nextFraction = simplifyFraction(entry.fraction);
    const sameBlocked = result.blocked === entry.blocked;
    const sameFraction = result.adjustedShare.numerator === nextFraction.numerator && result.adjustedShare.denominator === nextFraction.denominator;
    if (sameBlocked && sameFraction) return;

    result.originalShare = cloneFraction(nextFraction);
    result.adjustedShare = cloneFraction(nextFraction);
    result.blocked = entry.blocked;
    result.shareType = entry.blocked ? 'blocked' : (isZero(nextFraction) ? result.shareType : result.shareType === 'blocked' ? 'fard' : result.shareType);
    if (entry.blocked) {
      result.blockedBy = result.blockedBy || [];
      result.blockedByNames = result.blockedByNames || [];
    } else {
      result.blockedBy = undefined;
      result.blockedByNames = undefined;
    }
    result.note = entry.note || `${schoolLabel} görünümüne göre güncellendi.`;
    changed += 1;
  });

  if (changed > 0) {
    steps.push(`Ana özet, ${schoolLabel} görünümündeki özel dağıtıma eşitlendi.`);
  }
}

function buildGrandfatherAsFatherHeirs(heirs: Heir[]): Heir[] {
  const fatherTemplate = ALL_HEIRS.find((heir) => heir.type === 'father');
  if (!fatherTemplate || hasHeir(heirs, 'father') || !hasHeir(heirs, 'grandfather_paternal')) {
    return cloneHeirsForRecalculation(heirs);
  }

  return heirs.map((heir) => {
    if (heir.type !== 'grandfather_paternal') {
      return {
        ...heir,
        impediments: heir.impediments ? { ...heir.impediments } : undefined,
      };
    }

    return {
      ...fatherTemplate,
      count: heir.count,
      impediments: heir.impediments ? { ...heir.impediments } : undefined,
    };
  });
}

function buildHanafiMusharrikaDistribution(heirs: Heir[], defaultDistribution: SchoolDistribution): SchoolDistribution {
  const distribution = cloneSchoolDistribution(defaultDistribution);
  const totalMaternalCount = getHeirCount(heirs, 'brother_maternal') + getHeirCount(heirs, 'sister_maternal');
  const maternalGroupShare = totalMaternalCount >= 2 ? SHARES.ONE_THIRD : SHARES.ONE_SIXTH;
  const maternalPerPerson = totalMaternalCount > 0 ? divideFractionByNumber(maternalGroupShare, totalMaternalCount) : SHARES.ZERO;

  distribution.rows.forEach((entry) => {
    entry.fraction = SHARES.ZERO;
    entry.blocked = true;
    entry.note = 'Müşerrike Hanefî görünümünde pay almadı.';
  });

  const husband = distribution.rows.get('husband');
  if (husband) {
    husband.fraction = SHARES.HALF;
    husband.blocked = false;
    husband.note = 'Koca 1/2 alır.';
  }

  const mother = distribution.rows.get('mother');
  if (mother) {
    mother.fraction = SHARES.ONE_SIXTH;
    mother.blocked = false;
    mother.note = 'Anne 1/6 alır.';
  }

  ['brother_maternal', 'sister_maternal'].forEach((type) => {
    const row = distribution.rows.get(type as HeirType);
    const count = getHeirCount(heirs, type as HeirType);
    if (row && count > 0) {
      row.fraction = multiplyFractionByNumber(maternalPerPerson, count);
      row.blocked = false;
      row.note = 'Anne bir kardeşler kendi normal paylarını alır.';
    }
  });

  ['brother_full', 'sister_full'].forEach((type) => {
    const row = distribution.rows.get(type as HeirType);
    if (row) {
      row.fraction = SHARES.ZERO;
      row.blocked = true;
      row.note = 'Hanefî çizgide öz kardeşler artık paya ortak edilmez.';
    }
  });

  return rebaseSchoolDistribution(distribution);
}


function buildHanafiAkdariyyaDistribution(defaultDistribution: SchoolDistribution): SchoolDistribution {
  const distribution = cloneSchoolDistribution(defaultDistribution);

  distribution.rows.forEach((entry) => {
    entry.fraction = SHARES.ZERO;
    entry.blocked = true;
    entry.note = 'Bu görünümde pay almadı.';
  });

  const husband = distribution.rows.get('husband');
  if (husband) {
    husband.fraction = SHARES.HALF;
    husband.blocked = false;
    husband.note = 'Hanefî görüşte koca 1/2 alır.';
  }

  const mother = distribution.rows.get('mother');
  if (mother) {
    mother.fraction = SHARES.ONE_THIRD;
    mother.blocked = false;
    mother.note = "Hanefî görüşte tek kız kardeş anneyi 1/6'ya düşürmez; anne 1/3 alır.";
  }

  const grandfather = distribution.rows.get('grandfather_paternal');
  if (grandfather) {
    grandfather.fraction = SHARES.ONE_SIXTH;
    grandfather.blocked = false;
    grandfather.note = "Hanefî görüşte dede, öz kız kardeşi hacb ettikten sonra kalan 1/6'yı alır.";
  }

  const fullSister = distribution.rows.get('sister_full');
  if (fullSister) {
    fullSister.fraction = SHARES.ZERO;
    fullSister.blocked = true;
    fullSister.note = 'Hanefî görüşte dede bulunduğu için öz kız kardeş pay alamaz.';
  }

  return rebaseSchoolDistribution(distribution);
}

function finalizeZeroShareRows(results: HeirShare[], steps: string[]) {
  const nonZeroRows = results.filter((result) => !result.blocked && !isZero(result.adjustedShare));
  if (nonZeroRows.length === 0) return;

  const activePrimaryRows = nonZeroRows.filter((result) => !isZawilArham(result.heir.type) && !isSpouse(result.heir.type));
  const activeAsabaRows = activePrimaryRows.filter((result) => result.shareType === 'asaba');

  let finalizedCount = 0;

  results
    .filter((result) => !result.blocked && isZero(result.adjustedShare))
    .forEach((result) => {
      let blockers: HeirType[] = [];
      let reason = result.note || '';

      if (isZawilArham(result.heir.type)) {
        const closerZawilArham = nonZeroRows.filter(
          (row) =>
            isZawilArham(row.heir.type) &&
            (ZAWIL_ARHAM_ORDER[row.heir.type] || 99) < (ZAWIL_ARHAM_ORDER[result.heir.type] || 99),
        );

        if (closerZawilArham.length > 0) {
          blockers = closerZawilArham.map((row) => row.heir.type);
          reason = 'Daha yakın derecedeki zevi’l-erhâm pay aldığı için bu sıra devreye alınmadı.';
        } else if (activePrimaryRows.length > 0) {
          blockers = activePrimaryRows.slice(0, 4).map((row) => row.heir.type);
          reason = 'Daha yakın ashâb-ı furûz veya asabe terekeyi tükettiği için zevi’l-erhâm sırası gelmedi.';
        } else {
          blockers = nonZeroRows.slice(0, 4).map((row) => row.heir.type);
          reason = 'Diğer mirasçılar bakiyeyi tükettiği için zevi’l-erhâm için ayrıca pay kalmadı.';
        }
      } else if (result.shareType === 'asaba') {
        if (activeAsabaRows.length > 0) {
          blockers = activeAsabaRows.slice(0, 4).map((row) => row.heir.type);
          reason = `${activeAsabaRows.slice(0, 4).map((row) => row.heir.label).join(', ')} bakiyeyi aldığı için bu mirasçıya pay kalmadı.`;
        } else {
          blockers = activePrimaryRows.slice(0, 4).map((row) => row.heir.type);
          reason = 'Farz sahiplerinin toplamı terekeyi tükettiği için asabe sırası doğmadı.';
        }
      } else {
        blockers = activePrimaryRows.slice(0, 4).map((row) => row.heir.type);
        reason = reason || 'Daha güçlü mirasçılar terekeyi tükettiği için bu satıra pay düşmedi.';
      }

      markBlocked(result, blockers, reason);
      finalizedCount += 1;
    });

  if (finalizedCount > 0) {
    steps.push(`${finalizedCount} sıfır paylı satır, hacb gerekçesiyle ayrı listede gösterilecek şekilde sınıflandırıldı.`);
  }
}

function buildMadhhabDistributionRowsFromSchoolResults(
  heirs: Heir[],
  schoolResults: Record<Exclude<MadhhabKey, 'default'>, InheritanceResult>,
): {
  madhhabBases: Record<MadhhabKey, number>;
  madhhabDistributionRows: MadhhabDistributionRow[];
} {
  const madhhabBases: Record<MadhhabKey, number> = {
    default: schoolResults.hanafi.adjustedBase || schoolResults.hanafi.baseShare || 1,
    hanafi: schoolResults.hanafi.adjustedBase || schoolResults.hanafi.baseShare || 1,
    maliki: schoolResults.maliki.adjustedBase || schoolResults.maliki.baseShare || 1,
    shafii: schoolResults.shafii.adjustedBase || schoolResults.shafii.baseShare || 1,
    hanbali: schoolResults.hanbali.adjustedBase || schoolResults.hanbali.baseShare || 1,
  };

  const pickRow = (result: InheritanceResult, heirType: HeirType) =>
    result.heirs.find((row) => row.heir.type === heirType) || ({ adjustedShare: SHARES.ZERO, blocked: true } as HeirShare);

  const renderFor = (result: InheritanceResult, heirType: HeirType) => {
    const row = pickRow(result, heirType);
    const base = result.adjustedBase || result.baseShare || 1;
    return row.blocked ? `${fractionToBaseText(row.adjustedShare || SHARES.ZERO, base)} · hacb` : fractionToBaseText(row.adjustedShare || SHARES.ZERO, base);
  };

  const madhhabDistributionRows = heirs.map((heir) => {
    const hanafiRow = pickRow(schoolResults.hanafi, heir.type);
    const malikiRow = pickRow(schoolResults.maliki, heir.type);
    const shafiiRow = pickRow(schoolResults.shafii, heir.type);
    const hanbaliRow = pickRow(schoolResults.hanbali, heir.type);

    const payState = {
      default: !hanafiRow.blocked && !isZero(hanafiRow.adjustedShare || SHARES.ZERO),
      hanafi: !hanafiRow.blocked && !isZero(hanafiRow.adjustedShare || SHARES.ZERO),
      maliki: !malikiRow.blocked && !isZero(malikiRow.adjustedShare || SHARES.ZERO),
      shafii: !shafiiRow.blocked && !isZero(shafiiRow.adjustedShare || SHARES.ZERO),
      hanbali: !hanbaliRow.blocked && !isZero(hanbaliRow.adjustedShare || SHARES.ZERO),
    };

    const defaultView = renderFor(schoolResults.hanafi, heir.type);
    const hanafi = renderFor(schoolResults.hanafi, heir.type);
    const maliki = renderFor(schoolResults.maliki, heir.type);
    const shafii = renderFor(schoolResults.shafii, heir.type);
    const hanbali = renderFor(schoolResults.hanbali, heir.type);

    return {
      heirType: heir.type,
      label: heir.label,
      labelArabic: heir.labelArabic,
      count: heir.count,
      defaultView,
      hanafi,
      maliki,
      shafii,
      hanbali,
      fractions: {
        default: cloneFraction(hanafiRow.adjustedShare || SHARES.ZERO),
        hanafi: cloneFraction(hanafiRow.adjustedShare || SHARES.ZERO),
        maliki: cloneFraction(malikiRow.adjustedShare || SHARES.ZERO),
        shafii: cloneFraction(shafiiRow.adjustedShare || SHARES.ZERO),
        hanbali: cloneFraction(hanbaliRow.adjustedShare || SHARES.ZERO),
      },
      blockedStates: {
        default: hanafiRow.blocked,
        hanafi: hanafiRow.blocked,
        maliki: malikiRow.blocked,
        shafii: shafiiRow.blocked,
        hanbali: hanbaliRow.blocked,
      },
      payState,
      hasAnyPay: Object.values(payState).some(Boolean),
      changedIn: {
        default: false,
        hanafi: false,
        maliki: maliki !== hanafi,
        shafii: shafii !== hanafi,
        hanbali: hanbali !== hanafi,
      },
    };
  });

  return { madhhabBases, madhhabDistributionRows };
}

function applyCollectiveGrandmotherShare(results: HeirShare[]) {
  const grandmothers = results.filter(
    (result) => !result.blocked && ['grandmother_paternal', 'grandmother_maternal'].includes(result.heir.type),
  );
  const totalCount = grandmothers.reduce((sum, result) => sum + result.heir.count, 0);
  if (totalCount === 0) return;

  const perPersonShare = divideFractionByNumber(SHARES.ONE_SIXTH, totalCount);
  grandmothers.forEach((result) => {
    setShare(
      result,
      multiplyFractionByNumber(perPersonShare, result.heir.count),
      'fard',
      totalCount > 1 ? 'Aktif nineler müştereken 1/6 payı paylaşır.' : 'Tek nine 1/6 alır.',
    );
  });
}

function applyCollectiveMaternalSiblingShare(results: HeirShare[]) {
  const maternalSiblings = results.filter(
    (result) => !result.blocked && ['brother_maternal', 'sister_maternal'].includes(result.heir.type),
  );
  const totalCount = maternalSiblings.reduce((sum, result) => sum + result.heir.count, 0);
  if (totalCount === 0) return;

  const totalShare = totalCount === 1 ? SHARES.ONE_SIXTH : SHARES.ONE_THIRD;
  const perPersonShare = divideFractionByNumber(totalShare, totalCount);

  maternalSiblings.forEach((result) => {
    setShare(
      result,
      multiplyFractionByNumber(perPersonShare, result.heir.count),
      'fard',
      totalCount === 1
        ? 'Tek anne bir kardeş 1/6 alır.'
        : 'Anne bir kardeşler toplam 1/3 alır ve aralarında eşit paylaşır.',
    );
  });
}

function applySpecialCase(
  results: HeirShare[],
  specialCase: string | undefined,
  warnings: string[],
  steps: string[],
  school: Exclude<MadhhabKey, 'default'>,
): boolean {
  if (!specialCase) return false;

  const husband = results.find((result) => result.heir.type === 'husband' && !result.blocked);
  const wife = results.find((result) => result.heir.type === 'wife' && !result.blocked);
  const mother = results.find((result) => result.heir.type === 'mother' && !result.blocked);
  const father = results.find((result) => result.heir.type === 'father' && !result.blocked);
  const grandfather = results.find((result) => result.heir.type === 'grandfather_paternal' && !result.blocked);
  const fullSister = results.find((result) => result.heir.type === 'sister_full' && !result.blocked);

  if (specialCase === 'Ömeriyyeteyn (Garraveyn)' && mother && father) {
    if (husband) {
      setShare(husband, SHARES.HALF, 'fard', 'Koca sabit olarak 1/2 alır.');
      setShare(mother, SHARES.ONE_SIXTH, 'fard', 'Anne, eşin payı çıktıktan sonra kalan kısmın üçte birini aldığı için 1/6 olur.');
      setShare(father, { numerator: 1, denominator: 3 }, 'asaba', 'Kalan pay babaya geçer.', 'binefsihi');
    } else if (wife) {
      setShare(wife, SHARES.QUARTER, 'fard', 'Eşler toplam 1/4 alır.');
      setShare(mother, SHARES.QUARTER, 'fard', 'Anne, eşin payı çıktıktan sonra kalan kısmın üçte birini aldığı için 1/4 olur.');
      setShare(father, SHARES.HALF, 'asaba', 'Kalan pay babaya geçer.', 'binefsihi');
    }
    steps.push('Ömeriyyeteyn uygulandı.');
    return true;
  }

  if (specialCase === 'Müşerrike (Himariyye)' && mother) {
    if (husband) {
      setShare(husband, SHARES.HALF, 'fard', 'Koca 1/2 alır.');
    }
    setShare(mother, SHARES.ONE_SIXTH, 'fard', 'Anne 1/6 alır.');

    if (school === 'hanafi') {
      applyCollectiveMaternalSiblingShare(results);
      ['brother_full', 'sister_full'].forEach((type) => {
        const row = results.find((result) => result.heir.type === type);
        if (row) markBlocked(row, ['brother_maternal', 'sister_maternal'], 'Hanefî görüşte öz kardeşler anne bir kardeşlerin payına ortak edilmez.');
      });
      steps.push('Müşerrike Hanefî görüşe göre çözüldü.');
      return true;
    }

    const participantTypes: HeirType[] = ['brother_maternal', 'sister_maternal', 'brother_full', 'sister_full'];
    const participants = results.filter((result) => !result.blocked && participantTypes.includes(result.heir.type));
    const totalCount = participants.reduce((sum, result) => sum + result.heir.count, 0);
    if (totalCount > 0) {
      const perPersonShare = divideFractionByNumber(SHARES.ONE_THIRD, totalCount);
      participants.forEach((result) => {
        setShare(result, multiplyFractionByNumber(perPersonShare, result.heir.count), 'fard', 'Cumhur görüşünde bu üçte birlik pay kardeşler arasında eşit paylaşılır.');
      });
    }
    steps.push('Müşerrike cumhur görüşüne göre çözüldü.');
    return true;
  }

  if (specialCase === 'Akdariyye' && husband && mother && grandfather && fullSister) {
    if (school === 'hanafi') {
      setShare(husband, SHARES.HALF, 'fard', 'Koca 1/2 alır.');
      setShare(mother, SHARES.ONE_THIRD, 'fard', 'Hanefî görüşte anne bu dosyada 1/3 alır.');
      setShare(grandfather, SHARES.ONE_SIXTH, 'asaba', 'Hanefî görüşte dede kalan 1/6 payı alır.', 'binefsihi');
      markBlocked(fullSister, ['grandfather_paternal'], 'Hanefî görüşte dede, öz kız kardeşi düşürür.');
      steps.push('Akdariyye Hanefî görüşe göre çözüldü.');
      return true;
    }

    setShare(husband, { numerator: 9, denominator: 27 }, 'fard', 'Cumhur görüşünde koca 9/27 alır.');
    setShare(mother, { numerator: 6, denominator: 27 }, 'fard', 'Cumhur görüşünde anne 6/27 alır.');
    setShare(grandfather, { numerator: 8, denominator: 27 }, 'asaba', 'Cumhur görüşünde dede 8/27 alır.', 'binefsihi');
    setShare(fullSister, { numerator: 4, denominator: 27 }, 'fard', 'Cumhur görüşünde öz kız kardeş 4/27 alır.');
    steps.push('Akdariyye cumhur görüşüne göre çözüldü.');
    return true;
  }

  warnings.push(`${specialCase} bu vakada özel kontrol gerektiren bir mesele olarak işaretlendi.`);
  return false;
}

function prepareGrandfatherSiblingContext(results: HeirShare[], heirs: Heir[]) {
  const grandfather = results.find((result) => result.heir.type === 'grandfather_paternal' && !result.blocked);
  if (!grandfather || hasMaleFar(heirs) || hasHeir(heirs, 'father')) {
    return false;
  }

  const useFullSiblings = hasHeir(heirs, 'brother_full') || hasHeir(heirs, 'sister_full');
  const siblingTypes: HeirType[] = useFullSiblings ? ['brother_full', 'sister_full'] : ['brother_paternal', 'sister_paternal'];
  const siblingRows = results.filter((result) => !result.blocked && siblingTypes.includes(result.heir.type));
  if (siblingRows.length === 0) {
    return false;
  }

  results
    .filter((result) => !result.blocked && !siblingTypes.includes(result.heir.type) && ['brother_full', 'sister_full', 'brother_paternal', 'sister_paternal'].includes(result.heir.type))
    .forEach((result) => {
      markBlocked(result, siblingRows.map((row) => row.heir.type), 'Dede ile aynı babda daha yakın kardeş grubu bulunduğu için bu kardeş türü dışarıda kaldı.');
    });

  siblingRows.forEach((result) => {
    setShare(result, SHARES.ZERO, 'asaba', 'Dede ile birlikte mukāsama / bakiyenin üçte biri kıyasına tabi.', 'binefsihi');
  });

  grandfather.shareType = 'asaba';
  grandfather.note = 'Dede, kardeşlerle birlikte mukāsama / 1/6 / bakiyenin üçte biri kıyasına tabi tutuldu.';

  return true;
}

function applyGrandfatherSiblingDistribution(results: HeirShare[], heirs: Heir[], remainingShare: Fraction, steps: string[]): Fraction {
  const grandfather = results.find((result) => result.heir.type === 'grandfather_paternal' && !result.blocked);
  if (!grandfather || !isPositiveFraction(remainingShare) || hasMaleFar(heirs) || hasHeir(heirs, 'father')) {
    return remainingShare;
  }

  const siblings = results.filter(
    (result) =>
      !result.blocked &&
      ['brother_full', 'sister_full', 'brother_paternal', 'sister_paternal'].includes(result.heir.type),
  );

  if (siblings.length === 0) {
    return remainingShare;
  }

  const siblingUnits = siblings.reduce((sum, result) => {
    const units = result.heir.gender === 'male' ? 2 : 1;
    return sum + units * result.heir.count;
  }, 0);

  const muqasamaShare = siblingUnits > 0
    ? divideFractionByNumber(multiplyFractionByNumber(remainingShare, 2), siblingUnits + 2)
    : remainingShare;
  const residueThird = divideFractionByNumber(remainingShare, 3);
  const fixedSixth = SHARES.ONE_SIXTH;
  const chosenShare = maxFraction(muqasamaShare, residueThird, fixedSixth);

  let chosenNote = 'Dede 1/6 ile en yüksek payı aldı.';
  if (fractionToDecimal(chosenShare) === fractionToDecimal(residueThird)) {
    chosenNote = 'Dede bakiyenin üçte birini alarak en yüksek payı elde etti.';
  }
  if (fractionToDecimal(chosenShare) === fractionToDecimal(muqasamaShare)) {
    chosenNote = 'Dede kardeşlerle mukāsama yaparak en yüksek payı aldı.';
  }

  setShare(grandfather, chosenShare, 'asaba', chosenNote, 'binefsihi');

  const siblingsShare = isPositiveFraction(remainingShare) ? subtractFractions(remainingShare, chosenShare) : SHARES.ZERO;
  if (isPositiveFraction(siblingsShare) && siblingUnits > 0) {
    const sharePerUnit = divideFractionByNumber(siblingsShare, siblingUnits);
    siblings.forEach((result) => {
      const units = result.heir.gender === 'male' ? 2 : 1;
      setShare(
        result,
        multiplyFractionByNumber(sharePerUnit, units * result.heir.count),
        'asaba',
        'Dede ile birlikte mukāsama sonucu bakiye kardeşlere dağıtıldı.',
        result.heir.gender === 'male' ? 'binefsihi' : 'bigayrihi',
      );
    });
  } else {
    siblings.forEach((result) => {
      result.originalShare = SHARES.ZERO;
      result.adjustedShare = SHARES.ZERO;
      result.note = 'Dede daha güçlü tercih hakkını kullandığı için kardeşlere artık pay kalmadı.';
    });
  }

  steps.push('Dede + kardeşler babı için 1/6, bakiyenin 1/3’ü ve mukāsama seçenekleri kıyaslandı.');
  return SHARES.ZERO;
}

function applyNormalAsabaDistribution(results: HeirShare[], heirs: Heir[], remainingShare: Fraction): Fraction {
  if (!isPositiveFraction(remainingShare)) {
    return remainingShare;
  }

  const father = results.find((result) => result.heir.type === 'father' && !result.blocked);
  if (father && !hasMaleFar(heirs) && hasFemaleFar(heirs)) {
    setShare(
      father,
      addFractions(SHARES.ONE_SIXTH, remainingShare),
      'asaba',
      'Baba 1/6 farz payına ek olarak kalan bakiyeyi aldı.',
      'binefsihi',
    );
    return SHARES.ZERO;
  }

  const grandfather = results.find((result) => result.heir.type === 'grandfather_paternal' && !result.blocked);
  if (grandfather && !hasHeir(heirs, 'father') && !hasMaleFar(heirs) && hasFemaleFar(heirs)) {
    setShare(
      grandfather,
      addFractions(SHARES.ONE_SIXTH, remainingShare),
      'asaba',
      'Dede 1/6 farz payına ek olarak kalan bakiyeyi aldı.',
      'binefsihi',
    );
    return SHARES.ZERO;
  }

  const asabaHeirs = results
    .filter((result) => result.shareType === 'asaba' && !result.blocked)
    .sort((left, right) => getAsabaOrder(left.heir.type) - getAsabaOrder(right.heir.type));

  if (asabaHeirs.length === 0) {
    return remainingShare;
  }

  const leadOrder = getAsabaOrder(asabaHeirs[0].heir.type);
  const leadGroup = getAsabaGroup(asabaHeirs[0].heir.type);
  const effectiveAsaba = asabaHeirs.filter(
    (result) => getAsabaOrder(result.heir.type) === leadOrder || leadGroup.includes(result.heir.type),
  );

  const totalUnits = effectiveAsaba.reduce((sum, result) => {
    const units = result.heir.gender === 'male' ? 2 : 1;
    return sum + units * result.heir.count;
  }, 0);

  if (totalUnits === 0) {
    return remainingShare;
  }

  const sharePerUnit = divideFractionByNumber(remainingShare, totalUnits);
  effectiveAsaba.forEach((result) => {
    const units = result.heir.gender === 'male' ? 2 : 1;
    setShare(
      result,
      multiplyFractionByNumber(sharePerUnit, units * result.heir.count),
      'asaba',
      effectiveAsaba.length > 1
        ? `Asabe dağıtımı ${totalUnits} birim üzerinden yapıldı.`
        : 'Tüm bakiye bu mirasçı grubuna verildi.',
      result.asabaType || (result.heir.gender === 'male' ? 'binefsihi' : 'bigayrihi'),
    );
  });

  asabaHeirs
    .filter((result) => !effectiveAsaba.includes(result))
    .forEach((result) => {
      markBlocked(
        result,
        effectiveAsaba.map((row) => row.heir.type),
        `${effectiveAsaba.map((row) => row.heir.label).join(', ')} daha yakın asabe olduğu için bu mirasçı pay alamadı.`,
      );
    });

  return SHARES.ZERO;
}

function applyZawilArhamDistribution(results: HeirShare[], remainingShare: Fraction, steps: string[], warnings: string[]): boolean {
  const zawiRows = results.filter((result) => isZawilArham(result.heir.type) && !result.blocked);
  if (zawiRows.length === 0 || !isPositiveFraction(remainingShare)) {
    return false;
  }

  const activePrimaryHeirs = results.filter(
    (result) =>
      !result.blocked &&
      !isZawilArham(result.heir.type) &&
      !isSpouse(result.heir.type) &&
      !isZero(result.originalShare),
  );

  if (activePrimaryHeirs.length > 0) {
    zawiRows.forEach((result) => {
      markBlocked(
        result,
        activePrimaryHeirs.slice(0, 4).map((row) => row.heir.type),
        'Daha yakın ashâb-ı furûz veya asabe bulunduğu için zevi’l-erhâm sırası gelmedi.',
      );
    });
    return false;
  }

  const minOrder = Math.min(...zawiRows.map((result) => ZAWIL_ARHAM_ORDER[result.heir.type] || 99));
  const effectiveRows = zawiRows.filter((result) => (ZAWIL_ARHAM_ORDER[result.heir.type] || 99) === minOrder);

  zawiRows
    .filter((result) => !effectiveRows.includes(result))
    .forEach((result) => {
      markBlocked(
        result,
        effectiveRows.map((row) => row.heir.type),
        'Daha yakın derecedeki zevi’l-erhâm bulunduğu için bu sıra devreye alınmadı.',
      );
    });

  const totalUnits = effectiveRows.reduce((sum, result) => {
    const units = result.heir.gender === 'male' ? 2 : 1;
    return sum + units * result.heir.count;
  }, 0);

  if (totalUnits === 0) {
    warnings.push('Zevi’l-erhâm kaydı vardı; ancak etkin grup belirlenemedi.');
    return false;
  }

  const perUnitShare = divideFractionByNumber(remainingShare, totalUnits);
  effectiveRows.forEach((result) => {
    const units = result.heir.gender === 'male' ? 2 : 1;
    setShare(
      result,
      multiplyFractionByNumber(perUnitShare, units * result.heir.count),
      'zawil_arham',
      'Zevi’l-erhâm, yakınlık sırası içinde varsayılan 2:1 birim hesabıyla dağıtıldı.',
    );
  });

  steps.push('Yakın furûz ve asabe tükendiği için zevi’l-erhâm katmanı devreye alındı.');
  return true;
}

function applyRadd(results: HeirShare[]): boolean {
  const activeAsaba = results.filter((result) => result.shareType === 'asaba' && !result.blocked && isPositiveFraction(result.originalShare));
  if (activeAsaba.length > 0) return false;

  const totalShare = sumFractions(results.filter((result) => !result.blocked).map((result) => result.originalShare));
  if (fractionToDecimal(totalShare) >= 1) return false;

  const nonSpouseRecipients = results.filter(
    (result) => !result.blocked && !isSpouse(result.heir.type) && !isZero(result.originalShare) && result.shareType !== 'zawil_arham',
  );
  if (nonSpouseRecipients.length === 0) return false;

  const spouseShare = sumFractions(
    results.filter((result) => !result.blocked && isSpouse(result.heir.type)).map((result) => result.originalShare),
  );
  const distributable = isPositiveFraction(spouseShare)
    ? subtractFractions(SHARES.FULL, spouseShare)
    : SHARES.FULL;
  const totalNonSpouse = sumFractions(nonSpouseRecipients.map((result) => result.originalShare));

  nonSpouseRecipients.forEach((result) => {
    const normalized = divideFractions(result.originalShare, totalNonSpouse);
    result.adjustedShare = simplifyFraction(multiplyFractions(normalized, distributable));
    result.shareType = 'radd';
    result.note = `${result.note || 'Farz payı'} Artan bakiye redd ile aynı gruba iade edildi.`;
  });

  results
    .filter((result) => !result.blocked && isSpouse(result.heir.type))
    .forEach((result) => {
      result.adjustedShare = cloneFraction(result.originalShare);
    });

  return true;
}

function hasStructuredAdvancedCase(caseContext: AdvancedCaseContext | undefined): boolean {
  if (!caseContext) return false;
  return Boolean(
    caseContext.pregnancyConfig?.enabled ||
    caseContext.khunsaConfig?.enabled ||
    caseContext.mafqudConfig?.enabled,
  );
}

function getHeirTemplate(type: HeirType): Heir | undefined {
  return ALL_HEIRS.find((heir) => heir.type === type) as Heir | undefined;
}

function buildMergedHeirs(baseHeirs: Heir[], additions: Array<{ type: HeirType; count: number }>): Heir[] {
  const merged = cloneHeirsForRecalculation(baseHeirs);

  additions.forEach(({ type, count }) => {
    if (count <= 0) return;
    const existing = merged.find((heir) => heir.type === type);
    if (existing) {
      existing.count += count;
      return;
    }

    const template = getHeirTemplate(type);
    if (template) {
      merged.push({ ...template, count, impediments: undefined });
    }
  });

  return merged;
}

function enumerateGenderCombinations(totalCount: number): Array<{ maleCount: number; femaleCount: number }> {
  const safeCount = Math.max(0, Math.min(totalCount, 4));
  const combos: Array<{ maleCount: number; femaleCount: number }> = [];
  for (let maleCount = safeCount; maleCount >= 0; maleCount -= 1) {
    combos.push({ maleCount, femaleCount: safeCount - maleCount });
  }
  return combos;
}

function buildAdvancedScenarioSet(baseHeirs: Heir[], caseContext: AdvancedCaseContext | undefined): Array<{ label: string; scenarioKey: string; note: string; heirs: Heir[] }> {
  if (!caseContext) {
    return [{ label: 'Teyitli mirasçılar', scenarioKey: 'confirmed', note: 'İleri belirsizlik kaydı yok.', heirs: cloneHeirsForRecalculation(baseHeirs) }];
  }

  const pregnancyConfig = caseContext.pregnancyConfig ?? {
    enabled: caseContext.pregnancy === 'possible',
    count: 1 as 1 | 2 | 3,
    sexMode: 'unknown' as const,
  };

  const khunsaConfig = caseContext.khunsaConfig ?? {
    enabled: (caseContext.khunsaCount || 0) > 0,
    relation: 'child' as const,
    count: Math.max(1, Math.min(4, caseContext.khunsaCount || 1)),
  };

  const mafqudConfig = caseContext.mafqudConfig ?? {
    enabled: (caseContext.mafqudCount || 0) > 0,
    heirType: '' as HeirType | '',
    count: Math.max(1, Math.min(4, caseContext.mafqudCount || 1)),
  };

  const pregnancyOptions: Array<{ label: string; key: string; note: string; additions: Array<{ type: HeirType; count: number }> }> = [{
    label: 'Teyitli mirasçılar',
    key: 'preg:confirmed',
    note: 'Hamilelik senaryosu yok.',
    additions: [],
  }];

  if (pregnancyConfig.enabled) {
    pregnancyOptions.length = 0;
    const pushPregnancy = (maleCount: number, femaleCount: number, note: string) => {
      const additions: Array<{ type: HeirType; count: number }> = [];
      if (maleCount > 0) additions.push({ type: 'son', count: maleCount });
      if (femaleCount > 0) additions.push({ type: 'daughter', count: femaleCount });
      const labelParts: string[] = [];
      if (maleCount > 0) labelParts.push(`${maleCount} erkek`);
      if (femaleCount > 0) labelParts.push(`${femaleCount} kız`);
      const label = labelParts.join(' + ') || 'belirsiz haml';
      pregnancyOptions.push({
        label: `Haml: ${label}`,
        key: `preg:${maleCount}m${femaleCount}f`,
        note,
        additions,
      });
    };

    if (pregnancyConfig.sexMode === 'male') {
      pushPregnancy(pregnancyConfig.count, 0, `Haml tamamen erkek kabul edilerek ${pregnancyConfig.count} çocuk senaryosu çalıştırıldı.`);
    } else if (pregnancyConfig.sexMode === 'female') {
      pushPregnancy(0, pregnancyConfig.count, `Haml tamamen kız kabul edilerek ${pregnancyConfig.count} çocuk senaryosu çalıştırıldı.`);
    } else {
      enumerateGenderCombinations(pregnancyConfig.count).forEach(({ maleCount, femaleCount }) => {
        pushPregnancy(maleCount, femaleCount, `Haml için ${maleCount} erkek ve ${femaleCount} kız ihtimali ayrı bir dal olarak hesaplandı.`);
      });
    }
  }

  const khunsaRelationMap: Record<string, { male: HeirType; female: HeirType; label: string }> = {
    child: { male: 'son', female: 'daughter', label: 'çocuk' },
    grandchild: { male: 'grandson', female: 'granddaughter', label: 'oğul alt soyu' },
    full_sibling: { male: 'brother_full', female: 'sister_full', label: 'öz kardeş' },
    paternal_sibling: { male: 'brother_paternal', female: 'sister_paternal', label: 'baba bir kardeş' },
    maternal_sibling: { male: 'brother_maternal', female: 'sister_maternal', label: 'anne bir kardeş' },
  };

  const khunsaOptions: Array<{ label: string; key: string; note: string; additions: Array<{ type: HeirType; count: number }> }> = [{
    label: 'Hünsâ yok',
    key: 'khunsa:none',
    note: 'Hünsâ senaryosu yok.',
    additions: [],
  }];

  if (khunsaConfig.enabled) {
    khunsaOptions.length = 0;
    const relation = khunsaRelationMap[khunsaConfig.relation];
    for (let maleCount = khunsaConfig.count; maleCount >= 0; maleCount -= 1) {
      const femaleCount = khunsaConfig.count - maleCount;
      const additions: Array<{ type: HeirType; count: number }> = [];
      if (maleCount > 0) additions.push({ type: relation.male, count: maleCount });
      if (femaleCount > 0) additions.push({ type: relation.female, count: femaleCount });

      const labelParts: string[] = [];
      if (maleCount > 0) labelParts.push(`${maleCount} erkek`);
      if (femaleCount > 0) labelParts.push(`${femaleCount} kadın`);
      const summary = labelParts.join(' + ') || '0';
      khunsaOptions.push({
        label: `Hünsâ (${relation.label}): ${summary}`,
        key: `khunsa:${khunsaConfig.relation}:${maleCount}m${femaleCount}f`,
        note: `Hünsâ için ${summary} kombinasyonu denendi.`,
        additions,
      });
    }
  }

  const mafqudOptions: Array<{ label: string; key: string; note: string; additions: Array<{ type: HeirType; count: number }> }> = [{
    label: 'Mefkud yok',
    key: 'mafqud:none',
    note: 'Mefkud senaryosu yok.',
    additions: [],
  }];

  if (mafqudConfig.enabled && mafqudConfig.heirType) {
    mafqudOptions.length = 0;
    const label = getHeirName(mafqudConfig.heirType);
    for (let aliveCount = mafqudConfig.count; aliveCount >= 0; aliveCount -= 1) {
      mafqudOptions.push({
        label: aliveCount === 0 ? `Mefkud (${label}) ölü kabul` : `Mefkud (${label}) sağ kabul x${aliveCount}`,
        key: `mafqud:${mafqudConfig.heirType}:${aliveCount}`,
        note: aliveCount === 0 ? `${label} ölmüş sayılarak hesaplandı.` : `${label} içinden ${aliveCount} kişi hayatta kabul edilerek hesaplandı.`,
        additions: aliveCount > 0 ? [{ type: mafqudConfig.heirType, count: aliveCount }] : [],
      });
    }
  }

  const scenarios: Array<{ label: string; scenarioKey: string; note: string; heirs: Heir[] }> = [];
  pregnancyOptions.forEach((pregnancyOption) => {
    khunsaOptions.forEach((khunsaOption) => {
      mafqudOptions.forEach((mafqudOption) => {
        const additions = [...pregnancyOption.additions, ...khunsaOption.additions, ...mafqudOption.additions];
        const labels = [pregnancyOption.label, khunsaOption.label, mafqudOption.label].filter((label) => !['Teyitli mirasçılar', 'Hünsâ yok', 'Mefkud yok'].includes(label));
        const notes = [pregnancyOption.note, khunsaOption.note, mafqudOption.note].filter((note) => !note.endsWith('yok.'));
        scenarios.push({
          label: labels.join(' • ') || 'Teyitli mirasçılar',
          scenarioKey: [pregnancyOption.key, khunsaOption.key, mafqudOption.key].join('|'),
          note: notes.join(' ').trim() || 'Belirsizlik oluşturan ek senaryo bulunmadı.',
          heirs: buildMergedHeirs(baseHeirs, additions),
        });
      });
    });
  });

  return scenarios;
}

function getResultFractionForHeir(result: InheritanceResult, heirType: HeirType): Fraction {
  return result.heirs.find((row) => row.heir.type === heirType)?.adjustedShare || SHARES.ZERO;
}

function buildMinMaxFractions(fractions: Fraction[]): { min: Fraction; max: Fraction } {
  let min = cloneFraction(fractions[0] || SHARES.ZERO);
  let max = cloneFraction(fractions[0] || SHARES.ZERO);

  fractions.forEach((fraction) => {
    const value = fractionToDecimal(fraction);
    if (value < fractionToDecimal(min)) min = cloneFraction(fraction);
    if (value > fractionToDecimal(max)) max = cloneFraction(fraction);
  });

  return { min, max };
}

function attachAdvancedCaseWarnings(caseContext: AdvancedCaseContext | undefined, warnings: string[], steps: string[]): boolean {
  if (!caseContext) return false;
  let tentative = false;

  const pregnancyActive = caseContext.pregnancyConfig?.enabled || caseContext.pregnancy === 'possible';
  if (pregnancyActive) {
    warnings.push('Doğmamış çocuk bulunduğu için sistem kesin verilebilen payı ayırır, geri kalan kısmı bekletir.');
    steps.push('Haml için alternatif cinsiyet / sayı senaryoları kıyaslandı ve ihtiyatlı dağıtım üretildi.');
    tentative = true;
  }

  const khunsaActive = caseContext.khunsaConfig?.enabled || (caseContext.khunsaCount || 0) > 0;
  if (khunsaActive) {
    warnings.push('Cinsiyeti belirsiz kişi bulunduğu için sistem erkek ve kadın ihtimallerini ayrı hesaplayıp en güvenli payı gösterir.');
    steps.push('Hünsâ için erkek-kadın kombinasyonları senaryolaştırıldı.');
    tentative = true;
  }

  const mafqudActive = caseContext.mafqudConfig?.enabled || (caseContext.mafqudCount || 0) > 0;
  if (mafqudActive) {
    warnings.push('Kayıp kişi bulunduğu için sistem sağ kabulü ve ölü kabulünü ayrı ayrı hesaplayıp güvenli kısmı gösterir.');
    steps.push('Mefkud için hayatta ve ölü kabulü senaryoları kıyaslandı.');
    tentative = true;
  }

  if (caseContext.munasakhatConfig?.enabled || caseContext.munasakhatNote.trim()) {
    warnings.push('Ardışık ölüm bulunduğu için ilk mirastan gelen pay üzerinden ikinci bir dağıtım da hesaplanır.');
    steps.push('Münâsehat için ikinci tereke akışı etkinleştirildi.');
    tentative = true;
  }

  return tentative;
}

export function calculateInheritance(
  heirs: Heir[],
  deceased: DeceasedInfo,
  options?: CalcOptions,
): InheritanceResult {
  const calculationWarnings: string[] = [];
  const calculationSteps: string[] = [];
  const school = options?.school || 'hanafi';

  const { effectiveHeirs, excludedSummaries, warnings } = normalizeHeirs(heirs);
  calculationWarnings.push(...warnings);

  let tentative = attachAdvancedCaseWarnings(deceased.caseContext, calculationWarnings, calculationSteps);
  const specialCase = detectSpecialCase(effectiveHeirs);

  const results: HeirShare[] = [];
  calculationSteps.push(`Toplam ${effectiveHeirs.length} etkin mirasçı tipi hesap çekirdeğine alındı.`);

  for (const heir of effectiveHeirs) {
    const blockedInfo = getBlockedInfo(heir, effectiveHeirs);
    const shareTemplate = calculateShareTemplate(heir, effectiveHeirs);
    const forcedBlockedBy = shareTemplate.forcedBlockedBy || [];
    const actualBlockedBy = blockedInfo.blocked ? blockedInfo.blockedBy : forcedBlockedBy;
    const isBlocked = blockedInfo.blocked || shareTemplate.shareType === 'blocked' || actualBlockedBy.length > 0;

    const row = buildEmptyShare(
      heir,
      isBlocked ? SHARES.ZERO : shareTemplate.share,
      isBlocked ? 'blocked' : shareTemplate.shareType,
      isBlocked,
      isBlocked ? shareTemplate.note || blockedInfo.reason || `${actualBlockedBy.map(getHeirName).join(', ')} tarafından hacb edildi.` : shareTemplate.note,
    );

    row.asabaType = shareTemplate.asabaType;
    if (isBlocked) {
      row.blockedBy = actualBlockedBy;
      row.blockedByNames = actualBlockedBy.map(getHeirName);
    }
    results.push(row);
  }

  if (school === 'hanafi' && hasHeir(effectiveHeirs, 'grandfather_paternal') && !hasHeir(effectiveHeirs, 'father')) {
    results
      .filter((result) => ['brother_full', 'sister_full', 'brother_paternal', 'sister_paternal', 'nephew_full', 'nephew_paternal', 'uncle_paternal_full', 'uncle_paternal_half', 'cousin_paternal_full', 'cousin_paternal_half'].includes(result.heir.type))
      .forEach((result) => markBlocked(result, ['grandfather_paternal'], 'Hanefî görüşte dede bu mirasçıları düşürür.'));
  }

  applyCollectiveGrandmotherShare(results);
  applyCollectiveMaternalSiblingShare(results);

  const appliedSpecialCase = applySpecialCase(results, specialCase, calculationWarnings, calculationSteps, school);
  const preparedGrandfatherSiblings = !appliedSpecialCase && specialCase !== 'Akdariyye'
    ? prepareGrandfatherSiblingContext(results, effectiveHeirs)
    : false;

  const totalFardShare = sumFractions(results.filter((result) => result.shareType === 'fard' && !result.blocked).map((result) => result.originalShare));
  let remainingShare = subtractFractions(SHARES.FULL, totalFardShare);

  if (preparedGrandfatherSiblings) {
    remainingShare = applyGrandfatherSiblingDistribution(results, effectiveHeirs, remainingShare, calculationSteps);
  } else if (!appliedSpecialCase) {
    remainingShare = applyNormalAsabaDistribution(results, effectiveHeirs, remainingShare);
  } else {
    remainingShare = subtractFractions(
      SHARES.FULL,
      sumFractions(results.filter((result) => !result.blocked).map((result) => result.originalShare)),
    );
  }

  let rawTotalShare = sumFractions(results.filter((result) => !result.blocked).map((result) => result.originalShare));
  let hasAvl = fractionToDecimal(rawTotalShare) > 1;
  let hasRadd = false;

  if (!hasAvl) {
    const zawiApplied = applyZawilArhamDistribution(results, subtractFractions(SHARES.FULL, rawTotalShare), calculationSteps, calculationWarnings);
    if (zawiApplied) {
      rawTotalShare = sumFractions(results.filter((result) => !result.blocked).map((result) => result.originalShare));
    }
  }

  if (fractionToDecimal(rawTotalShare) < 1) {
    hasRadd = applyRadd(results);
  }

  rawTotalShare = sumFractions(results.filter((result) => !result.blocked).map((result) => result.originalShare));
  hasAvl = fractionToDecimal(rawTotalShare) > 1;

  if (hasAvl) {
    results.forEach((result) => {
      if (!result.blocked && !isZero(result.originalShare)) {
        result.adjustedShare = divideFractions(result.originalShare, rawTotalShare);
      }
    });
    calculationSteps.push('Farz payların toplamı 1’i geçtiği için avl uygulanarak bütün paylar orantılandı.');
  } else {
    results.forEach((result) => {
      if (!result.blocked && result.shareType !== 'radd') {
        result.adjustedShare = cloneFraction(result.originalShare);
      }
    });
  }

  const finalTotalShare = sumFractions(results.filter((result) => !result.blocked).map((result) => result.adjustedShare));
  const undistributed = subtractFractions(SHARES.FULL, finalTotalShare);
  if (isPositiveFraction(undistributed)) {
    calculationWarnings.push('Dağıtım sonunda artan pay bulundu. Bu bakiye beytülmâl / kamu hakkı veya ileri inceleme alanına kalabilir.');
  }

  finalizeZeroShareRows(results, calculationSteps);

  let baseShare = lcmMultiple(
    results.filter((result) => !result.blocked && !isZero(result.originalShare)).map((result) => result.originalShare.denominator),
  ) || 1;
  let adjustedBase = lcmMultiple(results.filter((result) => !result.blocked && !isZero(result.adjustedShare)).map((result) => result.adjustedShare.denominator)) || baseShare;
  let advancedAdjustments: InheritanceResult['advancedAdjustments'];

  if (!options?.skipAdvanced && hasStructuredAdvancedCase(deceased.caseContext)) {
    const scenarios = buildAdvancedScenarioSet(effectiveHeirs, deceased.caseContext);
    const scenarioResults = scenarios.map((scenario) =>
      calculateInheritance(
        scenario.heirs,
        { ...deceased, caseContext: undefined },
        { skipMadhhab: true, skipAdvanced: true, school },
      ),
    );

    const guaranteedHeirs = results
      .filter((row) => !row.blocked)
      .map((row) => {
        const fractions = scenarioResults.map((scenarioResult) => getResultFractionForHeir(scenarioResult, row.heir.type));
        const { min, max } = buildMinMaxFractions(fractions);
        row.adjustedShare = cloneFraction(min);
        row.amount = deceased.totalEstate * fractionToDecimal(row.adjustedShare);
        return {
          heirType: row.heir.type,
          label: row.heir.label,
          guaranteedShare: cloneFraction(min),
          maxPossibleShare: cloneFraction(max),
        };
      });

    const guaranteedTotal = sumFractions(results.filter((row) => !row.blocked).map((row) => row.adjustedShare));
    const reservedShare = subtractFractions(SHARES.FULL, guaranteedTotal);
    const reservedAmount = deceased.totalEstate * fractionToDecimal(reservedShare);

    const guaranteedMap = new Map(guaranteedHeirs.map((row) => [row.heirType, row.guaranteedShare]));

    advancedAdjustments = {
      active: true,
      reservedShare,
      reservedAmount,
      notes: [
        'Ana tabloda görülen paylar, bütün birleşik ileri senaryolarda güvenle verilebilen en düşük kesin paylardır.',
        'Bekletilen bölüm; doğacak çocuk, kayıp kişi, hünsâ ve varsa ardışık ölüm dalı netleşince yeniden dağıtılır.',
      ],
      guaranteedHeirs,
      scenarioSummaries: scenarios.map((scenario, index) => {
        const scenarioResult = scenarioResults[index];
        const variableFractions = scenarioResult.heirs
          .filter((row) => !row.blocked)
          .map((row) => {
            const guaranteed = guaranteedMap.get(row.heir.type);
            if (!guaranteed) return row.adjustedShare;
            const delta = subtractFractions(row.adjustedShare, guaranteed);
            return isPositiveFraction(delta) ? delta : SHARES.ZERO;
          });
        const scenarioReserved = sumFractions(variableFractions);
        let secondaryDistribution;
        const scenarioMunasakhat = deceased.caseContext?.munasakhatConfig;
        if (scenarioMunasakhat?.enabled && scenarioMunasakhat.sourceHeirType && scenarioMunasakhat.secondaryHeirs.length > 0) {
          const scenarioSource = scenarioResult.heirs.find((row) => row.heir.type === scenarioMunasakhat.sourceHeirType);
          if (scenarioSource && scenarioSource.amount > 0) {
            const secondTotalEstate = scenarioSource.amount + (scenarioMunasakhat.extraEstate || 0);
            const secondResult = calculateInheritance(
              scenarioMunasakhat.secondaryHeirs,
              { gender: scenarioMunasakhat.deceasedGender, totalEstate: secondTotalEstate, caseContext: undefined },
              { skipMadhhab: true, skipAdvanced: true, school },
            );
            secondaryDistribution = {
              sourceHeirType: scenarioSource.heir.type,
              sourceHeirLabel: scenarioSource.heir.label,
              inheritedAmount: scenarioSource.amount,
              extraEstate: scenarioMunasakhat.extraEstate || 0,
              totalEstate: secondTotalEstate,
              deceasedGender: scenarioMunasakhat.deceasedGender,
              heirs: secondResult.heirs,
              baseShare: secondResult.baseShare,
              adjustedBase: secondResult.adjustedBase,
              specialCase: secondResult.specialCase,
              calculationWarnings: [
                ...(scenarioMunasakhat.note ? [scenarioMunasakhat.note] : []),
                ...secondResult.calculationWarnings,
              ],
            };
          }
        }
        return {
          label: scenario.label,
          scenarioKey: scenario.scenarioKey,
          reservedShare: scenarioReserved,
          reservedAmount: deceased.totalEstate * fractionToDecimal(scenarioReserved),
          note: scenario.note,
          allocations: scenarioResult.heirs
            .filter((row) => !row.blocked && isPositiveFraction(row.adjustedShare))
            .map((row) => ({
              heirType: row.heir.type,
              label: row.heir.label,
              count: row.heir.count,
              groupShare: cloneFraction(row.adjustedShare),
              perPersonShare: row.heir.count > 1 ? divideFractionByNumber(row.adjustedShare, row.heir.count) : cloneFraction(row.adjustedShare),
            })),
          secondaryDistribution,
        };
      }),
    };

    adjustedBase = lcmMultiple(
      results.filter((row) => !row.blocked && !isZero(row.adjustedShare)).map((row) => row.adjustedShare.denominator)
        .concat(isPositiveFraction(reservedShare) ? [reservedShare.denominator] : []),
    ) || adjustedBase;

    tentative = true;
    calculationWarnings.push('İleri belirsizlik senaryoları sebebiyle ana tabloda yalnız güvenli dağıtım gösterildi; bekletilen pay ayrıca listelendi.');
    calculationSteps.push(`${scenarioResults.length} farklı birleşik ileri durum senaryosu çalıştırıldı ve ortak güvenli paylar çıkarıldı.`);
  }

  results.forEach((result) => {
    if (!result.blocked && !isZero(result.originalShare)) {
      result.shareInBase = result.originalShare.numerator * (baseShare / result.originalShare.denominator);
    }
    if (!result.blocked && !isZero(result.adjustedShare)) {
      result.adjustedShareInBase = result.adjustedShare.numerator * (adjustedBase / result.adjustedShare.denominator);
    }
    result.amount = deceased.totalEstate * fractionToDecimal(result.adjustedShare);
  });

  if (excludedSummaries.length > 0) {
    calculationSteps.push('Miras engeli kaydı bulunan kişiler sayısal olarak düşülüp etkin mirasçı sayısı yeniden hesaplandı.');
  }
  if (specialCase) {
    calculationSteps.push(`Özel mesele tespit edildi: ${specialCase}.`);
  }
  if (hasRadd) {
    calculationSteps.push('Asabe bulunmayan bakiyede redd uygulandı ve eş dışı farz sahiplerine iade yapıldı.');
  }

  const displaySchool = chooseDisplaySchool(options?.school);
  const { schoolResults, madhhabBases, madhhabDistributionRows } = options?.skipMadhhab
    ? {
        schoolResults: undefined,
        madhhabBases: { default: adjustedBase || 1, hanafi: adjustedBase || 1, maliki: adjustedBase || 1, shafii: adjustedBase || 1, hanbali: adjustedBase || 1 } as Record<MadhhabKey, number>,
        madhhabDistributionRows: [] as MadhhabDistributionRow[],
      }
    : buildSchoolBundle(effectiveHeirs, { ...deceased, caseContext: undefined });


  let munasakhatOutcome: InheritanceResult['munasakhatOutcome'];
  const munasakhatConfig = deceased.caseContext?.munasakhatConfig;
  if (!options?.skipAdvanced && munasakhatConfig?.enabled && munasakhatConfig.sourceHeirType && munasakhatConfig.secondaryHeirs.length > 0) {
    const sourceRow = results.find((row) => row.heir.type === munasakhatConfig.sourceHeirType);
    if (sourceRow && sourceRow.amount > 0) {
      const secondTotalEstate = sourceRow.amount + (munasakhatConfig.extraEstate || 0);
      const secondResult = calculateInheritance(
        munasakhatConfig.secondaryHeirs,
        { gender: munasakhatConfig.deceasedGender, totalEstate: secondTotalEstate, caseContext: undefined },
        { skipMadhhab: true, skipAdvanced: true, school },
      );

      munasakhatOutcome = {
        sourceHeirType: sourceRow.heir.type,
        sourceHeirLabel: sourceRow.heir.label,
        inheritedAmount: sourceRow.amount,
        extraEstate: munasakhatConfig.extraEstate || 0,
        totalEstate: secondTotalEstate,
        deceasedGender: munasakhatConfig.deceasedGender,
        heirs: secondResult.heirs,
        baseShare: secondResult.baseShare,
        adjustedBase: secondResult.adjustedBase,
        specialCase: secondResult.specialCase,
        calculationWarnings: [
          ...(munasakhatConfig.note ? [munasakhatConfig.note] : []),
          ...secondResult.calculationWarnings,
        ],
      };

      calculationSteps.push(`${sourceRow.heir.label} için münâsehat ikinci tereke hesabı üretildi.`);
    } else {
      calculationWarnings.push('Münâsehat için seçilen mirasçıya ilk terekeden fiilî pay düşmediği için ikinci dağıtım üretilemedi.');
    }
  }

  return {
    heirs: results,
    totalEstate: deceased.totalEstate,
    baseShare,
    adjustedBase,
    hasAvl,
    hasRadd,
    specialCase,
    remainingAsaba: remainingShare,
    calculationWarnings,
    calculationSteps,
    comparisonRows: buildComparisonRows(effectiveHeirs, specialCase, hasRadd, excludedSummaries, deceased.caseContext),
    madhhabBases,
    madhhabDistributionRows,
    displaySchool,
    excludedSummaries,
    tentative,
    advancedAdjustments,
    munasakhatOutcome,
    schoolResults,
    blockageDetails: buildBlockageDetails(results, excludedSummaries),
    trace: buildTrace(effectiveHeirs, {
      heirs: results,
      totalEstate: deceased.totalEstate,
      baseShare,
      adjustedBase,
      hasAvl,
      hasRadd,
      specialCase,
      remainingAsaba: remainingShare,
      calculationWarnings,
      calculationSteps,
      comparisonRows: [],
      madhhabBases,
      madhhabDistributionRows: [],
      displaySchool,
      excludedSummaries,
      tentative,
      advancedAdjustments,
      munasakhatOutcome,
    } as InheritanceResult, excludedSummaries, specialCase, Boolean(advancedAdjustments?.active), Boolean(munasakhatOutcome)),
    engineScope: ENGINE_SCOPE,
    referenceMatrix: REFERENCE_MATRIX,
  };
}

export function explainProspectiveBlock(heirType: HeirType, selectedHeirs: Heir[]): { blocked: boolean; blockedByType?: HeirType; reason: string } {
  const { effectiveHeirs } = normalizeHeirs(selectedHeirs);
  const heirDef = ALL_HEIRS.find((heir) => heir.type === heirType);
  if (!heirDef) {
    return { blocked: false, blockedByType: undefined, reason: '' };
  }

  if (isZawilArham(heirType)) {
    const blockers = effectiveHeirs.filter((heir) => !isSpouse(heir.type) && !isZawilArham(heir.type));
    if (blockers.length > 0) {
      return {
        blocked: true,
        blockedByType: blockers[0].type,
        reason: 'Daha yakın ashâb-ı furûz veya asabe bulunduğunda zevi’l-erhâm sırası gelmez.',
      };
    }
    return { blocked: false, blockedByType: undefined, reason: '' };
  }

  const info = getBlockedInfo({ ...heirDef, count: 1 }, effectiveHeirs);
  if (!info.blocked) {
    if (heirType === 'granddaughter' && getHeirCount(effectiveHeirs, 'daughter') >= 2 && !hasHeir(effectiveHeirs, 'grandson')) {
      return {
        blocked: true,
        blockedByType: 'daughter',
        reason: 'İki veya daha fazla kız varsa, oğlun kızına ancak aynı derecede erkek torun eşlik etmiyorsa sıra gelmez.',
      };
    }
    if (heirType === 'sister_paternal' && getHeirCount(effectiveHeirs, 'sister_full') >= 2) {
      return {
        blocked: true,
        blockedByType: 'sister_full',
        reason: 'İki veya daha fazla öz kız kardeş bulunduğunda baba bir kız kardeş hacb edilir; tek öz kız kardeş varsa tamamlayıcı 1/6 mümkün olur.',
      };
    }
    return { blocked: false, blockedByType: undefined, reason: '' };
  }

  return {
    blocked: true,
    blockedByType: info.blockedBy[0],
    reason: info.reason || 'Daha yakın mirasçı bulunduğu için hacb oluşur.',
  };
}
