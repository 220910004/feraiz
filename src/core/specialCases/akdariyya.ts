import type { Heir } from '../../types/inheritance';

export function matchesAkdariyya(heirs: Heir[]): boolean {
  const active = heirs.filter((heir) => heir.count > 0).map((heir) => heir.type);
  return active.every((type) => ['husband', 'mother', 'grandfather_paternal', 'sister_full'].includes(type))
    && active.includes('husband')
    && active.includes('mother')
    && active.includes('grandfather_paternal')
    && active.includes('sister_full');
}
