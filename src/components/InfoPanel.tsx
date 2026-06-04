import React from 'react';
import { getGlossaryDescription, getGlossaryLabel } from '../data/glossary';
import type { UiLanguage } from '../utils/uiI18n';

type InfoPanelProps = { language?: UiLanguage };

const TERM_KEYS = ['faraid','ashabulFuruz','asaba','zawilArham','hajb','awl','radd','netEstate','haml','khunsa','mafqud','munasakhat'] as const;

type Copy = {
  badge: string;
  title: string;
  intro: string;
  verseNote: string;
  orderTitle: string;
  orderIntro: string;
  order: [string, string][];
  termsTitle: string;
  familyTitle: string;
  familyCards: [string, string][];
  schoolTitle: string;
  schoolText: string;
};

const COPY: Record<UiLanguage, Copy> = {
  tr: {
    badge: 'Faraid rehberi',
    title: 'Feraiz ilmini adım adım anlamak için kısa bir rehber',
    intro: 'Bu sekme, hesaplama ekranında gördüğünüz sonuçların arka planını öğretmek için hazırlandı. Amaç sadece payı göstermek değil; o payın neden ortaya çıktığını açık ve sistemli şekilde anlatmaktır.',
    verseNote: 'Nisâ sûresindeki miras ayetleri faraid ilminin temelini oluşturur. Bu nedenle hükümler tahmine göre değil, nasla sabit paylar ve yerleşik fıkhî kurallar üzerinden kurulur.',
    orderTitle: 'Faraid hesabı hangi sırayla yapılır?',
    orderIntro: 'Bir miras hesabını doğru kurmanın en sağlam yolu, her vakada aynı sıralamayı takip etmektir.',
    order: [
      ['1. Net tereke belirlenir', 'Önce cenaze giderleri, borçlar ve geçerli vasiyet ayrılır. Paylaşım kalan net tereke üzerinden yapılır.'],
      ['2. Miras engelleri kontrol edilir', 'Katl, din farkı ve benzeri engeller varsa ilgili kişi görünse bile pay alamaz.'],
      ['3. Hacb uygulanır', 'Daha yakın veya daha güçlü mirasçılar bazı kimseleri tamamen düşürür veya payını azaltır.'],
      ['4. Farz paylar verilir', 'Önce payı nasla belirlenmiş mirasçılar payını alır.'],
      ['5. Asabe değerlendirilir', 'Farz paylardan sonra bakiye kalırsa asabe devreye girer.'],
      ['6. Gerekirse avl, redd veya zevi’l-erhâm aşaması gelir', 'Toplam pay terekeyi aşarsa avl, bakiye kalıp asabe bulunmazsa redd; her ikisi de yoksa bazı mezheplerde zevi’l-erhâm veya beytülmâl gündeme gelir.'],
    ],
    termsTitle: 'Sık kullanılan temel kavramlar',
    familyTitle: 'Üvey çocuklar ve mehir hakkında kısa notlar',
    familyCards: [
      ['Üvey çocuklar', 'Üvey çocuk, yani arada kan bağı veya sahih nesep bağı bulunmayan çocuk, feraiz hesabında kendiliğinden mirasçı olmaz. Ancak kişi sağlığında hibe yapabilir veya vefatından sonra geçerli vasiyet sınırları içinde ona mal bırakabilir.'],
      ['Mehir', 'Ödenmemiş mehir, kocanın zimmetinde bir borçtur. Kadın vefat ettiğinde henüz tahsil edilmemiş mehir alacağı terekeye dahil edilir; koca vefat ettiğinde ise ödenmemiş mehir, miras paylaşımından önce borç olarak terikeden düşülür.'],
    ],
    schoolTitle: 'Neden mezhep seçimi bulunuyor?',
    schoolText: 'Her mesele bütün mezheplerde aynı sonuca ulaşmaz. Özellikle dede ile kardeşler, Müşerrike, Akdariyye ve zevi’l-erhâm gibi alanlarda farklı sonuçlar çıkabilir. Bu yüzden ana sonuç seçtiğiniz mezhebe göre hesaplanır; isterseniz sonuç ekranında diğer mezhepleri ayrıca karşılaştırabilirsiniz.',
  },
  en: {
    badge: 'Faraid guide',
    title: 'A clear guide to understanding faraid step by step',
    intro: 'This tab explains the logic behind the figures shown by the calculator. The goal is not only to show a share, but also to explain why that share appears in a structured and understandable way.',
    verseNote: 'The inheritance verses in Surat al-Nisa form the foundation of faraid. For that reason the rules are not based on guesswork, but on revealed shares and established juristic principles.',
    orderTitle: 'In which order should a faraid calculation be done?',
    orderIntro: 'The safest way to build an inheritance case correctly is to follow the same sequence every time.',
    order: [
      ['1. Define the net estate', 'First deduct funeral expenses, debts, and any valid will. Distribution is based on what remains.'],
      ['2. Check legal impediments', 'If unlawful killing, difference of religion, or another valid impediment exists, that person cannot inherit even if listed.'],
      ['3. Apply exclusion and reduction', 'A closer or stronger heir may block another heir entirely or reduce the share they would otherwise receive.'],
      ['4. Assign the fixed shares', 'Heirs whose portions are fixed by revelation receive their shares first.'],
      ['5. Evaluate the residuaries', 'If any residue remains after the fixed shares, it passes to the residuary heirs.'],
      ['6. Apply awl, radd, or Dhawu al-Arham if needed', 'If the fixed shares exceed the estate, awl applies. If residue remains and no residuary heir exists, radd may apply. If both routes are exhausted, some schools then move to Dhawu al-Arham or Bayt al-mal.'],
    ],
    termsTitle: 'Core terms you will see often',
    familyTitle: 'Short notes on stepchildren and mahr',
    familyCards: [
      ['Stepchildren', 'A stepchild, meaning a child with no blood relationship or legally inheriting lineage, does not inherit automatically in faraid. A person may still gift property during life or leave a valid bequest within its lawful limits.'],
      ['Mahr', 'An unpaid mahr remains a debt. If the wife dies before receiving it, the unpaid mahr is treated as part of her estate. If the husband dies while it is still unpaid, it is deducted from his estate as a debt before the inheritance is distributed.'],
    ],
    schoolTitle: 'Why is there a madhhab selection?',
    schoolText: 'Not every inheritance problem ends the same way in every Sunni school. Grandfather with siblings, Mushtaraka, Akdariyya, and Dhawu al-Arham are the clearest examples. The main result therefore follows the school you choose, while comparison with the other schools remains optional on the results screen.',
  },
  de: {
    badge: 'Faraid-Leitfaden',
    title: 'Eine kurze Einführung, um Faraid Schritt für Schritt zu verstehen',
    intro: 'Dieser Bereich erklärt die Logik hinter den Ergebnissen des Rechners. Ziel ist nicht nur die Zahl zu zeigen, sondern den Aufbau des Urteils nachvollziehbar zu machen.',
    verseNote: 'Die Erbverse der Sure an-Nisa bilden das Fundament des Faraid-Rechts. Deshalb beruhen die Regeln auf festgelegten Texten und anerkannten juristischen Prinzipien.',
    orderTitle: 'In welcher Reihenfolge wird gerechnet?',
    orderIntro: 'Am sichersten ist es, jeden Fall in derselben klaren Reihenfolge aufzubauen.',
    order: [
      ['1. Netto-Nachlass bestimmen', 'Zuerst werden Bestattungskosten, Schulden und ein gültiges Testament abgezogen. Verteilung erfolgt nur auf den Rest.'],
      ['2. Erbhindernisse prüfen', 'Bei Tötung, Religionsverschiedenheit oder einem anderen anerkannten Hindernis entfällt das Erbrecht.'],
      ['3. Hacb anwenden', 'Nähere oder stärkere Erben können andere Erben ganz ausschließen oder ihren Anteil mindern.'],
      ['4. Feste Anteile geben', 'Zuerst erhalten die Erben mit festem Anteil ihren Anteil.'],
      ['5. Asaba behandeln', 'Bleibt nach den festen Anteilen ein Rest, geht er an die residuarischen Erben.'],
      ['6. Awl, Radd oder Dhawu al-Arham', 'Übersteigen die Anteile den Nachlass, gilt Awl. Bleibt Rest ohne Asaba, kommt Radd in Betracht. Danach folgen je nach Schule entferntere Verwandte oder Bayt al-mal.'],
    ],
    termsTitle: 'Wichtige Grundbegriffe',
    familyTitle: 'Kurze Hinweise zu Stiefkindern und Mahr',
    familyCards: [
      ['Stiefkinder', 'Stiefkinder erben im klassischen Faraid nicht automatisch, da keine blutsmäßige oder vererbende Abstammung vorliegt. Zuwendungen zu Lebzeiten oder ein gültiges Testament bleiben möglich.'],
      ['Mahr', 'Nicht gezahlter Mahr ist eine Schuld. Stirbt der Ehemann, wird sie vor der Verteilung vom Nachlass abgezogen. Stirbt die Ehefrau, zählt ihr offener Anspruch zu ihrem Nachlass.'],
    ],
    schoolTitle: 'Warum gibt es eine Madhhab-Auswahl?',
    schoolText: 'Nicht jede Erbfrage endet in allen sunnitischen Schulen gleich. Vor allem Großvater-mit-Geschwistern, Mushtaraka, Akdariyya und Dhawu al-Arham unterscheiden sich. Deshalb folgt das Hauptergebnis der gewählten Schule.',
  },
  es: {
    badge: 'Guía de farāʾiḍ',
    title: 'Una guía breve para entender farāʾiḍ paso a paso',
    intro: 'Esta sección explica la lógica detrás de los resultados de la calculadora. El objetivo no es solo mostrar una cuota, sino explicar por qué aparece.',
    verseNote: 'Las aleyas de la herencia de la sura al-Nisāʾ forman la base de la ciencia de las herencias. Por ello, las reglas se apoyan en textos revelados y principios jurídicos consolidados.',
    orderTitle: '¿En qué orden se hace el cálculo?',
    orderIntro: 'La forma más segura de construir un caso es seguir siempre la misma secuencia.',
    order: [
      ['1. Determinar la herencia neta', 'Primero se descuentan gastos funerarios, deudas y testamento válido. La distribución se hace sobre el resto.'],
      ['2. Revisar impedimentos', 'Si existe homicidio injusto, diferencia de religión u otro impedimento reconocido, esa persona no hereda.'],
      ['3. Aplicar exclusión', 'Un heredero más cercano o más fuerte puede excluir a otro o reducir su cuota.'],
      ['4. Asignar las cuotas fijas', 'Los herederos con cuota fijada por la revelación la reciben primero.'],
      ['5. Evaluar a los agnados', 'Si queda remanente tras las cuotas fijas, pasa a los herederos agnáticos.'],
      ['6. Aplicar ʿawl, radd o dhawū al-arḥām', 'Si las cuotas superan la herencia, se aplica ʿawl. Si sobra remanente sin agnado, puede aplicarse radd. Después, según el madhhab, pueden entrar los parientes uterinos o bayt al-māl.'],
    ],
    termsTitle: 'Términos básicos frecuentes',
    familyTitle: 'Notas breves sobre hijastros y mahr',
    familyCards: [
      ['Hijastros', 'El hijastro no hereda automáticamente en el sistema clásico de farāʾiḍ porque no existe vínculo sanguíneo o línea hereditaria directa. Siguen siendo posibles la donación y el legado válido.'],
      ['Mahr', 'El mahr no pagado es una deuda. Si muere el esposo, se descuenta antes de repartir la herencia. Si muere la esposa, su crédito pendiente entra en su patrimonio.'],
    ],
    schoolTitle: '¿Por qué existe una selección de madhhab?',
    schoolText: 'No todos los casos de herencia terminan igual en todas las escuelas sunníes. Abuelo con hermanos, Mushtaraka, Akdariyya y dhawū al-arḥām son ejemplos claros. Por eso el resultado principal sigue la escuela elegida.',
  },
  ar: {
    badge: 'دليل الفرائض',
    title: 'دليل مختصر لفهم علم الفرائض خطوة خطوة',
    intro: 'يشرح هذا القسم المنطق الكامن وراء النتائج التي يعرضها الحاسب. فالغاية ليست إظهار الرقم فقط، بل بيان سبب ظهوره بصورة واضحة ومنظمة.',
    verseNote: 'آيات المواريث في سورة النساء هي الأساس الذي يقوم عليه علم الفرائض، ولهذا تبنى الأحكام على النصوص المقررة والقواعد الفقهية المستقرة.',
    orderTitle: 'بأي ترتيب يجرى حساب الفرائض؟',
    orderIntro: 'أوثق طريقة لبناء المسألة هي الالتزام بالترتيب نفسه في كل حالة.',
    order: [
      ['1. تحديد صافي التركة', 'تخصم أولاً مؤنة التجهيز والديون والوصية الصحيحة، ثم يقع التقسيم على الباقي.'],
      ['2. فحص موانع الإرث', 'إذا وجد قتل أو اختلاف دين أو مانع معتبر آخر فلا يرث الشخص ولو كان مذكوراً في القائمة.'],
      ['3. تطبيق الحجب', 'قد يحجب الوارث الأقرب أو الأقوى غيره حجب حرمان أو حجب نقصان.'],
      ['4. إعطاء أصحاب الفروض فروضهم', 'يبدأ بأصحاب الأنصبة المقدرة شرعاً.'],
      ['5. النظر في العصبة', 'إذا بقي شيء بعد الفروض انتقل إلى العصبة.'],
      ['6. العول أو الرد أو ذوو الأرحام', 'إذا زادت الفروض على التركة وقع العول، وإذا بقي فضل بلا عصبة جاء الرد، ثم تنظر بعض المذاهب بعد ذلك في ذوي الأرحام أو بيت المال.'],
    ],
    termsTitle: 'مصطلحات أساسية متكررة',
    familyTitle: 'ملاحظات مختصرة حول أبناء الزوجة والمهر',
    familyCards: [
      ['أولاد الزوج أو الزوجة', 'الولد الذي لا تربطه بالميت قرابة نسب أو جهة إرث معتبرة لا يرث تلقائياً في الفرائض، لكن تبقى الهبة في الحياة والوصية الصحيحة ممكنتين.'],
      ['المهر', 'المهر غير المقبوض دين في الذمة. فإذا مات الزوج خُصم من تركته قبل القسمة، وإذا ماتت الزوجة عُد حقها غير المقبوض جزءاً من تركتها.'],
    ],
    schoolTitle: 'لماذا يوجد اختيار للمذهب؟',
    schoolText: 'ليست كل مسائل الإرث متفقة في جميع المذاهب السنية. ومن أوضح أمثلة ذلك الجد مع الإخوة والمشتركة والأكدرية وذوو الأرحام، ولذلك تتبع النتيجة الأساسية المذهب المختار.',
  },
};

