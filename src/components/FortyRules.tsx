import React, { useMemo, useState } from 'react';
import { fortyRules, fortyRulesCategories } from '../data/fortyRules';
import type { UiLanguage } from '../utils/uiI18n';
import { translateUiPhrase } from '../utils/uiI18n';

type FortyRulesProps = { language?: UiLanguage };

type RuleCopy = {
  badge: string;
  title: string;
  intro: string;
  totalCases: string;
  headings: string;
  visible: string;
  all: string;
  search: string;
  when: string;
  outcome: string;
  shortExplanation: string;
  evidence: string;
  example: string;
  open: string;
  close: string;
  translationNote?: string;
};

const normalize = (value: string) =>
  value.toLocaleLowerCase('tr-TR').replace(/ı/g, 'i').replace(/î/g, 'i').replace(/â/g, 'a').replace(/û/g, 'u');

const COPY: Record<UiLanguage, RuleCopy> = {
  tr: {
    badge: '40 Hal Rehberi',
    title: 'Sık karşılaşılan feraiz halleri, kısa açıklama ve temel delilleriyle',
    intro: 'Bu kartlar, hesaplama ekranında gördüğünüz payların neden o şekilde çıktığını hızlıca anlamanıza yardımcı olur.',
    totalCases: 'Toplam Hal',
    headings: 'Başlık',
    visible: 'Görünüm',
    all: 'Tümü',
    search: 'Hal, mirasçı, pay veya delil içinde ara',
    when: 'Ne zaman uygulanır?',
    outcome: 'Sonuç',
    shortExplanation: 'Kısa açıklama',
    evidence: 'Delil',
    example: 'Kısa örnek',
    open: 'Aç',
    close: 'Kapat',
  },
  en: {
    badge: 'Guide to the forty core cases',
    title: 'The most common faraid patterns with short explanations and proof notes',
    intro: 'These cards help the reader understand why the calculator produced a certain result. They are designed as a study aid, not a substitute for the main calculation screen.',
    totalCases: 'Cases',
    headings: 'Sections',
    visible: 'Visible',
    all: 'All',
    search: 'Search by case, heir, share, or proof',
    when: 'When does it apply?',
    outcome: 'Outcome',
    shortExplanation: 'Short explanation',
    evidence: 'Evidence',
    example: 'Example',
    open: 'Open',
    close: 'Close',
    translationNote: 'Case details are shown with translated labels where possible. The Arabic source title is preserved.',
  },
  de: {
    badge: 'Leitfaden zu 40 Fällen',
    title: 'Die häufigsten Faraid-Muster mit kurzer Erklärung und Beleg-Hinweisen',
    intro: 'Diese Karten helfen zu verstehen, warum der Rechner ein bestimmtes Ergebnis ausgibt. Sie sind als Lernhilfe gedacht.',
    totalCases: 'Fälle',
    headings: 'Abschnitte',
    visible: 'Sichtbar',
    all: 'Alle',
    search: 'Nach Fall, Erbe, Anteil oder Beleg suchen',
    when: 'Wann gilt der Fall?',
    outcome: 'Ergebnis',
    shortExplanation: 'Kurze Erklärung',
    evidence: 'Beleg',
    example: 'Beispiel',
    open: 'Öffnen',
    close: 'Schließen',
    translationNote: 'Die Falldetails werden soweit möglich lokalisiert angezeigt; der arabische Originaltitel bleibt sichtbar.',
  },
  es: {
    badge: 'Guía de 40 casos',
    title: 'Los patrones más comunes de farāʾiḍ con explicación breve y notas de prueba',
    intro: 'Estas tarjetas ayudan a entender por qué la calculadora produjo un resultado determinado. Sirven como apoyo didáctico.',
    totalCases: 'Casos',
    headings: 'Secciones',
    visible: 'Visibles',
    all: 'Todos',
    search: 'Buscar por caso, heredero, cuota o prueba',
    when: '¿Cuándo se aplica?',
    outcome: 'Resultado',
    shortExplanation: 'Explicación breve',
    evidence: 'Prueba',
    example: 'Ejemplo',
    open: 'Abrir',
    close: 'Cerrar',
    translationNote: 'Los detalles del caso se muestran localizados cuando es posible; el título árabe original se mantiene visible.',
  },
  ar: {
    badge: 'دليل الأربعين حالة',
    title: 'أشهر مسائل الفرائض مع شرح موجز وإشارات إلى الأدلة',
    intro: 'تساعد هذه البطاقات على فهم سبب النتيجة التي يعرضها الحاسب، وهي مهيأة للتعلّم والمراجعة السريعة.',
    totalCases: 'الحالات',
    headings: 'الأقسام',
    visible: 'المعروض',
    all: 'الكل',
    search: 'ابحث بحسب الحالة أو الوارث أو النصيب أو الدليل',
    when: 'متى تطبق؟',
    outcome: 'النتيجة',
    shortExplanation: 'شرح موجز',
    evidence: 'الدليل',
    example: 'مثال',
    open: 'فتح',
    close: 'إغلاق',
    translationNote: 'تُعرض تفاصيل الحالة مترجمة قدر الإمكان مع إبقاء العنوان العربي الأصلي ظاهراً.',
  },
};

