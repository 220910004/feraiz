import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AdvancedCaseContext,
  CalculationResult,
  ExcludedHeirSummary,
  Fraction,
  Heir,
  HeirShare,
  IMPEDIMENT_LABELS,
  MadhhabComparisonRow,
  MadhhabDistributionRow,
  ShareType,
} from '../types/inheritance';
import {
  divideFractionByNumber,
  fractionToDecimal,
  fractionToPercentage,
  fractionToString,
  lcmMultiple,
} from '../utils/fractionUtils';
import { calculateCase } from '../core/engine/calculateCase';
import type { SchoolKey } from '../core/schools/common';
import { buildUiResultSections } from '../adapters/uiResultAdapter';
import { buildShareUrl } from '../utils/shareState';
import { GlossaryTerm } from './GlossaryTerm';
import { getGlossaryDescription, getGlossaryLabel } from '../data/glossary';
import { UiLanguage, getHeirLabel, getImpedimentLabel, translateUiPhrase } from '../utils/uiI18n';
import { buildResultExplanation } from '../core/explain/explanationBuilder';
import { ExplanationPanel } from './results/ExplanationPanel';
import { VersionPanel } from './results/VersionPanel';
import { renderGlossaryAwareText } from '../utils/glossaryAwareText';
import { ReportModal } from './results/ReportModal';

interface ResultsDisplayProps {
  result: CalculationResult;
  deceasedGender: 'male' | 'female';
  selectedHeirs: Heir[];
  caseContext: AdvancedCaseContext;
  language: UiLanguage;
  school: SchoolKey;
}

const SHARE_TYPE_META: Record<ShareType, { label: string; className: string; description: string }> = {
  fard: {
    label: 'Farz',
    className: 'border border-stone-300 bg-white text-stone-900',
    description: 'Nasla sabit belirli paydır; 1/2, 1/4, 1/6 gibi önceden tayin edilen hisseleri ifade eder.',
  },
  asaba: {
    label: 'Asabe',
    className: 'border border-stone-900 bg-stone-900 text-white',
    description: 'Belirli farz paylar çıktıktan sonra kalan bakiyeyi alan mirasçı grubudur.',
  },
  blocked: {
    label: 'Hacb',
    className: 'bg-stone-100 text-stone-700 border border-stone-200',
    description: 'Daha yakın veya güçlü mirasçı yüzünden satırın tamamen düşmesidir.',
  },
  radd: {
    label: 'Redd',
    className: 'border border-stone-700 bg-stone-100 text-stone-900',
    description: 'Asabe bulunmadığında artan kısmın eş dışındaki farz sahiplerine iade edilmesidir.',
  },
  zawil_arham: {
    label: 'Zevi’l-Erhâm',
    className: 'bg-stone-100 text-stone-700 border border-stone-200',
    description: 'Ashâb-ı furûz ve asabe kalmadığında devreye giren rahim akrabalarıdır.',
  },
};


