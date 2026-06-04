import type { MadhhabKey } from '../../types/inheritance';

export type SchoolKey = Exclude<MadhhabKey, 'default'>;
export type ZawilArhamMethod = 'ahl_al_qaraba' | 'tanzil';

export interface SchoolEngineOptions {
  baitAlMalOperational?: boolean;
  zawilArhamMethod?: ZawilArhamMethod;
  includeComparison?: boolean;
}

export interface SchoolPolicy {
  key: SchoolKey;
  label: string;
  displayName: string;
  grandfatherWithSiblings: 'exclude_siblings' | 'compete_with_siblings';
  mushtaraka: 'exclude_full_siblings' | 'share_with_full_siblings';
  akdariyya: 'hanafi_block_sister' | 'jumhur_special_case';
  raddIncludesSpouses: boolean;
  zawilArhamMethod: ZawilArhamMethod;
  baitAlMalOperationalByDefault: boolean;
  supportedZawilArhamMethods: ZawilArhamMethod[];
  supportedBaitAlMalModes: boolean[];
  notes: string[];
}

export function isSchoolKey(value: string): value is SchoolKey {
  return value === 'hanafi' || value === 'maliki' || value === 'shafii' || value === 'hanbali';
}
