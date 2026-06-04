import { MadhhabKey } from '../types/inheritance';

export interface EngineScopeDefinition {
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

export const ENGINE_SCOPE: EngineScopeDefinition = {
  title: 'Net tereke üzerinden Sünnî faraid motoru',
  netEstateOnly: true,
  schools: ['hanafi', 'maliki', 'shafii', 'hanbali'],
  includes: [
    'ashab al-furud',
    'asaba',
    'hajb',
    'awl',
    'radd',
    'dede-kardeşler babı',
    'müşerrike',
    'akdariyye',
    'dhawu al-arham',
    'impediments',
    'haml',
    'khunsa',
    'mafqud',
    'munasakhat',
  ],
  notes: [
    'Motor net tereke üzerinden hesap yapar; techiz-tekfin, borç ve geçerli vasiyet kullanıcı tarafından önceden düşülmüş olmalıdır.',
    'Ana görünüm varsayılan olarak Hanefî çizgiyi gösterir; karşılaştırma kartları aynı girdiyi dört mezhep için yeniden çalıştırır.',
    'Haml, khunsa ve mafqud durumlarında sistem güvenli dağıtım ve senaryo ayrıntılarını birlikte üretir.',
  ],
};

export const REFERENCE_MATRIX: ReferenceMatrixEntry[] = [
  { id: 'SP-01', topic: 'Spouse shares', rule: 'Spouse shares change when descendants exist.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['husband+daughter', 'wife+daughter'] },
  { id: 'PA-01', topic: 'Parents', rule: 'Mother drops to one sixth with descendants or multiple siblings.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['mother+2siblings+father', 'daughter+mother'] },
  { id: 'PA-02', topic: 'Umariyyatayn', rule: 'Mother takes one third of the residue in the two Umariyyatayn cases.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['husband+mother+father', 'wife+mother+father'] },
  { id: 'FD-01', topic: 'Father / grandfather with daughters', rule: 'Father or paternal grandfather takes one sixth plus residue with only female descendants.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['daughter+father', '2daughters+father+mother', 'daughter+grandfather'] },
  { id: 'SI-01', topic: 'Full and paternal sisters', rule: 'Full sisters become asaba with daughters; paternal sisters may complete two thirds with one full sister.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['daughter+full_sister', 'full_sister+paternal_sister'] },
  { id: 'MS-01', topic: 'Maternal siblings', rule: 'Maternal siblings inherit only when no descendants or male ascendant exists.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['mother+maternal_siblings+father'] },
  { id: 'GM-01', topic: 'Grandmothers', rule: 'Active grandmothers share one sixth collectively.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['daughter+2grandmothers'] },
  { id: 'AW-01', topic: 'Awl', rule: 'When fixed shares exceed the estate, the denominator is raised proportionally.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['husband+mother+2daughters', 'husband+mother+2full_sisters'] },
  { id: 'RD-01', topic: 'Radd', rule: 'Remainder returns to non-spouse sharers when no residuary exists.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['mother+daughter', 'wife+daughter'] },
  { id: 'GS-01', topic: 'Grandfather and siblings', rule: 'Paternal grandfather versus siblings is school-sensitive and is solved in its own branch.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['akdariyya', 'grandfather+siblings'] },
  { id: 'SC-01', topic: 'Musharrika', rule: 'Maternal siblings and full siblings differ by school in Himariyya.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['musharrika'] },
  { id: 'SC-02', topic: 'Akdariyya', rule: 'Akdariyya is solved explicitly for Hanafi and jumhur branches.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['akdariyya'] },
  { id: 'ZA-01', topic: 'Dhawu al-Arham', rule: 'Dhawu al-Arham are considered only after closer sharers and agnates are exhausted.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['daughter_son+uncle_maternal', 'aunt_paternal+uncle_maternal'] },
  { id: 'IM-01', topic: 'Impediments', rule: 'Impeded persons are numerically excluded before effective heirs are evaluated.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['killer_son', 'religion_barrier'] },
  { id: 'AD-01', topic: 'Pregnancy / khunsa / mafqud', rule: 'Advanced uncertain cases are resolved through safe-share scenario synthesis.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['pregnancy_male_female', 'khunsa_child', 'mafqud_sibling'] },
  { id: 'MN-01', topic: 'Munasakhat', rule: 'Secondary estates are calculated from inherited shares and may be chained.', schools: ['hanafi', 'maliki', 'shafii', 'hanbali'], tests: ['munasakhat_two_sons'] },
];
