// Tereke (Miras) ve Kesintiler
export interface EstateData {
  totalEstate: number;           // Toplam Tereke
  techizTekfin: number;          // Techiz-Tekfin Masrafları
  debts: number;                 // Borçlar
  waspiyet: number;              // Vasiyet
  maxWasiyetPercent: number;     // Max vasiyet oranı (varsayılan 1/3)
  netEstate: number;             // Net Miras (Dağıtılacak)
}

export interface DeductionItem {
  id: string;
  name: string;
  nameAr: string;
  amount: number;
  description: string;
  order: number;
}

export const defaultEstateData: EstateData = {
  totalEstate: 0,
  techizTekfin: 0,
  debts: 0,
  waspiyet: 0,
  maxWasiyetPercent: 33.33,
  netEstate: 0
};

export function calculateNetEstate(data: EstateData): { netEstate: number; wasiyetWarning: string | null; breakdown: DeductionItem[] } {
  const { totalEstate, techizTekfin, debts, waspiyet } = data;
  
  // 1. Önce techiz-tekfin düşülür
  const afterTechiz = Math.max(0, totalEstate - techizTekfin);
  
  // 2. Sonra borçlar düşülür
  const afterDebts = Math.max(0, afterTechiz - debts);
  
  // 3. Vasiyet en fazla 1/3 olabilir
  const maxWasiyet = afterDebts / 3;
  let actualWasiyet = waspiyet;
  let wasiyetWarning: string | null = null;
  
  if (waspiyet > maxWasiyet) {
    actualWasiyet = maxWasiyet;
    wasiyetWarning = `Vasiyet tutarı terekenin 1/3'ünü (${maxWasiyet.toLocaleString('tr-TR')} ₺) aşamaz. Otomatik olarak 1/3'e indirildi.`;
  }
  
  // 4. Net miras hesaplanır
  const netEstate = Math.max(0, afterDebts - actualWasiyet);
  
  const breakdown: DeductionItem[] = [
    {
      id: 'total',
      name: 'Toplam Tereke',
      nameAr: 'إجمالي التركة',
      amount: totalEstate,
      description: 'Miras bırakanın toplam mal varlığı',
      order: 0
    },
    {
      id: 'techiz',
      name: 'Techiz-Tekfin',
      nameAr: 'تجهيز وتكفين',
      amount: techizTekfin,
      description: 'Cenaze masrafları (yıkama, kefenleme, defin)',
      order: 1
    },
    {
      id: 'debts',
      name: 'Borçlar',
      nameAr: 'الديون',
      amount: debts,
      description: 'Miras bırakanın borçları',
      order: 2
    },
    {
      id: 'wasiyet',
      name: 'Vasiyet',
      nameAr: 'الوصية',
      amount: actualWasiyet,
      description: wasiyetWarning ? `En fazla 1/3 (${maxWasiyet.toLocaleString('tr-TR')} ₺)` : 'Mirasçı olmayanlara vasiyet',
      order: 3
    },
    {
      id: 'net',
      name: 'Net Miras',
      nameAr: 'صافي التركة',
      amount: netEstate,
      description: 'Mirasçılara dağıtılacak miktar',
      order: 4
    }
  ];
  
  return { netEstate, wasiyetWarning, breakdown };
}
