import type { InheritanceResult } from '../../types/inheritance';

export function hasAwl(result: InheritanceResult): boolean {
  return Boolean(result.hasAvl);
}
