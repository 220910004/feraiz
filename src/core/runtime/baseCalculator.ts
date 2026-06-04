import type { DeceasedInfo, Heir, HeirType, InheritanceResult } from '../../types/inheritance';
import {
  calculateInheritance as calculateBaseInheritance,
  explainProspectiveBlock as explainBaseProspectiveBlock,
} from '../../utils/inheritanceCalculator';

export function runBaseCalculator(
  heirs: Heir[],
  deceased: DeceasedInfo,
  school?: Exclude<import('../../types/inheritance').MadhhabKey, 'default'>,
): InheritanceResult {
  return calculateBaseInheritance(heirs, deceased, school ? { school } : undefined);
}

export function explainProspectiveBlock(heirType: HeirType, heirs: Heir[]) {
  return explainBaseProspectiveBlock(heirType, heirs);
}
