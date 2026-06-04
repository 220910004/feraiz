import type { HeirType } from '../../types/inheritance';

export const ASABA_ORDER: Partial<Record<HeirType, number>> = {
  son: 1,
  grandson: 2,
  father: 3,
  grandfather_paternal: 4,
  brother_full: 5,
  brother_paternal: 6,
  nephew_full: 7,
  nephew_paternal: 8,
  uncle_paternal_full: 9,
  uncle_paternal_half: 10,
  cousin_paternal_full: 11,
  cousin_paternal_half: 12,
};

export const ASABA_WITH_OTHERS: HeirType[] = ['daughter', 'granddaughter', 'sister_full', 'sister_paternal'];
