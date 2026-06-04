import type { Heir } from '../../types/inheritance';

export function matchesMushtaraka(heirs: Heir[]): boolean {
  const types = heirs.filter((heir) => heir.count > 0).map((heir) => heir.type);
  const maternal = types.includes('brother_maternal') || types.includes('sister_maternal');
  const full = types.includes('brother_full') || types.includes('sister_full');
  return types.includes('husband') && types.includes('mother') && maternal && full;
}