const CATEGORY_LABELS: Record<UiLanguage, Record<string, string>> = {
  tr: Object.fromEntries(fortyRulesCategories.map((category) => [category.id, category.name])),
  en: {
    spouse: 'Spouses',
    parents: 'Parents',
    children: 'Children',
    grandparents: 'Grandparents',
    siblings: 'Siblings',
    special: 'Special issues',
  },
  de: {
    spouse: 'Ehegatten',
    parents: 'Eltern',
    children: 'Kinder',
    grandparents: 'Großeltern',
    siblings: 'Geschwister',
    special: 'Sonderfälle',
  },
  es: {
    spouse: 'Cónyuges',
    parents: 'Padres',
    children: 'Hijos',
    grandparents: 'Abuelos',
    siblings: 'Hermanos',
    special: 'Casos especiales',
  },
  ar: {
    spouse: 'الزوجان',
    parents: 'الأبوان',
    children: 'الأولاد',
    grandparents: 'الأجداد',
    siblings: 'الإخوة',
    special: 'المسائل الخاصة',
  },
};

const getEvidenceLabel = (dalil: string, language: UiLanguage) => {
  const value = dalil.toLocaleLowerCase('tr-TR');
  if (value.includes('nisa') || value.includes('enfal') || value.includes('ayet')) return ({ tr: 'Ayet', en: 'Qur’an', de: 'Qur’an', es: 'Corán', ar: 'آية' } as const)[language];
  if (value.includes('buhari') || value.includes('müslim') || value.includes('hadis') || value.includes('tirmizi')) return ({ tr: 'Hadis', en: 'Hadith', de: 'Hadith', es: 'Hadiz', ar: 'حديث' } as const)[language];
  if (value.includes('icma')) return ({ tr: 'İcmâ', en: 'Consensus', de: 'Konsens', es: 'Consenso', ar: 'إجماع' } as const)[language];
  if (value.includes('ömer') || value.includes('ali') || value.includes('zeyd') || value.includes('sahabe')) return ({ tr: 'Sahabe uygulaması', en: 'Companion practice', de: 'Praxis der Gefährten', es: 'Práctica de los compañeros', ar: 'عمل الصحابة' } as const)[language];
  return COPY[language].evidence;
};

