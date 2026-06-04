export type HeirType =
  | 'husband'
  | 'wife'
  | 'father'
  | 'mother'
  | 'grandfather_paternal'
  | 'grandfather_maternal'
  | 'grandmother_paternal'
  | 'grandmother_maternal'
  | 'son'
  | 'daughter'
  | 'grandson'
  | 'granddaughter'
  | 'daughter_son'
  | 'daughter_daughter'
  | 'daughter_son_son'
  | 'daughter_son_daughter'
  | 'daughter_daughter_son'
  | 'daughter_daughter_daughter'
  | 'brother_full'
  | 'sister_full'
  | 'brother_paternal'
  | 'sister_paternal'
  | 'brother_maternal'
  | 'sister_maternal'
  | 'sister_full_son'
  | 'sister_full_daughter'
  | 'sister_full_son_son'
  | 'sister_full_son_daughter'
  | 'sister_full_daughter_son'
  | 'sister_full_daughter_daughter'
  | 'sister_paternal_son'
  | 'sister_paternal_daughter'
  | 'sister_paternal_son_son'
  | 'sister_paternal_son_daughter'
  | 'sister_paternal_daughter_son'
  | 'sister_paternal_daughter_daughter'
  | 'brother_maternal_son'
  | 'brother_maternal_daughter'
  | 'brother_maternal_son_son'
  | 'brother_maternal_son_daughter'
  | 'brother_maternal_daughter_son'
  | 'brother_maternal_daughter_daughter'
  | 'nephew_full'
  | 'nephew_full_daughter'
  | 'nephew_full_daughter_son'
  | 'nephew_full_daughter_daughter'
  | 'nephew_paternal'
  | 'nephew_paternal_daughter'
  | 'nephew_paternal_daughter_son'
  | 'nephew_paternal_daughter_daughter'
  | 'uncle_paternal_full'
  | 'uncle_paternal_half'
  | 'uncle_maternal'
  | 'uncle_maternal_son'
  | 'uncle_maternal_daughter'
  | 'uncle_maternal_son_son'
  | 'uncle_maternal_son_daughter'
  | 'uncle_maternal_daughter_son'
  | 'uncle_maternal_daughter_daughter'
  | 'aunt_paternal'
  | 'aunt_paternal_son'
  | 'aunt_paternal_daughter'
  | 'aunt_paternal_son_son'
  | 'aunt_paternal_son_daughter'
  | 'aunt_paternal_daughter_son'
  | 'aunt_paternal_daughter_daughter'
  | 'aunt_maternal'
  | 'aunt_maternal_son'
  | 'aunt_maternal_daughter'
  | 'aunt_maternal_son_son'
  | 'aunt_maternal_son_daughter'
  | 'aunt_maternal_daughter_son'
  | 'aunt_maternal_daughter_daughter'
  | 'cousin_paternal_full'
  | 'cousin_paternal_full_daughter'
  | 'cousin_paternal_half'
  | 'cousin_paternal_half_daughter';

export type HeirCategory =
  | 'spouse'
  | 'parent'
  | 'grandparent'
  | 'child'
  | 'grandchild'
  | 'sibling'
  | 'extended'
  | 'zawil_arham';

export type ShareType =
  | 'fard'
  | 'asaba'
  | 'blocked'
  | 'radd'
  | 'zawil_arham';

export type MadhhabKey = 'default' | 'hanafi' | 'maliki' | 'shafii' | 'hanbali';
export type SchoolKey = Exclude<MadhhabKey, 'default'>;
export type RuleReferenceId = string;

export type ImpedimentType = 'murder' | 'religion' | 'slavery' | 'lian';
export type PregnancySexMode = 'unknown' | 'male' | 'female';
export type KhunsaRelationType = 'child' | 'grandchild' | 'full_sibling' | 'paternal_sibling' | 'maternal_sibling';

export interface Fraction {
  numerator: number;
  denominator: number;
}

export interface Heir {
  type: HeirType;
  count: number;
  label: string;
  labelArabic: string;
  gender: 'male' | 'female';
  category: HeirCategory;
  impediments?: Partial<Record<ImpedimentType, number>>;
}

export interface NormalizedHeir extends Heir {}

export interface CaseInput {
  heirs: Heir[];
  deceased: DeceasedInfo;
}

export interface InputSummary {
  deceasedGender: 'male' | 'female';
  heirCount: number;
  hasAdvancedContext: boolean;
}

