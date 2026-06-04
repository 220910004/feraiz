import React from 'react';
import type { UiLanguage } from '../utils/uiI18n';

type SourcesPanelProps = { language?: UiLanguage };

type Copy = {
  badge: string;
  title: string;
  intro: string;
  quranTitle: string;
  hadithTitle: string;
  issuesTitle: string;
  worksTitle: string;
  methodologyTitle: string;
  methodologyText: string;
  bibliographyTitle: string;
  bibliographyText: string;
  readTitle: string;
  readText: string;
  proof: string;
  use: string;
  note: string;
  faqTitle: string;
};

const COPY: Record<UiLanguage, Copy> = {
  tr: {
    badge: 'Kaynak rehberi',
    title: 'Faraid hükümlerini hangi deliller taşır?',
    intro: 'Bu sekme, miras hükümlerinin hangi ana deliller üzerine kurulduğunu, mezhep bazlı özel meselelerin hangi başlıklarda ayrıştığını ve uygulamanın temel metodolojisini özetler.',
    quranTitle: 'Kur’an’dan ana deliller',
    hadithTitle: 'Hadislerden ana deliller',
    issuesTitle: 'Mezhep bazlı özel meseleler',
    worksTitle: 'Klasik başvuru eserleri',
    methodologyTitle: 'Metodoloji notu',
    methodologyText: 'Motor önce net terekeyi esas alır, ardından engelleri ve hacbi kontrol eder; farz sahiplerini yerleştirir, asabeyi işletir, gerekiyorsa avl, redd, zevi’l-erhâm ve beytülmâl mantıklarını seçilen mezhebe göre uygular. İhtilaflı meselelerde ana sonuç seçilen mezhebi esas alır; karşılaştırma bölümü diğer görüşleri yan yana gösterir.',
    bibliographyTitle: 'Öne çıkan kaynaklar',
    bibliographyText: 'Kaynaklar bölümü, hükmün dayandığı başlıkları görünür kılmak için hazırlandı. Resmî veya çekişmeli dosyalarda burada adı geçen temel eserlerin tahkikli baskılarına ve yetkin bir fetva merciine başvurulmalıdır.',
    readTitle: 'Bu sekme nasıl okunmalı?',
    readText: 'Önce ayet ve hadis çerçevesini okuyun. Ardından özel mesele kartlarına geçin. Bir vaka doğrudan mezhepler arasında ayrışıyorsa bunu sonuç ekranındaki karşılaştırma ile birlikte değerlendirin.',
    proof: 'Delil yönü',
    use: 'Nerede kullanılır?',
    note: 'Uygulama notu',
    faqTitle: 'Sık sorulan başlıklar',
  },
  en: {
    badge: 'Source guide',
    title: 'Which proofs carry the faraid rulings?',
    intro: 'This tab explains the main textual proofs of inheritance law, the best-known school-specific divergences, and the methodology used by the calculator.',
    quranTitle: 'Primary Qur’anic proofs',
    hadithTitle: 'Primary hadith proofs',
    issuesTitle: 'School-specific special issues',
    worksTitle: 'Classical reference works',
    methodologyTitle: 'Methodology note',
    methodologyText: 'The engine starts from the net estate, checks impediments and exclusion, assigns the fixed shares, activates the residuaries, and then applies awl, radd, Dhawu al-Arham, or Bayt al-mal logic according to the selected madhhab. In disputed issues, the main result follows the chosen school and the comparison section shows the alternatives side by side.',
    bibliographyTitle: 'Highlighted sources',
    bibliographyText: 'This section is designed to show which textual and juristic layers support the result. For official or disputed files, the named works and a qualified authority should still be consulted directly.',
    readTitle: 'How should this section be read?',
    readText: 'Start with the Qur’anic and hadith foundations. Then move to the special-issue cards. If a case genuinely differs between schools, read this tab together with the optional comparison section on the results screen.',
    proof: 'Proof focus',
    use: 'Where it is used',
    note: 'Practical note',
    faqTitle: 'Frequently asked points',
  },
  de: {
    badge: 'Quellenübersicht',
    title: 'Welche Belege tragen die Faraid-Regeln?',
    intro: 'Dieser Bereich fasst die wichtigsten Textbelege, die bekannten Schulunterschiede und die vom Rechner verwendete Methodik zusammen.',
    quranTitle: 'Zentrale Qurʾan-Belege',
    hadithTitle: 'Zentrale Hadith-Belege',
    issuesTitle: 'Spezielle schulbezogene Fragen',
    worksTitle: 'Klassische Referenzwerke',
    methodologyTitle: 'Methodikhinweis',
    methodologyText: 'Die Berechnung beginnt mit dem Netto-Nachlass, prüft Hindernisse und Verdrängung, ordnet die festen Anteile zu und behandelt anschließend Asaba, Awl, Radd, Dhawu al-Arham oder Bayt al-mal entsprechend der gewählten Rechtsschule. In Streitfragen folgt das Hauptergebnis der gewählten Schule; der Vergleich zeigt die Alternativen.',
    bibliographyTitle: 'Hervorgehobene Quellen',
    bibliographyText: 'Dieser Abschnitt soll sichtbar machen, auf welche textlichen und juristischen Grundlagen sich das Ergebnis stützt. Bei amtlichen oder strittigen Fällen sollten die genannten Werke und eine qualifizierte Stelle direkt konsultiert werden.',
    readTitle: 'Wie liest man diesen Bereich?',
    readText: 'Beginnen Sie mit Qurʾan und Hadith, wechseln Sie dann zu den Sonderfällen. Wenn sich eine Frage wirklich zwischen den Schulen unterscheidet, lesen Sie diesen Bereich zusammen mit dem Vergleich im Ergebnisbildschirm.',
    proof: 'Belegfokus',
    use: 'Wo wird es genutzt?',
    note: 'Praxisnotiz',
    faqTitle: 'Häufige Fragen',
  },
  es: {
    badge: 'Guía de fuentes',
    title: '¿Qué pruebas sostienen las reglas de farāʾiḍ?',
    intro: 'Esta sección resume las pruebas textuales principales, las diferencias más conocidas entre escuelas y la metodología utilizada por la calculadora.',
    quranTitle: 'Pruebas coránicas principales',
    hadithTitle: 'Pruebas principales de hadiz',
    issuesTitle: 'Cuestiones especiales según la escuela',
    worksTitle: 'Obras clásicas de referencia',
    methodologyTitle: 'Nota metodológica',
    methodologyText: 'El motor parte de la herencia neta, revisa impedimentos y exclusiones, asigna las cuotas fijas y después aplica la lógica de los agnados, ʿawl, radd, dhawū al-arḥām o bayt al-māl según el madhhab seleccionado. En cuestiones discutidas, el resultado principal sigue la escuela elegida y la comparación muestra las alternativas.',
    bibliographyTitle: 'Fuentes destacadas',
    bibliographyText: 'Esta sección busca mostrar las capas textuales y jurídicas que sostienen el resultado. En expedientes oficiales o controvertidos deben consultarse directamente las obras citadas y una autoridad cualificada.',
    readTitle: '¿Cómo leer esta sección?',
    readText: 'Empiece por el marco coránico y los hadices. Después pase a las tarjetas de cuestiones especiales. Si un caso difiere realmente entre escuelas, lea esta sección junto con la comparación opcional del resultado.',
    proof: 'Enfoque de la prueba',
    use: 'Dónde se usa',
    note: 'Nota práctica',
    faqTitle: 'Preguntas frecuentes',
  },
  ar: {
    badge: 'دليل المصادر',
    title: 'ما الأدلة التي تقوم عليها أحكام الفرائض؟',
    intro: 'يعرض هذا القسم أهم الأدلة النصية، وأشهر مواضع اختلاف المذاهب، والمنهج الذي تسير عليه الآلة في بناء النتيجة.',
    quranTitle: 'الأدلة القرآنية الأساسية',
    hadithTitle: 'الأدلة الحديثية الأساسية',
    issuesTitle: 'المسائل الخاصة بحسب المذهب',
    worksTitle: 'المراجع الكلاسيكية',
    methodologyTitle: 'ملاحظة منهجية',
    methodologyText: 'يبدأ المحرك بصافي التركة، ثم يفحص الموانع والحجب، ويعطي أصحاب الفروض فروضهم، ثم يعالج العصبة، ويطبق العول أو الرد أو ذوي الأرحام أو بيت المال بحسب المذهب المختار. وفي المسائل المختلف فيها تتبع النتيجة الأساسية المذهب المختار بينما يعرض قسم المقارنة البدائل جنباً إلى جنب.',
    bibliographyTitle: 'المصادر البارزة',
    bibliographyText: 'أُعد هذا القسم لإظهار الطبقات النصية والفقهية التي يستند إليها الناتج. وفي الملفات الرسمية أو المختلف فيها ينبغي الرجوع مباشرة إلى الكتب المذكورة وإلى جهة علمية مؤهلة.',
    readTitle: 'كيف يُقرأ هذا القسم؟',
    readText: 'ابدأ بآيات الميراث والأحاديث، ثم انتقل إلى بطاقات المسائل الخاصة. وإذا كانت المسألة تختلف فعلاً بين المذاهب فاقرأ هذا القسم مع المقارنة الظاهرة في شاشة النتيجة.',
    proof: 'وجه الدليل',
    use: 'موضع الاستعمال',
    note: 'ملاحظة عملية',
    faqTitle: 'أسئلة متكررة',
  },
};

