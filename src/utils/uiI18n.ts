import { ALL_HEIRS, HeirType, ImpedimentType, KhunsaRelationType } from '../types/inheritance';

export type UiLanguage = 'tr' | 'en' | 'de' | 'es' | 'ar';

export const HEIR_LABELS: Record<UiLanguage, Partial<Record<HeirType, string>>> = {
  tr: {
    husband: 'Koca', wife: 'Eş', father: 'Baba', mother: 'Anne', grandfather_paternal: 'Dede (baba tarafı)', grandfather_maternal: 'Dede (anne tarafı)', grandmother_paternal: 'Nine (baba tarafı)', grandmother_maternal: 'Nine (anne tarafı)', son: 'Oğul', daughter: 'Kız', grandson: 'Oğlun oğlu', granddaughter: 'Oğlun kızı', daughter_son: 'Kızın oğlu', daughter_daughter: 'Kızın kızı', brother_full: 'Öz erkek kardeş', sister_full: 'Öz kız kardeş', brother_paternal: 'Baba bir erkek kardeş', sister_paternal: 'Baba bir kız kardeş', brother_maternal: 'Anne bir erkek kardeş', sister_maternal: 'Anne bir kız kardeş', sister_full_son: 'Öz kız kardeşin oğlu', sister_full_daughter: 'Öz kız kardeşin kızı', sister_paternal_son: 'Baba bir kız kardeşin oğlu', sister_paternal_daughter: 'Baba bir kız kardeşin kızı', brother_maternal_son: 'Anne bir kardeşin oğlu', brother_maternal_daughter: 'Anne bir kardeşin kızı', nephew_full: 'Öz erkek kardeşin oğlu', nephew_paternal: 'Baba bir erkek kardeşin oğlu', uncle_paternal_full: 'Öz amca', uncle_paternal_half: 'Baba bir amca', uncle_maternal: 'Dayı', aunt_paternal: 'Hala', aunt_maternal: 'Teyze', cousin_paternal_full: 'Öz amca oğlu', cousin_paternal_half: 'Baba bir amca oğlu', daughter_son_son: 'Kızın oğlunun oğlu', daughter_son_daughter: 'Kızın oğlunun kızı', daughter_daughter_son: 'Kızın kızının oğlu', daughter_daughter_daughter: 'Kızın kızının kızı', sister_full_son_son: 'Öz kız kardeşin oğlunun oğlu', sister_full_son_daughter: 'Öz kız kardeşin oğlunun kızı', sister_full_daughter_son: 'Öz kız kardeşin kızının oğlu', sister_full_daughter_daughter: 'Öz kız kardeşin kızının kızı', sister_paternal_son_son: 'Baba bir kız kardeşin oğlunun oğlu', sister_paternal_son_daughter: 'Baba bir kız kardeşin oğlunun kızı', sister_paternal_daughter_son: 'Baba bir kız kardeşin kızının oğlu', sister_paternal_daughter_daughter: 'Baba bir kız kardeşin kızının kızı', brother_maternal_son_son: 'Anne bir kardeşin oğlunun oğlu', brother_maternal_son_daughter: 'Anne bir kardeşin oğlunun kızı', brother_maternal_daughter_son: 'Anne bir kardeşin kızının oğlu', brother_maternal_daughter_daughter: 'Anne bir kardeşin kızının kızı', uncle_maternal_son: 'Dayının oğlu', uncle_maternal_daughter: 'Dayının kızı', aunt_paternal_son: 'Halanın oğlu', aunt_paternal_daughter: 'Halanın kızı', aunt_maternal_son: 'Teyzenin oğlu', aunt_maternal_daughter: 'Teyzenin kızı',
  },
  en: {
    husband: 'Husband', wife: 'Wife / Wives', father: 'Father', mother: 'Mother', grandfather_paternal: 'Paternal grandfather', grandfather_maternal: 'Maternal grandfather', grandmother_paternal: 'Paternal grandmother', grandmother_maternal: 'Maternal grandmother', son: 'Son', daughter: 'Daughter', grandson: 'Son\'s son', granddaughter: 'Son\'s daughter', daughter_son: 'Daughter\'s son', daughter_daughter: 'Daughter\'s daughter', brother_full: 'Full brother', sister_full: 'Full sister', brother_paternal: 'Paternal half-brother', sister_paternal: 'Paternal half-sister', brother_maternal: 'Maternal half-brother', sister_maternal: 'Maternal half-sister', sister_full_son: 'Son of full sister', sister_full_daughter: 'Daughter of full sister', sister_paternal_son: 'Son of paternal half-sister', sister_paternal_daughter: 'Daughter of paternal half-sister', brother_maternal_son: 'Son of maternal sibling', brother_maternal_daughter: 'Daughter of maternal sibling', nephew_full: 'Son of full brother', nephew_paternal: 'Son of paternal half-brother', uncle_paternal_full: 'Full paternal uncle', uncle_paternal_half: 'Paternal half-uncle', uncle_maternal: 'Maternal uncle', aunt_paternal: 'Paternal aunt', aunt_maternal: 'Maternal aunt', cousin_paternal_full: 'Son of full paternal uncle', cousin_paternal_half: 'Son of paternal half-uncle', daughter_son_son: 'Son of daughter\'s son', daughter_son_daughter: 'Daughter of daughter\'s son', daughter_daughter_son: 'Son of daughter\'s daughter', daughter_daughter_daughter: 'Daughter of daughter\'s daughter', sister_full_son_son: 'Son of full sister\'s son', sister_full_son_daughter: 'Daughter of full sister\'s son', sister_full_daughter_son: 'Son of full sister\'s daughter', sister_full_daughter_daughter: 'Daughter of full sister\'s daughter', sister_paternal_son_son: 'Son of paternal half-sister\'s son', sister_paternal_son_daughter: 'Daughter of paternal half-sister\'s son', sister_paternal_daughter_son: 'Son of paternal half-sister\'s daughter', sister_paternal_daughter_daughter: 'Daughter of paternal half-sister\'s daughter', brother_maternal_son_son: 'Son of maternal sibling\'s son', brother_maternal_son_daughter: 'Daughter of maternal sibling\'s son', brother_maternal_daughter_son: 'Son of maternal sibling\'s daughter', brother_maternal_daughter_daughter: 'Daughter of maternal sibling\'s daughter', uncle_maternal_son: 'Son of maternal uncle', uncle_maternal_daughter: 'Daughter of maternal uncle', aunt_paternal_son: 'Son of paternal aunt', aunt_paternal_daughter: 'Daughter of paternal aunt', aunt_maternal_son: 'Son of maternal aunt', aunt_maternal_daughter: 'Daughter of maternal aunt',
  },
  de: {
    husband: 'Ehemann', wife: 'Ehefrau / Ehefrauen', father: 'Vater', mother: 'Mutter', grandfather_paternal: 'Großvater väterlicherseits', grandfather_maternal: 'Großvater mütterlicherseits', grandmother_paternal: 'Großmutter väterlicherseits', grandmother_maternal: 'Großmutter mütterlicherseits', son: 'Sohn', daughter: 'Tochter', grandson: 'Sohn des Sohnes', granddaughter: 'Tochter des Sohnes', daughter_son: 'Sohn der Tochter', daughter_daughter: 'Tochter der Tochter', brother_full: 'Vollbruder', sister_full: 'Vollschwester', brother_paternal: 'Halbbruder väterlicherseits', sister_paternal: 'Halbschwester väterlicherseits', brother_maternal: 'Halbbruder mütterlicherseits', sister_maternal: 'Halbschwester mütterlicherseits', sister_full_son: 'Sohn der Vollschwester', sister_full_daughter: 'Tochter der Vollschwester', sister_paternal_son: 'Sohn der väterlichen Halbschwester', sister_paternal_daughter: 'Tochter der väterlichen Halbschwester', brother_maternal_son: 'Sohn eines mütterlichen Geschwisters', brother_maternal_daughter: 'Tochter eines mütterlichen Geschwisters', nephew_full: 'Sohn des Vollbruders', nephew_paternal: 'Sohn des väterlichen Halbbruders', uncle_paternal_full: 'Vollonkel väterlicherseits', uncle_paternal_half: 'Halbonkel väterlicherseits', uncle_maternal: 'Onkel mütterlicherseits', aunt_paternal: 'Tante väterlicherseits', aunt_maternal: 'Tante mütterlicherseits', cousin_paternal_full: 'Sohn des Vollonkels väterlicherseits', cousin_paternal_half: 'Sohn des Halbonkels väterlicherseits', daughter_son_son: 'Sohn des Sohnes der Tochter', daughter_son_daughter: 'Tochter des Sohnes der Tochter', daughter_daughter_son: 'Sohn der Tochter der Tochter', daughter_daughter_daughter: 'Tochter der Tochter der Tochter', sister_full_son_son: 'Sohn des Sohnes der Vollschwester', sister_full_son_daughter: 'Tochter des Sohnes der Vollschwester', sister_full_daughter_son: 'Sohn der Tochter der Vollschwester', sister_full_daughter_daughter: 'Tochter der Tochter der Vollschwester', sister_paternal_son_son: 'Sohn des Sohnes der väterlichen Halbschwester', sister_paternal_son_daughter: 'Tochter des Sohnes der väterlichen Halbschwester', sister_paternal_daughter_son: 'Sohn der Tochter der väterlichen Halbschwester', sister_paternal_daughter_daughter: 'Tochter der Tochter der väterlichen Halbschwester', brother_maternal_son_son: 'Sohn des Sohnes eines mütterlichen Geschwisters', brother_maternal_son_daughter: 'Tochter des Sohnes eines mütterlichen Geschwisters', brother_maternal_daughter_son: 'Sohn der Tochter eines mütterlichen Geschwisters', brother_maternal_daughter_daughter: 'Tochter der Tochter eines mütterlichen Geschwisters', uncle_maternal_son: 'Sohn des Onkels mütterlicherseits', uncle_maternal_daughter: 'Tochter des Onkels mütterlicherseits', aunt_paternal_son: 'Sohn der Tante väterlicherseits', aunt_paternal_daughter: 'Tochter der Tante väterlicherseits', aunt_maternal_son: 'Sohn der Tante mütterlicherseits', aunt_maternal_daughter: 'Tochter der Tante mütterlicherseits',
  },
  es: {
    husband: 'Esposo', wife: 'Esposa / esposas', father: 'Padre', mother: 'Madre', grandfather_paternal: 'Abuelo paterno', grandfather_maternal: 'Abuelo materno', grandmother_paternal: 'Abuela paterna', grandmother_maternal: 'Abuela materna', son: 'Hijo', daughter: 'Hija', grandson: 'Hijo del hijo', granddaughter: 'Hija del hijo', daughter_son: 'Hijo de la hija', daughter_daughter: 'Hija de la hija', brother_full: 'Hermano de padre y madre', sister_full: 'Hermana de padre y madre', brother_paternal: 'Medio hermano por padre', sister_paternal: 'Media hermana por padre', brother_maternal: 'Medio hermano por madre', sister_maternal: 'Media hermana por madre', sister_full_son: 'Hijo de la hermana completa', sister_full_daughter: 'Hija de la hermana completa', sister_paternal_son: 'Hijo de la media hermana por padre', sister_paternal_daughter: 'Hija de la media hermana por padre', brother_maternal_son: 'Hijo del hermano materno', brother_maternal_daughter: 'Hija del hermano materno', nephew_full: 'Hijo del hermano completo', nephew_paternal: 'Hijo del medio hermano por padre', uncle_paternal_full: 'Tío paterno completo', uncle_paternal_half: 'Tío paterno por abuelo', uncle_maternal: 'Tío materno', aunt_paternal: 'Tía paterna', aunt_maternal: 'Tía materna', cousin_paternal_full: 'Hijo del tío paterno completo', cousin_paternal_half: 'Hijo del tío paterno por abuelo', daughter_son_son: 'Hijo del hijo de la hija', daughter_son_daughter: 'Hija del hijo de la hija', daughter_daughter_son: 'Hijo de la hija de la hija', daughter_daughter_daughter: 'Hija de la hija de la hija', sister_full_son_son: 'Hijo del hijo de la hermana completa', sister_full_son_daughter: 'Hija del hijo de la hermana completa', sister_full_daughter_son: 'Hijo de la hija de la hermana completa', sister_full_daughter_daughter: 'Hija de la hija de la hermana completa', sister_paternal_son_son: 'Hijo del hijo de la media hermana por padre', sister_paternal_son_daughter: 'Hija del hijo de la media hermana por padre', sister_paternal_daughter_son: 'Hijo de la hija de la media hermana por padre', sister_paternal_daughter_daughter: 'Hija de la hija de la media hermana por padre', brother_maternal_son_son: 'Hijo del hijo del hermano materno', brother_maternal_son_daughter: 'Hija del hijo del hermano materno', brother_maternal_daughter_son: 'Hijo de la hija del hermano materno', brother_maternal_daughter_daughter: 'Hija de la hija del hermano materno', uncle_maternal_son: 'Hijo del tío materno', uncle_maternal_daughter: 'Hija del tío materno', aunt_paternal_son: 'Hijo de la tía paterna', aunt_paternal_daughter: 'Hija de la tía paterna', aunt_maternal_son: 'Hijo de la tía materna', aunt_maternal_daughter: 'Hija de la tía materna',
  },
  ar: {
    husband: 'الزوج', wife: 'الزوجة / الزوجات', father: 'الأب', mother: 'الأم', grandfather_paternal: 'الجد من جهة الأب', grandfather_maternal: 'الجد من جهة الأم', grandmother_paternal: 'الجدة من جهة الأب', grandmother_maternal: 'الجدة من جهة الأم', son: 'الابن', daughter: 'البنت', grandson: 'ابن الابن', granddaughter: 'بنت الابن', daughter_son: 'ابن البنت', daughter_daughter: 'بنت البنت', brother_full: 'الأخ الشقيق', sister_full: 'الأخت الشقيقة', brother_paternal: 'الأخ لأب', sister_paternal: 'الأخت لأب', brother_maternal: 'الأخ لأم', sister_maternal: 'الأخت لأم', sister_full_son: 'ابن الأخت الشقيقة', sister_full_daughter: 'بنت الأخت الشقيقة', sister_paternal_son: 'ابن الأخت لأب', sister_paternal_daughter: 'بنت الأخت لأب', brother_maternal_son: 'ابن الأخ لأم', brother_maternal_daughter: 'بنت الأخ لأم', nephew_full: 'ابن الأخ الشقيق', nephew_paternal: 'ابن الأخ لأب', uncle_paternal_full: 'العم الشقيق', uncle_paternal_half: 'العم لأب', uncle_maternal: 'الخال', aunt_paternal: 'العمة', aunt_maternal: 'الخالة', cousin_paternal_full: 'ابن العم الشقيق', cousin_paternal_half: 'ابن العم لأب', daughter_son_son: 'ابن ابن البنت', daughter_son_daughter: 'بنت ابن البنت', daughter_daughter_son: 'ابن بنت البنت', daughter_daughter_daughter: 'بنت بنت البنت', sister_full_son_son: 'ابن ابن الأخت الشقيقة', sister_full_son_daughter: 'بنت ابن الأخت الشقيقة', sister_full_daughter_son: 'ابن بنت الأخت الشقيقة', sister_full_daughter_daughter: 'بنت بنت الأخت الشقيقة', sister_paternal_son_son: 'ابن ابن الأخت لأب', sister_paternal_son_daughter: 'بنت ابن الأخت لأب', sister_paternal_daughter_son: 'ابن بنت الأخت لأب', sister_paternal_daughter_daughter: 'بنت بنت الأخت لأب', brother_maternal_son_son: 'ابن ابن الأخ لأم', brother_maternal_son_daughter: 'بنت ابن الأخ لأم', brother_maternal_daughter_son: 'ابن بنت الأخ لأم', brother_maternal_daughter_daughter: 'بنت بنت الأخ لأم', uncle_maternal_son: 'ابن الخال', uncle_maternal_daughter: 'بنت الخال', aunt_paternal_son: 'ابن العمة', aunt_paternal_daughter: 'بنت العمة', aunt_maternal_son: 'ابن الخالة', aunt_maternal_daughter: 'بنت الخالة',
  },
};