export const FortyRules: React.FC<FortyRulesProps> = ({ language = 'tr' }) => {
  const copy = COPY[language];
  const categoryLabels = CATEGORY_LABELS[language];
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedRule, setExpandedRule] = useState<number | null>(1);
  const [query, setQuery] = useState('');

  const filteredRules = useMemo(() => {
    const q = normalize(query.trim());
    return fortyRules.filter((rule) => {
      if (activeCategory !== 'all' && rule.category !== activeCategory) return false;
      if (!q) return true;
      return normalize([rule.title, rule.heirs, rule.shares, rule.explanation, rule.dalil, rule.example ?? ''].join(' ')).includes(q);
    });
  }, [activeCategory, query]);

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-stone-200 bg-white/95 p-5 shadow-[0_18px_48px_rgba(28,25,23,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800">{copy.badge}</div>
            <div>
              <h3 className="text-xl font-semibold text-stone-900">{copy.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{copy.intro}</p>
              {copy.translationNote && language !== 'tr' && <p className="mt-2 text-xs leading-5 text-stone-500">{copy.translationNote}</p>}
            </div>
          </div>
          <div className="grid gap-2 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700 sm:grid-cols-3 lg:w-[420px] lg:grid-cols-1 xl:grid-cols-3">
            <div><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{copy.totalCases}</div><div className="mt-1 text-lg font-semibold text-stone-900">40</div></div>
            <div><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{copy.headings}</div><div className="mt-1 text-lg font-semibold text-stone-900">6</div></div>
            <div><div className="text-xs font-medium uppercase tracking-wide text-stone-500">{copy.visible}</div><div className="mt-1 text-sm font-medium text-stone-700">{filteredRules.length} {language === 'ar' ? 'بطاقة' : 'cards'}</div></div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-stone-200 bg-white/95 p-4 shadow-[0_18px_48px_rgba(28,25,23,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveCategory('all')} className={`rounded-full px-4 py-2 text-sm font-medium ${activeCategory === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}>{copy.all}</button>
            {fortyRulesCategories.map((category) => (
              <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`rounded-full px-4 py-2 text-sm font-medium ${activeCategory === category.id ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}>
                <span className="mr-2">{category.icon}</span>{categoryLabels[category.id] ?? category.name}
              </button>
            ))}
          </div>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={copy.search} className="w-full lg:max-w-sm rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700" />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filteredRules.map((rule) => {
          const isOpen = expandedRule === rule.id;
          const translatedTitle = language === 'tr' ? rule.title : translateUiPhrase(rule.title, language);
          const translatedHeirs = language === 'tr' ? rule.heirs : translateUiPhrase(rule.heirs, language);
          const translatedShares = language === 'tr' ? rule.shares : translateUiPhrase(rule.shares, language);
          const translatedExplanation = language === 'tr' ? rule.explanation : translateUiPhrase(rule.explanation, language);
          const translatedDalil = language === 'tr' ? rule.dalil : translateUiPhrase(rule.dalil, language);
          const translatedExample = language === 'tr' ? rule.example : rule.example ? translateUiPhrase(rule.example, language) : undefined;
          return (
            <article key={rule.id} className="overflow-hidden rounded-[26px] border border-stone-200 bg-white/95 shadow-[0_18px_48px_rgba(28,25,23,0.06)]">
              <button aria-label={isOpen ? copy.close : copy.open} onClick={() => setExpandedRule(isOpen ? null : rule.id)} className="w-full p-5 text-left hover:bg-stone-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-semibold text-white">{rule.id}</div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-base font-semibold text-stone-900">{translatedTitle}</h4>
                        <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-medium text-stone-600">{getEvidenceLabel(rule.dalil, language)}</span>
                      </div>
                      <p className="mt-1 font-arabic text-sm text-stone-400" dir="rtl">{rule.titleAr}</p>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">{copy.when}</div><p className="mt-1 text-sm leading-6 text-stone-700">{translatedHeirs}</p></div>
                        <div><div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">{copy.outcome}</div><p className="mt-1 text-sm font-semibold leading-6 text-emerald-700">{translatedShares}</p></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-stone-400">{isOpen ? '−' : '+'}</span>
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-stone-100 bg-stone-50/80 px-5 pb-5 pt-4">
                  <div className="ml-14 space-y-4">
                    <div className="rounded-2xl border border-stone-200 bg-white p-4">
                      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{copy.shortExplanation}</div>
                      <p className="mt-2 text-sm leading-6 text-stone-700">{translatedExplanation}</p>
                    </div>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
                        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{copy.evidence}</div>
                        <p className="mt-2 text-sm leading-6 text-emerald-900">{translatedDalil}</p>
                      </div>
                      {translatedExample ? <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-800">{copy.example}</div><p className="mt-2 text-sm leading-6 text-amber-900">{translatedExample}</p></div> : null}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
};