const QURAN = {
  tr: [
    ['Nisâ 11', 'Çocuklar, anne-baba ve temel farz paylar', 'Tek kız için 1/2, iki veya daha çok kız için 2/3; çocuk bulunduğunda anne ve baba için 1/6 gibi temel paylar burada belirlenir.', 'Kızlar, ebeveynler ve çocuklu vakalar.'],
    ['Nisâ 12', 'Eşlerin payı ve anne bir kardeşler', 'Koca ve eşin payı ile anne bir kardeşlerin 1/6 veya ortak 1/3 payı bu ayette yer alır.', 'Eşler ve anne bir kardeşler.'],
    ['Nisâ 176', 'Kelâle ve kardeşler', 'Öz ve baba bir kardeşlerin tek, çift veya karışık halde nasıl pay alacağı bu ayette temellenir.', 'Kardeşler ve kelâle vakaları.'],
    ['Enfâl 75', 'Yakın akrabalığın önceliği', 'Yakın akrabalık bağının önceliği vurgulanır; zevi’l-erhâm tartışmalarında önemli dayanaklardan biridir.', 'Zevi’l-erhâm ve beytülmâl tartışmaları.'],
  ],
  en: [
    ['Qur’an 4:11', 'Children, parents, and the core fixed shares', 'This verse establishes the foundational shares of daughters, parents, and direct descendants, including one half for a single daughter and two thirds for multiple daughters without a son.', 'Cases involving daughters, parents, and descendants.'],
    ['Qur’an 4:12', 'Spouses and maternal siblings', 'This verse defines the shares of the husband and wives, and the one-sixth or collective one-third of the maternal siblings.', 'Cases involving spouses and maternal siblings.'],
    ['Qur’an 4:176', 'Kalalah and siblings', 'This verse grounds the inheritance of full and paternal siblings in kalalah cases and supports the 2:1 rule when male and female siblings inherit together.', 'Sibling cases, kalalah, and several special issues.'],
    ['Qur’an 8:75', 'Priority of close kinship', 'This verse supports the priority of close blood relations and is central to discussions of Dhawu al-Arham and Bayt al-mal.', 'Remote relatives and Bayt al-mal issues.'],
  ],
};

