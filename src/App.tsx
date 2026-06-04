import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { AdvancedCaseContext } from './types/inheritance';
import type { SchoolKey } from './core/schools/common';
import { HeirSelector } from './components/HeirSelector';
import { useCalculatorState } from './hooks/useCalculatorState';

type Tab = 'calculator' | 'rules' | 'sources' | 'info';
type CalculatorStep = 1 | 2 | 3 | 4;
type Language = 'tr' | 'en' | 'de' | 'es' | 'ar';
type ThemeMode = 'light' | 'dark';

const THEME_UI: Record<Language, { label: string; light: string; dark: string }> = {
  tr: { label: 'Tema', light: 'Aydinlik', dark: 'Karanlik' },
  en: { label: 'Theme', light: 'Light', dark: 'Dark' },
  de: { label: 'Design', light: 'Hell', dark: 'Dunkel' },
  es: { label: 'Tema', light: 'Claro', dark: 'Oscuro' },
  ar: { label: 'المظهر', light: 'فاتح', dark: 'داكن' },
};

const UNIT_ESTATE = 1;

const INITIAL_CASE_CONTEXT: AdvancedCaseContext = {
  pregnancy: 'none',
  khunsaCount: 0,
  mafqudCount: 0,
  munasakhatNote: '',
  pregnancyConfig: {
    enabled: false,
    count: 1,
    sexMode: 'unknown',
  },
  khunsaConfig: {
    enabled: false,
    relation: 'child',
    count: 1,
  },
  mafqudConfig: {
    enabled: false,
    heirType: '',
    count: 1,
  },
  munasakhatConfig: {
    enabled: false,
    sourceHeirType: '',
    deceasedGender: 'male',
    extraEstate: 0,
    secondaryHeirs: [],
    note: '',
  },
};

const UI_TEXT: Record<
  Language,
  {
    calculatorBadge: string;
    tabs: { calculator: string; rules: string; sources: string; info: string };
    heroTitle: string;
    heroSubtitle: string;
    heroNote: string;
    step1Title: string;
    step1Text: string;
    step2Title: string;
    step2Text: string;
    male: string;
    female: string;
    maleHint: string;
    femaleHint: string;
    back: string;
    calculate: string;
    edit: string;
    newCalc: string;
    rulesTitle: string;
    rulesText: string;
    sourcesTitle: string;
    sourcesText: string;
    infoTitle: string;
    infoText: string;
    footerNote: string;
    steps: { one: string; two: string; three: string; four: string };
    languageLabel: string;
  }