const IMPEDIMENTS: Record<UiLanguage, Record<ImpedimentType, string>> = {
  tr: { murder: 'Katl', religion: 'Din farkı', slavery: 'Kölelik', lian: 'Liân' },
  en: { murder: 'Killing', religion: 'Difference of religion', slavery: 'Slavery', lian: 'Li\'an' },
  de: { murder: 'Tötung', religion: 'Religionsverschiedenheit', slavery: 'Sklaverei', lian: 'Li\'an' },
  es: { murder: 'Homicidio', religion: 'Diferencia de religión', slavery: 'Esclavitud', lian: 'Li\'an' },
  ar: { murder: 'القتل', religion: 'اختلاف الدين', slavery: 'الرق', lian: 'اللعان' },
};

const KHUNSA_RELATIONS: Record<UiLanguage, Record<KhunsaRelationType, string>> = {
  tr: { child: 'Çocuk', grandchild: 'Torun', full_sibling: 'Öz kardeş', paternal_sibling: 'Baba bir kardeş', maternal_sibling: 'Anne bir kardeş' },
  en: { child: 'Child', grandchild: 'Grandchild', full_sibling: 'Full sibling', paternal_sibling: 'Paternal sibling', maternal_sibling: 'Maternal sibling' },
  de: { child: 'Kind', grandchild: 'Enkelkind', full_sibling: 'Vollgeschwister', paternal_sibling: 'Väterliches Geschwister', maternal_sibling: 'Mütterliches Geschwister' },
  es: { child: 'Hijo o hija', grandchild: 'Nieto o nieta', full_sibling: 'Hermano completo', paternal_sibling: 'Hermano por padre', maternal_sibling: 'Hermano por madre' },
  ar: { child: 'ولد', grandchild: 'حفيد', full_sibling: 'أخ شقيق', paternal_sibling: 'أخ لأب', maternal_sibling: 'أخ لأم' },
};


