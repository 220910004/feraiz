import type { CalculationResult } from '../../types/inheritance';
import type { UiLanguage } from '../../utils/uiI18n';

export interface ExplanationSection {
  title: string;
  items: string[];
}

export interface ResultExplanation {
  sections: ExplanationSection[];
}

const COPY: Record<UiLanguage, {
  why: string;
  flow: string;
  blocked: string;
  schoolDiffs: string;
}> = {
  tr: {
    why: 'Neden bu sonuç çıktı?',
    flow: 'Hesap akışı',
    blocked: 'Hacb ve düşen satırlar',
    schoolDiffs: 'Mezhep farkı notları',
  },
  en: {
    why: 'Why this result?',
    flow: 'Calculation flow',
    blocked: 'Blocked rows',
    schoolDiffs: 'School difference notes',
  },
  de: {
    why: 'Warum dieses Ergebnis?',
    flow: 'Rechenablauf',
    blocked: 'Ausgeschlossene Zeilen',
    schoolDiffs: 'Hinweise zu Schulunterschieden',
  },
  es: {
    why: '¿Por qué este resultado?',
    flow: 'Flujo del cálculo',
    blocked: 'Filas excluidas',
    schoolDiffs: 'Notas sobre diferencias entre escuelas',
  },
  ar: {
    why: 'لماذا خرجت هذه النتيجة؟',
    flow: 'مسار الحساب',
    blocked: 'الأسطر المحجوبة',
    schoolDiffs: 'ملاحظات فروق المذاهب',
  },
};

export function buildResultExplanation(result: CalculationResult, language: UiLanguage): ResultExplanation {
  const copy = COPY[language] || COPY.tr;
  const sections: ExplanationSection[] = [];

  const whyItems: string[] = [];
  if (result.schoolPolicy?.displayName) whyItems.push(`Ana görünüm ${result.schoolPolicy.displayName} esas alınarak üretildi.`);
  if (result.specialCase) whyItems.push(`Özel mesele: ${result.specialCase}`);
  if (result.hasAvl) whyItems.push('Payların toplamı 1’i aştığı için avl uygulandı.');
  if (result.hasRadd) whyItems.push('Artan kısım uygun mirasçılara redd yoluyla dağıtıldı.');
  if (result.tentative) whyItems.push('İleri durum senaryoları nedeniyle temkinli sonuç üretildi.');
  if (whyItems.length > 0) sections.push({ title: copy.why, items: whyItems });

  const flowItems = [
    ...(result.calculationSteps || []).slice(0, 4),
    ...(result.trace?.slice(0, 2).map((row) => `${row.title}: ${row.detail}`) || []),
  ];
  if (flowItems.length > 0) sections.push({ title: copy.flow, items: flowItems });

  const blockedItems = [
    ...(result.blockageDetails?.slice(0, 4).map((row) => `${row.label}: ${row.explanation}`) || []),
    ...result.heirs.filter((row) => row.blocked).slice(0, 2).map((row) => `${row.heir.label}: ${row.note || 'Hacb edildi.'}`),
  ];
  if (blockedItems.length > 0) sections.push({ title: copy.blocked, items: blockedItems });

  const schoolDiffItems = (result.comparisonRows || [])
    .filter((row) => row.relevant)
    .slice(0, 4)
    .map((row) => `${row.issue}: ${row.defaultView}`);
  if (schoolDiffItems.length > 0) sections.push({ title: copy.schoolDiffs, items: schoolDiffItems });

  return { sections };
}