const HADITH = {
  tr: [
    ['Buhârî, Müslim', 'Farz payları verin, kalan asabeye gider', 'Önce farz sahiplerinin payı verilir; kalan en yakın erkek asabeye aittir.', 'Farz + asabe sırasının kurulması.'],
    ['İbn Mâce, Tirmizî', 'Mirasçıya vasiyet yoktur', 'Geçerli vasiyet, normal şartta mirasçı olmayan lehinedir ve meşru sınır içinde kalmalıdır.', 'Vasiyetin sınırı ve mirasla ilişkisi.'],
    ['Buhârî, Müslim', 'Üçte bir, üçte bir bile çoktur', 'Vasiyet üst sınırının 1/3 olduğunu gösteren meşhur delildir.', 'Net terekenin belirlenmesi.'],
    ['Buhârî, Müslim', 'Din farkı ve katl engelleri', 'Din farkı ve haksız öldürme, klasik engeller arasında yer alır.', 'Miras engellerinin uygulanması.'],
  ],
  en: [
    ['Bukhari, Muslim', 'Give the fixed shares first, then the residue', 'The fixed shares are assigned first, and whatever remains goes to the nearest qualifying residuary heir.', 'Establishing the sequence of fixed shares and residuaries.'],
    ['Ibn Majah, Tirmidhi', 'There is no bequest for an heir', 'A valid will normally benefits a non-heir and stays within its lawful limits.', 'The relationship between wills and inheritance shares.'],
    ['Bukhari, Muslim', 'One third, and even one third is much', 'This narration is the well-known proof for limiting a will to one third of the estate.', 'Defining the net estate before distribution.'],
    ['Bukhari, Muslim', 'Difference of religion and unlawful killing', 'Difference of religion and unlawful killing are among the classic impediments to inheritance.', 'Applying legal impediments.'],
  ],
};

