import type { HeirType } from '../../types/inheritance';
import type { ZawilArhamMethod } from '../schools/common';

export const ZAWIL_ARHAM_LEVELS: Partial<Record<HeirType, number>> = {
  daughter_son: 1,
  daughter_daughter: 1,
  daughter_son_son: 2,
  daughter_son_daughter: 2,
  daughter_daughter_son: 2,
  daughter_daughter_daughter: 2,
  grandfather_maternal: 2,
  sister_full_son: 3,
  sister_full_daughter: 3,
  sister_full_son_son: 4,
  sister_full_son_daughter: 4,
  sister_full_daughter_son: 4,
  sister_full_daughter_daughter: 4,
  sister_paternal_son: 3,
  sister_paternal_daughter: 3,
  sister_paternal_son_son: 4,
  sister_paternal_son_daughter: 4,
  sister_paternal_daughter_son: 4,
  sister_paternal_daughter_daughter: 4,
  brother_maternal_son: 5,
  brother_maternal_daughter: 5,
  brother_maternal_son_son: 6,
  brother_maternal_son_daughter: 6,
  brother_maternal_daughter_son: 6,
  brother_maternal_daughter_daughter: 6,
  uncle_maternal: 7,
  uncle_maternal_son: 8,
  uncle_maternal_daughter: 8,
  aunt_paternal: 7,
  aunt_paternal_son: 8,
  aunt_paternal_daughter: 8,
  aunt_maternal: 7,
  aunt_maternal_son: 8,
  aunt_maternal_daughter: 8,
};

export interface ZawilArhamPolicy {
  method: ZawilArhamMethod;
  baitAlMalOperational: boolean;
}