const EN_FALLBACK_LABELS: Partial<Record<HeirType, string>> = {
  nephew_full_daughter: "Daughter of full brother",
  nephew_full_daughter_son: "Son of full brother's daughter",
  nephew_full_daughter_daughter: "Daughter of full brother's daughter",
  nephew_paternal_daughter: "Daughter of paternal half-brother",
  nephew_paternal_daughter_son: "Son of paternal half-brother's daughter",
  nephew_paternal_daughter_daughter: "Daughter of paternal half-brother's daughter",
  uncle_maternal_son_son: "Son of maternal uncle's son",
  uncle_maternal_son_daughter: "Daughter of maternal uncle's son",
  uncle_maternal_daughter_son: "Son of maternal uncle's daughter",
  uncle_maternal_daughter_daughter: "Daughter of maternal uncle's daughter",
  aunt_paternal_son_son: "Son of paternal aunt's son",
  aunt_paternal_son_daughter: "Daughter of paternal aunt's son",
  aunt_paternal_daughter_son: "Son of paternal aunt's daughter",
  aunt_paternal_daughter_daughter: "Daughter of paternal aunt's daughter",
  aunt_maternal_son_son: "Son of maternal aunt's son",
  aunt_maternal_son_daughter: "Daughter of maternal aunt's son",
  aunt_maternal_daughter_son: "Son of maternal aunt's daughter",
  aunt_maternal_daughter_daughter: "Daughter of maternal aunt's daughter",
  cousin_paternal_full_daughter: "Daughter of full paternal uncle's son",
  cousin_paternal_half_daughter: "Daughter of paternal half-uncle's son",
};

function getGeneratedEnglishHeirLabel(type: HeirType): string | undefined {
  return EN_FALLBACK_LABELS[type];
}

export function getHeirLabel(type: HeirType, language: UiLanguage) {
  if (HEIR_LABELS[language]?.[type]) return HEIR_LABELS[language][type] as string;
  if (language === 'en') {
    const generated = getGeneratedEnglishHeirLabel(type);
    if (generated) return generated;
  }
  return HEIR_LABELS.tr[type]
    || ALL_HEIRS.find((heir) => heir.type === type)?.label
    || type;
}
export function getImpedimentLabel(type: ImpedimentType, language: UiLanguage) { return IMPEDIMENTS[language]?.[type] || IMPEDIMENTS.tr[type] || type; }
export function getKhunsaRelationLabel(type: KhunsaRelationType, language: UiLanguage) { return KHUNSA_RELATIONS[language]?.[type] || KHUNSA_RELATIONS.tr[type] || type; }