const ISSUES = {
  tr: [
    ['Dede ile kardeşler', ['Hanefî: Dede, kardeşleri düşürür.', 'Cumhur: Dede, bazı durumlarda kardeşlerle birlikte değerlendirilir.'], 'Kelâle ayetlerinin uygulanışı ve sahabe içtihadı.', 'Bu başlık ana sonucu en çok değiştiren ihtilaflardan biridir.'],
    ['Müşerrike / Himariyye', ['Hanefî: Öz kardeş, anne bir kardeşlerle ortak edilmez.', 'Cumhur: Öz kardeşler, anne bir kardeşlerle aynı üçte bire katılabilir.'], 'Nisâ 12 ve 176’nın birlikte uygulanışı ile sahabe uygulamaları.', 'Karşılaştırma ekranında en belirgin farklardan biridir.'],
    ['Akdariyye', ['Hanefî: Dede kardeşi düşürdüğü için cumhurdaki özel çözüm aynı biçimde kurulmaz.', 'Cumhur: 27’lik meşhur çözüm uygulanır.'], 'Dede-kardeşler usulü ve cumhur kaynaklarındaki özel çözüm.', 'Özel meselelerin neden mezhep seçimi istediğini açıkça gösterir.'],
    ['Zevi’l-erhâm ve beytülmâl', ['Hanefî / Hanbelî: Uygun durumda zevi’l-erhâm devreye girer.', 'Şâfiî / Mâlikî: Beytülmâlin işleyişi ve tercih edilen alt görüş önemlidir.'], 'Enfâl 75 ve zevi’l-erhâmı düzenleyen fıkhî usuller.', 'Uzak akraba vakalarında motorun mezhep duyarlı çalışması gerekir.'],
  ],
  en: [
    ['Grandfather with siblings', ['Hanafi: The true grandfather excludes the siblings.', 'Jumhur: The grandfather may be assessed together with the siblings in certain forms.'], 'The application of the kalalah verses and the juristic reading of companion practice.', 'This is one of the biggest areas where the selected school changes the final table.'],
    ['Mushtaraka / Himariyya', ['Hanafi: Full siblings are not added to the maternal siblings’ one-third.', 'Jumhur: Full siblings may join the maternal siblings in the shared one-third.'], 'The relationship between Qur’an 4:12 and 4:176, together with companion practice.', 'It often produces the clearest difference on the comparison screen.'],
    ['Akdariyya', ['Hanafi: Because the grandfather excludes the sister, the famous Jumhur solution does not arise in the same way.', 'Jumhur: The well-known 27-based solution is applied.'], 'The grandfather-siblings doctrine and the classical Jumhur treatment of the special case.', 'This issue clearly shows why the calculator needs a real school-sensitive engine.'],
    ['Dhawu al-Arham and Bayt al-mal', ['Hanafi / Hanbali: Dhawu al-Arham may enter once fixed-share heirs and residuaries are exhausted.', 'Shafiʿi / Maliki: The role of Bayt al-mal and the adopted operative view becomes decisive.'], 'Qur’an 8:75 and the juristic methods governing remote uterine relatives.', 'This matters most in cases with remote relatives or when a spouse remains without a residuary heir.'],
  ],
};

