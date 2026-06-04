import type { SchoolPolicy } from './common';

export const hanbaliPolicy: SchoolPolicy = {
  key: 'hanbali',
  label: 'Hanbelî',
  displayName: 'Hanbelî',
  grandfatherWithSiblings: 'compete_with_siblings',
  mushtaraka: 'exclude_full_siblings',
  akdariyya: 'jumhur_special_case',
  raddIncludesSpouses: false,
  zawilArhamMethod: 'ahl_al_qaraba',
  baitAlMalOperationalByDefault: false,
  supportedZawilArhamMethods: ['ahl_al_qaraba'],
  supportedBaitAlMalModes: [false],
  notes: [
    'Dede ve kardeşler hattında cumhura yakın özel hesap yolları korunur.',
    'Müşerrike için Hanbelî çizgi çoğunlukla anne-bir kardeşleri esas alır.',
    'Zevi’l-erhâmda fiilen kullanılan çizgi ahl al-qarâba yaklaşımıdır.',
  ],
};