const UI_EXACT_TRANSLATIONS: Record<Exclude<UiLanguage, "tr">, Record<string, string>> = {
  en: {
    'Sonuç Özeti': 'Result Summary', 'Temkinli sonuç': 'Provisional result', 'Müteveffa:': 'Deceased:', 'Gösterim:': 'Display:', 'Maddi kıymetli': 'With monetary values', 'Oransal': 'Ratio only', 'Net tereke:': 'Net estate:', 'Mesele türü:': 'Case type:', 'Genel akış': 'General flow', 'Ana görüş:': 'Main view:', 'Nihai payda': 'Final denominator', 'Kişi paydası': 'Per-person denominator', 'Özet kopyalandı': 'Summary copied', 'Kopyalama başarısız': 'Copy failed', 'Özeti kopyala': 'Copy summary', 'Yazdır / PDF al': 'Print / Save as PDF',
    'Tutar olarak da göster': 'Also show monetary amounts', 'net tereke': 'net estate', 'Sadece oranlar': 'Ratios only', 'Tutarı da göster': 'Show amounts too', 'Dağıtıma esas net tereke': 'Net estate used for distribution', 'Örn: 720000': 'Example: 720000', 'Techiz-tekfin, borç ve vasiyet sonrası kalan net miktarı girin.': 'Enter the net amount remaining after funeral expenses, debts, and any valid bequest.', 'Parasal gösterim için net tereke giriniz.': 'Enter the net estate to show monetary values.',
    'Uyarılar ve ihtiyat kayıtları': 'Warnings and reservation notes', 'İhtiyatlı Dağıtım ve Bekletilen Pay': 'Reserved distribution and withheld share', 'Senaryoda en çok': 'Maximum in this scenario', 'Senaryo özeti': 'Scenario summary', 'Bu senaryoda bekletilecek bölüm:': 'Reserved portion in this scenario:', 'Bu senaryoda payların dağılımı': 'Share distribution in this scenario', 'İsterseniz': 'If you want,', 'tutarını girerek oranları para karşılığıyla da görebilirsiniz.': 'you can enter the amount and also see the ratios as monetary values.', 'Durum': 'Status', 'Oranlar': 'The ratios were calculated over', 'net tereke üzerinden hesaplandı.': 'the net estate.', 'Parasal gösterim için net terekeyi giriniz.': 'Enter the net estate to show monetary values.', 'İlk mirastan pay alan': 'The share received from the first estate by', 'için ikinci dağıtım otomatik olarak hesaplandı.': 'was used to calculate the second distribution automatically.', 'Bu dalda münâsehat da çözüldü': 'Munasakhat was also resolved in this branch', 'bu senaryoda ilk terekeden pay aldığı için ikinci tereke toplamı': 'received from the first estate in this scenario, so the total of the second estate was also calculated as', 'olarak ayrıca hesaplandı.': '.', 'İkinci dağıtımda etkin mirasçı satırı:': 'Active heir rows in the second distribution:',
    'Pay Dağılımı': 'Share Distribution', 'Kişi başı pay': 'Per-person share', 'Mirasçı': 'Heir', 'Sayı': 'Count', 'Tür': 'Type', 'Grup Payı': 'Group share', 'Yüzde': 'Percent', 'Kişi Başı Paylar': 'Per-Person Shares', 'Tek kişi payı': 'Single-person share', 'Grup toplamı:': 'Group total:',
    'Miras Engeli Nedeniyle Düşen Kişiler': 'Excluded due to impediments', 'düşüldü': 'excluded', 'Toplam': 'Total', 'Etkin': 'Effective', 'Engeller': 'Impediments', 'Kayıt yok': 'No record', 'Hesabın Kısa Açıklaması': 'Short explanation of the calculation', 'Bu vaka için ek açıklama bulunmuyor.': 'There is no additional note for this case.',
    'Mezheplere Göre Pay Dağılımı': 'Share Distribution by School', 'Bu bölüm, aynı vakanın diğer mezheplerde nasıl değişebileceğini gösterir. Ana sonuç Hanefî görünümüne göre verilmiştir.': 'This section shows how the same case may differ across schools. The main result above follows the Hanafi view.', 'Adet:': 'Count:', 'Ana sonuç': 'Main result', 'Pay yok': 'No share', 'Ana sonuçtan farklı': 'Different from main result', 'Mezhep Farklarının Kısa Açıklaması': 'Short explanation of school differences', 'Aşağıdaki notlar, bu vakada mezhepler arasında neden farklı sonuç çıkabildiğini sade bir dille açıklar. Bu vakayla ilgili başlıklar açık gelir.': 'The notes below explain in simple language why this case can produce different results across schools. Topics relevant to this case are opened by default.', 'Bu vaka için önemli': 'Important for this case', 'Göster': 'Show',
    'Pay Alamayan Mirasçılar (Hacb)': 'Heirs with no share (blocked)', 'Hacb': 'Blocked', 'Engelleyen:': 'Blocked by:', 'Münâsehat için net tereke gerekiyor': 'Net estate is required for munasakhat', 'İkinci miras için ayrıca mal yazıldıysa, ilk mirastan gelen payın para karşılığı bilinmeden ikinci dağıtım kesinleştirilemez. Üstteki net tereke alanına tutar girildiğinde bu tablo otomatik açılır.': 'If extra property is entered for the second estate, the second distribution cannot be finalized until the monetary value inherited from the first estate is known. This table opens automatically once a net estate amount is entered above.', 'Münâsehat İkinci Tereke': 'Munasakhat: second estate', 'İlk mirastan gelen pay': 'Share received from the first estate', 'Oransal aktarım': 'Ratio-based transfer', 'Ek tereke': 'Additional estate', 'Varsa para ile eklenir': 'Added in money if present', 'İkinci toplam': 'Second total', 'İlk paya göre oluşur': 'Derived from the first share', 'İkinci payda': 'Second denominator', 'Kişi başı': 'Per person', 'Grup toplamı': 'Group total', 'Önemli not': 'Important note', 'Bu çıktı yol gösterici bir özettir. İhtilaflı, ileri veya resmî işleme konu vakalarda nihai paylaşım için ehil bir uzmana danışılmalıdır.': 'This output is a guiding summary. For disputed, advanced, or official cases, consult a qualified expert for the final distribution.',
    'Farz': 'Fard', 'Asabe': 'Asaba', 'Asabe (bi-nefsihi)': 'Asaba (bi-nafsihi)', 'Asabe (bi-gayrihi)': 'Asaba (bi-ghayrihi)', 'Asabe (maa-gayrihi)': 'Asaba (ma\'a ghayrihi)', 'Redd': 'Radd', 'Zevi’l-Erhâm': 'Dhawu al-Arham',
    'Müşerrike': 'Musharrika', 'Akdariyye': 'Akdariyya', 'Dede ve kardeşler': 'Grandfather and siblings', 'Miras engelleri': 'Impediments to inheritance', 'Haml, hünsâ, mefkud ve münâsehat': 'Pregnancy, khunsa, mafqud, and munasakhat',
    'Ömeriyyeteyn (Garraveyn)': 'Umariyyatayn (Gharrawayn)', 'Müşerrike (Himariyye)': 'Musharrika (Himariyya)', 'Evet': 'Yes', 'Hayır': 'No',
    'Parasal gösterim': 'Monetary display', 'Sadece oranlar': 'Ratios only', 'Tutarı da göster': 'Show monetary values', 'Dağıtıma esas net tereke': 'Net estate used for distribution', 'Techiz-tekfin, borçlar ve geçerli vasiyet sonrasında kalan net tutarı girin.': 'Enter the net amount remaining after funeral expenses, debts, and any valid will.', 'Uyarılar ve ihtiyat notları': 'Warnings and precaution notes', 'İhtiyatlı dağıtım ve bekletilen pay': 'Precautionary distribution and reserved share', 'Bekletilecek pay': 'Reserved share', 'Senaryo özeti': 'Scenario summary', 'Bu senaryoda payların dağılımı': 'Distribution in this scenario', 'Pay alamayan mirasçılar': 'Heirs with no share', 'İlk mirastan gelen hisse': 'Inherited share from the first estate', 'Ek tereke': 'Additional estate', 'İkinci toplam': 'Second total', 'İkinci payda': 'Second denominator', 'Parasal değer için net tereke giriniz.': 'Enter the net estate to show the monetary value.', 'Münâsehat için net tereke gerekiyor': 'The net estate amount is required for Munasakhat', 'Ana sonuçdan farklı': 'Different from the main result', 'Ana sonuçtan farklı': 'Different from the main result', 'Bu vaka için önemli': 'Important for this case', 'Gösterim:': 'Display:', 'Müteveffa:': 'Deceased:', 'Seçilen mezhep:': 'Selected school:', 'Mesele türü:': 'Case type:', 'Genel dağıtım': 'General distribution', 'İkinci tereke': 'Second estate', 'Kişi başı': 'Per person', 'Tek kişi payı': 'Single-person share', 'Yazdır / PDF al': 'Print / Save PDF',
    'Erkek': 'Male', 'Kadın': 'Female', 'Meselenin aslı': 'Case base', 'Meselenin aslı:': 'Case base:', 'Hesabın ilk ortak paydası': 'Initial common denominator of the case', 'Yalnız pay ve kesir gösteriliyor': 'Only shares and fractions are shown', 'Dağıtımda esas alınan son ortak payda': 'Final common denominator used for distribution', 'Kişi başı payları birlikte okumaya yarayan ortak payda': 'Common denominator used to read per-person shares together', 'Pay alan mirasçı': 'Heirs with a share', 'Hacbedilen satır yok': 'No blocked rows', 'Ana özet ve ana tablo bu mezhebe göre hazırlanır': 'The main summary and main table follow this school.', 'Net tereke': 'Net estate', 'Dağıtıma esas tutar': 'Amount used for distribution', 'Dağıtılan toplam': 'Total distributed', 'Aktif satırlara dağıtılan toplam kıymet': 'Total amount distributed to active rows', 'Geçici sonuç:': 'Provisional result:', 'Ortak kişi paydası:': 'Per-person denominator:', 'PAY DAĞILIMI': 'SHARE DISTRIBUTION', 'UYARILAR': 'WARNINGS', 'Ek uyarı yok': 'No additional warning', 'Kesin verilebilir paylar': 'Guaranteed shares', 'Kesin verilebilir': 'Guaranteed', 'Aynı bekletilen toplam farklı mirasçılara farklı şekilde dağılabilir; ayrıntı aşağıdaki satırlardadır.': 'The same reserved total may be distributed differently across heirs; the details are shown below.', 've grup toplamı birlikte gösterilir.': 'and the group total are shown together.', 'Aynı grupta birden fazla mirasçı varsa her bir ferdin tek tek aldığı kesirdir.': 'If a group contains more than one heir, this is the fraction received by each individual person.', 'için ayrılan ihtiyat payı burada gösterilir.': 'reserved as a precaution is shown here.', 'Bekletilecek pay': 'Reserved share', 'Grup': 'Group', 'Miras Engeli Nedeniyle Düşen Kişiler': 'Excluded due to impediments', 'için net tereke gerekiyor': 'requires the net estate amount', 'Varsa parasal olarak eklenir': 'Added as money if present', 'İlk hisseden hareketle oluşur': 'Derived from the first inherited share', 'Tek kız 1/2 alır. Artan bakiye redd ile aynı gruba iade edildi.': 'A single daughter receives 1/2. The remaining residue was returned to the same group by radd.', 'Seçilen ana mezhep:': 'Selected main school:', 'Zevi’l-erhâm yöntemi:': 'Dhawu al-Arham method:', 'Alt görünüm:': 'Active sub-view:', 'Ahl al-qarâba': 'Ahl al-Qaraba', 'Tanzîl': 'Tanzil', 'beytülmâl pasif': 'bayt al-mal inactive', 'beytülmâl aktif': 'bayt al-mal active', 'Asaba bulunmayan bakiyede redd uygulandı ve eş dışı farz sahiplerine iade yapıldı.': 'When no agnatic heir remained, radd was applied and the residue was returned to the fixed-share heirs other than the spouse.', 'Oranlar tutara çevrildi': 'Ratios were converted into monetary amounts', 'Ana sonuç': 'Main result', 'Nasla sabit belirli paydır; 1/2, 1/4, 1/6 gibi önceden tayin edilen hisseleri ifade eder.': 'A fixed Qurʾanic share such as 1/2, 1/4, or 1/6 that is specified in the legal texts.', 'Belirli farz paylar çıktıktan sonra kalan bakiyeyi alan mirasçı grubudur.': 'The heir class that takes the residue after the fixed shares have been distributed.', 'Daha yakın veya güçlü mirasçı yüzünden satırın tamamen düşmesidir.': 'This row is fully excluded because a closer or stronger heir is present.', 'Asabe bulunmadığında artan kısmın eş dışındaki farz sahiplerine iade edilmesidir.': 'When no agnatic heir remains, the residue is returned to the fixed-share heirs other than the spouse.', 'Ashâb-ı furûz ve asabe kalmadığında devreye giren rahim akrabalarıdır.': 'Uterine and extended blood relatives who inherit only when neither fixed-share heirs nor agnatic heirs remain.'
  },
  de: {
    'Sonuç Özeti': 'Ergebnisübersicht', 'Temkinli sonuç': 'Vorläufiges Ergebnis', 'Müteveffa:': 'Verstorbene Person:', 'Gösterim:': 'Anzeige:', 'Maddi kıymetli': 'Mit Geldwerten', 'Oransal': 'Nur Verhältnis', 'Net tereke:': 'Netto-Nachlass:', 'Mesele türü:': 'Falltyp:', 'Genel akış': 'Allgemeiner Ablauf', 'Ana görüş:': 'Hauptansicht:', 'Nihai payda': 'Endgültiger Nenner', 'Kişi paydası': 'Nenner pro Person', 'Özet kopyalandı': 'Zusammenfassung kopiert', 'Kopyalama başarısız': 'Kopieren fehlgeschlagen', 'Özeti kopyala': 'Zusammenfassung kopieren', 'Yazdır / PDF al': 'Drucken / Als PDF speichern', 'Tutar olarak da göster': 'Auch Geldbeträge anzeigen', 'net tereke': 'Netto-Nachlass', 'Sadece oranlar': 'Nur Verhältnisse', 'Tutarı da göster': 'Auch Beträge anzeigen', 'Dağıtıma esas net tereke': 'Netto-Nachlass für die Verteilung', 'Örn: 720000': 'Beispiel: 720000', 'Techiz-tekfin, borç ve vasiyet sonrası kalan net miktarı girin.': 'Geben Sie den Nettobetrag ein, der nach Bestattungskosten, Schulden und gültigem Vermächtnis verbleibt.', 'Parasal gösterim için net tereke giriniz.': 'Geben Sie den Netto-Nachlass ein, um Geldbeträge anzuzeigen.', 'Pay Dağılımı': 'Verteilung der Anteile', 'Mirasçı': 'Erbe', 'Sayı': 'Anzahl', 'Tür': 'Art', 'Yüzde': 'Prozent', 'Kişi Başı Paylar': 'Anteile pro Person', 'Tek kişi payı': 'Einzelanteil', 'Grup toplamı:': 'Gruppensumme:', 'Hacb': 'Ausgeschlossen', 'Önemli not': 'Wichtiger Hinweis'
  },
  es: {
    'Sonuç Özeti': 'Resumen del resultado', 'Temkinli sonuç': 'Resultado prudente', 'Müteveffa:': 'Causante:', 'Gösterim:': 'Visualización:', 'Maddi kıymetli': 'Con valores monetarios', 'Oransal': 'Solo proporción', 'Net tereke:': 'Herencia neta:', 'Mesele türü:': 'Tipo de caso:', 'Genel akış': 'Flujo general', 'Ana görüş:': 'Vista principal:', 'Nihai payda': 'Denominador final', 'Kişi paydası': 'Denominador por persona', 'Özet kopyalandı': 'Resumen copiado', 'Kopyalama başarısız': 'No se pudo copiar', 'Özeti kopyala': 'Copiar resumen', 'Yazdır / PDF al': 'Imprimir / Guardar PDF', 'Tutar olarak da göster': 'Mostrar también importes', 'net tereke': 'Herencia neta', 'Sadece oranlar': 'Solo proporciones', 'Tutarı da göster': 'Mostrar también importes', 'Dağıtıma esas net tereke': 'Herencia neta usada para el reparto', 'Örn: 720000': 'Ejemplo: 720000', 'Techiz-tekfin, borç ve vasiyet sonrası kalan net miktarı girin.': 'Introduzca el importe neto restante después de gastos funerarios, deudas y testamento válido.', 'Parasal gösterim için net tereke giriniz.': 'Introduzca la herencia neta para ver importes monetarios.', 'Pay Dağılımı': 'Distribución de cuotas', 'Mirasçı': 'Heredero', 'Sayı': 'Cantidad', 'Tür': 'Tipo', 'Yüzde': 'Porcentaje', 'Kişi Başı Paylar': 'Cuotas por persona', 'Tek kişi payı': 'Cuota individual', 'Grup toplamı:': 'Total del grupo:', 'Hacb': 'Bloqueado', 'Önemli not': 'Nota importante'
  },
  ar: {
    'Sonuç Özeti': 'ملخص النتيجة', 'Temkinli sonuç': 'نتيجة احتياطية', 'Müteveffa:': 'المتوفى:', 'Gösterim:': 'طريقة العرض:', 'Maddi kıymetli': 'مع القيم المالية', 'Oransal': 'نِسَب فقط', 'Net tereke:': 'صافي التركة:', 'Mesele türü:': 'نوع المسألة:', 'Genel akış': 'المسار العام', 'Ana görüş:': 'الرأي المعتمد:', 'Nihai payda': 'المقام النهائي', 'Kişi paydası': 'مقام نصيب الفرد', 'Özet kopyalandı': 'تم نسخ الملخص', 'Kopyalama başarısız': 'فشل النسخ', 'Özeti kopyala': 'نسخ الملخص', 'Yazdır / PDF al': 'طباعة / حفظ PDF', 'Tutar olarak da göster': 'إظهار القيم المالية أيضاً', 'net tereke': 'صافي التركة', 'Sadece oranlar': 'النسب فقط', 'Tutarı da göster': 'إظهار القيم أيضاً', 'Dağıtıma esas net tereke': 'صافي التركة المعتمد في القسمة', 'Örn: 720000': 'مثال: 720000', 'Techiz-tekfin, borç ve vasiyet sonrası kalan net miktarı girin.': 'أدخل المبلغ الصافي الباقي بعد تجهيز الميت والديون والوصية الصحيحة.', 'Parasal gösterim için net tereke giriniz.': 'أدخل صافي التركة لإظهار القيم المالية.', 'Pay Dağılımı': 'توزيع الأنصبة', 'Mirasçı': 'الوارث', 'Sayı': 'العدد', 'Tür': 'النوع', 'Yüzde': 'النسبة المئوية', 'Kişi Başı Paylar': 'أنصبة الأفراد', 'Tek kişi payı': 'نصيب شخص واحد', 'Grup toplamı:': 'مجموع المجموعة:', 'Hacb': 'حجب', 'Önemli not': 'ملاحظة مهمة'
  },
};

