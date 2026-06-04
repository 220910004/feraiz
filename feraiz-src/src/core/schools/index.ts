import type { SchoolPolicy, SchoolKey } from './common';
import { hanafiPolicy } from './hanafi';
import { malikiPolicy } from './maliki';
import { shafiiPolicy } from './shafii';
import { hanbaliPolicy } from './hanbali';

export const SCHOOL_POLICIES: Record<SchoolKey, SchoolPolicy> = {
  hanafi: hanafiPolicy,
  maliki: malikiPolicy,
  shafii: shafiiPolicy,
  hanbali: hanbaliPolicy,
};

export function getSchoolPolicy(school: SchoolKey): SchoolPolicy {
  return SCHOOL_POLICIES[school];
}
