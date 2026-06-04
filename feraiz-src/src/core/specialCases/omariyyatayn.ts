import type { Heir } from '../../types/inheritance';

export function matchesOmariyyatayn(heirs: Heir[]): boolean {
  const types = heirs.filter((heir) => heir.count > 0).map((heir) => heir.type);
  return types.includes('mother') && types.includes('father') && (types.includes('husband') || types.includes('wife'));
}
