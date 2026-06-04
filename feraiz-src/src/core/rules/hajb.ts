import type { BlockageDetail, HeirType, InheritanceResult } from '../../types/inheritance';

export const HAJB_GROUPS: Record<string, HeirType[]> = {
  usul: ['father', 'mother', 'grandfather_paternal', 'grandmother_paternal', 'grandmother_maternal'],
  furu: ['son', 'daughter', 'grandson', 'granddaughter'],
  siblings: ['brother_full', 'sister_full', 'brother_paternal', 'sister_paternal', 'brother_maternal', 'sister_maternal'],
  zawilArham: ['grandfather_maternal', 'daughter_son', 'daughter_daughter', 'sister_full_son', 'sister_full_daughter', 'sister_paternal_son', 'sister_paternal_daughter', 'brother_maternal_son', 'brother_maternal_daughter', 'uncle_maternal', 'aunt_paternal', 'aunt_maternal'],
};

export function summarizeHajb(result: InheritanceResult): BlockageDetail[] {
  return result.blockageDetails || [];
}