export const InfoPanel: React.FC<InfoPanelProps> = ({ language = 'tr' }) => {
  const copy = COPY[language];
  return (
    <div className="space-y-8">
      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)]">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800">{copy.badge}</div>
          <div>
            <h3 className="text-xl font-semibold text-stone-950">{copy.title}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">{copy.intro}</p>
          </div>
          <div className="rounded-[20px] border border-stone-200 bg-stone-50 p-4">
            <p className="font-arabic text-xl text-stone-500 text-right" dir="rtl">يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ</p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{copy.verseNote}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)]">
        <h3 className="text-lg font-semibold text-stone-950">{copy.orderTitle}</h3>
        <p className="mt-2 text-sm leading-6 text-stone-600">{copy.orderIntro}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {copy.order.map(([title, text]) => <div key={title} className="rounded-[20px] border border-stone-200 bg-stone-50 p-4"><h4 className="text-sm font-semibold text-stone-900">{title}</h4><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></div>)}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)]">
        <h3 className="text-lg font-semibold text-stone-950">{copy.termsTitle}</h3>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TERM_KEYS.map((key) => <div key={key} className="rounded-[18px] border border-stone-200 bg-stone-50 p-4"><h4 className="font-medium text-stone-900">{getGlossaryLabel(key, language)}</h4><p className="mt-2 text-sm leading-6 text-stone-600">{getGlossaryDescription(key, language)}</p></div>)}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)]">
        <h3 className="text-lg font-semibold text-stone-950">{copy.familyTitle}</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {copy.familyCards.map(([title, text]) => (
            <div key={title} className="rounded-[20px] border border-stone-200 bg-stone-50 p-4">
              <h4 className="text-sm font-semibold text-stone-900">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)]">
        <h3 className="text-lg font-semibold text-stone-950">{copy.schoolTitle}</h3>
        <p className="mt-4 text-sm leading-7 text-stone-600">{copy.schoolText}</p>
      </section>
    </div>
  );
};

export default InfoPanel;
