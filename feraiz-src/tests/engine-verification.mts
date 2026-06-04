import assert from 'node:assert/strict';
import { calculateCase } from '../src/core/engine/calculateCase.ts';
import { ALL_HEIRS, Fraction, HeirType } from '../src/types/inheritance.ts';

const mk = (type: HeirType, count = 1, impediments?: Record<string, number>) => {
  const base = ALL_HEIRS.find((h) => h.type === type);
  if (!base) throw new Error(`Missing heir template: ${type}`);
  return { ...base, count, impediments };
};

const frac = (n: number, d: number): Fraction => ({ numerator: n, denominator: d });
const same = (a: Fraction | undefined, b: Fraction) => !!a && a.numerator === b.numerator && a.denominator === b.denominator;
const get = (res: ReturnType<typeof calculateCase>, type: HeirType) => res.heirs.find((row) => row.heir.type === type);

const run = (name: string, fn: () => void) => {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
};

run('01 daughter + father', () => {
  const res = calculateCase({ heirs: [mk('daughter'), mk('father')], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'daughter')?.adjustedShare, frac(1, 2)));
  assert(same(get(res, 'father')?.adjustedShare, frac(1, 2)));
});

run('02 two daughters + mother + father', () => {
  const res = calculateCase({ heirs: [mk('daughter', 2), mk('mother'), mk('father')], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'father')?.adjustedShare, frac(1, 6)));
  assert(same(get(res, 'mother')?.adjustedShare, frac(1, 6)));
});

run('03 husband + mother + father', () => {
  const res = calculateCase({ heirs: [mk('husband'), mk('mother'), mk('father')], deceased: { gender: 'female', totalEstate: 1 } });
  assert(same(get(res, 'husband')?.adjustedShare, frac(1, 2)));
  assert(same(get(res, 'mother')?.adjustedShare, frac(1, 6)));
  assert(same(get(res, 'father')?.adjustedShare, frac(1, 3)));
});

run('04 wife + mother + father', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('mother'), mk('father')], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'wife')?.adjustedShare, frac(1, 4)));
  assert(same(get(res, 'mother')?.adjustedShare, frac(1, 4)));
  assert(same(get(res, 'father')?.adjustedShare, frac(1, 2)));
});

run('05 awl case husband + mother + two daughters', () => {
  const res = calculateCase({ heirs: [mk('husband'), mk('mother'), mk('daughter', 2)], deceased: { gender: 'female', totalEstate: 1 } });
  assert.equal(res.hasAvl, true);
  assert.equal(res.adjustedBase, 13);
  assert(same(get(res, 'husband')?.adjustedShare, frac(3, 13)));
});

run('06 radd case wife + daughter', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('daughter')], deceased: { gender: 'male', totalEstate: 1 } });
  assert.equal(res.hasRadd, true);
  assert(same(get(res, 'wife')?.adjustedShare, frac(1, 8)));
  assert(same(get(res, 'daughter')?.adjustedShare, frac(7, 8)));
});

run('07 radd case mother + daughter', () => {
  const res = calculateCase({ heirs: [mk('mother'), mk('daughter')], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'mother')?.adjustedShare, frac(1, 4)));
  assert(same(get(res, 'daughter')?.adjustedShare, frac(3, 4)));
});

run('08 son + daughter ratio', () => {
  const res = calculateCase({ heirs: [mk('son'), mk('daughter')], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'son')?.adjustedShare, frac(2, 3)));
  assert(same(get(res, 'daughter')?.adjustedShare, frac(1, 3)));
});

run('09 daughter + full sister', () => {
  const res = calculateCase({ heirs: [mk('daughter'), mk('sister_full')], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'daughter')?.adjustedShare, frac(1, 2)));
  assert(same(get(res, 'sister_full')?.adjustedShare, frac(1, 2)));
});

run('10 full brother blocks paternal sister', () => {
  const res = calculateCase({ heirs: [mk('brother_full'), mk('sister_paternal')], deceased: { gender: 'male', totalEstate: 1 } });
  assert.equal(get(res, 'sister_paternal')?.blocked, true);
  assert(same(get(res, 'brother_full')?.adjustedShare, frac(1, 1)));
});

