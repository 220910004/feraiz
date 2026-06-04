import type { SchoolPolicy } from './common';

export const malikiPolicy: SchoolPolicy = {
  key: 'maliki',
  label: 'Mâlikî',
  displayName: 'Mâlikî',
  grandfatherWithSiblings: 'compete_with_siblings',
  mushtaraka: 'share_with_full_siblings',
  akdariyya: 'jumhur_special_case',
  raddIncludesSpouses: false,
  zawilArhamMethod: 'tanzil',
  baitAlMalOperationalByDefault: true,
  supportedZawilArhamMethods: ['tanzil'],
  supportedBaitAlMalModes: [true, false],
  notes: [
    'Dede ile kardeşler babında cumhur çizgisine yakın özel hesaplar uygulanır.',
    'Müşerrike ve Akdariyye gibi meseleler bağımsız özel çözüm gerektirir.',
    'Zevi’l-erhâm babında yaşayan uygulamada tanzîl yöntemi, beytülmâl aktif/pasif ayrımıyla birlikte değerlendirilir.',
  ],
};
