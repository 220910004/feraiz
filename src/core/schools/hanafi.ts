import type { SchoolPolicy } from './common';

export const hanafiPolicy: SchoolPolicy = {
  key: 'hanafi',
  label: 'Hanefî',
  displayName: 'Hanefî',
  grandfatherWithSiblings: 'exclude_siblings',
  mushtaraka: 'exclude_full_siblings',
  akdariyya: 'hanafi_block_sister',
  raddIncludesSpouses: false,
  zawilArhamMethod: 'ahl_al_qaraba',
  baitAlMalOperationalByDefault: false,
  supportedZawilArhamMethods: ['ahl_al_qaraba'],
  supportedBaitAlMalModes: [false],
  notes: [
    'Dede, baba bulunmadığında çoğu vakada kardeşleri düşüren daha güçlü usûl olarak ele alınır.',
    'Müşerrike meselesinde öz kardeşler anne-bir kardeşlerin payına ortak edilmez.',
    'Zevi’l-erhâm dağıtımında fiilen kullanılan esas çizgi ahl al-qarâba yöntemidir.',
  ],
};