const UI_INLINE_REPLACEMENTS: Record<Exclude<UiLanguage, "tr">, Array<[RegExp, string]>> = {
  en: [
    [/^(\d+) kişilik grupta kişi başı pay$/, 'Per-person share in a group of $1'], [/^Adet: (\d+)$/, 'Count: $1'], [/^Kişi Başı \(\/(\d+)\)$/, 'Per Person (/$1)'], [/^Grup Payı \(\/(\d+)\)$/, 'Group Share (/$1)'], [/^Müteveffa: (.+)$/, 'Deceased: $1'], [/^Gösterim: (.+)$/, 'Display: $1'], [/^Net tereke: (.+)$/, 'Net estate: $1'], [/^Mesele türü: (.+)$/, 'Case type: $1'], [/^Ana görüş: (.+)$/, 'Main view: $1'], [/^Toplam (\d+)$/, 'Total $1'], [/^Etkin (\d+)$/, 'Effective $1'], [/^Engeller (.+)$/, 'Impediments $1'], [/^Kişi başı (.+)$/, 'Per person $1'], [/^Bu vakada (.+)$/, 'In this case $1'], [/^Tek kız 1\/2 alır\.$/, 'A single daughter takes 1/2.'], [/^Tek öz kız kardeş 1\/2 alır\.$/, 'A single full sister takes 1/2.'], [/^Aktif nineler müştereken 1\/6 paylaşır\.$/, 'The active grandmothers share 1/6 together.'], [/^Tek baba bir kız kardeş 1\/2 alır\.$/, 'A single paternal half-sister takes 1/2.'], [/^İki veya daha fazla kız toplam 2\/3 alır\.$/, 'Two or more daughters together take 2/3.'], [/^İki veya daha fazla öz kız kardeş toplam 2\/3 alır\.$/, 'Two or more full sisters together take 2/3.'], [/^İki veya daha fazla baba bir kız kardeş toplam 2\/3 alır\.$/, 'Two or more paternal half-sisters together take 2/3.'], [/^Tek kişi payı$/, 'Single-person share'], [/^Kişi başı pay$/, 'Per-person share'], [/^Grup toplamı$/, 'Group total'], [/^Pay yok$/, 'No share'], [/^Ana sonuçden farklı$/, 'Different from main result'], [/^Oransal aktarım$/, 'Ratio-based transfer'], [/^Toplam (\d+) etkin mirasçı tipi hesap çekirdeğine alındı\.$/, 'A total of $1 active heir types were processed by the calculation engine.'], [/^Seçilen ana mezhep: (.+?)\. Zevi’l-erhâm yöntemi: (.+?)\. Alt görünüm: (.+?)\.$/, 'Selected main school: $1. Dhawu al-Arham method: $2. Active sub-view: $3.'], [/^(\d+) satır hacbedildi$/, '$1 rows were blocked']
  ],
  de: [[/^(\d+) kişilik grupta kişi başı pay$/, 'Anteil pro Person in einer Gruppe von $1'], [/^Adet: (\d+)$/, 'Anzahl: $1'], [/^Kişi Başı \(\/(\d+)\)$/, 'Pro Person (/$1)'], [/^Grup Payı \(\/(\d+)\)$/, 'Gruppenanteil (/$1)']],
  es: [[/^(\d+) kişilik grupta kişi başı pay$/, 'Cuota por persona en un grupo de $1'], [/^Adet: (\d+)$/, 'Cantidad: $1'], [/^Kişi Başı \(\/(\d+)\)$/, 'Por persona (/$1)'], [/^Grup Payı \(\/(\d+)\)$/, 'Cuota del grupo (/$1)']],
  ar: [[/^(\d+) kişilik grupta kişi başı pay$/, 'نصيب الفرد في مجموعة من $1'], [/^Adet: (\d+)$/, 'العدد: $1'], [/^Kişi Başı \(\/(\d+)\)$/, 'لكل شخص (/$1)'], [/^Grup Payı \(\/(\d+)\)$/, 'نصيب المجموعة (/$1)']]
};