const FAQ = {
  tr: [
    ['Koca tek başına kaldığında bakiye ne olur?', 'Hanefî çizgide koca, çocuk veya torun yoksa 1/2 alır. Kalan pay eşe redd edilmez. Vakanın yapısına göre bakiye zevi’l-erhâm, beytülmâl veya ayrıca incelenecek kamu hakkı alanına kalabilir.'],
    ['Üvey çocuklar neden listede mirasçı değildir?', 'Üvey çocuk ile müteveffa arasında otomatik miras doğuran nesep bağı bulunmaz. Bu sebeple feraiz hesabında pay sahibi sayılmaz; ancak sağlığında hibe veya geçerli vasiyet ile mal bırakılması mümkündür.'],
    ['Mehir miras hesabına nasıl girer?', 'Ödenmemiş mehir bir borçtur. Koca öldüğünde tereke paylaşımından önce düşülür. Kadın öldüğünde henüz tahsil edilmemiş mehir alacağı, onun terekesine dahil edilir.'],
  ],
  en: [
    ['What happens to the residue if the husband is the only heir?', 'In the Hanafi line, the husband receives one half when there is no child or grandchild. The remaining half is not returned to the spouse by radd. Depending on the case, it may move to Dhawu al-Arham, Bayt al-mal, or a further legal review.'],
    ['Why are stepchildren not listed as heirs?', 'A stepchild does not inherit automatically because there is no blood relationship or inheriting lineage. A gift during life or a valid bequest may still benefit the stepchild.'],
    ['How does mahr affect the inheritance calculation?', 'An unpaid mahr is a debt. If the husband dies, it is deducted from his estate before distribution. If the wife dies while it is still unpaid, her claim to that mahr is treated as part of her estate.'],
  ],
};

const WORKS = {
  tr: ['Kur’an-ı Kerîm: Nisâ 11, 12, 176; Enfâl 75', 'Buhârî ve Müslim’in ferâiz bölümleri', 'el-Mebsût (Serahsî)', 'Bedâʾiʿu’s-Sanâʾiʿ (Kâsânî)', 'el-Hidâye (Mergînânî)', 'el-Mecmûʿ (Nevevî)', 'el-Hâvî (Mâverdî)', 'el-Muğnî (İbn Kudâme)', 'Sirâciyye ve güvenilir mezhep içi fetva mecmuaları'],
  en: ['The Qur’an: 4:11, 4:12, 4:176, and 8:75', 'The inheritance chapters of Bukhari and Muslim', 'al-Mabsut (Sarakhsi)', 'Bada’iʿ al-Sana’iʿ (Kasani)', 'al-Hidaya (Marghinani)', 'al-Majmuʿ (Nawawi)', 'al-Hawi (Mawardi)', 'al-Mughni (Ibn Qudama)', 'Sirajiyya and reliable intra-school fatwa collections'],
};