run('11 maternal siblings blocked by father', () => {
  const res = calculateCase({ heirs: [mk('mother'), mk('brother_maternal'), mk('sister_maternal'), mk('father')], deceased: { gender: 'male', totalEstate: 1 } });
  assert.equal(get(res, 'brother_maternal')?.blocked, true);
  assert.equal(get(res, 'sister_maternal')?.blocked, true);
  assert(same(get(res, 'mother')?.adjustedShare, frac(1, 6)));
});

run('12 two grandmothers share collectively', () => {
  const res = calculateCase({ heirs: [mk('daughter'), mk('grandmother_maternal'), mk('grandmother_paternal')], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'daughter')?.adjustedShare, frac(3, 4)));
  assert(same(get(res, 'grandmother_maternal')?.adjustedShare, frac(1, 8)));
  assert(same(get(res, 'grandmother_paternal')?.adjustedShare, frac(1, 8)));
});

run('13 wife + father + two daughters', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('father'), mk('daughter', 2)], deceased: { gender: 'male', totalEstate: 1 } });
  assert(same(get(res, 'wife')?.adjustedShare, frac(1, 8)));
  assert(same(get(res, 'father')?.adjustedShare, frac(5, 24)));
});

run('14 Akdariyya Hanafi branch', () => {
  const res = calculateCase({ heirs: [mk('husband'), mk('mother'), mk('grandfather_paternal'), mk('sister_full')], deceased: { gender: 'male', totalEstate: 1 } }, 'hanafi');
  assert.equal(res.displaySchool, 'hanafi');
  assert(same(get(res, 'mother')?.adjustedShare, frac(1, 3)));
  assert(same(get(res, 'grandfather_paternal')?.adjustedShare, frac(1, 6)));
  assert.equal(get(res, 'sister_full')?.blocked, true);
});

run('15 Musharrika Hanafi branch', () => {
  const res = calculateCase({ heirs: [mk('husband'), mk('mother'), mk('brother_maternal', 2), mk('brother_full')], deceased: { gender: 'male', totalEstate: 1 } }, 'hanafi');
  assert(same(get(res, 'husband')?.adjustedShare, frac(1, 2)));
  assert(same(get(res, 'mother')?.adjustedShare, frac(1, 6)));
  assert.equal(get(res, 'brother_full')?.blocked, true);
});

run('16 Musharrika Maliki branch gives full siblings a share', () => {
  const res = calculateCase({ heirs: [mk('husband'), mk('mother'), mk('brother_maternal', 2), mk('brother_full')], deceased: { gender: 'male', totalEstate: 1 } }, 'maliki');
  assert.equal(get(res, 'brother_full')?.blocked, false);
  assert(same(get(res, 'brother_full')?.adjustedShare, frac(1, 9)));
});

run('17 impediment exclusion', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('son', 1, { murder: 1 }), mk('daughter')], deceased: { gender: 'male', totalEstate: 1 } });
  assert.equal(res.excludedSummaries.length, 1);
  assert(same(get(res, 'daughter')?.adjustedShare, frac(7, 8)));
});

run('18 pregnancy scenarios', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('father')], deceased: {
    gender: 'male',
    totalEstate: 1,
    caseContext: { pregnancy: 'possible', khunsaCount: 0, mafqudCount: 0, munasakhatNote: '', pregnancyConfig: { enabled: true, count: 1, sexMode: 'unknown' } },
  } });
  assert.equal(res.tentative, true);
  assert.equal(res.advancedAdjustments?.scenarioSummaries.length, 2);
});

run('19 khunsa scenarios', () => {
  const res = calculateCase({ heirs: [mk('mother')], deceased: {
    gender: 'male',
    totalEstate: 1,
    caseContext: { pregnancy: 'none', khunsaCount: 1, mafqudCount: 0, munasakhatNote: '', khunsaConfig: { enabled: true, relation: 'child', count: 1 } },
  } });
  assert.equal(res.tentative, true);
  assert.ok((res.advancedAdjustments?.scenarioSummaries.length || 0) >= 2);
});

run('20 mafqud scenarios', () => {
  const res = calculateCase({ heirs: [mk('mother')], deceased: {
    gender: 'male',
    totalEstate: 1,
    caseContext: { pregnancy: 'none', khunsaCount: 0, mafqudCount: 1, munasakhatNote: '', mafqudConfig: { enabled: true, heirType: 'brother_full', count: 1 } },
  } });
  assert.equal(res.tentative, true);
  assert.ok((res.advancedAdjustments?.scenarioSummaries.length || 0) >= 2);
});

