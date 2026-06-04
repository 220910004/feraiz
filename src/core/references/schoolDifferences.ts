import { SCHOOL_POLICIES } from '../schools';

export const SCHOOL_DIFFERENCES = Object.values(SCHOOL_POLICIES).map((policy) => ({
  school: policy.key,
  label: policy.label,
  grandfatherWithSiblings: policy.grandfatherWithSiblings,
  mushtaraka: policy.mushtaraka,
  akdariyya: policy.akdariyya,
  zawilArhamMethod: policy.zawilArhamMethod,
  baitAlMalOperationalByDefault: policy.baitAlMalOperationalByDefault,
  notes: policy.notes,
}));