> = {
  tr: {
    calculatorBadge: 'Feraiz Hesaplama Aracı',
    tabs: { calculator: 'Hesaplama', rules: '40 Hal', sources: 'Kaynaklar', info: 'Bilgi' },
    heroTitle: 'Feraiz',
    heroSubtitle: 'Miras paylarını açık biçimde gösterir; kişi başı hisseleri ve mezhep farklarını anlaşılır hale getirir.',
    heroNote: 'Paylar önce oran olarak gösterilir. İsterseniz sonuç ekranında net terekeyi girerek aynı payları tutar olarak da görebilirsiniz.',
    step1Title: 'Müteveffa',
    step1Text: 'Önce müteveffanın cinsiyetini seçin.',
    step2Title: 'Mirasçıları Seçin',
    step2Text: 'Mirasçıları seçin; gerekiyorsa ileri durumları da ayrıca tanımlayın.',
    male: 'Erkek',
    female: 'Kadın',
    maleHint: 'Eş alanında hanım seçeneği açılır.',
    femaleHint: 'Eş alanında koca seçeneği açılır.',
    back: '← Geri',
    calculate: 'Hesapla',
    edit: '← Düzenle',
    newCalc: 'Yeni Hesaplama',
    rulesTitle: '40 Hal',
    rulesText: 'Sık karşılaşılan 40 halin kısa özeti ve uygulama mantığı.',
    sourcesTitle: 'Kaynaklar',
    sourcesText: 'Temel deliller, mezhep bazlı özel meseleler ve başvuru kaynakları.',
    infoTitle: 'Feraiz İlmi',
    infoText: 'Temel kavramlar, işlem sırası ve öğrenme rehberi.',
    footerNote: 'Bu araç öğretici bir yardımcıdır. İleri, ihtilaflı veya resmî işleme konu dosyalarda ehil bir fetva makamına başvurulmalıdır.',
    steps: { one: 'Mezhep', two: 'Müteveffa', three: 'Mirasçılar', four: 'Sonuç' },
    languageLabel: 'Dil',
  },
  en: {
    calculatorBadge: 'Faraid Calculator',
    tabs: { calculator: 'Calculator', rules: '40 Cases', sources: 'Sources', info: 'Info' },
    heroTitle: 'Faraid',
    heroSubtitle: 'Shows inheritance shares clearly, comparatively, and with per-person allocations.',
    heroNote: 'Shares are shown as ratios first. If you want, you can enter the net estate on the results screen and also see monetary amounts.',
    step1Title: 'Deceased',
    step1Text: 'First choose the gender of the deceased.',
    step2Title: 'Choose Heirs',
    step2Text: 'Add the heirs and any special situations if needed.',
    male: 'Male',
    female: 'Female',
    maleHint: 'The wife option becomes available in the spouse section.',
    femaleHint: 'The husband option becomes available in the spouse section.',
    back: '← Back',
    calculate: 'Calculate',
    edit: '← Edit',
    newCalc: 'New Calculation',
    rulesTitle: '40 Cases',
    rulesText: 'Basic rules.',
    sourcesTitle: 'Sources',
    sourcesText: 'Core evidence, school-specific issues and reference works.',
    infoTitle: 'Science of Faraid',
    infoText: 'Concepts and general framework.',
    footerNote: 'This tool is an explanatory aid. For advanced, disputed, or real legal cases, consult a qualified scholar or authority.',
    steps: { one: 'School', two: 'Deceased', three: 'Heirs', four: 'Result' },
    languageLabel: 'Language',
  },
  de: {
    calculatorBadge: 'Faraid-Rechner',
    tabs: { calculator: 'Berechnung', rules: '40 Fälle', sources: 'Quellen', info: 'Info' },
    heroTitle: 'Faraid',
    heroSubtitle: 'Zeigt Erbanteile klar, vergleichend und mit Anteilen pro Person an.',
    heroNote: 'Die Anteile werden zuerst als Verhältnis gezeigt. Auf dem Ergebnisbildschirm können Sie auf Wunsch auch den Netto-Nachlass eingeben und Geldbeträge sehen.',
    step1Title: 'Verstorbene Person',
    step1Text: 'Wählen Sie zuerst das Geschlecht der verstorbenen Person.',
    step2Title: 'Erben wählen',
    step2Text: 'Fügen Sie die Erben und gegebenenfalls besondere Situationen hinzu.',
    male: 'Männlich',
    female: 'Weiblich',
    maleHint: 'Im Ehebereich wird die Option Ehefrau geöffnet.',
    femaleHint: 'Im Ehebereich wird die Option Ehemann geöffnet.',
    back: '← Zurück',
    calculate: 'Berechnen',
    edit: '← Bearbeiten',
    newCalc: 'Neue Berechnung',
    rulesTitle: '40 Fälle',
    rulesText: 'Grundregeln.',
    sourcesTitle: 'Quellen',
    sourcesText: 'Wichtige Belege, schulbezogene Sonderfälle und Referenzwerke.',
    infoTitle: 'Faraid-Lehre',
    infoText: 'Begriffe und allgemeiner Rahmen.',
    footerNote: 'Dieses Werkzeug ist eine erläuternde Hilfe. Bei fortgeschrittenen, umstrittenen oder realen Rechtsfällen sollte eine qualifizierte Stelle konsultiert werden.',
    steps: { one: 'Madhhab', two: 'Verstorbene Person', three: 'Erben', four: 'Ergebnis' },
    languageLabel: 'Sprache',
  },
  es: {
    calculatorBadge: 'Calculadora de Farāʾiḍ',
    tabs: { calculator: 'Cálculo', rules: '40 Casos', sources: 'Fuentes', info: 'Información' },
    heroTitle: 'Farāʾiḍ',
    heroSubtitle: 'Muestra las cuotas hereditarias de forma clara, comparativa y por persona.',
    heroNote: 'Las cuotas se muestran primero como proporciones. Si lo desea, en la pantalla de resultados puede introducir la herencia neta y ver también los importes.',
    step1Title: 'Causante',
    step1Text: 'Primero elija el sexo del causante.',
    step2Title: 'Seleccione los herederos',
    step2Text: 'Añada los herederos y, si hace falta, las situaciones especiales.',
    male: 'Hombre',
    female: 'Mujer',
    maleHint: 'En la sección del cónyuge se habilita la opción esposa.',
    femaleHint: 'En la sección del cónyuge se habilita la opción esposo.',
    back: '← Atrás',
    calculate: 'Calcular',
    edit: '← Editar',
    newCalc: 'Nuevo cálculo',
    rulesTitle: '40 Casos',
    rulesText: 'Reglas básicas.',
    sourcesTitle: 'Fuentes',
    sourcesText: 'Pruebas principales, cuestiones por madhhab y obras de referencia.',
    infoTitle: 'Ciencia del Farāʾiḍ',
    infoText: 'Conceptos y marco general.',
    footerNote: 'Esta herramienta es una ayuda explicativa. Para casos avanzados, controvertidos o reales, consulte a una autoridad cualificada.',
    steps: { one: 'Madhhab', two: 'Causante', three: 'Herederos', four: 'Resultado' },
    languageLabel: 'Idioma',
  },
  ar: {
    calculatorBadge: 'حاسبة الفرائض',
    tabs: { calculator: 'الحساب', rules: '٤٠ حالة', sources: 'المصادر', info: 'معلومات' },
    heroTitle: 'الفرائض',
    heroSubtitle: 'تعرض أنصبة الميراث بوضوح وبالمقارنة مع نصيب كل شخص.',
    heroNote: 'تُعرض الأنصبة أولاً على شكل نسب. ويمكنكم في شاشة النتائج إدخال صافي التركة لرؤية القيم المالية أيضاً.',
    step1Title: 'المتوفى',
    step1Text: 'اختر أولاً جنس المتوفى.',
    step2Title: 'اختر الورثة',
    step2Text: 'أضف الورثة والحالات الخاصة عند الحاجة.',
    male: 'ذكر',
    female: 'أنثى',
    maleHint: 'في قسم الزوجية يظهر خيار الزوجة.',
    femaleHint: 'في قسم الزوجية يظهر خيار الزوج.',
    back: 'رجوع ←',
    calculate: 'احسب',
    edit: 'تعديل ←',
    newCalc: 'حساب جديد',
    rulesTitle: '٤٠ حالة',
    rulesText: 'القواعد الأساسية.',
    sourcesTitle: 'المصادر',
    sourcesText: 'الأدلة الأساسية، والمسائل الخاصة حسب المذهب، والمراجع المعتمدة.',
    infoTitle: 'علم الفرائض',
    infoText: 'المفاهيم والإطار العام.',
    footerNote: 'هذه الأداة مساعدة توضيحية. وفي المسائل المتقدمة أو المختلف فيها أو القضايا الواقعية ينبغي الرجوع إلى جهة علمية مؤهلة.',
    steps: { one: 'المذهب', two: 'المتوفى', three: 'الورثة', four: 'النتيجة' },
    languageLabel: 'اللغة',
  },
};

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'es', label: 'Español' },
  { value: 'ar', label: 'العربية' },
];