export interface ExcludedHeirSummary {
  heirType: HeirType;
  label: string;
  originalCount: number;
  excludedCount: number;
  effectiveCount: number;
  impediments: Partial<Record<ImpedimentType, number>>;
}


export type BlockageKind =
  | 'hajb_hirman'
  | 'hajb_nuqsan'
  | 'impediment'
  | 'residue_exhausted'
  | 'dhawu_al_arham_deferred'
  | 'school_specific';

export interface BlockageDetail {
  heirType: HeirType;
  label: string;
  kind: BlockageKind;
  blockedBy: HeirType[];
  explanation: string;
}

export interface CalculationTraceStep {
  stage: 'input' | 'impediments' | 'hajb' | 'furud' | 'asaba' | 'adjustment' | 'special_case' | 'advanced' | 'secondary' | 'output';
  title: string;
  detail: string;
}

export interface RuleContext {
  heirs: Heir[];
  deceased: DeceasedInfo;
  school: SchoolKey;
}

export interface EngineScopeSummary {
  title: string;
  netEstateOnly: boolean;
  schools: Array<Exclude<MadhhabKey, 'default'>>;
  includes: string[];
  notes: string[];
}

export interface ReferenceMatrixEntry {
  id: string;
  topic: string;
  rule: string;
  schools: Array<Exclude<MadhhabKey, 'default'>>;
  tests: string[];
}

export interface SchoolResultSnapshot {
  school: Exclude<MadhhabKey, 'default'>;
  specialCase?: string;
  hasAvl: boolean;
  hasRadd: boolean;
  baseShare: number;
  adjustedBase: number;
  calculationWarnings: string[];
  calculationSteps: string[];
  heirs: Array<{
    heirType: HeirType;
    label: string;
    count: number;
    share: Fraction;
    blocked: boolean;
    note?: string;
  }>;
}

export interface ScenarioGraphNode {
  id: string;
  kind: 'pregnancy' | 'khunsa' | 'mafqud' | 'munasakhat';
  label: string;
  scenario?: AdvancedScenarioSummary | SecondaryDistribution;
}

export interface SpecialCaseMatch {
  id: 'omariyyatayn' | 'mushtaraka' | 'akdariyya' | 'grandfather_siblings';
  label: string;
}
export interface HeirShare {
  heir: Heir;
  originalShare: Fraction;
  adjustedShare: Fraction;
  shareType: ShareType;
  blocked: boolean;
  blockedBy?: HeirType[];
  blockedByNames?: string[];
  amount: number;
  asabaType?: 'binefsihi' | 'bigayrihi' | 'maagayrihi';
  note?: string;
  shareInBase?: number;
  adjustedShareInBase?: number;
}

export interface MadhhabComparisonRow {
  issue: string;
  defaultView: string;
  hanafi: string;
  maliki: string;
  shafii: string;
  hanbali: string;
  relevant?: boolean;
}

export interface MadhhabDistributionRow {
  heirType: HeirType;
  label: string;
  labelArabic: string;
  count: number;
  defaultView: string;
  hanafi: string;
  maliki: string;
  shafii: string;
  hanbali: string;
  fractions?: Partial<Record<MadhhabKey, Fraction>>;
  blockedStates?: Partial<Record<MadhhabKey, boolean>>;
  changedIn?: Partial<Record<MadhhabKey, boolean>>;
  payState?: Partial<Record<MadhhabKey, boolean>>;
  hasAnyPay?: boolean;
}

export interface PregnancyConfig {
  enabled: boolean;
  count: 1 | 2 | 3;
  sexMode: PregnancySexMode;
}

export interface KhunsaConfig {
  enabled: boolean;
  relation: KhunsaRelationType;
  count: number;
}

export interface MafqudConfig {
  enabled: boolean;
  heirType: HeirType | '';
  count: number;
}

export interface MunasakhatConfig {
  enabled: boolean;
  sourceHeirType: HeirType | '';
  deceasedGender: 'male' | 'female';
  extraEstate: number;
  secondaryHeirs: Heir[];
  note: string;
}

export interface AdvancedCaseContext {
  pregnancy: 'none' | 'possible';
  khunsaCount: number;
  mafqudCount: number;
  munasakhatNote: string;
  pregnancyConfig?: PregnancyConfig;
  khunsaConfig?: KhunsaConfig;
  mafqudConfig?: MafqudConfig;
  munasakhatConfig?: MunasakhatConfig;
}

export interface AdvancedHeirGuarantee {
  heirType: HeirType;
  label: string;
  guaranteedShare: Fraction;
  maxPossibleShare: Fraction;
}

