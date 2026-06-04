import type { Heir } from '../../types/inheritance';
import { matchesOmariyyatayn } from './omariyyatayn';
import { matchesMushtaraka } from './mushtaraka';
import { matchesAkdariyya } from './akdariyya';
import { hasGrandfatherSiblingConflict } from './grandfatherSiblings';

export type SpecialCaseId = 'omariyyatayn' | 'mushtaraka' | 'akdariyya' | 'grandfather_siblings';

export interface SpecialCaseMatch {
  id: SpecialCaseId;
  label: string;
}

export function detectSpecialCases(heirs: Heir[]): SpecialCaseMatch[] {
  const matches: SpecialCaseMatch[] = [];
  if (matchesOmariyyatayn(heirs)) matches.push({ id: 'omariyyatayn', label: 'Ömeriyyeteyn' });
  if (matchesMushtaraka(heirs)) matches.push({ id: 'mushtaraka', label: 'Müşerrike / Himariyye' });
  if (matchesAkdariyya(heirs)) matches.push({ id: 'akdariyya', label: 'Akdariyye' });
  if (hasGrandfatherSiblingConflict(heirs)) matches.push({ id: 'grandfather_siblings', label: 'Dede ve kardeşler babı' });
  return matches;
}