const SCHOOL_OPTIONS: SchoolKey[] = ['hanafi', 'maliki', 'shafii', 'hanbali'];

const SCHOOL_UI_TEXT: Record<Language, {
  title: string;
  text: string;
  labels: Record<SchoolKey, string>;
}> = {
  tr: {
    title: 'Mezhep seçimi',
    text: 'Ana sonuç seçtiğiniz mezhebe göre hesaplanır. İsterseniz sonuç ekranında diğer mezheplerle karşılaştırmayı ayrıca açabilirsiniz.',
    labels: { hanafi: 'Hanefî', maliki: 'Mâlikî', shafii: 'Şâfiî', hanbali: 'Hanbelî' },
  },
  en: {
    title: 'School selection',
    text: 'The main result is calculated according to the selected school. You can optionally enable comparison with the other schools on the results screen.',
    labels: { hanafi: 'Hanafi', maliki: 'Maliki', shafii: 'Shafi’i', hanbali: 'Hanbali' },
  },
  de: {
    title: 'Madhhab-Auswahl',
    text: 'Das Hauptergebnis wird nach der gewählten Rechtsschule berechnet. Auf der Ergebnisseite können Sie bei Bedarf den Vergleich mit den anderen Schulen öffnen.',
    labels: { hanafi: 'Hanafitisch', maliki: 'Malikitisch', shafii: 'Schafiitisch', hanbali: 'Hanbalitisch' },
  },
  es: {
    title: 'Selección de madhhab',
    text: 'El resultado principal se calcula según la escuela elegida. Si lo desea, puede abrir después una comparación con las otras escuelas en la pantalla de resultados.',
    labels: { hanafi: 'Hanafí', maliki: 'Mālikí', shafii: 'Shāfiʿí', hanbali: 'Hanbalí' },
  },
  ar: {
    title: 'اختيار المذهب',
    text: 'تُحسب النتيجة الأساسية بحسب المذهب الذي تختاره. ويمكنك لاحقاً إظهار المقارنة مع بقية المذاهب من شاشة النتائج.',
    labels: { hanafi: 'الحنفي', maliki: 'المالكي', shafii: 'الشافعي', hanbali: 'الحنبلي' },
  },
};