export interface AdvancedScenarioAllocation {
  heirType: HeirType;
  label: string;
  count: number;
  groupShare: Fraction;
  perPersonShare: Fraction;
}

export interface AdvancedScenarioSummary {
  label: string;
  scenarioKey?: string;
  reservedShare: Fraction;
  reservedAmount: number;
  note: string;
  allocations: AdvancedScenarioAllocation[];
  secondaryDistribution?: SecondaryDistribution;
}

export interface AdvancedAdjustments {
  active: boolean;
  reservedShare: Fraction;
  reservedAmount: number;
  notes: string[];
  guaranteedHeirs: AdvancedHeirGuarantee[];
  scenarioSummaries: AdvancedScenarioSummary[];
}

export interface SecondaryDistribution {
  sourceHeirType: HeirType;
  sourceHeirLabel: string;
  inheritedAmount: number;
  extraEstate: number;
  totalEstate: number;
  deceasedGender: 'male' | 'female';
  heirs: HeirShare[];
  baseShare: number;
  adjustedBase: number;
  specialCase?: string;
  calculationWarnings: string[];
}

export interface InheritanceResult {
  heirs: HeirShare[];
  totalEstate: number;
  baseShare: number;
  adjustedBase: number;
  hasAvl: boolean;
  hasRadd: boolean;
  specialCase?: string;
  remainingAsaba: Fraction;
  calculationWarnings: string[];
  calculationSteps: string[];
  comparisonRows: MadhhabComparisonRow[];
  madhhabBases: Record<MadhhabKey, number>;
  madhhabDistributionRows: MadhhabDistributionRow[];
  displaySchool: Exclude<MadhhabKey, 'default'>;
  excludedSummaries: ExcludedHeirSummary[];
  tentative: boolean;
  advancedAdjustments?: AdvancedAdjustments;
  munasakhatOutcome?: SecondaryDistribution;
  schoolResults?: Partial<Record<Exclude<MadhhabKey, 'default'>, SchoolResultSnapshot>>;
  blockageDetails?: BlockageDetail[];
  trace?: CalculationTraceStep[];
  engineScope?: EngineScopeSummary;
  referenceMatrix?: ReferenceMatrixEntry[];
  inputSummary?: InputSummary;
  schoolPolicy?: {
    key: SchoolKey;
    label: string;
    displayName: string;
    notes: string[];
    zawilArhamMethod?: 'ahl_al_qaraba' | 'tanzil';
    baitAlMalOperational?: boolean;
    supportedZawilArhamMethods?: Array<'ahl_al_qaraba' | 'tanzil'>;
    supportedBaitAlMalModes?: boolean[];
  };
  scenarioGraph?: ScenarioGraphNode[];
  matchedSpecialCases?: SpecialCaseMatch[];
  resultVersion?: string;
}

export interface DeceasedInfo {
  gender: 'male' | 'female';
  totalEstate: number;
  caseContext?: AdvancedCaseContext;
}

export interface EstateInfo {
  totalEstate: number;
  techizTekfin: number;
  debts: number;
  waspiyet: number;
  netEstate: number;
}

export interface ResultBundle extends InheritanceResult {}

export interface CalculationResult extends ResultBundle {}

export const SHARES = {
  HALF: { numerator: 1, denominator: 2 },
  QUARTER: { numerator: 1, denominator: 4 },
  EIGHTH: { numerator: 1, denominator: 8 },
  TWO_THIRDS: { numerator: 2, denominator: 3 },
  ONE_THIRD: { numerator: 1, denominator: 3 },
  ONE_SIXTH: { numerator: 1, denominator: 6 },
  ZERO: { numerator: 0, denominator: 1 },
  FULL: { numerator: 1, denominator: 1 },
};

export const IMPEDIMENT_LABELS: Record<ImpedimentType, string> = {
  murder: 'Katl',
  religion: 'Din farkı',
  slavery: 'Kölelik',
  lian: 'Liân / nesep engeli',
};

export const KHUNSA_RELATION_LABELS: Record<KhunsaRelationType, string> = {
  child: 'Çocuk',
  grandchild: 'Oğlun çocuğu',
  full_sibling: 'Öz kardeş',
  paternal_sibling: 'Baba bir kardeş',
  maternal_sibling: 'Anne bir kardeş',
};