const TR_TO_HEIR_TYPE = Object.fromEntries(Object.entries(HEIR_LABELS.tr).map(([type, label]) => [label, type as HeirType]));


const EXTRA_EXACT_TRANSLATIONS: Record<Exclude<UiLanguage, 'tr'>, Record<string, string>> = {
  en: {
    'Baba varken baba tarafından dede mirastan pay alamaz.': 'A paternal grandfather does not inherit while the father is alive.',
    'Anne varken baba tarafından nine mirastan pay alamaz.': 'A paternal grandmother does not inherit while the mother is alive.',
    'Baba varken baba tarafından nine mirastan pay alamaz.': 'A paternal grandmother does not inherit while the father is alive.',
    'Anne varken anne tarafından nine mirastan pay alamaz.': 'A maternal grandmother does not inherit while the mother is alive.',
    'Oğul varken oğlun çocukları hacb edilir.': 'A son blocks the son\'s children from inheriting.',
    'Füru veya baba varken öz kardeşler mirastan pay alamaz.': 'Full siblings do not inherit when there are descendants or the father is alive.',
    'Daha yakın füru, baba veya öz erkek kardeş varken baba bir erkek kardeş pay alamaz.': 'A paternal half-brother does not inherit when there are closer descendants, the father, or a full brother.',
    'Daha yakın füru, baba, öz erkek kardeş veya iki öz kız kardeş varken baba bir kız kardeş pay alamaz.': 'A paternal half-sister does not inherit when there are closer descendants, the father, a full brother, or two full sisters.',
    'Füru veya erkek usul bulunduğunda anne bir kardeşler mirastan pay alamaz.': 'Maternal siblings do not inherit when there are descendants or a male ascendant.',
    'Daha yakın asabe varken öz erkek kardeşin oğlu pay alamaz.': 'The son of a full brother does not inherit when a closer agnatic heir exists.',
    'Daha yakın asabe varken baba bir erkek kardeşin oğlu pay alamaz.': 'The son of a paternal half-brother does not inherit when a closer agnatic heir exists.',
    'Daha yakın asabe varken öz amca pay alamaz.': 'A full paternal uncle does not inherit when a closer agnatic heir exists.',
    'Daha yakın asabe veya öz amca varken baba bir amca pay alamaz.': 'A paternal half-uncle does not inherit when a closer agnatic heir or a full paternal uncle exists.',
    'Daha yakın asabe varken öz amca oğlu pay alamaz.': 'The son of a full paternal uncle does not inherit when a closer agnatic heir exists.',
    'Daha yakın asabe varken baba bir amca oğlu pay alamaz.': 'The son of a paternal half-uncle does not inherit when a closer agnatic heir exists.',
    'Daha yakın ashâb-ı furûz veya asabe bulunduğunda zevi’l-erhâm sırası gelmez.': 'Dhawu al-Arham do not inherit while closer sharers or agnatic heirs are present.',
    'İki veya daha fazla kız varsa, oğlun kızına ancak aynı derecede erkek torun eşlik etmiyorsa sıra gelmez.': 'If there are two or more daughters, a son\'s daughter does not inherit unless a grandson of the same level is present with her.',
    'İki veya daha fazla öz kız kardeş bulunduğunda baba bir kız kardeş hacb edilir; tek öz kız kardeş varsa tamamlayıcı 1/6 mümkün olur.': 'When there are two or more full sisters, a paternal half-sister is blocked; with one full sister she may still receive a complementary 1/6.',
    'Daha yakın mirasçı bulunduğu için hacb oluşur.': 'This heir is excluded because a closer heir is present.',
    'Bu mirasçı hesaba katılabilir.': 'This heir can be included in the calculation.',
    'Kayıt yok': 'No record'
  },
  de: {
    'Baba varken baba tarafından dede mirastan pay alamaz.': 'Der Großvater väterlicherseits erbt nicht, solange der Vater lebt.',
    'Anne varken baba tarafından nine mirastan pay alamaz.': 'Die Großmutter väterlicherseits erbt nicht, solange die Mutter lebt.',
    'Baba varken baba tarafından nine mirastan pay alamaz.': 'Die Großmutter väterlicherseits erbt nicht, solange der Vater lebt.',
    'Anne varken anne tarafından nine mirastan pay alamaz.': 'Die Großmutter mütterlicherseits erbt nicht, solange die Mutter lebt.',
    'Oğul varken oğlun çocukları hacb edilir.': 'Kinder des Sohnes erben nicht, solange ein Sohn lebt.',
    'Füru veya baba varken öz kardeşler mirastan pay alamaz.': 'Vollgeschwister erben nicht, wenn Nachkommen oder der Vater vorhanden sind.',
    'Daha yakın füru, baba veya öz erkek kardeş varken baba bir erkek kardeş pay alamaz.': 'Ein Halbbruder väterlicherseits erbt nicht, wenn nähere Nachkommen, der Vater oder ein Vollbruder vorhanden sind.',
    'Daha yakın füru, baba, öz erkek kardeş veya iki öz kız kardeş varken baba bir kız kardeş pay alamaz.': 'Eine Halbschwester väterlicherseits erbt nicht, wenn nähere Nachkommen, der Vater, ein Vollbruder oder zwei Vollschwestern vorhanden sind.',
    'Füru veya erkek usul bulunduğunda anne bir kardeşler mirastan pay alamaz.': 'Mütterliche Geschwister erben nicht, wenn Nachkommen oder ein männlicher Vorfahr vorhanden sind.',
    'Daha yakın ashâb-ı furûz veya asabe bulunduğunda zevi’l-erhâm sırası gelmez.': 'Entferntere Verwandte erben nicht, solange nähere سهم-Erben oder Agnaten vorhanden sind.',
    'Daha yakın mirasçı bulunduğu için hacb oluşur.': 'Dieser Erbe wird ausgeschlossen, weil ein näherer Erbe vorhanden ist.',
    'Bu mirasçı hesaba katılabilir.': 'Dieser Erbe kann in die Berechnung aufgenommen werden.',
    'Kayıt yok': 'Kein Eintrag'
  },
  es: {
    'Baba varken baba tarafından dede mirastan pay alamaz.': 'El abuelo paterno no hereda mientras viva el padre.',
    'Anne varken baba tarafından nine mirastan pay alamaz.': 'La abuela paterna no hereda mientras viva la madre.',
    'Baba varken baba tarafından nine mirastan pay alamaz.': 'La abuela paterna no hereda mientras viva el padre.',
    'Anne varken anne tarafından nine mirastan pay alamaz.': 'La abuela materna no hereda mientras viva la madre.',
    'Oğul varken oğlun çocukları hacb edilir.': 'Los hijos del hijo no heredan mientras exista un hijo.',
    'Füru veya baba varken öz kardeşler mirastan pay alamaz.': 'Los hermanos completos no heredan cuando hay descendientes o vive el padre.',
    'Daha yakın füru, baba veya öz erkek kardeş varken baba bir erkek kardeş pay alamaz.': 'El medio hermano paterno no hereda si hay descendientes más cercanos, el padre o un hermano completo.',
    'Daha yakın füru, baba, öz erkek kardeş veya iki öz kız kardeş varken baba bir kız kardeş pay alamaz.': 'La media hermana paterna no hereda si hay descendientes más cercanos, el padre, un hermano completo o dos hermanas completas.',
    'Füru veya erkek usul bulunduğunda anne bir kardeşler mirastan pay alamaz.': 'Los hermanos maternos no heredan cuando hay descendientes o un ascendiente varón.',
    'Daha yakın ashâb-ı furûz veya asabe bulunduğunda zevi’l-erhâm sırası gelmez.': 'Los parientes lejanos no heredan mientras existan herederos de cuota fija o agnados más cercanos.',
    'Daha yakın mirasçı bulunduğu için hacb oluşur.': 'Este heredero queda bloqueado porque existe un heredero más cercano.',
    'Bu mirasçı hesaba katılabilir.': 'Este heredero puede incluirse en el cálculo.',
    'Kayıt yok': 'Sin registro'
  },
  ar: {
    'Baba varken baba tarafından dede mirastan pay alamaz.': 'الجد من جهة الأب لا يرث مع وجود الأب.',
    'Anne varken baba tarafından nine mirastan pay alamaz.': 'الجدة من جهة الأب لا ترث مع وجود الأم.',
    'Baba varken baba tarafından nine mirastan pay alamaz.': 'الجدة من جهة الأب لا ترث مع وجود الأب.',
    'Anne varken anne tarafından nine mirastan pay alamaz.': 'الجدة من جهة الأم لا ترث مع وجود الأم.',
    'Oğul varken oğlun çocukları hacb edilir.': 'أولاد الابن لا يرثون مع وجود الابن.',
    'Füru veya baba varken öz kardeşler mirastan pay alamaz.': 'الإخوة الأشقاء لا يرثون مع وجود الفرع الوارث أو الأب.',
    'Daha yakın füru, baba veya öz erkek kardeş varken baba bir erkek kardeş pay alamaz.': 'الأخ لأب لا يرث مع وجود فرع أقرب أو الأب أو الأخ الشقيق.',
    'Daha yakın füru, baba, öz erkek kardeş veya iki öz kız kardeş varken baba bir kız kardeş pay alamaz.': 'الأخت لأب لا ترث مع وجود فرع أقرب أو الأب أو الأخ الشقيق أو أختين شقيقتين.',
    'Füru veya erkek usul bulunduğunda anne bir kardeşler mirastan pay alamaz.': 'الإخوة لأم لا يرثون مع وجود الفرع الوارث أو أصل ذكر.',
    'Daha yakın ashâb-ı furûz veya asabe bulunduğunda zevi’l-erhâm sırası gelmez.': 'ذوو الأرحام لا يرثون مع وجود أصحاب فروض أو عصبة أقرب.',
    'Daha yakın mirasçı bulunduğu için hacb oluşur.': 'هذا الوارث محجوب لوجود وارث أقرب.',
    'Bu mirasçı hesaba katılabilir.': 'يمكن إدخال هذا الوارث في الحساب.',
    'Kayıt yok': 'لا يوجد سجل'
  }
};