function buildImpedimentText(summary: ExcludedHeirSummary, language: UiLanguage): string {
  const entries = Object.entries(summary.impediments)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${getImpedimentLabel(key as keyof typeof IMPEDIMENT_LABELS, language)}: ${value}`);

  return entries.length > 0 ? entries.join(' • ') : translateUiPhrase('Kayıt yok', language);
}

function hasPositiveFraction(fraction: Fraction): boolean {
  return fractionToDecimal(fraction) > 0;
}

function normalizeFractionText(fraction: Fraction, base: number): { primary: string; secondary?: string } {
  const safeBase = base > 0 ? base : 1;
  const simplified = fractionToString(fraction);
  const normalizedNumerator = fraction.numerator === 0
    ? 0
    : Math.round(fraction.numerator * (safeBase / fraction.denominator));
  const primary = `${normalizedNumerator}/${safeBase}`;

  if (simplified !== primary) {
    return { primary, secondary: simplified };
  }

  return { primary };
}

function normalizeHeirShareText(heirShare: HeirShare, base: number): { primary: string; secondary?: string } {
  if (typeof heirShare.adjustedShareInBase === 'number' && base > 0) {
    const primary = `${Math.round(heirShare.adjustedShareInBase)}/${base}`;
    const simplified = fractionToString(heirShare.adjustedShare);
    return simplified !== primary ? { primary, secondary: simplified } : { primary };
  }

  return normalizeFractionText(heirShare.adjustedShare, base);
}

function buildPerPersonBreakdown(rows: HeirShare[], hasMoneyValues: boolean) {
  return rows.map((heirShare) => {
    const perPersonShare = heirShare.heir.count > 1 ? divideFractionByNumber(heirShare.adjustedShare, heirShare.heir.count) : heirShare.adjustedShare;
    return {
      heirShare,
      perPersonShare,
      groupAmount: hasMoneyValues ? heirShare.amount : undefined,
      perPersonAmount: hasMoneyValues ? heirShare.amount / heirShare.heir.count : undefined,
    };
  });
}

function buildShareTypeLabel(heirShare: HeirShare) {
  if (heirShare.shareType !== 'asaba') return SHARE_TYPE_META[heirShare.shareType]?.label || heirShare.shareType;
  if (heirShare.asabaType === 'binefsihi') return 'Asabe (bi-nefsihi)';
  if (heirShare.asabaType === 'bigayrihi') return 'Asabe (bi-gayrihi)';
  if (heirShare.asabaType === 'maagayrihi') return 'Asabe (maa-gayrihi)';
  return 'Asabe';
}

const SCHOOL_LABELS: Record<UiLanguage, Record<SchoolKey, string>> = {
  tr: { hanafi: 'Hanefî', maliki: 'Mâlikî', shafii: 'Şâfiî', hanbali: 'Hanbelî' },
  en: { hanafi: 'Hanafi', maliki: 'Maliki', shafii: 'Shafi’i', hanbali: 'Hanbali' },
  de: { hanafi: 'Hanafitisch', maliki: 'Malikitisch', shafii: 'Schafiitisch', hanbali: 'Hanbalitisch' },
  es: { hanafi: 'Hanafí', maliki: 'Mālikí', shafii: 'Shāfiʿí', hanbali: 'Hanbalí' },
  ar: { hanafi: 'الحنفي', maliki: 'المالكي', shafii: 'الشافعي', hanbali: 'الحنبلي' },
};

const RESULT_COPY: Record<UiLanguage, {
  comparisonTitle: string;
  comparisonText: string;
  comparisonOff: string;
  comparisonOn: string;
  comparisonPanelTitle: string;
  comparisonPanelText: string;
  comparisonNotesTitle: string;
  comparisonNotesText: string;
}> = {
  tr: {
    comparisonTitle: 'Mezhep karşılaştırması',
    comparisonText: 'İsterseniz ana sonuca ek olarak diğer mezheplerin pay dağılımını ve kısa açıklamalarını da görebilirsiniz.',
    comparisonOff: 'Sadece seçilen mezhep',
    comparisonOn: 'Diğer mezhepleri de göster',
    comparisonPanelTitle: 'Mezheplere göre pay dağılımı',
    comparisonPanelText: 'Bu bölüm, aynı vakanın diğer mezheplerde nasıl değişebileceğini gösterir. Ana sonuç seçtiğiniz mezhebe göre verilir.',
    comparisonNotesTitle: 'Mezhep farklarının kısa açıklaması',
    comparisonNotesText: 'Aşağıdaki notlar, bu vakada mezhepler arasında neden farklı sonuç çıkabildiğini sade bir dille açıklar. Bu vakayla ilgili başlıklar açık gelir.',
  },
  en: {
    comparisonTitle: 'School comparison',
    comparisonText: 'If you want, you can also view the share distribution and short notes for the other schools in addition to the main result.',
    comparisonOff: 'Selected school only',
    comparisonOn: 'Show other schools too',
    comparisonPanelTitle: 'Distribution by school',
    comparisonPanelText: 'This section shows how the same case may differ in the other schools. The main result follows your selected school.',
    comparisonNotesTitle: 'Short explanation of school differences',
    comparisonNotesText: 'These notes explain in simple language why the outcome may differ between the schools in this case.',
  },
  de: {
    comparisonTitle: 'Vergleich der Rechtsschulen',
    comparisonText: 'Auf Wunsch können Sie neben dem Hauptergebnis auch die Verteilung und kurze Hinweise der anderen Schulen anzeigen.',
    comparisonOff: 'Nur die gewählte Schule',
    comparisonOn: 'Auch andere Schulen anzeigen',
    comparisonPanelTitle: 'Verteilung nach Rechtsschule',
    comparisonPanelText: 'Dieser Abschnitt zeigt, wie sich derselbe Fall in anderen Schulen unterscheiden kann. Das Hauptergebnis folgt der gewählten Schule.',
    comparisonNotesTitle: 'Kurze Erklärung der Unterschiede',
    comparisonNotesText: 'Diese Hinweise erklären in einfacher Sprache, warum sich das Ergebnis in diesem Fall zwischen den Schulen unterscheiden kann.',
  },
  es: {
    comparisonTitle: 'Comparación entre escuelas',
    comparisonText: 'Si lo desea, además del resultado principal puede ver la distribución y notas breves de las otras escuelas.',
    comparisonOff: 'Solo la escuela elegida',
    comparisonOn: 'Mostrar también las otras escuelas',
    comparisonPanelTitle: 'Distribución por escuela',
    comparisonPanelText: 'Esta sección muestra cómo puede cambiar el mismo caso en las otras escuelas. El resultado principal sigue la escuela elegida.',
    comparisonNotesTitle: 'Breve explicación de las diferencias',
    comparisonNotesText: 'Estas notas explican de forma sencilla por qué el resultado puede cambiar entre las escuelas en este caso.',
  },
  ar: {
    comparisonTitle: 'مقارنة المذاهب',
    comparisonText: 'يمكنك عند الحاجة إظهار توزيع الأنصبة والملاحظات المختصرة في بقية المذاهب إضافة إلى النتيجة الأساسية.',
    comparisonOff: 'المذهب المختار فقط',
    comparisonOn: 'أظهر بقية المذاهب أيضاً',
    comparisonPanelTitle: 'توزيع الأنصبة بحسب المذهب',
    comparisonPanelText: 'يوضح هذا القسم كيف قد تختلف المسألة نفسها في بقية المذاهب. وتبقى النتيجة الأساسية بحسب المذهب الذي اخترته.',
    comparisonNotesTitle: 'شرح مختصر لفروق المذاهب',
    comparisonNotesText: 'تشرح هذه الملاحظات بلغة سهلة سبب اختلاف النتيجة بين المذاهب في هذه المسألة.',
  },
};

function schoolCardsForRow(row: MadhhabComparisonRow, language: UiLanguage) {
  const notes = [
    { key: 'hanafi', label: SCHOOL_LABELS[language].hanafi, text: row.hanafi },
    { key: 'maliki', label: SCHOOL_LABELS[language].maliki, text: row.maliki },
    { key: 'shafii', label: SCHOOL_LABELS[language].shafii, text: row.shafii },
    { key: 'hanbali', label: SCHOOL_LABELS[language].hanbali, text: row.hanbali },
  ];

  if (!row.relevant) {
    return notes.map((note) => ({ ...note, open: false }));
  }

  const textCounts = new Map<string, number>();
  notes.forEach((note) => {
    textCounts.set(note.text, (textCounts.get(note.text) || 0) + 1);
  });

  let majorityText = notes[0]?.text || '';
  let majorityCount = 0;
  for (const [noteText, count] of textCounts.entries()) {
    if (count > majorityCount) {
      majorityText = noteText;
      majorityCount = count;
    }
  }

  if (textCounts.size <= 1) {
    return notes.map((note, index) => ({ ...note, open: index === 0 }));
  }

  let majorityShown = false;

  return notes.map((note) => {
    if (note.text !== majorityText) {
      return { ...note, open: true };
    }

    if (!majorityShown) {
      majorityShown = true;
      return { ...note, open: true };
    }

    return { ...note, open: false };
  });
}


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  result,
  deceasedGender,
  selectedHeirs,
  caseContext,
  language,
  school,
}) => {
  type MobileTab = 'summary' | 'shares' | 'people' | 'explain';

  const [copyState, setCopyState] = useState<'idle' | 'success' | 'error'>('idle');
  const [shareState, setShareState] = useState<'idle' | 'success' | 'error'>('idle');
  const [showReport, setShowReport] = useState(false);
  const [moneyMode, setMoneyMode] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [netEstateInput, setNetEstateInput] = useState('');
  const [mobileTab, setMobileTab] = useState<MobileTab>('summary');
  const [showManualCopy, setShowManualCopy] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const parsedNetEstate = useMemo(() => {
    const normalized = netEstateInput.replace(/,/g, '.').trim();
    const value = Number(normalized);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [netEstateInput]);

  const hasMoneyValues = moneyMode && parsedNetEstate > 0;
  const displayResult = useMemo(
    () =>
      hasMoneyValues
        ? calculateCase({
            heirs: selectedHeirs,
            deceased: {
              gender: deceasedGender,
              totalEstate: parsedNetEstate,
              caseContext,
            },
          }, school)
        : result,
    [caseContext, deceasedGender, hasMoneyValues, parsedNetEstate, result, school, selectedHeirs],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || language === 'tr') return;

    const translate = (value: string) => translateUiPhrase(value, language);

    root.querySelectorAll<HTMLElement>('*').forEach((element) => {
      if (element.classList.contains('font-arabic') || /[؀-ۿ]/.test(element.textContent || '')) return;
      if (element.hasAttribute('title')) {
        element.setAttribute('title', translate(element.getAttribute('title') || ''));
      }
      if (element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', translate(element.getAttribute('aria-label') || ''));
      }
      if (element instanceof HTMLInputElement && element.placeholder) {
        element.placeholder = translate(element.placeholder);
      }
    });
  }, [language, displayResult, hasMoneyValues, parsedNetEstate]);

  const uiSections = useMemo(
    () => buildUiResultSections(displayResult, hasMoneyValues),
    [displayResult, hasMoneyValues],
  );

  const { activeHeirs, blockedHeirs, perPersonRows, finalBase, perPersonBase } = uiSections;
  const totalDistributed = hasMoneyValues ? activeHeirs.reduce((sum, heirShare) => sum + heirShare.amount, 0) : null;
  const t = (value: string) => translateUiPhrase(value, language);
  const heirName = (type: string, fallback: string) => (language === 'tr' ? fallback : getHeirLabel(type as any, language));
  const heirLabelText = deceasedGender === 'male' ? t('Erkek') : t('Kadın');
  const displaySchoolLabel = SCHOOL_LABELS[language][displayResult.displaySchool as SchoolKey] || SCHOOL_LABELS.tr[displayResult.displaySchool as SchoolKey];
  const copy = RESULT_COPY[language] || RESULT_COPY.tr;

  const spouseOnlyRemainderNote = useMemo(() => {
    if (activeHeirs.length !== 1) return null;
    const onlyHeir = activeHeirs[0];
    if (!onlyHeir || fractionToDecimal(onlyHeir.adjustedShare) >= 1) return null;

    if (displayResult.displaySchool === 'hanafi' && onlyHeir.heir.type === 'husband') {
      return language === 'en'
        ? 'In the Hanafi school, if the husband is the only heir, he receives one half. The remaining half is not returned to him by radd; it is handled separately under the operative Dhawu al-Arham or Bayt al-mal policy.'
        : 'Hanefî çizgide koca tek başına kaldığında 1/2 alır. Kalan 1/2 kocaya redd edilmez; bakiye zevi’l-erhâm veya beytülmâl politikasına göre ayrıca değerlendirilir.';
    }

    if (displayResult.displaySchool === 'hanafi' && onlyHeir.heir.type === 'wife') {
      return language === 'en'
        ? 'In the Hanafi school, if the wife or wives are the only heirs, they receive their fixed share and the remainder is not returned to them by radd. The residue is handled separately under the operative Dhawu al-Arham or Bayt al-mal policy.'
        : 'Hanefî çizgide eş tek başına kaldığında sabit payını alır; kalan kısım eşe redd edilmez. Bakiye zevi’l-erhâm veya beytülmâl politikasına göre ayrıca değerlendirilir.';
    }

    return null;
  }, [activeHeirs, displayResult.displaySchool, language]);

  const combinedWarnings = spouseOnlyRemainderNote
    ? [...displayResult.calculationWarnings, spouseOnlyRemainderNote]
    : displayResult.calculationWarnings;

  const schoolColumnMeta = [
    { key: 'hanafi' as const, label: SCHOOL_LABELS[language].hanafi, base: displayResult.madhhabBases.hanafi || finalBase },
    { key: 'maliki' as const, label: SCHOOL_LABELS[language].maliki, base: displayResult.madhhabBases.maliki || finalBase },
    { key: 'shafii' as const, label: SCHOOL_LABELS[language].shafii, base: displayResult.madhhabBases.shafii || finalBase },
    { key: 'hanbali' as const, label: SCHOOL_LABELS[language].hanbali, base: displayResult.madhhabBases.hanbali || finalBase },
  ];

  const displaySchoolKey = displayResult.displaySchool;
  const isSameFraction = (left?: Fraction, right?: Fraction) => {
    if (!left || !right) return false;
    return left.numerator * right.denominator === right.numerator * left.denominator;
  };

  const isColumnInDisplayView = (row: MadhhabDistributionRow, schoolKey: 'hanafi' | 'maliki' | 'shafii' | 'hanbali') => {
    const displayFraction = row.fractions?.[displaySchoolKey];
    const columnFraction = row.fractions?.[schoolKey];
    const displayBlocked = row.blockedStates?.[displaySchoolKey] ?? !hasPositiveFraction(displayFraction || { numerator: 0, denominator: 1 });
    const columnBlocked = row.blockedStates?.[schoolKey] ?? !hasPositiveFraction(columnFraction || { numerator: 0, denominator: 1 });
    return displayBlocked === columnBlocked && isSameFraction(displayFraction, columnFraction);
  };

  const visibleMadhhabRows = useMemo(
    () => displayResult.madhhabDistributionRows.filter((row) => row.hasAnyPay),
    [displayResult.madhhabDistributionRows],
  );

  const advancedBase = useMemo(() => {
    const denominators = [displayResult.advancedAdjustments?.reservedShare.denominator || 1].concat(
      (displayResult.advancedAdjustments?.guaranteedHeirs || []).map((row) => row.guaranteedShare.denominator),
    );
    return lcmMultiple(denominators.filter(Boolean)) || finalBase;
  }, [displayResult.advancedAdjustments, finalBase]);

  const secondaryNeedsMoney = Boolean(
    caseContext.munasakhatConfig?.enabled &&
      (caseContext.munasakhatConfig.extraEstate || 0) > 0 &&
      !hasMoneyValues,
  );

  const secondaryActiveHeirs = useMemo(
    () => (displayResult.munasakhatOutcome?.heirs || []).filter((row) => !row.blocked && hasPositiveFraction(row.adjustedShare)),
    [displayResult.munasakhatOutcome],
  );

  const secondaryPerPersonRows = useMemo(
    () => buildPerPersonBreakdown(secondaryActiveHeirs, hasMoneyValues),
    [secondaryActiveHeirs, hasMoneyValues],
  );

  const secondaryFinalBase = displayResult.munasakhatOutcome?.adjustedBase || displayResult.munasakhatOutcome?.baseShare || 1;
  const secondaryPerPersonBase = useMemo(() => {
    const denominators = secondaryPerPersonRows.map((row) => row.perPersonShare.denominator).filter(Boolean);
    return lcmMultiple(denominators.length > 0 ? denominators : [secondaryFinalBase]) || secondaryFinalBase;
  }, [secondaryFinalBase, secondaryPerPersonRows]);

  const showSecondaryDistribution = Boolean(
    displayResult.munasakhatOutcome && !secondaryNeedsMoney && secondaryPerPersonRows.length > 0,
  );

  const explanation = buildResultExplanation(displayResult, language);

  const financialSummaryCards = hasMoneyValues && totalDistributed !== null
    ? [
        { label: t('Net tereke'), value: formatCurrency(parsedNetEstate), hint: t('Dağıtıma esas tutar') },
        { label: t('Dağıtılan toplam'), value: formatCurrency(totalDistributed), hint: t('Aktif satırlara dağıtılan toplam kıymet') },
      ]
    : [];

  const summaryCards = [
    { label: t('Pay alan mirasçı'), value: String(activeHeirs.length), hint: blockedHeirs.length > 0 ? t(`${blockedHeirs.length} satır hacbedildi`) : t('Hacbedilen satır yok') },
    { label: t('Seçilen mezhep'), value: displaySchoolLabel, hint: t('Ana özet ve ana tablo bu mezhebe göre hazırlanır') },
    { label: t('Gösterim:'), value: hasMoneyValues ? t('Tutar + oran') : t('Sadece oranlar'), hint: hasMoneyValues ? t('Oranlar tutara çevrildi') : t('Yalnız pay ve kesir gösteriliyor') },
    { label: t('Meselenin aslı'), value: String(displayResult.baseShare), hint: t('Hesabın ilk ortak paydası') },
    { label: t('Nihai payda'), value: String(finalBase), hint: displayResult.hasAvl ? t('Avl sonrası güncellendi') : t('Dağıtımda esas alınan son ortak payda') },
    { label: t('Kişi paydası'), value: String(perPersonBase), hint: t('Kişi başı payları birlikte okumaya yarayan ortak payda') },
  ];

  const summaryText = [
    `${t('Sonuç Özeti')}`,
    `${t('Müteveffa:')} ${heirLabelText}`,
    `${t('Seçilen mezhep')}: ${displaySchoolLabel}`,
    `${t('Gösterim:')} ${hasMoneyValues ? t('Tutar + oran') : t('Oransal')}`,
    ...(hasMoneyValues ? [`${t('Net tereke')}: ${formatCurrency(parsedNetEstate)}`] : []),
    `${t('Pay alan mirasçı')}: ${activeHeirs.length}`,
    '',
    t('Pay Dağılımı'),
    ...perPersonRows.map(({ heirShare, perPersonShare, groupAmount, perPersonAmount }) => {
      const groupShareText = normalizeHeirShareText(heirShare, finalBase).primary;
      const personShareText = normalizeFractionText(perPersonShare, perPersonBase).primary;
      const amountText = hasMoneyValues && typeof perPersonAmount === 'number' && typeof groupAmount === 'number'
        ? ` • ${t('Kişi başı').toLowerCase()} ${formatCurrency(perPersonAmount)} • ${t('Grup toplamı').toLowerCase()} ${formatCurrency(groupAmount)}`
        : '';
      return `${heirName(heirShare.heir.type, heirShare.heir.label)}${heirShare.heir.count > 1 ? ` x${heirShare.heir.count}` : ''}: ${t('Kişi başı').toLowerCase()} ${personShareText} • ${t('Grup toplamı').toLowerCase()} ${groupShareText}${amountText}`;
    }),
    '',
    t('Uyarılar ve ihtiyat notları'),
    ...(combinedWarnings.length > 0 ? combinedWarnings.map((warning) => t(warning)) : [t('Bu sonuç için ek uyarı veya ihtiyat notu bulunmuyor.')]),
  ].join('\n');

  const shareUrl = useMemo(
    () => buildShareUrl({ gender: deceasedGender, selectedHeirs, caseContext, selectedSchool: school }),
    [caseContext, deceasedGender, school, selectedHeirs],
  );

  const copyText = async (value: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return;
    }

    const area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', 'true');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.focus();
    area.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(area);
    if (!ok) throw new Error('copy failed');
  };

  const flashState = (setter: (value: any) => void, value: 'success' | 'error') => {
    setter(value);
    window.setTimeout(() => setter('idle'), 2200);
  };

  const handleCopySummary = async () => {
    try {
      await copyText(summaryText);
      setShowManualCopy(false);
      flashState(setCopyState as any, 'success');
    } catch (error) {
      console.error(error);
      setShowManualCopy(true);
      flashState(setCopyState as any, 'error');
    }
  };

  const handleShare = async () => {
    const sharePayload = { title: t('Feraiz Hesap Özeti'), text: summaryText, url: shareUrl };
    try {
      if (navigator.share) {
        await navigator.share(sharePayload);
      } else {
        await copyText(`${summaryText}\n\n${shareUrl}`);
      }
      flashState(setShareState as any, 'success');
    } catch (error) {
      console.error(error);
      flashState(setShareState as any, 'error');
    }
  };

  const handleSummaryPdf = () => {
    const popup = window.open('', '_blank', 'width=900,height=1200');
    if (!popup) return;

    const warningHtml = (combinedWarnings.length > 0 ? combinedWarnings : [t('Bu sonuç için ek uyarı veya ihtiyat notu bulunmuyor.')])
      .map((warning) => `<li>${t(warning)}</li>`)
      .join('');

    const rowsHtml = perPersonRows
      .map(({ heirShare, perPersonShare, groupAmount, perPersonAmount }) => {
        const groupShareText = normalizeHeirShareText(heirShare, finalBase).primary;
        const personShareText = normalizeFractionText(perPersonShare, perPersonBase).primary;
        const moneyText = hasMoneyValues && typeof groupAmount === 'number' && typeof perPersonAmount === 'number'
          ? `<div class="muted">Kişi başı ${formatCurrency(perPersonAmount)} • Grup ${formatCurrency(groupAmount)}</div>`
          : '';
        return `<tr><td>${heirName(heirShare.heir.type, heirShare.heir.label)}</td><td>${heirShare.heir.count}</td><td>${personShareText}</td><td>${groupShareText}</td><td>${fractionToPercentage(heirShare.adjustedShare)}</td></tr><tr><td colspan="5">${moneyText}</td></tr>`;
      })
      .join('');

    popup.document.write(`<!doctype html><html><head><meta charset="utf-8" /><title>${t('Feraiz Hesap Özeti')}</title><style>body{font-family:Inter,Arial,sans-serif;padding:32px;color:#1c1917}h1{font-size:24px;margin:0 0 8px}h2{font-size:16px;margin:24px 0 12px}p,li,td,th{font-size:13px;line-height:1.6}table{width:100%;border-collapse:collapse;margin-top:8px}th,td{border:1px solid #e7e5e4;padding:10px;text-align:left;vertical-align:top}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.card{border:1px solid #e7e5e4;border-radius:14px;padding:12px}.muted{color:#78716c;font-size:12px}.note{margin-top:24px;font-size:12px;color:#57534e}</style></head><body><h1>${t('Feraiz Hesap Özeti')}</h1><p>${t('Seçilen mezhep')}: ${displaySchoolLabel} • ${t('Müteveffa:')} ${heirLabelText}${hasMoneyValues ? ` • ${t('Net tereke')}: ${formatCurrency(parsedNetEstate)}` : ''}</p><div class="grid">${summaryCards.slice(0,4).map((item) => `<div class="card"><strong>${item.label}</strong><div>${item.value}</div><div class="muted">${item.hint}</div></div>`).join('')}</div><h2>${t('Pay Dağılımı')}</h2><table><thead><tr><th>${t('Mirasçı')}</th><th>${t('Sayı')}</th><th>${t('Kişi başı')}</th><th>${t('Grup toplamı')}</th><th>${t('Yüzde')}</th></tr></thead><tbody>${rowsHtml}</tbody></table><h2>${t('Uyarılar ve ihtiyat notları')}</h2><ul>${warningHtml}</ul><div class="note">${t('Bu araç öğretici bir yardımcıdır. İleri, ihtilaflı veya resmî işleme konu dosyalarda ehil bir fetva makamına başvurulmalıdır.')}</div><script>window.onload=()=>{window.print();}</script></body></html>`);
    popup.document.close();
  };

  const mobileTabs: Array<{ key: MobileTab; label: string }> = [
    { key: 'summary', label: t('Özet') },
    { key: 'shares', label: t('Paylar') },
    { key: 'people', label: t('Kişi başı') },
    { key: 'explain', label: t('Açıklama') },
  ];

  const mobileSectionClass = (tab: MobileTab) => `${mobileTab === tab ? 'block' : 'hidden'} md:block`;
  const mobileSummaryHighlights = [...financialSummaryCards, ...summaryCards].slice(0, financialSummaryCards.length > 0 ? 5 : 4);

  return (
    <div ref={rootRef} className="space-y-6 md:space-y-8 pb-24 md:pb-0 min-w-0">
      <div className="md:hidden sticky top-2 z-20 rounded-[20px] border border-stone-200 bg-white/95 px-4 py-3 shadow-[0_10px_30px_rgba(28,25,23,0.08)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-stone-500">{displaySchoolLabel}</p>
            <p className="truncate text-sm font-semibold text-stone-950">{activeHeirs.length} {t('pay alan mirasçı')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-500">/{finalBase}</p>
            {hasMoneyValues && <p className="text-sm font-semibold text-stone-950">{formatCurrency(parsedNetEstate)}</p>}
          </div>
        </div>
      </div>

      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-3 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-stone-900">{t('Sonuç Özeti')}</h3>
              {displayResult.tentative && <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">{t('Temkinli sonuç')}</span>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-700">
              <span><span className="text-stone-500">{t('Müteveffa:')}</span> {heirLabelText}</span>
              <span><span className="text-stone-500">{t('Seçilen mezhep')}:</span> {displaySchoolLabel}</span>
              <span><span className="text-stone-500">{t('Gösterim:')}</span> {hasMoneyValues ? t('Tutar + oran') : t('Oransal')}</span>
              {hasMoneyValues && <span><span className="text-stone-500">{t('Net tereke')}:</span> {formatCurrency(parsedNetEstate)}</span>}
            </div>
            {showManualCopy && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-medium text-amber-900">{t('Otomatik kopyalama başarısız oldu. Aşağıdaki özeti manuel olarak kopyalayabilirsiniz.')}</p>
                <textarea readOnly value={summaryText} className="mt-3 min-h-[180px] w-full rounded-2xl border border-amber-200 bg-white p-3 text-sm text-stone-700" />
              </div>
            )}
          </div>

          <div className="hidden md:flex gap-3 no-print flex-wrap">
            <button type="button" onClick={handleCopySummary} className="btn btn-secondary">{copyState === 'success' ? t('Özet kopyalandı') : copyState === 'error' ? t('Kopyalama başarısız') : t('Özeti kopyala')}</button>
            <button type="button" onClick={handleShare} className="btn btn-secondary">{shareState === 'success' ? t('Paylaşıma hazır') : shareState === 'error' ? t('Paylaşım başarısız') : t('Paylaş')}</button>
            <button type="button" onClick={() => setShowReport(true)} className="btn btn-secondary">{language === 'en' ? 'Calculation Report' : language === 'de' ? 'Berechnungsbericht' : language === 'es' ? 'Informe de cálculo' : language === 'ar' ? 'تقرير الحساب' : 'Hesaplama Raporu'}</button>
            <button type="button" onClick={handleSummaryPdf} className="btn btn-primary">{t('Özet PDF indir')}</button>
            <button type="button" onClick={() => window.print()} className="btn btn-secondary">{t('Detaylı yazdır')}</button>
          </div>
        </div>
      </section>

      <div className="md:hidden space-y-3 no-print">
        <div className="rounded-[20px] border border-stone-200 bg-white/90 p-3 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={handleCopySummary} className="rounded-2xl border border-stone-200 bg-white px-3 py-3 text-xs font-medium text-stone-700">
              {copyState === 'success' ? t('Rapor kopyalandi') : copyState === 'error' ? t('Kopyalama basarisiz') : t('Raporu kopyala')}
            </button>
            <button type="button" onClick={handleSummaryPdf} className="rounded-2xl border border-stone-200 bg-stone-100 px-3 py-3 text-xs font-medium text-stone-800">
              {t('Ozet PDF indir')}
            </button>
          </div>
          <div className="mt-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              {mobileSummaryHighlights.map((item) => (
                <div key={`mobile-highlight-${item.label}`} className="min-w-[152px] rounded-2xl border border-stone-200 bg-stone-50/70 px-3 py-3">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-stone-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-stone-900 break-words">{item.value}</p>
                  <p className="mt-1 text-[11px] leading-5 text-stone-500">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[20px] border border-stone-200 bg-white/90 p-2 shadow-[0_10px_30px_rgba(28,25,23,0.05)]">
          <div className="grid grid-cols-4 gap-2">
            {mobileTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setMobileTab(tab.key)}
                className={`rounded-2xl px-3 py-2 text-xs font-medium ${mobileTab === tab.key ? 'bg-stone-900 text-white border border-stone-900' : 'bg-white text-stone-600 border border-stone-200'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={mobileSectionClass('summary')}>
        <div className={`rounded-[24px] border p-5 md:p-6 ${combinedWarnings.length > 0 ? 'border-amber-200 bg-amber-50' : 'border-emerald-200 bg-emerald-50/70'}`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{combinedWarnings.length > 0 ? '⚠️' : '✓'}</span>
            <div className="space-y-3 min-w-0">
              <h4 className={`font-medium ${combinedWarnings.length > 0 ? 'text-amber-900' : 'text-emerald-900'}`}>{t('Uyarılar ve ihtiyat notları')}</h4>
              {combinedWarnings.length > 0 ? (
                <ul className="space-y-2 text-sm text-amber-900 list-disc pl-5">
                  {combinedWarnings.map((warning, index) => <li key={`warning-${index}`}>{renderGlossaryAwareText(t(warning), language)}</li>)}
                </ul>
              ) : (
                <p className="text-sm text-emerald-900">{t('Bu sonuç için ek uyarı veya ihtiyat notu bulunmuyor.')}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] gap-4 items-stretch min-w-0">
          <div className="space-y-4 h-full min-w-0">
            {financialSummaryCards.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {financialSummaryCards.map((item) => (
                  <div key={item.label} className="ui-metric-card ui-metric-card-strong rounded-[22px] p-5 min-w-0">
                    <p className="text-sm text-stone-500">{item.label}</p>
                    <p className="ui-kpi mt-2 text-2xl md:text-[1.7rem] break-words">{item.value}</p>
                    <p className="mt-2 text-xs text-stone-500 leading-5">{item.hint}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {summaryCards.map((item) => (
                <div key={item.label} className="ui-metric-card rounded-[22px] p-5 min-w-0">
                  <p className="text-sm text-stone-500">{item.label}</p>
                  <p className="ui-kpi mt-2 text-2xl md:text-[1.7rem] break-words">{item.value}</p>
                  <p className="mt-2 text-xs text-stone-500 leading-5">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ui-metric-card rounded-[22px] p-5 h-full flex flex-col min-h-full min-w-0">
            <div>
              <p className="text-sm text-stone-500">{t('Görünüm seçenekleri')}</p>
              <p className="mt-1 text-xs text-stone-500">{t('Parasal gösterim ve mezhep kıyaslama ayarları tek alanda toplanmıştır.')}</p>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-1 content-start flex-1">
              <div className="rounded-[18px] border border-stone-200 bg-stone-50/70 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">{t('Parasal gösterim')}</p>
                <div className="mt-3 flex flex-wrap gap-2 no-print">
                  <button type="button" onClick={() => setMoneyMode(false)} className={`ui-pill px-3 py-2 text-sm ${!moneyMode ? 'ui-pill-active' : ''}`}>{t('Sadece oranlar')}</button>
                  <button type="button" onClick={() => setMoneyMode(true)} className={`ui-pill px-3 py-2 text-sm ${moneyMode ? 'ui-pill-active' : ''}`}>{t('Tutarı da göster')}</button>
                </div>
                {moneyMode && (
                  <label className="mt-4 block">
                    <span className="text-xs font-medium text-stone-700">{t('Dağıtıma esas net tereke')}</span>
                    <div className="relative mt-2">
                      <input type="number" min="0" step="0.01" value={netEstateInput} onChange={(event) => setNetEstateInput(event.target.value)} placeholder={t('Örn: 720000')} className="input pr-12" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">₺</span>
                    </div>
                    <p className="mt-2 text-xs text-stone-500 leading-5">{hasMoneyValues ? `${t('Oranlar')} ${formatCurrency(parsedNetEstate)} ${t('net tereke üzerinden hesaplandı.')}` : t('Parasal gösterim için net terekeyi giriniz.')}</p>
                  </label>
                )}
              </div>

              <div className="rounded-[18px] border border-stone-200 bg-stone-50/70 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">{copy.comparisonTitle}</p>
                <div className="mt-3 flex flex-wrap gap-2 no-print">
                  <button type="button" onClick={() => setShowComparison(false)} className={`ui-pill px-3 py-2 text-sm ${!showComparison ? 'ui-pill-active' : ''}`}>{copy.comparisonOff}</button>
                  <button type="button" onClick={() => setShowComparison(true)} className={`ui-pill px-3 py-2 text-sm ${showComparison ? 'ui-pill-active' : ''}`}>{copy.comparisonOn}</button>
                </div>
                <p className="mt-3 text-xs leading-5 text-stone-500">{copy.comparisonText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={mobileSectionClass('shares')}>
        {/* ── Pay Dağılımı Grafiği ── */}
        {activeHeirs.length > 0 && (() => {
          const CHART_COLORS = [
            '#1a4a2e', '#2d6b45', '#4a8460', '#6ba87a',
            '#b07c2a', '#c89444', '#d4a85c', '#e0c080',
            '#3d6b4a', '#5a8c66', '#8ab09a', '#2a5c38',
          ];
          const slices = activeHeirs.map((hs, i) => ({
            pct: fractionToDecimal(hs.adjustedShare),
            label: heirName(hs.heir.type, hs.heir.label),
            arabic: hs.heir.labelArabic,
            count: hs.heir.count,
            pctStr: fractionToPercentage(hs.adjustedShare),
            color: CHART_COLORS[i % CHART_COLORS.length],
          }));

          // Build donut path arcs
          const R = 80, r = 50, cx = 110, cy = 110;
          let cumPct = 0;
          const paths = slices.map((s) => {
            const startAngle = cumPct * 2 * Math.PI - Math.PI / 2;
            cumPct += s.pct;
            const endAngle = cumPct * 2 * Math.PI - Math.PI / 2;
            const x1 = cx + R * Math.cos(startAngle);
            const y1 = cy + R * Math.sin(startAngle);
            const x2 = cx + R * Math.cos(endAngle);
            const y2 = cy + R * Math.sin(endAngle);
            const ix1 = cx + r * Math.cos(endAngle);
            const iy1 = cy + r * Math.sin(endAngle);
            const ix2 = cx + r * Math.cos(startAngle);
            const iy2 = cy + r * Math.sin(startAngle);
            const large = s.pct > 0.5 ? 1 : 0;
            // midpoint for label line
            const midAngle = startAngle + (endAngle - startAngle) / 2;
            return {
              ...s,
              d: `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix1.toFixed(2)},${iy1.toFixed(2)} A${r},${r} 0 ${large},0 ${ix2.toFixed(2)},${iy2.toFixed(2)} Z`,
              midAngle,
            };
          });

          return (
            <div className="rounded-[24px] border border-stone-200 bg-white/90 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl overflow-hidden mb-4 no-print">
              <div className="px-5 py-4 md:px-6 md:py-5 border-b border-stone-200" style={{background: 'linear-gradient(90deg, var(--brand-lighter) 0%, transparent 100%)'}}>
                <h3 className="text-sm font-semibold" style={{color: 'var(--brand-primary)'}}>{t('Pay Dağılımı Grafiği')}</h3>
              </div>
              <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Donut SVG */}
                <div className="flex-shrink-0">
                  <svg width="220" height="220" viewBox="0 0 220 220" role="img" aria-label={t('Pay dağılımı pasta grafiği')}>
                    {paths.map((p, i) => (
                      <path key={i} d={p.d} fill={p.color} stroke="var(--surface-strong)" strokeWidth="2" />
                    ))}
                    {/* center label */}
                    <circle cx={cx} cy={cy} r={r - 2} fill="var(--surface-strong)" />
                    <text x={cx} y={cy - 8} textAnchor="middle" fontSize="11" fill="var(--text-3)" fontFamily="Inter, sans-serif">{t('Toplam')}</text>
                    <text x={cx} y={cy + 10} textAnchor="middle" fontSize="22" fontWeight="600" fill="var(--brand-primary)" fontFamily="Inter, sans-serif">{activeHeirs.length}</text>
                    <text x={cx} y={cy + 26} textAnchor="middle" fontSize="11" fill="var(--text-3)" fontFamily="Inter, sans-serif">{t('mirasçı')}</text>
                  </svg>
                </div>
                {/* Legend */}
                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2 content-start w-full">
                  {paths.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 border border-stone-100 bg-stone-50/60">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{background: p.color}} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-stone-800 truncate">{p.label}</p>
                        {p.arabic && <p className="font-arabic text-xs text-stone-400 mt-0.5">{p.arabic}</p>}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold" style={{color: p.color}}>{p.pctStr}</p>
                        {p.count > 1 && <p className="text-[11px] text-stone-400">×{p.count}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        <section className="rounded-[24px] border border-stone-200 bg-white/90 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl overflow-hidden min-w-0">
          <div className="px-5 py-4 md:px-6 md:py-5 border-b border-stone-200 bg-gradient-to-r from-emerald-50 to-white">
            <h3 className="text-sm font-semibold text-stone-900">{t('Pay Dağılımı')}</h3>
            <p className="text-sm text-stone-500 mt-1"><GlossaryTerm term={t('Kişi başı pay')} description={t('Aynı grupta birden fazla mirasçı varsa her bir ferdin tek tek aldığı kesirdir.')} /> {t('ve grup toplamı birlikte gösterilir.')}</p>
          </div>

          <div className="md:hidden space-y-3 p-4">
            {perPersonRows.map(({ heirShare, perPersonShare, groupAmount, perPersonAmount }) => {
              const shareTypeMeta = SHARE_TYPE_META[heirShare.shareType];
              const normalizedGroupShare = normalizeHeirShareText(heirShare, finalBase);
              const normalizedPersonShare = normalizeFractionText(perPersonShare, perPersonBase);
              return (
                <article key={`mobile-${heirShare.heir.type}`} className="rounded-[20px] border border-stone-200 bg-stone-50/70 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900 break-words">{heirName(heirShare.heir.type, heirShare.heir.label)}</p>
                      <p className="font-arabic text-sm text-stone-400 mt-0.5">{heirShare.heir.labelArabic}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${shareTypeMeta.className}`}>
                      <GlossaryTerm term={t(buildShareTypeLabel(heirShare))} description={t(shareTypeMeta.description)} className="border-b-0" />
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl border border-stone-200 bg-white p-3">
                      <p className="text-xs text-stone-500">{t('Kişi başı')}</p>
                      <p className="mt-1 font-mono text-stone-900 break-all">{normalizedPersonShare.primary}</p>
                      {normalizedPersonShare.secondary && <p className="mt-1 text-[11px] text-stone-500">= {normalizedPersonShare.secondary}</p>}
                      {hasMoneyValues && typeof perPersonAmount === 'number' && <p className="mt-1 text-[11px] font-semibold text-stone-900">≈ {formatCurrency(perPersonAmount)}</p>}
                    </div>
                    <div className="rounded-2xl border border-stone-200 bg-white p-3">
                      <p className="text-xs text-stone-500">{t('Grup toplamı')}</p>
                      <p className="mt-1 font-mono text-stone-900 break-all">{normalizedGroupShare.primary}</p>
                      {normalizedGroupShare.secondary && <p className="mt-1 text-[11px] text-stone-500">= {normalizedGroupShare.secondary}</p>}
                      {hasMoneyValues && typeof groupAmount === 'number' && <p className="mt-1 text-[11px] font-semibold text-stone-900">≈ {formatCurrency(groupAmount)}</p>}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-stone-600">
                    <span>{t('Sayı')}: {heirShare.heir.count}</span>
                    <span>{t('Yüzde')}: {fractionToPercentage(heirShare.adjustedShare)}</span>
                  </div>
                  {heirShare.note && <p className="mt-2 text-xs leading-5 text-stone-500">{t(heirShare.note)}</p>}
                </article>
              );
            })}
          </div>

          <div className="hidden md:block overflow-hidden">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="px-4 py-3 md:px-6 text-left text-xs font-medium text-stone-500 uppercase tracking-wider w-[24%]">{t('Mirasçı')}</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider w-[8%]">{t('Sayı')}</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider w-[14%]">{t('Tür')}</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider w-[20%]">{`${t('Kişi başı')} (/${perPersonBase})`}</th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-stone-500 uppercase tracking-wider w-[20%]">{`${t('Grup Payı')} (/${finalBase})`}</th>
                  <th className="px-4 py-3 md:px-6 text-center text-xs font-medium text-stone-500 uppercase tracking-wider w-[14%]">{t('Yüzde')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {perPersonRows.map(({ heirShare, perPersonShare, groupAmount, perPersonAmount }) => {
                  const shareTypeMeta = SHARE_TYPE_META[heirShare.shareType];
                  const normalizedGroupShare = normalizeHeirShareText(heirShare, finalBase);
                  const normalizedPersonShare = normalizeFractionText(perPersonShare, perPersonBase);
                  return (
                    <tr key={heirShare.heir.type} className="hover:bg-stone-50/80 align-top">
                      <td className="px-4 py-4 md:px-6">
                        <p className="font-medium text-stone-900 break-words">{heirName(heirShare.heir.type, heirShare.heir.label)}</p>
                        <p className="font-arabic text-sm text-stone-400 mt-0.5">{heirShare.heir.labelArabic}</p>
                        {heirShare.note && <p className="text-xs text-stone-500 mt-2 leading-5">{t(heirShare.note)}</p>}
                      </td>
                      <td className="px-2 py-4 text-center text-stone-600">{heirShare.heir.count}</td>
                      <td className="px-2 py-4 text-center"><span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${shareTypeMeta.className}`}><GlossaryTerm term={t(buildShareTypeLabel(heirShare))} description={t(shareTypeMeta.description)} className="border-b-0" /></span></td>
                      <td className="px-2 py-4 text-center font-mono text-stone-900 break-all"><p>{normalizedPersonShare.primary}</p>{normalizedPersonShare.secondary && <p className="mt-1 text-[11px] font-normal text-stone-500">= {normalizedPersonShare.secondary}</p>}{hasMoneyValues && typeof perPersonAmount === 'number' && <p className="mt-1 text-[11px] font-normal text-stone-600">≈ {formatCurrency(perPersonAmount)}</p>}</td>
                      <td className="px-2 py-4 text-center font-mono text-stone-900 break-all"><p>{normalizedGroupShare.primary}</p>{normalizedGroupShare.secondary && <p className="mt-1 text-[11px] font-normal text-stone-500">= {normalizedGroupShare.secondary}</p>}{hasMoneyValues && typeof groupAmount === 'number' && <p className="mt-1 text-[11px] font-normal text-stone-600">≈ {formatCurrency(groupAmount)}</p>}</td>
                      <td className="px-4 py-4 md:px-6 text-center text-stone-600">{fractionToPercentage(heirShare.adjustedShare)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {displayResult.excludedSummaries.length > 0 && (
          <div className="mt-4 rounded-[24px] border border-amber-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🚫</span>
              <div><h3 className="text-sm font-semibold text-stone-900">{t('Miras Engeli Nedeniyle Düşen Kişiler')}</h3></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayResult.excludedSummaries.map((summary) => (
                <div key={`excluded-${summary.heirType}`} className="rounded-[18px] border border-amber-200 bg-amber-50/70 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-amber-950">{heirName(summary.heirType, summary.label)}</p>
                      <p className="text-xs text-amber-800 mt-1">{buildImpedimentText(summary, language)}</p>
                    </div>
                    <span className="text-xs rounded-full border border-amber-200 bg-white px-2.5 py-1 text-amber-700">{summary.excludedCount} {t('düşüldü')}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-xl border border-amber-200 bg-white px-3 py-2"><p className="text-xs text-amber-700">Toplam</p><p className="font-semibold text-stone-900">{summary.originalCount}</p></div>
                    <div className="rounded-xl border border-amber-200 bg-white px-3 py-2"><p className="text-xs text-amber-700">Engelli</p><p className="font-semibold text-stone-900">{summary.excludedCount}</p></div>
                    <div className="rounded-xl border border-amber-200 bg-white px-3 py-2"><p className="text-xs text-amber-700">Etkin</p><p className="font-semibold text-stone-900">{summary.effectiveCount}</p></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {blockedHeirs.length > 0 && (
          <div className="mt-4 rounded-[24px] border border-red-200 bg-red-50/80 p-5 md:p-6">
            <h3 className="text-sm font-semibold text-red-900 mb-4">{t('Pay alamayan mirasçılar')} (<GlossaryTerm term={getGlossaryLabel('hajb', language)} description={getGlossaryDescription('hajb', language)} />)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blockedHeirs.map((heirShare) => (
                <div key={`blocked-${heirShare.heir.type}`} className="rounded-[18px] border border-stone-300 bg-stone-100/90 p-4 opacity-90">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-red-900">{heirName(heirShare.heir.type, heirShare.heir.label)}</p>
                      <p className="font-arabic text-sm text-red-700/70 mt-0.5">{heirShare.heir.labelArabic}</p>
                    </div>
                    <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">{t('Hacb')}</span>
                  </div>
                  {(heirShare.blockedByNames?.length || heirShare.note) && (
                    <div className="mt-3 text-sm text-red-700 space-y-1">
                      {heirShare.blockedByNames && heirShare.blockedByNames.length > 0 && <p><span className="font-medium">{t('Engelleyen:')}</span> {heirShare.blockedByNames.map((name) => t(name)).join(', ')}</p>}
                      {heirShare.note && <p>{t(heirShare.note)}</p>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showComparison && visibleMadhhabRows.length > 0 && (
          <div className="mt-4 rounded-[24px] border border-stone-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-stone-900">{copy.comparisonPanelTitle}</h3>
              <p className="text-sm text-stone-500 mt-1">{copy.comparisonPanelText}</p>
            </div>
            <div className="space-y-3">
              {visibleMadhhabRows.map((row) => (
                <div key={`madhhab-share-${row.heirType}`} className="rounded-[18px] border border-stone-200 bg-stone-50/70 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-stone-900">{heirName(row.heirType, row.label)}</p>
                      <p className="font-arabic text-sm text-stone-400 mt-0.5">{row.labelArabic}</p>
                    </div>
                    <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-600">{t('Adet:')} {row.count}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {schoolColumnMeta.map((column) => {
                      const cellValue = row[column.key];
                      const isAlignedWithDisplay = isColumnInDisplayView(row, column.key);
                      const hasPay = row.payState?.[column.key as 'hanafi' | 'maliki' | 'shafii' | 'hanbali'];
                      const differsFromDisplay = !isAlignedWithDisplay;
                      return (
                        <div key={`${row.heirType}-${column.key}`} className={`rounded-xl border px-3 py-3 text-center ${isAlignedWithDisplay ? 'border-emerald-200 bg-emerald-50/70' : 'border-stone-200 bg-white'}`}>
                          <div className="flex items-center justify-center gap-2">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-stone-500">{column.label}</p>
                            {isAlignedWithDisplay && <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[10px] font-medium text-emerald-700">{t('Ana sonuç')}</span>}
                          </div>
                          <p className="mt-1 text-[11px] text-stone-400">/{column.base}</p>
                          <p className={`mt-2 font-mono text-sm break-all ${isAlignedWithDisplay ? 'text-emerald-700' : 'text-stone-800'}`}>{hasPay ? cellValue : ''}</p>
                          {!hasPay && <p className="mt-2 text-[11px] text-stone-400">{t('Pay yok')}</p>}
                          {hasPay && differsFromDisplay && <p className="mt-2 text-[11px] text-stone-400">{t('Ana sonuçtan farklı')}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={mobileSectionClass('people')}>
        <div className="rounded-[24px] border border-stone-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-stone-900 mb-1">{t('Kişi Başı Paylar')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
            {perPersonRows.map(({ heirShare, perPersonShare, groupAmount, perPersonAmount }) => {
              const normalizedPersonShare = normalizeFractionText(perPersonShare, perPersonBase);
              const normalizedGroupShare = normalizeHeirShareText(heirShare, finalBase);
              return (
                <div key={`person-${heirShare.heir.type}`} className="rounded-[20px] p-4 border border-stone-200 bg-stone-50/70 space-y-3">
                  <div>
                    <p className="font-medium text-stone-900">{heirName(heirShare.heir.type, heirShare.heir.label)}</p>
                    <p className="text-xs text-stone-500 mt-1">{heirShare.heir.count > 1 ? t(`${heirShare.heir.count} kişilik grupta kişi başı pay`) : t('Tek kişi payı')}</p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white px-3 py-3">
                    <p className="text-xs text-stone-500 uppercase tracking-wider">{t('Kişi başı pay')}</p>
                    <p className="mt-1 font-mono text-xl font-semibold text-stone-950">{normalizedPersonShare.primary}</p>
                    {normalizedPersonShare.secondary && <p className="mt-1 text-xs text-stone-500">= {normalizedPersonShare.secondary}</p>}
                    {hasMoneyValues && typeof perPersonAmount === 'number' && <p className="mt-2 text-sm font-semibold text-stone-900">≈ {formatCurrency(perPersonAmount)}</p>}
                  </div>
                  <div className="text-sm text-stone-600"><span className="text-stone-500">{t('Grup toplamı:')}</span> {normalizedGroupShare.primary}{hasMoneyValues && typeof groupAmount === 'number' && <span>{` • ≈ ${formatCurrency(groupAmount)}`}</span>}</div>
                </div>
              );
            })}
          </div>
        </div>

        {displayResult.advancedAdjustments?.active && (
          <div className="mt-4 rounded-[24px] border border-emerald-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <h3 className="text-sm font-semibold text-stone-900">{t('İhtiyatlı dağıtım ve bekletilen pay')}</h3>
                <p className="mt-1 text-sm text-stone-500"><GlossaryTerm term={getGlossaryLabel('haml', language)} description={getGlossaryDescription('haml', language)} />, <GlossaryTerm term={getGlossaryLabel('khunsa', language)} description={getGlossaryDescription('khunsa', language)} /> ve <GlossaryTerm term={getGlossaryLabel('mafqud', language)} description={getGlossaryDescription('mafqud', language)} /> {t('için ayrılan ihtiyat payı burada gösterilir.')}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
              <div className="rounded-[22px] border border-emerald-200 bg-emerald-50/70 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">{t('Bekletilecek pay')}</p>
                <div className="mt-3 font-mono text-2xl font-semibold text-stone-950">{normalizeFractionText(displayResult.advancedAdjustments.reservedShare, advancedBase).primary}</div>
                {hasMoneyValues && <p className="mt-3 text-lg font-semibold text-stone-900">≈ {formatCurrency(displayResult.advancedAdjustments.reservedAmount)}</p>}
              </div>
              <div className="rounded-[22px] border border-stone-200 bg-stone-50/70 p-5">
                <p className="text-sm font-semibold text-stone-900">{t('Teminatlı pay verilen satırlar')}</p>
                <div className="mt-4 space-y-3">
                  {displayResult.advancedAdjustments.guaranteedHeirs.map((row) => {
                    const guaranteedText = normalizeFractionText(row.guaranteedShare, advancedBase);
                    const actualText = normalizeFractionText(row.actualShare, advancedBase);
                    return (
                      <div key={`guaranteed-${row.heirType}`} className="rounded-2xl border border-stone-200 bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="font-medium text-stone-900">{t(row.label)}</p>
                          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">{t('Garanti pay')}</span>
                        </div>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3"><p className="text-xs text-stone-500">{t('Garanti edilen')}</p><p className="mt-1 font-mono text-stone-900">{guaranteedText.primary}</p>{hasMoneyValues && <p className="mt-1 text-xs font-semibold text-stone-900">≈ {formatCurrency(row.guaranteedAmount)}</p>}</div>
                          <div className="rounded-xl border border-stone-200 bg-stone-50 p-3"><p className="text-xs text-stone-500">{t('Bu senaryodaki fiilî pay')}</p><p className="mt-1 font-mono text-stone-900">{actualText.primary}</p>{hasMoneyValues && <p className="mt-1 text-xs font-semibold text-stone-900">≈ {formatCurrency(row.actualAmount)}</p>}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {secondaryNeedsMoney && (
          <div className="mt-4 rounded-[24px] border border-amber-200 bg-amber-50 p-5 md:p-6">
            <div className="flex gap-3"><span className="text-2xl">🔁</span><div><h4 className="font-medium text-amber-900"><GlossaryTerm term={getGlossaryLabel('munasakhat', language)} description={getGlossaryDescription('munasakhat', language)} /> {t('için net tereke gerekiyor')}</h4><p className="text-sm text-amber-700 mt-1 leading-6">{t('İkinci tereke için ayrıca mal girildiyse, ilk mirastan gelen payın parasal karşılığı bilinmeden ikinci dağıtım kesinleştirilemez. Yukarıdaki net tereke alanına tutar girildiğinde bu tablo otomatik açılır.')}</p></div></div>
          </div>
        )}

        {showSecondaryDistribution && displayResult.munasakhatOutcome && (
          <div className="mt-4 rounded-[24px] border border-emerald-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
            <div className="flex items-start gap-3 mb-5"><span className="text-2xl">🔁</span><div><h3 className="text-sm font-semibold text-stone-900"><GlossaryTerm term={getGlossaryLabel('munasakhat', language)} description={getGlossaryDescription('munasakhat', language)} />: {t('İkinci tereke')}</h3><p className="text-sm text-stone-500 mt-1">{t('İlk mirastan pay alan')} {t(displayResult.munasakhatOutcome.sourceHeirLabel)} {t('için ikinci dağıtım otomatik olarak hesaplandı.')}</p></div></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3"><p className="text-xs text-emerald-700">{t('İlk mirastan gelen hisse')}</p><p className="mt-1 font-semibold text-stone-900">{hasMoneyValues ? formatCurrency(displayResult.munasakhatOutcome.inheritedAmount) : t('Oransal aktarım')}</p>{!hasMoneyValues && <p className="mt-1 text-xs text-stone-500">{t('Parasal değer için net tereke giriniz.')}</p>}</div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3"><p className="text-xs text-emerald-700">{t('Ek tereke')}</p><p className="mt-1 font-semibold text-stone-900">{hasMoneyValues ? formatCurrency(displayResult.munasakhatOutcome.extraEstate) : t('Varsa parasal olarak eklenir')}</p></div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3"><p className="text-xs text-emerald-700">{t('İkinci toplam')}</p><p className="mt-1 font-semibold text-stone-900">{hasMoneyValues ? formatCurrency(displayResult.munasakhatOutcome.totalEstate) : t('İlk hisseden hareketle oluşur')}</p></div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3"><p className="text-xs text-emerald-700">{t('İkinci payda')}</p><p className="mt-1 font-semibold text-stone-900">/{displayResult.munasakhatOutcome.adjustedBase || displayResult.munasakhatOutcome.baseShare}</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {secondaryPerPersonRows.map(({ heirShare, perPersonShare, groupAmount, perPersonAmount }) => {
                const personText = normalizeFractionText(perPersonShare, secondaryPerPersonBase);
                const groupText = normalizeHeirShareText(heirShare, secondaryFinalBase);
                return <div key={`secondary-${heirShare.heir.type}`} className="rounded-[18px] border border-stone-200 bg-stone-50/70 p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium text-stone-900">{heirName(heirShare.heir.type, heirShare.heir.label)}</p><p className="text-xs text-stone-500 mt-1">{heirShare.heir.count > 1 ? t(`${heirShare.heir.count} kişilik grupta kişi başı pay`) : t('Tek kişi payı')}</p></div><span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-600">{t('Adet:')} {heirShare.heir.count}</span></div><div className="mt-3 grid grid-cols-2 gap-3 text-sm"><div className="rounded-xl border border-stone-200 bg-white px-3 py-2"><p className="text-xs text-stone-500">{t('Kişi başı')}</p><p className="mt-1 font-mono text-lg font-semibold text-stone-900">{personText.primary}</p>{personText.secondary && <p className="mt-1 text-[11px] text-stone-500">= {personText.secondary}</p>}{hasMoneyValues && typeof perPersonAmount === 'number' && <p className="mt-1 text-[11px] font-semibold text-stone-900">≈ {formatCurrency(perPersonAmount)}</p>}</div><div className="rounded-xl border border-stone-200 bg-white px-3 py-2"><p className="text-xs text-stone-500">{t('Grup toplamı')}</p><p className="mt-1 font-mono text-lg font-semibold text-stone-900">{groupText.primary}</p>{groupText.secondary && <p className="mt-1 text-[11px] text-stone-500">= {groupText.secondary}</p>}{hasMoneyValues && typeof groupAmount === 'number' && <p className="mt-1 text-[11px] font-semibold text-stone-900">≈ {formatCurrency(groupAmount)}</p>}</div></div></div>;
              })}
            </div>
          </div>
        )}
      </div>

      <div className={mobileSectionClass('explain')}>
        {showComparison && (
          <div className="rounded-[24px] border border-stone-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl mb-4">
            <div className="mb-5"><h3 className="text-sm font-semibold text-stone-900">{copy.comparisonNotesTitle}</h3><p className="text-sm text-stone-500 mt-1">{copy.comparisonNotesText}</p></div>
            <div className="space-y-4">
              {displayResult.comparisonRows.map((row, index) => (
                <div key={`comparison-${index}`} className={`rounded-[18px] border ${row.relevant ? 'border-emerald-200 bg-emerald-50/40' : 'border-stone-200 bg-stone-50/50'} p-4`}>
                  <div className="flex flex-wrap items-center gap-2"><h4 className="font-medium text-stone-900">{t(row.issue)}</h4>{row.relevant && <span className="rounded-full border border-emerald-200 bg-white px-2 py-0.5 text-[11px] text-emerald-700">{t('Bu vaka için önemli')}</span>}</div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {schoolCardsForRow(row, language).map((note) => (
                      <details key={`${t(row.issue)}-${note.key}`} open={note.open} className="rounded-xl border border-stone-200 bg-white p-3">
                        <summary className="cursor-pointer list-none text-sm font-medium text-stone-900 flex items-center justify-between gap-3"><span>{note.label}</span><span className="text-xs text-stone-400">{t('Göster')}</span></summary>
                        <p className="mt-3 text-sm leading-6 text-stone-700">{t(note.text)}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <ExplanationPanel explanation={explanation} language={language} />
        <div className="rounded-[20px] border border-stone-200 bg-white/80 p-4 md:p-5 mt-4">
          <VersionPanel resultVersion={displayResult.resultVersion} language={language} />
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-stone-200 bg-white/96 p-3 shadow-[0_-10px_30px_rgba(28,25,23,0.08)] backdrop-blur-xl no-print">
        <div className="grid grid-cols-4 gap-2">
          <button type="button" onClick={handleCopySummary} className="rounded-2xl border border-stone-200 bg-white px-3 py-3 text-xs font-medium text-stone-700">{copyState === 'success' ? t('Kopyalandı') : t('Kopyala')}</button>
          <button type="button" onClick={handleShare} className="rounded-2xl border border-stone-200 bg-white px-3 py-3 text-xs font-medium text-stone-700">{shareState === 'success' ? t('Hazır') : t('Paylaş')}</button>
          <button type="button" onClick={() => setShowReport(true)} className="rounded-2xl border border-stone-200 bg-white px-3 py-3 text-xs font-medium text-stone-700">{language === 'en' ? 'Report' : language === 'ar' ? 'تقرير' : 'Rapor'}</button>
          <button type="button" onClick={handleSummaryPdf} className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs font-medium text-emerald-700">PDF</button>
        </div>
      </div>

      {showReport && (
        <ReportModal
          result={displayResult}
          language={language}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default ResultsDisplay;