run('21 munasakhat preserves two sons', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('son', 2)], deceased: {
    gender: 'male',
    totalEstate: 1,
    caseContext: {
      pregnancy: 'none',
      khunsaCount: 0,
      mafqudCount: 0,
      munasakhatNote: '',
      munasakhatConfig: { enabled: true, sourceHeirType: 'wife', deceasedGender: 'female', extraEstate: 0, secondaryHeirs: [mk('son', 2)], note: '' },
    },
  } });
  assert.equal(res.munasakhatOutcome?.heirs.find((row) => row.heir.type === 'son')?.heir.count, 2);
});

run('22 dhawu al-arham deferred by closer sharer', () => {
  const res = calculateCase({ heirs: [mk('daughter'), mk('uncle_maternal')], deceased: { gender: 'male', totalEstate: 1 } });
  assert.equal(get(res, 'uncle_maternal')?.blocked, true);
});

run('23 school result bundle is attached', () => {
  const res = calculateCase({ heirs: [mk('husband'), mk('mother'), mk('grandfather_paternal'), mk('sister_full')], deceased: { gender: 'male', totalEstate: 1 } });
  assert.ok(res.schoolResults?.hanafi);
  assert.ok(res.schoolResults?.maliki);
  assert.ok(res.madhhabDistributionRows.length > 0);
});

run('24 trace, scope and reference matrix are attached', () => {
  const res = calculateCase({ heirs: [mk('daughter'), mk('father')], deceased: { gender: 'male', totalEstate: 1 } });
  assert.ok((res.trace?.length || 0) > 0);
  assert.ok((res.referenceMatrix?.length || 0) > 0);
  assert.equal(res.engineScope?.netEstateOnly, true);
});


run('25 selected school is reflected in output policy', () => {
  const res = calculateCase({ heirs: [mk('husband'), mk('mother'), mk('brother_maternal', 2), mk('brother_full')], deceased: { gender: 'male', totalEstate: 1 } }, 'maliki');
  assert.equal(res.displaySchool, 'maliki');
  assert.equal(res.schoolPolicy?.key, 'maliki');
});

run('26 shafii default treats spouse-only residue as beytulmal when dhawu al-arham are present', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('uncle_maternal')], deceased: { gender: 'male', totalEstate: 1 } }, 'shafii');
  assert.equal(get(res, 'uncle_maternal')?.blocked, true);
  assert.equal(res.schoolPolicy?.baitAlMalOperational, true);
});

run('27 shafii can be switched to dhawu al-arham distribution when beytulmal is disabled', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('uncle_maternal')], deceased: { gender: 'male', totalEstate: 1 } }, 'shafii', { baitAlMalOperational: false });
  assert.equal(get(res, 'uncle_maternal')?.blocked, false);
  assert.equal((get(res, 'uncle_maternal')?.adjustedShare.numerator || 0) > 0, true);
});

run('28 hanafi ahl al-qaraba keeps nearest dhawu al-arham branch active', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('daughter_son'), mk('aunt_maternal')], deceased: { gender: 'male', totalEstate: 1 } }, 'hanafi');
  assert.equal(get(res, 'daughter_son')?.blocked, false);
  assert.equal(get(res, 'aunt_maternal')?.blocked, true);
});

run('29 unsupported zawil method is ignored for Hanafi and defaults to ahl al-qaraba', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('daughter_son'), mk('aunt_maternal')], deceased: { gender: 'male', totalEstate: 1 } }, 'hanafi', { zawilArhamMethod: 'tanzil' });
  assert.equal(res.schoolPolicy?.zawilArhamMethod, 'ahl_al_qaraba');
});

run('30 newly added rare dhawu al-arham branch is selectable and can receive a share', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('nephew_full_daughter')], deceased: { gender: 'male', totalEstate: 1 } }, 'hanafi');
  assert.equal(get(res, 'nephew_full_daughter')?.blocked, false);
  assert.equal((get(res, 'nephew_full_daughter')?.adjustedShare.numerator || 0) > 0, true);
});

run('31 remote maternal uncle branch can be processed without crashing', () => {
  const res = calculateCase({ heirs: [mk('wife'), mk('uncle_maternal_son_son')], deceased: { gender: 'male', totalEstate: 1 } }, 'hanafi');
  assert.ok(get(res, 'uncle_maternal_son_son'));
});
