import type { SchoolPolicy } from './common';

export const shafiiPolicy: SchoolPolicy = {
  key: 'shafii',
  label: 'Şâfiî',
  displayName: 'Şâfiî',
  grandfatherWithSiblings: 'compete_with_siblings',
  mushtaraka: 'share_with_full_siblings',
  akdariyya: 'jumhur_special_case',
  raddIncludesSpouses: false,
  zawilArhamMethod: 'tanzil',
  baitAlMalOperationalByDefault: true,
  supportedZawilArhamMethods: ['tanzil'],
  supportedBaitAlMalModes: [true, false],
  notes: [
    'Dede ile kardeşler birlikte bulunduğunda muqāsama, sülüs ve südüs eksenli özel hesap gerekir.',
    'Akdariyye ve Müşerrike Şâfiî çizgide özel mesele olarak sürer.',
    'Zevi’l-erhâmda yaşayan uygulamada tanzîl yöntemi, beytülmâl aktif/pasif kabulüne göre sonuç üretir.',
  ],
};