const BLOCKAGE_SENTENCE_TEMPLATES: Record<UiLanguage, (blockedBy: string, reason: string) => string> = {
  tr: (blockedBy, reason) => `${blockedBy} bulunduğu için bu mirasçı hacbedildi. ${reason}`,
  en: (blockedBy, reason) => `This heir is blocked because of ${blockedBy}. ${reason}`,
  de: (blockedBy, reason) => `Dieser Erbe ist wegen ${blockedBy} ausgeschlossen. ${reason}`,
  es: (blockedBy, reason) => `Este heredero queda bloqueado por ${blockedBy}. ${reason}`,
  ar: (blockedBy, reason) => `حُجب هذا الوارث بسبب ${blockedBy}. ${reason}`,
};

function replaceHeirLabels(text: string, language: UiLanguage): string {
  if (!text || language === 'tr') return text;
  const entries = Object.entries(HEIR_LABELS.tr).sort((a, b) => b[1].length - a[1].length);
  let output = text;
  for (const [heirType, label] of entries) {
    output = output.replaceAll(label, getHeirLabel(heirType as HeirType, language));
  }
  return output;
}

function applyExactTranslations(text: string, language: Exclude<UiLanguage, 'tr'>): string {
  let output = text;
  for (const dict of [UI_EXACT_TRANSLATIONS[language] || {}, EXTRA_EXACT_TRANSLATIONS[language] || {}]) {
    for (const [source, target] of Object.entries(dict)) {
      output = output.replaceAll(source, target);
    }
  }
  return output;
}

export function translateUiPhrase(text: string, language: UiLanguage): string {
  if (!text || language === 'tr') return text;
  let translated = replaceHeirLabels(text, language);
  translated = applyExactTranslations(translated, language as Exclude<UiLanguage, 'tr'>);
  for (const [pattern, replacement] of UI_INLINE_REPLACEMENTS[language as Exclude<UiLanguage, 'tr'>] || []) {
    translated = translated.replace(pattern, replacement);
  }
  return translated;
}

export function buildBlockageExplanation(blockedBy: string, reason: string, language: UiLanguage): string {
  if (!blockedBy && !reason) return '';
  if (!blockedBy) return translateUiPhrase(reason, language);
  return BLOCKAGE_SENTENCE_TEMPLATES[language](translateUiPhrase(blockedBy, language), translateUiPhrase(reason, language));
}
