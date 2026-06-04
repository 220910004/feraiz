import type { Fraction, HeirShare, ResultBundle } from '../types/inheritance';
import { divideFractionByNumber, fractionToDecimal, lcmMultiple } from '../utils/fractionUtils';

export interface UiPerPersonRow {
  heirShare: HeirShare;
  perPersonShare: Fraction;
  groupAmount?: number;
  perPersonAmount?: number;
}

export interface UiResultSections {
  activeHeirs: HeirShare[];
  blockedHeirs: HeirShare[];
  perPersonRows: UiPerPersonRow[];
  finalBase: number;
  perPersonBase: number;
}

function hasPositiveFraction(fraction: Fraction): boolean {
  return fractionToDecimal(fraction) > 0;
}

export function buildUiResultSections(result: ResultBundle, hasMoneyValues: boolean): UiResultSections {
  const activeHeirs = result.heirs.filter((heirShare) => !heirShare.blocked && hasPositiveFraction(heirShare.adjustedShare));
  const blockedHeirs = result.heirs.filter((heirShare) => heirShare.blocked);
  const perPersonRows = activeHeirs.map((heirShare) => {
    const perPersonShare = heirShare.heir.count > 1 ? divideFractionByNumber(heirShare.adjustedShare, heirShare.heir.count) : heirShare.adjustedShare;
    return {
      heirShare,
      perPersonShare,
      groupAmount: hasMoneyValues ? heirShare.amount : undefined,
      perPersonAmount: hasMoneyValues ? heirShare.amount / heirShare.heir.count : undefined,
    };
  });
  const finalBase = result.adjustedBase || result.baseShare || 1;
  const denominators = perPersonRows.map((row) => row.perPersonShare.denominator).filter(Boolean);
  const perPersonBase = lcmMultiple(denominators.length > 0 ? denominators : [finalBase]) || finalBase;
  return { activeHeirs, blockedHeirs, perPersonRows, finalBase, perPersonBase };
}