export const SourcesPanel: React.FC<SourcesPanelProps> = ({ language = 'tr' }) => {
  const lang = language === 'tr' ? 'tr' : 'en';
  const copy = COPY[language] ?? COPY[lang];
  const quran = QURAN[lang];
  const hadith = HADITH[lang];
  const issues = ISSUES[lang];
  const works = WORKS[lang];
  const faq = FAQ[lang];

  return (
    <div className="space-y-8">
      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><div className="max-w-4xl space-y-4"><div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800">{copy.badge}</div><div><h3 className="text-xl font-semibold text-stone-950">{copy.title}</h3><p className="mt-3 text-sm leading-7 text-stone-600">{copy.intro}</p></div></div></section>
      <section className="grid gap-8 xl:grid-cols-2">
        <div className="rounded-[24px] border border-stone-200 bg-white/90 p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><h3 className="text-lg font-semibold text-stone-950">{copy.quranTitle}</h3><div className="mt-5 space-y-4">{quran.map(([ref,title,text,use]) => <article key={ref} className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"><div className="flex items-center justify-between gap-3"><h4 className="font-medium text-stone-900">{title}</h4><span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-medium text-emerald-800">{ref}</span></div><p className="mt-2 text-sm leading-6 text-stone-700">{text}</p><p className="mt-3 text-xs uppercase tracking-[0.14em] text-emerald-800">{copy.use}</p><p className="mt-1 text-sm leading-6 text-stone-700">{use}</p></article>)}</div></div>
        <div className="rounded-[24px] border border-stone-200 bg-white/90 p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><h3 className="text-lg font-semibold text-stone-950">{copy.hadithTitle}</h3><div className="mt-5 space-y-4">{hadith.map(([source,title,text,use]) => <article key={title} className="rounded-2xl border border-stone-200 bg-stone-50 p-4"><div className="flex items-center justify-between gap-3"><h4 className="font-medium text-stone-900">{title}</h4><span className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs font-medium text-stone-700">{source}</span></div><p className="mt-2 text-sm leading-6 text-stone-700">{text}</p><p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">{copy.use}</p><p className="mt-1 text-sm leading-6 text-stone-700">{use}</p></article>)}</div></div>
      </section>
      <section className="rounded-[24px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><h3 className="text-lg font-semibold text-stone-950">{copy.issuesTitle}</h3><div className="mt-6 grid gap-4 lg:grid-cols-2">{issues.map(([title,schools,proof,note]) => <article key={title} className="rounded-[20px] border border-stone-200 bg-stone-50 p-5"><h4 className="text-base font-semibold text-stone-900">{title}</h4><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">{schools.map((line) => <li key={line}>{line}</li>)}</ul><div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{copy.proof}</div><p className="mt-2 text-sm leading-6 text-stone-700">{proof}</p></div><div className="mt-3 rounded-2xl border border-stone-200 bg-white p-4"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{copy.note}</div><p className="mt-2 text-sm leading-6 text-stone-700">{note}</p></div></article>)}</div></section>
      <section className="grid gap-8 xl:grid-cols-[1fr,1fr]"><div className="rounded-[24px] border border-stone-200 bg-white/90 p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><h3 className="text-lg font-semibold text-stone-950">{copy.worksTitle}</h3><ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-6 text-stone-700">{works.map((work) => <li key={work}>{work}</li>)}</ul></div><div className="rounded-[24px] border border-stone-200 bg-white/90 p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><h3 className="text-lg font-semibold text-stone-950">{copy.methodologyTitle}</h3><p className="mt-3 text-sm leading-7 text-stone-700">{copy.methodologyText}</p><div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4"><div className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{copy.bibliographyTitle}</div><p className="mt-2 text-sm leading-6 text-stone-700">{copy.bibliographyText}</p></div></div></section>
      <section className="grid gap-8 xl:grid-cols-[1.25fr,0.75fr]"><div className="rounded-[24px] border border-stone-200 bg-white/90 p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><h3 className="text-lg font-semibold text-stone-950">{copy.faqTitle}</h3><div className="mt-6 grid gap-4 md:grid-cols-3">{faq.map(([title, text]) => <article key={title} className="rounded-[20px] border border-stone-200 bg-stone-50 p-4"><h4 className="text-sm font-semibold text-stone-900">{title}</h4><p className="mt-2 text-sm leading-6 text-stone-600">{text}</p></article>)}</div></div><div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)]"><h3 className="text-lg font-semibold text-emerald-900">{copy.readTitle}</h3><p className="mt-3 text-sm leading-7 text-stone-700">{copy.readText}</p></div></section>
    </div>
  );
};

export default SourcesPanel;