export const ALL_HEIRS: Omit<Heir, 'count' | 'impediments'>[] = [
  { type: 'husband', label: 'Koca', labelArabic: 'الزوج', gender: 'male', category: 'spouse' },
  { type: 'wife', label: 'Karı', labelArabic: 'الزوجة', gender: 'female', category: 'spouse' },
  { type: 'father', label: 'Baba', labelArabic: 'الأب', gender: 'male', category: 'parent' },
  { type: 'mother', label: 'Anne', labelArabic: 'الأم', gender: 'female', category: 'parent' },
  { type: 'grandfather_paternal', label: 'Dede (Baba tarafı)', labelArabic: 'الجد', gender: 'male', category: 'grandparent' },
  { type: 'grandfather_maternal', label: 'Dede (Anne tarafı)', labelArabic: 'الجد من الأم', gender: 'male', category: 'zawil_arham' },
  { type: 'grandmother_paternal', label: 'Nine (Baba tarafı)', labelArabic: 'الجدة من الأب', gender: 'female', category: 'grandparent' },
  { type: 'grandmother_maternal', label: 'Nine (Anne tarafı)', labelArabic: 'الجدة من الأم', gender: 'female', category: 'grandparent' },
  { type: 'son', label: 'Oğul', labelArabic: 'الابن', gender: 'male', category: 'child' },
  { type: 'daughter', label: 'Kız', labelArabic: 'البنت', gender: 'female', category: 'child' },
  { type: 'grandson', label: 'Oğlun Oğlu', labelArabic: 'ابن الابن', gender: 'male', category: 'grandchild' },
  { type: 'granddaughter', label: 'Oğlun Kızı', labelArabic: 'بنت الابن', gender: 'female', category: 'grandchild' },
  { type: 'daughter_son', label: 'Kızın Oğlu', labelArabic: 'ابن البنت', gender: 'male', category: 'zawil_arham' },
  { type: 'daughter_daughter', label: 'Kızın Kızı', labelArabic: 'بنت البنت', gender: 'female', category: 'zawil_arham' },
  { type: 'daughter_son_son', label: 'Kızın Oğlunun Oğlu', labelArabic: 'ابن ابن البنت', gender: 'male', category: 'zawil_arham' },
  { type: 'daughter_son_daughter', label: 'Kızın Oğlunun Kızı', labelArabic: 'بنت ابن البنت', gender: 'female', category: 'zawil_arham' },
  { type: 'daughter_daughter_son', label: 'Kızın Kızının Oğlu', labelArabic: 'ابن بنت البنت', gender: 'male', category: 'zawil_arham' },
  { type: 'daughter_daughter_daughter', label: 'Kızın Kızının Kızı', labelArabic: 'بنت بنت البنت', gender: 'female', category: 'zawil_arham' },
  { type: 'brother_full', label: 'Öz Erkek Kardeş', labelArabic: 'الأخ الشقيق', gender: 'male', category: 'sibling' },
  { type: 'sister_full', label: 'Öz Kız Kardeş', labelArabic: 'الأخت الشقيقة', gender: 'female', category: 'sibling' },
  { type: 'brother_paternal', label: 'Baba Bir Erkek Kardeş', labelArabic: 'الأخ لأب', gender: 'male', category: 'sibling' },
  { type: 'sister_paternal', label: 'Baba Bir Kız Kardeş', labelArabic: 'الأخت لأب', gender: 'female', category: 'sibling' },
  { type: 'brother_maternal', label: 'Anne Bir Erkek Kardeş', labelArabic: 'الأخ لأم', gender: 'male', category: 'sibling' },
  { type: 'sister_maternal', label: 'Anne Bir Kız Kardeş', labelArabic: 'الأخت لأم', gender: 'female', category: 'sibling' },
  { type: 'sister_full_son', label: 'Öz Kız Kardeşin Oğlu', labelArabic: 'ابن الأخت الشقيقة', gender: 'male', category: 'zawil_arham' },
  { type: 'sister_full_daughter', label: 'Öz Kız Kardeşin Kızı', labelArabic: 'بنت الأخت الشقيقة', gender: 'female', category: 'zawil_arham' },
  { type: 'sister_full_son_son', label: 'Öz Kız Kardeşin Oğlunun Oğlu', labelArabic: 'ابن ابن الأخت الشقيقة', gender: 'male', category: 'zawil_arham' },
  { type: 'sister_full_son_daughter', label: 'Öz Kız Kardeşin Oğlunun Kızı', labelArabic: 'بنت ابن الأخت الشقيقة', gender: 'female', category: 'zawil_arham' },
  { type: 'sister_full_daughter_son', label: 'Öz Kız Kardeşin Kızının Oğlu', labelArabic: 'ابن بنت الأخت الشقيقة', gender: 'male', category: 'zawil_arham' },
  { type: 'sister_full_daughter_daughter', label: 'Öz Kız Kardeşin Kızının Kızı', labelArabic: 'بنت بنت الأخت الشقيقة', gender: 'female', category: 'zawil_arham' },
  { type: 'sister_paternal_son', label: 'Baba Bir Kız Kardeşin Oğlu', labelArabic: 'ابن الأخت لأب', gender: 'male', category: 'zawil_arham' },
  { type: 'sister_paternal_daughter', label: 'Baba Bir Kız Kardeşin Kızı', labelArabic: 'بنت الأخت لأب', gender: 'female', category: 'zawil_arham' },
  { type: 'sister_paternal_son_son', label: 'Baba Bir Kız Kardeşin Oğlunun Oğlu', labelArabic: 'ابن ابن الأخت لأب', gender: 'male', category: 'zawil_arham' },
  { type: 'sister_paternal_son_daughter', label: 'Baba Bir Kız Kardeşin Oğlunun Kızı', labelArabic: 'بنت ابن الأخت لأب', gender: 'female', category: 'zawil_arham' },
  { type: 'sister_paternal_daughter_son', label: 'Baba Bir Kız Kardeşin Kızının Oğlu', labelArabic: 'ابن بنت الأخت لأب', gender: 'male', category: 'zawil_arham' },
  { type: 'sister_paternal_daughter_daughter', label: 'Baba Bir Kız Kardeşin Kızının Kızı', labelArabic: 'بنت بنت الأخت لأب', gender: 'female', category: 'zawil_arham' },
  { type: 'brother_maternal_son', label: 'Anne Bir Kardeşin Oğlu', labelArabic: 'ابن الأخ لأم', gender: 'male', category: 'zawil_arham' },
  { type: 'brother_maternal_daughter', label: 'Anne Bir Kardeşin Kızı', labelArabic: 'بنت الأخ لأم', gender: 'female', category: 'zawil_arham' },
  { type: 'brother_maternal_son_son', label: 'Anne Bir Kardeşin Oğlunun Oğlu', labelArabic: 'ابن ابن الأخ لأم', gender: 'male', category: 'zawil_arham' },
  { type: 'brother_maternal_son_daughter', label: 'Anne Bir Kardeşin Oğlunun Kızı', labelArabic: 'بنت ابن الأخ لأم', gender: 'female', category: 'zawil_arham' },
  { type: 'brother_maternal_daughter_son', label: 'Anne Bir Kardeşin Kızının Oğlu', labelArabic: 'ابن بنت الأخ لأم', gender: 'male', category: 'zawil_arham' },
  { type: 'brother_maternal_daughter_daughter', label: 'Anne Bir Kardeşin Kızının Kızı', labelArabic: 'بنت بنت الأخ لأم', gender: 'female', category: 'zawil_arham' },
  { type: 'nephew_full', label: 'Öz Erkek Kardeşin Oğlu', labelArabic: 'ابن الأخ الشقيق', gender: 'male', category: 'extended' },
  { type: 'nephew_full_daughter', label: 'Öz Erkek Kardeşin Kızı', labelArabic: 'بنت الأخ الشقيق', gender: 'female', category: 'zawil_arham' },
  { type: 'nephew_full_daughter_son', label: 'Öz Erkek Kardeşin Kızının Oğlu', labelArabic: 'ابن بنت الأخ الشقيق', gender: 'male', category: 'zawil_arham' },
  { type: 'nephew_full_daughter_daughter', label: 'Öz Erkek Kardeşin Kızının Kızı', labelArabic: 'بنت بنت الأخ الشقيق', gender: 'female', category: 'zawil_arham' },
  { type: 'nephew_paternal', label: 'Baba Bir Erkek Kardeşin Oğlu', labelArabic: 'ابن الأخ لأب', gender: 'male', category: 'extended' },
  { type: 'nephew_paternal_daughter', label: 'Baba Bir Erkek Kardeşin Kızı', labelArabic: 'بنت الأخ لأب', gender: 'female', category: 'zawil_arham' },
  { type: 'nephew_paternal_daughter_son', label: 'Baba Bir Erkek Kardeşin Kızının Oğlu', labelArabic: 'ابن بنت الأخ لأب', gender: 'male', category: 'zawil_arham' },
  { type: 'nephew_paternal_daughter_daughter', label: 'Baba Bir Erkek Kardeşin Kızının Kızı', labelArabic: 'بنت بنت الأخ لأب', gender: 'female', category: 'zawil_arham' },
  { type: 'uncle_paternal_full', label: 'Öz Amca', labelArabic: 'العم الشقيق', gender: 'male', category: 'extended' },
  { type: 'uncle_paternal_half', label: 'Baba Bir Amca', labelArabic: 'العم لأب', gender: 'male', category: 'extended' },
  { type: 'uncle_maternal', label: 'Dayı', labelArabic: 'الخال', gender: 'male', category: 'zawil_arham' },
  { type: 'uncle_maternal_son', label: 'Dayının Oğlu', labelArabic: 'ابن الخال', gender: 'male', category: 'zawil_arham' },
  { type: 'uncle_maternal_daughter', label: 'Dayının Kızı', labelArabic: 'بنت الخال', gender: 'female', category: 'zawil_arham' },
  { type: 'uncle_maternal_son_son', label: 'Dayının Oğlunun Oğlu', labelArabic: 'ابن ابن الخال', gender: 'male', category: 'zawil_arham' },
  { type: 'uncle_maternal_son_daughter', label: 'Dayının Oğlunun Kızı', labelArabic: 'بنت ابن الخال', gender: 'female', category: 'zawil_arham' },
  { type: 'uncle_maternal_daughter_son', label: 'Dayının Kızının Oğlu', labelArabic: 'ابن بنت الخال', gender: 'male', category: 'zawil_arham' },
  { type: 'uncle_maternal_daughter_daughter', label: 'Dayının Kızının Kızı', labelArabic: 'بنت بنت الخال', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_paternal', label: 'Hala', labelArabic: 'العمة', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_paternal_son', label: 'Halanın Oğlu', labelArabic: 'ابن العمة', gender: 'male', category: 'zawil_arham' },
  { type: 'aunt_paternal_daughter', label: 'Halanın Kızı', labelArabic: 'بنت العمة', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_paternal_son_son', label: 'Halanın Oğlunun Oğlu', labelArabic: 'ابن ابن العمة', gender: 'male', category: 'zawil_arham' },
  { type: 'aunt_paternal_son_daughter', label: 'Halanın Oğlunun Kızı', labelArabic: 'بنت ابن العمة', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_paternal_daughter_son', label: 'Halanın Kızının Oğlu', labelArabic: 'ابن بنت العمة', gender: 'male', category: 'zawil_arham' },
  { type: 'aunt_paternal_daughter_daughter', label: 'Halanın Kızının Kızı', labelArabic: 'بنت بنت العمة', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_maternal', label: 'Teyze', labelArabic: 'الخالة', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_maternal_son', label: 'Teyzenin Oğlu', labelArabic: 'ابن الخالة', gender: 'male', category: 'zawil_arham' },
  { type: 'aunt_maternal_daughter', label: 'Teyzenin Kızı', labelArabic: 'بنت الخالة', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_maternal_son_son', label: 'Teyzenin Oğlunun Oğlu', labelArabic: 'ابن ابن الخالة', gender: 'male', category: 'zawil_arham' },
  { type: 'aunt_maternal_son_daughter', label: 'Teyzenin Oğlunun Kızı', labelArabic: 'بنت ابن الخالة', gender: 'female', category: 'zawil_arham' },
  { type: 'aunt_maternal_daughter_son', label: 'Teyzenin Kızının Oğlu', labelArabic: 'ابن بنت الخالة', gender: 'male', category: 'zawil_arham' },
  { type: 'aunt_maternal_daughter_daughter', label: 'Teyzenin Kızının Kızı', labelArabic: 'بنت بنت الخالة', gender: 'female', category: 'zawil_arham' },
  { type: 'cousin_paternal_full', label: 'Öz Amca Oğlu', labelArabic: 'ابن العم الشقيق', gender: 'male', category: 'extended' },
  { type: 'cousin_paternal_full_daughter', label: 'Öz Amca Kızı', labelArabic: 'بنت العم الشقيق', gender: 'female', category: 'zawil_arham' },
  { type: 'cousin_paternal_half', label: 'Baba Bir Amca Oğlu', labelArabic: 'ابن العم لأب', gender: 'male', category: 'extended' },
  { type: 'cousin_paternal_half_daughter', label: 'Baba Bir Amca Kızı', labelArabic: 'بنت العم لأب', gender: 'female', category: 'zawil_arham' },
];