const ResultsDisplay = lazy(() => import('./components/ResultsDisplay').then((module) => ({ default: module.ResultsDisplay })));
const FortyRules = lazy(() => import('./components/FortyRules').then((module) => ({ default: module.FortyRules })));
const SourcesPanel = lazy(() => import('./components/SourcesPanel').then((module) => ({ default: module.SourcesPanel })));
const InfoPanel = lazy(() => import('./components/InfoPanel').then((module) => ({ default: module.InfoPanel })));

function SectionFallback({ label }: { label: string }) {
  return (
    <div className="card animate-fadeIn"> 
      <div className="flex items-center gap-3"> 
        <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-stone-500" />
        <p className="text-sm font-medium text-stone-700">{label}</p>
      </div>
      <div className="mt-4 grid gap-3"> 
        <div className="h-4 rounded-full bg-stone-100" />
        <div className="h-4 w-5/6 rounded-full bg-stone-100" />
        <div className="h-24 rounded-3xl bg-stone-50" />
      </div>
    </div>
  );
}

const META_COPY: Record<Language, Record<Tab, { title: string; description: string }>> = {
  tr: {
    calculator: { title: 'Feraiz | İslami Miras Hesaplama', description: 'Mezhep duyarlı, açıklamalı ve kişi başı payları gösteren İslami miras hesaplama aracı.' },
    rules: { title: '40 Hal | Feraiz', description: 'Sık karşılaşılan feraiz halleri, kısa açıklamalar ve delil notları ile birlikte.' },
    sources: { title: 'Kaynaklar | Feraiz', description: 'Kur’an, hadis, mezhep farkları, metodoloji ve başvuru eserleri.' },
    info: { title: 'Bilgi | Feraiz', description: 'Feraiz ilmini adım adım açıklayan kavram ve rehber bölümü.' },
  },
  en: {
    calculator: { title: 'Faraid | Islamic Inheritance Calculator', description: 'A school-sensitive Islamic inheritance calculator with explanations and per-person allocations.' },
    rules: { title: '40 Core Cases | Faraid', description: 'The common faraid case patterns with short explanations and proof notes.' },
    sources: { title: 'Sources | Faraid', description: 'Qur’anic and hadith proofs, school-specific issues, methodology, and reference works.' },
    info: { title: 'Info | Faraid', description: 'A step-by-step guide to the science of Islamic inheritance.' },
  },
  de: {
    calculator: { title: 'Faraid | Islamischer Erbrechner', description: 'Madhhab-sensitiver Rechner für islamische Erbanteile mit Erklärung und Pro-Kopf-Anteilen.' },
    rules: { title: '40 Fälle | Faraid', description: 'Häufige Faraid-Fälle mit kurzen Erläuterungen und Belegnotizen.' },
    sources: { title: 'Quellen | Faraid', description: 'Qurʾan, Hadith, Schulunterschiede, Methodik und Referenzwerke.' },
    info: { title: 'Info | Faraid', description: 'Schritt-für-Schritt-Einführung in das islamische Erbrecht.' },
  },
  es: {
    calculator: { title: 'Farāʾiḍ | Calculadora de herencia islámica', description: 'Calculadora sensible al madhhab con explicación y reparto por persona.' },
    rules: { title: '40 Casos | Farāʾiḍ', description: 'Casos frecuentes de herencia islámica con notas explicativas y de prueba.' },
    sources: { title: 'Fuentes | Farāʾiḍ', description: 'Corán, hadices, diferencias entre escuelas, metodología y obras de referencia.' },
    info: { title: 'Información | Farāʾiḍ', description: 'Guía paso a paso sobre la ciencia de la herencia islámica.' },
  },
  ar: {
    calculator: { title: 'الفرائض | حاسبة المواريث', description: 'حاسبة مواريث تراعي المذهب مع شرح ونصيب كل فرد.' },
    rules: { title: '٤٠ حالة | الفرائض', description: 'أشهر مسائل الفرائض مع شرح موجز وإشارات إلى الأدلة.' },
    sources: { title: 'المصادر | الفرائض', description: 'القرآن والحديث واختلاف المذاهب والمنهج والمراجع.' },
    info: { title: 'معلومات | الفرائض', description: 'دليل موجز لفهم علم الفرائض خطوة خطوة.' },
  },
};

