import type { Heir } from '../../types/inheritance';

export function hasGrandfatherSiblingConflict(heirs: Heir[]): boolean {
  const active = heirs.filter((heir) => heir.count > 0).map((heir) => heir.type);
  return active.includes('grandfather_paternal') && active.some((type) => ['brother_full', 'sister_full', 'brother_paternal', 'sister_paternal'].includes(type));
}