function App() {

  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'tr';
    const saved = window.localStorage.getItem('feraiz-lang');
    const valid: Language[] = ['tr', 'en', 'de', 'es', 'ar'];
    return valid.includes(saved as Language) ? (saved as Language) : 'tr';
  });;
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = window.localStorage.getItem('feraiz-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const {
    step,
    setStep,
    gender,
    selectedHeirs,
    caseContext,
    result,
    selectedSchool,
    canCalculate,
    handleGenderSelect,
    handleSelectedHeirsChange,
    handleSchoolSelect,
    handleCaseContextChange,
    handleCalculate,
    handleReset,
  } = useCalculatorState({ initialCaseContext: INITIAL_CASE_CONTEXT, initialSchool: 'hanafi' });
  const stickyNavRef = useRef<HTMLElement | null>(null);
  const calculatorTopRef = useRef<HTMLDivElement | null>(null);
  const stepNavRef = useRef<HTMLDivElement | null>(null);
  const busyTimeoutRef = useRef<number | null>(null);
  const [uiBusy, setUiBusy] = useState(false);

  const t = UI_TEXT[language];
  const schoolText = SCHOOL_UI_TEXT[language];
  const themeText = THEME_UI[language];
  const isArabic = language === 'ar';

  const pulseUiBusy = (duration = 260) => {
    setUiBusy(true);
    if (busyTimeoutRef.current) window.clearTimeout(busyTimeoutRef.current);
    busyTimeoutRef.current = window.setTimeout(() => setUiBusy(false), duration);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('feraiz-theme', theme);
  }, [theme]);

  useEffect(() => {
    const meta = META_COPY[language][activeTab];
    document.title = meta.title;
    let description = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!description) {
      description = document.createElement('meta');
      description.name = 'description';
      document.head.appendChild(description);
    }
    description.content = meta.description;
  }, [activeTab, language]);

  useEffect(() => () => {
    if (busyTimeoutRef.current) window.clearTimeout(busyTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (activeTab !== 'calculator') return;

    let frameA = 0;
    let frameB = 0;

    const scrollToStepMenu = () => {
      const anchor = stepNavRef.current || calculatorTopRef.current;
      if (!anchor) return;

      const targetTop = anchor.getBoundingClientRect().top + window.scrollY - 16;

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth',
      });
    };

    frameA = window.requestAnimationFrame(() => {
      frameB = window.requestAnimationFrame(scrollToStepMenu);
    });

    return () => {
      window.cancelAnimationFrame(frameA);
      window.cancelAnimationFrame(frameB);
    };
  }, [activeTab, step]);



  const tabs: { id: Exclude<Tab, 'calculator'>; label: string }[] = [

    { id: 'rules', label: t.tabs.rules },
    { id: 'sources', label: t.tabs.sources },
    { id: 'info', label: t.tabs.info },
  ];

  const goToTab = (tab: Tab) => {
    pulseUiBusy(220);
    setActiveTab(tab);
    if (tab === 'calculator') {
      setTimeout(() => {
        const anchor = stepNavRef.current || calculatorTopRef.current;
        const top = anchor?.getBoundingClientRect().top ?? 0;
        window.scrollTo({
          top: Math.max(top + window.scrollY - 16, 0),
          behavior: 'smooth',
        });
      }, 0);
    }
  };

  const progressSteps: { num: CalculatorStep; label: string }[] = [
    { num: 1, label: t.steps.one },
    { num: 2, label: t.steps.two },
    { num: 3, label: t.steps.three },
    { num: 4, label: t.steps.four },
  ];

  const goToStep = (targetStep: CalculatorStep) => {
    if (targetStep <= step) {
      pulseUiBusy(220);
      setActiveTab('calculator');
      setStep(targetStep);
    }
  };

  const runCalculate = () => {
    pulseUiBusy(420);
    window.setTimeout(() => handleCalculate(), 40);
  };

  return (
    <div className="app-shell min-h-screen text-stone-900" dir={isArabic ? 'rtl' : 'ltr'}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-white">{language === 'en' ? 'Skip to content' : language === 'de' ? 'Zum Inhalt springen' : language === 'es' ? 'Ir al contenido' : language === 'ar' ? 'تخط إلى المحتوى' : 'İçeriğe atla'}</a>
      <header ref={stickyNavRef} className="app-header-shell border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-10">
          <div className="rounded-[32px] border border-stone-200/80 bg-white/90 shadow-[0_20px_60px_rgba(28,25,23,0.08)] px-6 py-8 md:px-8 md:py-10">
            <div className="flex flex-col gap-8">
              <div className={`flex flex-col gap-3 md:flex-row ${isArabic ? 'md:flex-row-reverse' : 'md:items-start md:justify-between'}`}>
                <div className={`flex flex-wrap items-center gap-2 ${isArabic ? 'md:justify-end' : ''}`}>
                  <button
                    type="button"
                    onClick={() => goToTab('calculator')}
                    className={`ui-pill inline-flex w-fit px-4 py-2 text-sm font-medium ${activeTab === 'calculator' ? 'ui-pill-active' : ''}`}
                  >
                    {t.calculatorBadge}
                  </button>

                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => goToTab(tab.id)}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                      className={`ui-pill px-4 py-2 text-sm font-medium ${activeTab === tab.id ? 'ui-pill-active' : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className={`flex flex-wrap items-center gap-3 text-sm text-stone-600 ${isArabic ? 'md:self-start md:justify-start' : 'md:self-start md:justify-end'}`}>
                  <div className="ui-toggle-shell shadow-sm">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      className={`ui-pill px-3 py-2 text-sm font-medium ${theme === 'light' ? 'ui-pill-active' : ''}`}
                      aria-label={themeText.light}
                    >
                      ☼ <span className="hidden sm:inline">{themeText.light}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      className={`ui-pill px-3 py-2 text-sm font-medium ${theme === 'dark' ? 'ui-pill-active' : ''}`}
                      aria-label={themeText.dark}
                    >
                      ☾ <span className="hidden sm:inline">{themeText.dark}</span>
                    </button>
                  </div>
                  <label className="inline-flex items-center gap-2">
                    <span className="font-medium">{t.languageLabel}</span>
                    <select
                      value={language}
                      onChange={(event) => {
                        const lang = event.target.value as Language;
                        setLanguage(lang);
                        window.localStorage.setItem('feraiz-lang', lang);
                      }}
                      className="rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700 outline-none transition focus:border-stone-400"
                      aria-label={t.languageLabel}
                    >
                      {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className={`flex flex-col gap-6 lg:flex-row lg:justify-between ${isArabic ? 'lg:flex-row-reverse' : 'lg:items-end'}`}>
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-3">
                    {/* Brand mark — geometric hexagon with crescent detail */}
                    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <rect width="44" height="44" rx="12" fill="var(--brand-primary)"/>
                      <path d="M22 8L34 15V29L22 36L10 29V15L22 8Z" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
                      <path d="M22 12L31 17V27L22 32L13 27V17L22 12Z" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="0.5"/>
                      <path d="M20 16C20 16 16.5 17.5 16.5 22C16.5 26.5 20 28 20 28C20 28 18 26 18 22C18 18 20 16 20 16Z" fill="rgba(255,255,255,0.85)"/>
                      <circle cx="24" cy="22" r="4.5" fill="rgba(255,255,255,0.9)"/>
                      <circle cx="25.8" cy="20.8" r="3" fill="var(--brand-primary)"/>
                      <circle cx="28" cy="20" r="1.5" fill="var(--brand-gold)" opacity="0.9"/>
                    </svg>
                    <h1 className="text-4xl md:text-5xl font-semibold tracking-tight" style={{color: 'var(--text-1)'}}>
                      {t.heroTitle}
                    </h1>
                  </div>
                  <p className="mt-1 text-base md:text-lg text-stone-600 leading-7">{t.heroSubtitle}</p>
                </div>

                <div className={`lg:self-end lg:pb-1 ${isArabic ? 'text-left lg:text-left' : 'text-right'}`}>
                  <p className="font-arabic text-3xl" dir="rtl" style={{color: 'var(--brand-gold)'}}>
                    عِلْمُ الْفَرَائِض
                  </p>
                  <p className={`mt-2 max-w-sm text-sm leading-6 text-stone-500 ${isArabic ? 'lg:mr-auto' : 'lg:ml-auto'}`}>
                    {t.heroNote}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="relative max-w-6xl mx-auto px-6 py-8 md:py-10">
        {uiBusy && <div className="pointer-events-none absolute inset-x-6 top-2 z-20 flex justify-center"><div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white/95 px-4 py-2 text-sm text-stone-700 shadow-sm"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-stone-500" />{language === 'en' ? 'Updating view…' : language === 'de' ? 'Ansicht wird aktualisiert…' : language === 'es' ? 'Actualizando vista…' : language === 'ar' ? 'جار تحديث العرض…' : 'Gorunum guncelleniyor…'}</div></div>}
        {activeTab === 'calculator' && (
          <div ref={calculatorTopRef} className="animate-fadeIn">
            <div ref={stepNavRef} className="mb-10 rounded-[28px] border border-stone-200 bg-white/96 p-4 md:p-6 shadow-[0_10px_40px_rgba(28,25,23,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
                {progressSteps.map((progressStep, index) => {
                  const isCompleted = progressStep.num <= step;
                  const isActive = step === progressStep.num;

                  return (
                    <div key={progressStep.num} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => goToStep(progressStep.num)}
                        disabled={!isCompleted}
                        className={`group flex flex-col items-center rounded-2xl px-3 py-2 ${
                          isCompleted ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-semibold shadow-sm transition-all ${
                            step > progressStep.num
                              ? 'bg-[var(--brand-primary)] text-white'
                              : isActive
                                ? 'bg-[var(--brand-primary)] text-white ring-4 ring-[var(--brand-light)] shadow-[0_12px_24px_rgba(26,74,46,0.22)]'
                                : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'
                          }`}
                        >
                          {step > progressStep.num ? '✓' : progressStep.num}
                        </div>
                        <span
                          className={`mt-2 text-xs font-medium ${
                            step >= progressStep.num ? 'text-stone-700' : 'text-stone-400'
                          }`}
                        >
                          {progressStep.label}
                        </span>
                      </button>

                      {index < progressSteps.length - 1 && (
                        <div className="w-6 md:w-12 h-px bg-stone-200 mx-1 md:mx-2 mb-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="max-w-5xl mx-auto">

              {step === 1 && (
                <div className="space-y-8 animate-slideUp">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-stone-950 mb-3">{schoolText.title}</h2>
                    <p className="text-stone-500 max-w-2xl mx-auto leading-7">{schoolText.text}</p>
                  </div>

                  <div className="max-w-4xl mx-auto space-y-6">
                    <div className="rounded-[24px] border border-stone-200 bg-white p-5 md:p-6 shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                        {SCHOOL_OPTIONS.map((schoolOption) => (
                          <button
                            key={schoolOption}
                            type="button"
                            onClick={() => handleSchoolSelect(schoolOption)}
                            className={`ui-choice-card rounded-[20px] px-4 py-4 text-left ${selectedSchool === schoolOption ? 'ui-choice-card-selected' : ''}`}
                          >
                            <div className="flex items-center justify-between gap-3"><p className="ui-choice-title text-base font-semibold text-stone-900">{schoolText.labels[schoolOption]}</p><span className="ui-check-badge">{selectedSchool === schoolOption ? '✓' : '○'}</span></div>
                            <p className="ui-choice-subtle mt-2 text-xs text-stone-500">{selectedSchool === schoolOption ? (language === 'en' ? 'Selected as the main school.' : 'Ana mezhep olarak seçildi.') : (language === 'en' ? 'Use this school as the main view.' : 'Bu mezhebi ana görünüm olarak kullan.')}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-slideUp">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-stone-950 mb-3">{t.step1Title}</h2>
                    <p className="text-stone-500 max-w-2xl mx-auto leading-7">{t.step1Text}</p>
                  </div>

                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleGenderSelect('male')}
                        className={`ui-choice-card rounded-[24px] p-8 ${gender === 'male' ? 'ui-choice-card-selected' : ''}`}
                      >
                        <div className="mb-4 flex items-start justify-between gap-3"><div className="text-4xl">👨</div><span className="ui-check-badge">{gender === 'male' ? '✓' : '○'}</span></div>
                        <h3 className="ui-choice-title text-xl font-semibold text-stone-900 mb-2">{t.male}</h3>
                        <p className="ui-choice-subtle text-sm text-stone-500">{t.maleHint}</p>
                      </button>

                      <button
                        onClick={() => handleGenderSelect('female')}
                        className={`ui-choice-card rounded-[24px] p-8 ${gender === 'female' ? 'ui-choice-card-selected' : ''}`}
                      >
                        <div className="mb-4 flex items-start justify-between gap-3"><div className="text-4xl">👩</div><span className="ui-check-badge">{gender === 'female' ? '✓' : '○'}</span></div>
                        <h3 className="ui-choice-title text-xl font-semibold text-stone-900 mb-2">{t.female}</h3>
                        <p className="ui-choice-subtle text-sm text-stone-500">{t.femaleHint}</p>
                      </button>
                    </div>

                    <div className="flex justify-between gap-4 pt-2">
                      <button onClick={() => setStep(1)} className="btn btn-secondary">{t.back}</button>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8 animate-slideUp">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-stone-950 mb-3">{t.step2Title}</h2>
                    <p className="text-stone-500 max-w-3xl mx-auto leading-7">{t.step2Text}</p>
                  </div>

                  <HeirSelector
                    selectedHeirs={selectedHeirs}
                    onHeirsChange={handleSelectedHeirsChange}
                    deceasedGender={gender}
                    caseContext={caseContext}
                    onCaseContextChange={handleCaseContextChange}
                    language={language}
                  />


                  <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                    <button onClick={() => setStep(2)} className="btn btn-secondary">
                      {t.back}
                    </button>
                    <button
                      onClick={runCalculate}
                      disabled={!canCalculate}
                      className={`btn btn-primary ${!canCalculate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {t.calculate}
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && result && (
                <div className="space-y-8 animate-slideUp">
                  <div className="flex justify-between items-center no-print gap-4 flex-wrap">
                    <button onClick={() => setStep(3)} className="btn btn-secondary">
                      {t.edit}
                    </button>
                    <button onClick={() => { setActiveTab('calculator'); handleReset(); }} className="btn btn-secondary">
                      {t.newCalc}
                    </button>
                  </div>

                  <Suspense fallback={<SectionFallback label={language === 'en' ? 'Loading results…' : language === 'de' ? 'Ergebnisse werden geladen…' : language === 'es' ? 'Cargando resultados…' : language === 'ar' ? 'جار تحميل النتائج…' : 'Sonuclar yukleniyor…'} />}>
                    <ResultsDisplay
                      result={result}
                      deceasedGender={gender}
                      selectedHeirs={selectedHeirs}
                      caseContext={caseContext}
                      language={language}
                      school={selectedSchool}
                    />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-stone-950 mb-3">{t.rulesTitle}</h2>
              <p className="text-stone-500">{t.rulesText}</p>
            </div>
            <Suspense fallback={<SectionFallback label={language === 'en' ? 'Loading cases…' : language === 'de' ? 'Falle werden geladen…' : language === 'es' ? 'Cargando casos…' : language === 'ar' ? 'جار تحميل الحالات…' : 'Haller yukleniyor…'} />}><FortyRules language={language} /></Suspense>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-stone-950 mb-3">{t.sourcesTitle}</h2>
              <p className="text-stone-500">{t.sourcesText}</p>
            </div>
            <Suspense fallback={<SectionFallback label={language === 'en' ? 'Loading sources…' : language === 'de' ? 'Quellen werden geladen…' : language === 'es' ? 'Cargando fuentes…' : language === 'ar' ? 'جار تحميل المصادر…' : 'Kaynaklar yukleniyor…'} />}><SourcesPanel language={language} /></Suspense>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-stone-950 mb-3">{t.infoTitle}</h2>
              <p className="text-stone-500">{t.infoText}</p>
            </div>
            <Suspense fallback={<SectionFallback label={language === 'en' ? 'Loading info…' : language === 'de' ? 'Informationen werden geladen…' : language === 'es' ? 'Cargando informacion…' : language === 'ar' ? 'جار تحميل المعلومات…' : 'Bilgiler yukleniyor…'} />}><InfoPanel language={language} /></Suspense>
          </div>
        )}
      </main>

      <footer className="border-t border-stone-200/80 bg-white/75 backdrop-blur-xl mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-stone-500 ${isArabic ? 'md:flex-row-reverse' : ''}`}>
            <p>{t.footerNote}</p>
            <p className="font-arabic text-lg" dir="rtl">
              وَفَوْقَ كُلِّ ذِي عِلْمٍ عَلِيمٌ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
