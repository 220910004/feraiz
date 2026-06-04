import React, { useMemo, useState } from 'react';
import {
  AdvancedCaseContext,
  ALL_HEIRS,
  Heir,
  HeirCategory,
  HeirType,
  ImpedimentType,
} from '../types/inheritance';
import { explainProspectiveBlock } from '../core/runtime/baseCalculator';
import { GlossaryTerm } from './GlossaryTerm';
import { getGlossaryDescription, getGlossaryLabel } from '../data/glossary';
import { CompactHeirPicker } from './CompactHeirPicker';
import { buildBlockageExplanation, getHeirLabel, getImpedimentLabel, getKhunsaRelationLabel } from '../utils/uiI18n';

type Language = 'tr' | 'en' | 'de' | 'es' | 'ar';

interface HeirSelectorProps {
  selectedHeirs: Heir[];
  onHeirsChange: (heirs: Heir[]) => void;
  deceasedGender: 'male' | 'female';
  caseContext: AdvancedCaseContext;
  onCaseContextChange: (context: AdvancedCaseContext) => void;
  language?: Language;
}

const CATEGORY_META: Record<Language, { id: HeirCategory; label: string; icon: string; hint: string }[]> = {
  tr: [
    { id: 'spouse', label: 'Eşler', icon: '💍', hint: 'Koca veya eşler grubu' },
    { id: 'parent', label: 'Anne-Baba', icon: '👨‍👩', hint: 'Üst soyun ilk halkası' },
    { id: 'grandparent', label: 'Dede-Nine', icon: '👴', hint: 'Baba ve anne üst hattı' },
    { id: 'child', label: 'Çocuklar', icon: '👶', hint: 'Doğrudan alt soy' },
    { id: 'grandchild', label: 'Torunlar', icon: '🧒', hint: 'Oğul alt soyu ve diğer torunlar' },
    { id: 'sibling', label: 'Kardeşler', icon: '👫', hint: 'Öz, baba bir ve anne bir kardeşler' },
    { id: 'extended', label: 'Asabe Devamı', icon: '👥', hint: 'Yeğen, amca ve amca çocukları' },
    { id: 'zawil_arham', label: 'Zevi’l-Erhâm', icon: '🪶', hint: 'Dayı, hala, teyze ve diğer rahim akrabaları' },
  ],
  en: [
    { id: 'spouse', label: 'Spouses', icon: '💍', hint: 'Husband or wives group' },
    { id: 'parent', label: 'Parents', icon: '👨‍👩', hint: 'First level ascendants' },
    { id: 'grandparent', label: 'Grandparents', icon: '👴', hint: 'Paternal and maternal upper line' },
    { id: 'child', label: 'Children', icon: '👶', hint: 'Direct descendants' },
    { id: 'grandchild', label: 'Grandchildren', icon: '🧒', hint: 'Son’s descendants and other grandchildren' },
    { id: 'sibling', label: 'Siblings', icon: '👫', hint: 'Full, paternal and maternal siblings' },
    { id: 'extended', label: 'Extended Agnates', icon: '👥', hint: 'Nephews, uncles, and their sons' },
    { id: 'zawil_arham', label: 'Distant Kindred', icon: '🪶', hint: 'Uncles on the maternal side, aunts, and other uterine kin' },
  ],
  de: [
    { id: 'spouse', label: 'Ehegatten', icon: '💍', hint: 'Ehemann oder Gruppe der Ehefrauen' },
    { id: 'parent', label: 'Eltern', icon: '👨‍👩', hint: 'Erste Stufe der Vorfahren' },
    { id: 'grandparent', label: 'Großeltern', icon: '👴', hint: 'Väterliche und mütterliche obere Linie' },
    { id: 'child', label: 'Kinder', icon: '👶', hint: 'Direkte Nachkommen' },
    { id: 'grandchild', label: 'Enkel', icon: '🧒', hint: 'Nachkommen des Sohnes und andere Enkel' },
    { id: 'sibling', label: 'Geschwister', icon: '👫', hint: 'Voll-, väterliche und mütterliche Geschwister' },
    { id: 'extended', label: 'Erweiterte Agnaten', icon: '👥', hint: 'Neffen, Onkel und deren Söhne' },
    { id: 'zawil_arham', label: 'Entferntere Verwandte', icon: '🪶', hint: 'Onkel mütterlicherseits, Tanten und weitere رحم-Verwandte' },
  ],
  es: [
    { id: 'spouse', label: 'Cónyuges', icon: '💍', hint: 'Esposo o grupo de esposas' },
    { id: 'parent', label: 'Padres', icon: '👨‍👩', hint: 'Primer nivel de ascendientes' },
    { id: 'grandparent', label: 'Abuelos', icon: '👴', hint: 'Línea superior paterna y materna' },
    { id: 'child', label: 'Hijos', icon: '👶', hint: 'Descendencia directa' },
    { id: 'grandchild', label: 'Nietos', icon: '🧒', hint: 'Descendencia del hijo y otros nietos' },
    { id: 'sibling', label: 'Hermanos', icon: '👫', hint: 'Hermanos completos, paternos y maternos' },
    { id: 'extended', label: 'Agnados ampliados', icon: '👥', hint: 'Sobrinos, tíos e hijos de los tíos' },
    { id: 'zawil_arham', label: 'Parientes lejanos', icon: '🪶', hint: 'Tíos maternos, tías y otros parientes uterinos' },
  ],
  ar: [
    { id: 'spouse', label: 'الزوجية', icon: '💍', hint: 'الزوج أو الزوجات' },
    { id: 'parent', label: 'الأبوان', icon: '👨‍👩', hint: 'أول طبقة من الأصول' },
    { id: 'grandparent', label: 'الأجداد والجدات', icon: '👴', hint: 'الخط الأعلى من جهة الأب والأم' },
    { id: 'child', label: 'الأولاد', icon: '👶', hint: 'الفرع المباشر' },
    { id: 'grandchild', label: 'الأحفاد', icon: '🧒', hint: 'أحفاد الابن وغيرهم' },
    { id: 'sibling', label: 'الإخوة', icon: '👫', hint: 'الإخوة الأشقاء ولأب ولأم' },
    { id: 'extended', label: 'بقية العصبة', icon: '👥', hint: 'أبناء الإخوة والأعمام وأبناؤهم' },
    { id: 'zawil_arham', label: 'ذوو الأرحام', icon: '🪶', hint: 'الخال والخالة والعمة وغيرهم' },
  ],
};

const MAX_COUNTS: Partial<Record<HeirType, number>> = {
  husband: 1,
  wife: 4,
  father: 1,
  mother: 1,
  grandfather_paternal: 1,
  grandfather_maternal: 1,
  grandmother_paternal: 1,
  grandmother_maternal: 1,
};

const IMPEDIMENT_ORDER: ImpedimentType[] = ['murder', 'religion', 'slavery', 'lian'];

const EMPTY_IMPEDIMENTS: Record<ImpedimentType, number> = {
  murder: 0,
  religion: 0,
  slavery: 0,
  lian: 0,
};

function clampCount(value: number, max = 999): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.floor(value)));
}

const TEXT = {
  tr: {
    chooserTitle: 'Kartlardan mirasçıları seçin.',
    chooserText: 'Hacb edilen kartlar artık seçilemez. Bir satır hacbedildiyse sebebi kartın üzerinde açıkça gösterilir.',
    selectionTitle: 'Seçim Özeti',
    selectionText: 'Seçtiğiniz mirasçılar ve girilen miras engelleri burada özetlenir.',
    selectedType: 'Seçilen tip',
    impedimentRecord: 'Engel kaydı',
    selected: 'seçili',
    noHeir: 'Henüz mirasçı seçilmedi.',
    male: 'Erkek',
    female: 'Kadın',
    chosen: 'Seçili',
    blockRisk: 'Hacb edildi',
    mayBeBlocked: 'sebebiyle hacb oluşabilir.',
    selectable: 'Bu mirasçı hesaba katılabilir.',
    perPersonInResult: 'Kişi başı pay sonuçta gösterilir',
    upperLimit: 'Üst sınır',
    impediments: 'Miras engelleri',
    impedimentsText: 'Burada girilen sayılar, seçilen toplam kişiden düşülür. Aynı kişi için birden fazla engel yazmayın.',
    advancedCases: 'İleri Durumlar',
    advancedCasesText: 'Haml, Hünsâ, Mefkud ve Münâsehat ayarlarını buradan girebilirsiniz.',
    none: 'Yok',
    active: 'Aktif',
    pregnancySettings: 'Haml ayarları',
    pregnancyText: 'Ana listede çocuk ayrıca eklenmez. Buradan fetus sayısı ve cinsiyet bilgisi girilince sistem muhtemel senaryolar üzerinden rezerv payı ayırır.',
    probableChildCount: 'Muhtemel çocuk sayısı',
    sexInfo: 'Cinsiyet bilgisi',
    uncertain: 'Belirsiz',
    knownMale: 'Erkek olduğu biliniyor',
    knownFemale: 'Kız olduğu biliniyor',
    khunsaSettings: 'Hünsâ ayarları',
    khunsaText: 'Hünsâ kişiyi ana listede ayrıca erkek veya kadın diye eklemeyin. Aşağıdan akrabalık cinsini ve sayısını girin.',
    relationType: 'Akrabalık türü',
    personCount: 'Kişi sayısı',
    mafqudSettings: 'Mefkud ayarları',
    mafqudText: 'Kayıp kişiyi ana mirasçı listesine ayrıca eklemeyin. Burada seçtiğiniz akraba için senaryolar kurulur.',
    mafqudType: 'Mefkud akraba türü',
    choose: 'Seçin',
    munasakhatSettings: 'Münâsehat ayarları',
    munasakhatText: 'İlk mirastan pay alan bir kişi daha sonra vefat ettiyse, burada ikinci mirası kurabilirsiniz.',
    laterDeceased: 'Sonradan vefat eden mirasçı',
    secondGender: 'İkinci müteveffanın cinsiyeti',
    extraEstate: 'Ek tereke',
    note: 'Açıklama notu',
    notePlaceholder: 'Örn: İlk terekeden pay alan anne bir hafta sonra vefat etti.',
    chooseMainHeirsFirst: 'Önce ana mirasçıları seçin',
    secondaryHeirsTitle: 'İkinci terekenin mirasçıları',
    secondaryHeirsDesc: 'Bu bölüm yalnız ardışık vefat eden ikinci kişi içindir; ilk terekenin mirasçılarıyla aynı olmak zorunda değildir.',
  },

  en: {
    chooserTitle: 'Choose heirs from the cards.', chooserText: 'Cards that are blocked can no longer be selected. If a row is blocked, the reason is shown clearly on the card.', selectionTitle: 'Selection summary', selectionText: 'Selected heirs and recorded impediments are summarized here.', selectedType: 'Selected types', impedimentRecord: 'Impediment records', selected: 'selected', noHeir: 'No heir has been selected yet.', male: 'Male', female: 'Female', chosen: 'Chosen', blockRisk: 'Blocked', mayBeBlocked: 'may be blocked because of', selectable: 'This heir can be included in the calculation.', perPersonInResult: 'Per-person share appears in the result', upperLimit: 'Upper limit', impediments: 'Legal impediments', impedimentsText: 'Counts entered here are deducted from the selected total. Do not record more than one impediment for the same person.', advancedCases: 'Advanced cases', advancedCasesText: 'Configure haml, khunsa, mafqud, and munasakhat here.', none: 'Off', active: 'On', pregnancySettings: 'Haml settings', pregnancyText: 'Do not add the unborn child separately in the main list. Once you enter the possible child count and sex information here, the system reserves a precautionary share across likely scenarios.', probableChildCount: 'Possible child count', sexInfo: 'Sex information', uncertain: 'Unknown', knownMale: 'Known male', knownFemale: 'Known female', khunsaSettings: 'Khunsa settings', khunsaText: 'Do not add the khunsa person separately as male or female in the main list. Enter the relation type and count below.', relationType: 'Relation type', personCount: 'Person count', mafqudSettings: 'Mafqud settings', mafqudText: 'Do not add the missing person separately in the main heir list. The system will build scenarios for the selected relation here.', mafqudType: 'Missing heir type', choose: 'Choose', munasakhatSettings: 'Munasakhat settings', munasakhatText: 'If a person who inherited from the first estate died later, you can set up the second estate here.', laterDeceased: 'Heir who died later', secondGender: 'Gender of the second deceased', extraEstate: 'Additional estate', note: 'Note', notePlaceholder: 'Example: The mother who received from the first estate died a week later.', chooseMainHeirsFirst: 'Choose the main heirs first', secondaryHeirsTitle: 'Heirs of the second estate', secondaryHeirsDesc: 'This section is only for the second deceased person; it does not have to match the heirs of the first estate.',
  },
  de: {
    chooserTitle: 'Wählen Sie die Erben über die Karten aus.', chooserText: 'Karten mit möglicher Verdrängung können trotzdem ausgewählt werden. Wenn kein Anteil bleibt, wird der Grund im Ergebnis klar angezeigt.', selectionTitle: 'Auswahlübersicht', selectionText: 'Die ausgewählten Erben und eingetragenen Hindernisse werden hier zusammengefasst.', selectedType: 'Gewählte Typen', impedimentRecord: 'Hinderniseinträge', selected: 'gewählt', noHeir: 'Noch kein Erbe ausgewählt.', male: 'Männlich', female: 'Weiblich', chosen: 'Gewählt', blockRisk: 'Ausgeschlossen', mayBeBlocked: 'kann verdrängt werden wegen', selectable: 'Dieser Erbe kann in die Berechnung einbezogen werden.', perPersonInResult: 'Der Anteil pro Person erscheint im Ergebnis', upperLimit: 'Obergrenze', impediments: 'Rechtliche Hindernisse', impedimentsText: 'Die hier eingetragenen Zahlen werden von der Gesamtzahl abgezogen. Für dieselbe Person nicht mehrere Hindernisse eintragen.', advancedCases: 'Erweiterte Fälle', advancedCasesText: 'Hier können Haml, Khunsa, Mafqud und Munasakhat eingestellt werden.', none: 'Aus', active: 'An', pregnancySettings: 'Haml-Einstellungen', pregnancyText: 'Das ungeborene Kind nicht separat in der Hauptliste eintragen. Wenn Sie hier die mögliche Kinderzahl und das Geschlecht angeben, reserviert das System einen Vorsichtsanteil.', probableChildCount: 'Mögliche Kinderzahl', sexInfo: 'Geschlechtsangabe', uncertain: 'Unbekannt', knownMale: 'Männlich bekannt', knownFemale: 'Weiblich bekannt', khunsaSettings: 'Khunsa-Einstellungen', khunsaText: 'Die Khunsa-Person nicht separat als männlich oder weiblich in die Hauptliste eintragen. Geben Sie unten Verwandtschaft und Anzahl ein.', relationType: 'Verwandtschaft', personCount: 'Personenzahl', mafqudSettings: 'Mafqud-Einstellungen', mafqudText: 'Die vermisste Person nicht separat in die Hauptliste aufnehmen. Hier erstellt das System Szenarien für die gewählte Verwandtschaft.', mafqudType: 'Art des vermissten Erben', choose: 'Wählen', munasakhatSettings: 'Munasakhat-Einstellungen', munasakhatText: 'Wenn eine Person nach der ersten Verteilung verstirbt, kann hier der zweite Nachlass aufgebaut werden.', laterDeceased: 'Später verstorbener Erbe', secondGender: 'Geschlecht der zweiten verstorbenen Person', extraEstate: 'Zusätzlicher Nachlass', note: 'Notiz', notePlaceholder: 'Beispiel: Die Mutter, die aus dem ersten Nachlass erbte, starb eine Woche später.', chooseMainHeirsFirst: 'Zuerst die Haupterben wählen', secondaryHeirsTitle: 'Erben des zweiten Nachlasses', secondaryHeirsDesc: 'Dieser Abschnitt gilt nur für die zweite verstorbene Person; er muss nicht mit dem ersten Nachlass übereinstimmen.',
  },
  es: {
    chooserTitle: 'Seleccione los herederos desde las tarjetas.', chooserText: 'Las tarjetas ya bloqueadas no pueden seleccionarse. El motivo del bloqueo aparece directamente en la tarjeta.', selectionTitle: 'Resumen de selección', selectionText: 'Aquí se resumen los herederos elegidos y los impedimentos registrados.', selectedType: 'Tipos seleccionados', impedimentRecord: 'Registros de impedimento', selected: 'seleccionado', noHeir: 'Todavía no se ha seleccionado ningún heredero.', male: 'Masculino', female: 'Femenino', chosen: 'Elegido', blockRisk: 'Bloqueado', mayBeBlocked: 'puede quedar excluido por', selectable: 'Este heredero puede incluirse en el cálculo.', perPersonInResult: 'La cuota por persona aparece en el resultado', upperLimit: 'Límite superior', impediments: 'Impedimentos legales', impedimentsText: 'Los números introducidos aquí se restan del total seleccionado. No registre más de un impedimento para la misma persona.', advancedCases: 'Casos avanzados', advancedCasesText: 'Configure aquí haml, khunsa, mafqud y munasakhat.', none: 'Desactivado', active: 'Activado', pregnancySettings: 'Ajustes de haml', pregnancyText: 'No añada al no nacido por separado en la lista principal. Cuando introduzca aquí el número posible de hijos y la información del sexo, el sistema reservará una cuota cautelar.', probableChildCount: 'Posible número de hijos', sexInfo: 'Información sobre el sexo', uncertain: 'Desconocido', knownMale: 'Se sabe que es varón', knownFemale: 'Se sabe que es mujer', khunsaSettings: 'Ajustes de khunsa', khunsaText: 'No añada a la persona khunsa por separado como hombre o mujer en la lista principal. Introduzca abajo el parentesco y la cantidad.', relationType: 'Tipo de parentesco', personCount: 'Número de personas', mafqudSettings: 'Ajustes de mafqud', mafqudText: 'No añada a la persona desaparecida por separado en la lista principal. Aquí el sistema construirá escenarios para el parentesco elegido.', mafqudType: 'Tipo de heredero desaparecido', choose: 'Elegir', munasakhatSettings: 'Ajustes de munasakhat', munasakhatText: 'Si una persona que heredó de la primera herencia falleció después, aquí puede crear la segunda herencia.', laterDeceased: 'Heredero fallecido después', secondGender: 'Sexo del segundo causante', extraEstate: 'Herencia adicional', note: 'Nota', notePlaceholder: 'Ejemplo: La madre que recibió de la primera herencia falleció una semana después.', chooseMainHeirsFirst: 'Primero elija los herederos principales', secondaryHeirsTitle: 'Herederos de la segunda herencia', secondaryHeirsDesc: 'Esta sección es solo para la segunda persona fallecida; no tiene que coincidir con los herederos de la primera herencia.',
  },
  ar: {
    chooserTitle: 'اختر الورثة من البطاقات.', chooserText: 'البطاقات التي حُجبت لا يمكن اختيارها. ويظهر سبب الحجب بوضوح على البطاقة نفسها.', selectionTitle: 'ملخص الاختيار', selectionText: 'يظهر هنا ملخص الورثة المختارين والموانع المسجلة.', selectedType: 'الأنواع المختارة', impedimentRecord: 'سجلات الموانع', selected: 'مختار', noHeir: 'لم يتم اختيار أي وارث بعد.', male: 'ذكر', female: 'أنثى', chosen: 'مختار', blockRisk: 'حُجب', mayBeBlocked: 'قد يُحجب بسبب', selectable: 'يمكن إدخال هذا الوارث في الحساب.', perPersonInResult: 'يظهر نصيب كل شخص في النتيجة', upperLimit: 'الحد الأعلى', impediments: 'موانع الإرث', impedimentsText: 'الأعداد المدخلة هنا تُخصم من العدد الكلي المختار. لا تكتب أكثر من مانع واحد للشخص نفسه.', advancedCases: 'الحالات المتقدمة', advancedCasesText: 'يمكن هنا ضبط الحمل والخنثى والمفقود والمناسخة.', none: 'إيقاف', active: 'تفعيل', pregnancySettings: 'إعدادات الحمل', pregnancyText: 'لا تضف الجنين مستقلاً في القائمة الرئيسية. عند إدخال عدد الأولاد المحتملين وبيان الجنس هنا سيحجز النظام نصيباً احتياطياً.', probableChildCount: 'عدد الأولاد المتوقع', sexInfo: 'بيان الجنس', uncertain: 'غير معلوم', knownMale: 'معلوم أنه ذكر', knownFemale: 'معلوم أنها أنثى', khunsaSettings: 'إعدادات الخنثى', khunsaText: 'لا تضف الخنثى مستقلاً على أنه ذكر أو أنثى في القائمة الرئيسية. أدخل نوع القرابة والعدد من الأسفل.', relationType: 'نوع القرابة', personCount: 'عدد الأشخاص', mafqudSettings: 'إعدادات المفقود', mafqudText: 'لا تضف المفقود مستقلاً في القائمة الرئيسية. سينشئ النظام هنا سيناريوهات للقرابة المختارة.', mafqudType: 'نوع الوارث المفقود', choose: 'اختر', munasakhatSettings: 'إعدادات المناسخة', munasakhatText: 'إذا توفي شخص بعد أن ورث من التركة الأولى فيمكن إنشاء التركة الثانية هنا.', laterDeceased: 'الوارث الذي توفي لاحقاً', secondGender: 'جنس المتوفى الثاني', extraEstate: 'تركة إضافية', note: 'ملاحظة', notePlaceholder: 'مثال: الأم التي أخذت من التركة الأولى توفيت بعد أسبوع.', chooseMainHeirsFirst: 'اختر الورثة الأصليين أولاً', secondaryHeirsTitle: 'ورثة التركة الثانية', secondaryHeirsDesc: 'هذا القسم خاص بالمتوفى الثاني فقط، ولا يلزم أن يطابق ورثة التركة الأولى.',
  },
} as const;

export const HeirSelector: React.FC<HeirSelectorProps> = ({
  selectedHeirs,
  onHeirsChange,
  deceasedGender,
  caseContext,
  onCaseContextChange,
  language = 'tr',
}) => {
  const locale = (TEXT as any)[language] || TEXT.tr;
  const categories = CATEGORY_META[language] || CATEGORY_META.tr;

  const filteredHeirs = useMemo(() => {
    return ALL_HEIRS.filter((heir) => {
      if (deceasedGender === 'male' && heir.type === 'husband') return false;
      if (deceasedGender === 'female' && heir.type === 'wife') return false;
      return true;
    });
  }, [deceasedGender]);

  const selectedCounts = useMemo(() => {
    return selectedHeirs.reduce<Record<string, number>>((acc, heir) => {
      acc[heir.type] = heir.count;
      return acc;
    }, {});
  }, [selectedHeirs]);

  const activeSelected = useMemo(() => selectedHeirs.filter((heir) => heir.count > 0), [selectedHeirs]);

  const pregnancyConfig = caseContext.pregnancyConfig ?? {
    enabled: caseContext.pregnancy === 'possible',
    count: 1 as 1 | 2 | 3,
    sexMode: 'unknown' as const,
  };

  const khunsaConfig = caseContext.khunsaConfig ?? {
    enabled: (caseContext.khunsaCount || 0) > 0,
    relation: 'child' as const,
    count: Math.max(1, caseContext.khunsaCount || 1),
  };

  const mafqudConfig = caseContext.mafqudConfig ?? {
    enabled: (caseContext.mafqudCount || 0) > 0,
    heirType: '' as HeirType | '',
    count: Math.max(1, caseContext.mafqudCount || 1),
  };

  const munasakhatConfig = caseContext.munasakhatConfig ?? {
    enabled: Boolean(caseContext.munasakhatNote?.trim()),
    sourceHeirType: '' as HeirType | '',
    deceasedGender: 'male' as const,
    extraEstate: 0,
    secondaryHeirs: [] as Heir[],
    note: caseContext.munasakhatNote || '',
  };

  const [selectorMode, setSelectorMode] = useState<'basic' | 'expert'>('expert');
  const [showAdvanced, setShowAdvanced] = useState(true);

  const updateSelectedHeirs = (type: HeirType, updater: (existing?: Heir) => Heir | null) => {
    const existing = selectedHeirs.find((heir) => heir.type === type);
    const nextHeir = updater(existing);

    if (!existing && !nextHeir) return;
    if (!existing && nextHeir) {
      onHeirsChange([...selectedHeirs, nextHeir]);
      return;
    }
    if (existing && !nextHeir) {
      onHeirsChange(selectedHeirs.filter((heir) => heir.type !== type));
      return;
    }

    onHeirsChange(selectedHeirs.map((heir) => (heir.type === type ? (nextHeir as Heir) : heir)));
  };

  const handleCountChange = (type: HeirType, nextCount: number) => {
    const heirDef = ALL_HEIRS.find((heir) => heir.type === type);
    if (!heirDef) return;

    const maxCount = MAX_COUNTS[type] ?? 99;
    const clamped = clampCount(nextCount, maxCount);

    updateSelectedHeirs(type, (existing) => {
      if (clamped <= 0) return null;
      return {
        ...(existing || heirDef),
        count: clamped,
        impediments: {
          ...EMPTY_IMPEDIMENTS,
          ...(existing?.impediments || {}),
        },
      };
    });
  };

  const handleImpedimentChange = (type: HeirType, impediment: ImpedimentType, nextValue: number) => {
    updateSelectedHeirs(type, (existing) => {
      if (!existing) return existing || null;
      const count = existing.count;
      const clamped = clampCount(nextValue, count);
      return {
        ...existing,
        impediments: {
          ...EMPTY_IMPEDIMENTS,
          ...(existing.impediments || {}),
          [impediment]: clamped,
        },
      };
    });
  };

  const totalImpededPeople = useMemo(() => {
    return selectedHeirs.reduce((sum, heir) => {
      const impediments = { ...EMPTY_IMPEDIMENTS, ...(heir.impediments || {}) };
      return sum + IMPEDIMENT_ORDER.reduce((inner, key) => inner + (impediments[key] || 0), 0);
    }, 0);
  }, [selectedHeirs]);

  const updatePregnancyConfig = (next: typeof pregnancyConfig) => {
    onCaseContextChange({
      ...caseContext,
      pregnancy: next.enabled ? 'possible' : 'none',
      pregnancyConfig: next,
    });
  };

  const updateKhunsaConfig = (next: typeof khunsaConfig) => {
    onCaseContextChange({
      ...caseContext,
      khunsaCount: next.enabled ? next.count : 0,
      khunsaConfig: next,
    });
  };

  const updateMafqudConfig = (next: typeof mafqudConfig) => {
    onCaseContextChange({
      ...caseContext,
      mafqudCount: next.enabled ? next.count : 0,
      mafqudConfig: next,
    });
  };

  const updateMunasakhatConfig = (next: typeof munasakhatConfig) => {
    onCaseContextChange({
      ...caseContext,
      munasakhatNote: next.enabled ? next.note : '',
      munasakhatConfig: next,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[22px] border border-blue-200 bg-blue-50/80 p-4 text-sm text-blue-900 shadow-sm">
        <p className="font-medium">{locale.chooserTitle}</p>
        <p className="mt-2 text-blue-800/90 leading-5">
          <GlossaryTerm term={language === "en" ? getGlossaryLabel("hajb", language) : "Hacb"} description={getGlossaryDescription("hajb", language)} /> {locale.chooserText}
        </p>
      </div>

      <div className="rounded-[24px] border border-stone-200 bg-white/90 p-4 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-stone-900">{locale.selectionTitle}</h3>
            <p className="mt-1 text-sm text-stone-500">{locale.selectionText}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm min-w-[240px]">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-stone-500">{locale.selectedType}</p>
              <p className="mt-1 text-xl font-semibold text-stone-900">{activeSelected.length}</p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-stone-500">{locale.impedimentRecord}</p>
              <p className="mt-1 text-xl font-semibold text-stone-900">{totalImpededPeople}</p>
            </div>
          </div>
        </div>

        {activeSelected.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeSelected.map((heir) => {
              const impediments = { ...EMPTY_IMPEDIMENTS, ...(heir.impediments || {}) };
              const impeded = IMPEDIMENT_ORDER.reduce((sum, key) => sum + (impediments[key] || 0), 0);
              return (
                <div
                  key={`summary-${heir.type}`}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700"
                >
                  <span className="font-medium text-stone-900">{getHeirLabel(heir.type, language)}</span>
                  <span>x{heir.count}</span>
                  {impeded > 0 && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-700">{impeded} {language === 'en' ? 'records' : language === 'de' ? 'Einträge' : language === 'es' ? 'registros' : language === 'ar' ? 'سجلات' : 'engel'}</span>}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-5 text-sm text-stone-500">{locale.noHeir}</p>
        )}
      </div>

      <div className="space-y-6">
        {categories.map((category) => {
          const heirsInCategory = filteredHeirs.filter((heir) => heir.category === category.id);
          if (heirsInCategory.length === 0) return null;

          const selectedCountInCategory = heirsInCategory.filter((heir) => (selectedCounts[heir.type] || 0) > 0).length;

          return (
            <section
              key={category.id}
              className="rounded-[26px] border border-stone-200 bg-white/90 p-4 md:p-5 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl"
            >
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <h3 className="text-lg font-semibold text-stone-950">{category.label}</h3>
                    <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs text-stone-600">{selectedCountInCategory} {locale.selected}</span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500">{category.hint}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3">
                {heirsInCategory.map((heirDef) => {
                  const count = selectedCounts[heirDef.type] || 0;
                  const relevantHeirs = selectedHeirs.filter((heir) => heir.type !== heirDef.type && heir.count > 0);
                  const blockInfo = explainProspectiveBlock(heirDef.type, relevantHeirs);
                  const maxCount = MAX_COUNTS[heirDef.type] ?? 99;
                  const impediments = {
                    ...EMPTY_IMPEDIMENTS,
                    ...(selectedHeirs.find((heir) => heir.type === heirDef.type)?.impediments || {}),
                  };

                  return (
                    <div
                      key={heirDef.type}
                      className={`ui-choice-card rounded-[22px] p-4 ${
                        blockInfo.blocked
                          ? 'ui-blocked-card'
                          : count > 0
                            ? 'ui-choice-card-selected'
                            : 'ui-muted-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className={`ui-choice-title font-semibold ${blockInfo.blocked ? 'text-stone-500 line-through' : 'text-stone-950'}`}>{getHeirLabel(heirDef.type, language)}</h4>
                            <span className="rounded-full bg-white/80 px-2 py-0.5 text-[11px] text-stone-500 border border-stone-200">
                              {heirDef.gender === 'male' ? locale.male : locale.female}
                            </span>
                            {count > 0 && (
                              <span className="rounded-full border border-stone-300 bg-stone-900 px-2 py-0.5 text-[11px] text-white">
                                {locale.chosen}
                              </span>
                            )}
                            {blockInfo.blocked && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] text-red-700 border border-red-200">
                                {locale.blockRisk}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 font-arabic text-sm text-stone-400">{heirDef.labelArabic}</p>
                          <p className="ui-choice-subtle mt-1.5 text-sm text-stone-500 leading-5">
                            {blockInfo.blocked
                              ? buildBlockageExplanation(blockInfo.blockedByType ? getHeirLabel(blockInfo.blockedByType, language) : '', blockInfo.reason, language)
                              : buildBlockageExplanation('', locale.selectable, language)}
                          </p>
                        </div>

                        <div className="ui-muted-card-strong flex items-center gap-2 rounded-2xl px-2 py-1.5 shadow-sm">
                          <button
                            type="button"
                            onClick={() => handleCountChange(heirDef.type, count - 1)}
                            disabled={blockInfo.blocked}
                            className={`w-8 h-8 rounded-xl border font-semibold ${blockInfo.blocked ? 'border-stone-200 text-stone-300 cursor-not-allowed' : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-100'}`}
                            aria-label={`${getHeirLabel(heirDef.type, language)} azalt`}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={0}
                            max={maxCount}
                            value={count}
                            onChange={(event) => handleCountChange(heirDef.type, Number(event.target.value || 0))}
                            disabled={blockInfo.blocked}
                            className={`w-16 rounded-xl border px-2 py-1.5 text-center text-sm font-semibold outline-none ${blockInfo.blocked ? 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed' : 'border-stone-300 bg-white text-stone-900 focus:border-stone-700'}`}
                            inputMode="numeric"
                            aria-label={`${getHeirLabel(heirDef.type, language)} sayısı`}
                          />
                          <button
                            type="button"
                            onClick={() => handleCountChange(heirDef.type, count + 1)}
                            disabled={blockInfo.blocked || count >= maxCount}
                            className={`w-8 h-8 rounded-xl border font-semibold ${
                              blockInfo.blocked || count >= maxCount
                                ? 'border-stone-200 text-stone-300 cursor-not-allowed'
                                : 'border-stone-300 bg-white text-stone-900 hover:bg-stone-100'
                            }`}
                            aria-label={`${getHeirLabel(heirDef.type, language)} artır`}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-stone-500">
                        {maxCount < 99 && (
                          <span className="rounded-full border border-stone-200 bg-white px-2.5 py-1">{locale.upperLimit}: {maxCount}</span>
                        )}
                        {count > 0 && (
                          <span className="rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-emerald-700">
                            {locale.perPersonInResult}
                          </span>
                        )}
                      </div>

                      {count > 0 && (
                        <div className="mt-3 rounded-[18px] border border-amber-200 bg-amber-50/70 p-3 space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-amber-950"><GlossaryTerm term={locale.impediments} description={getGlossaryDescription("impediment", language)} /></h5>
                            <p className="mt-1 text-xs leading-5 text-amber-800">{locale.impedimentsText}</p>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                            {IMPEDIMENT_ORDER.map((impediment) => (
                              <label key={`${heirDef.type}-${impediment}`} className="space-y-1">
                                <span className="text-xs font-medium text-amber-900">{getImpedimentLabel(impediment, language)}</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={count}
                                  value={impediments[impediment] || 0}
                                  onChange={(event) => handleImpedimentChange(heirDef.type, impediment, Number(event.target.value))}
                                  className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-stone-900 outline-none focus:border-amber-400"
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-[26px] border border-stone-200 bg-white/90 p-4 md:p-5 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧭</span>
            <div>
              <h3 className="text-lg font-semibold text-stone-950">{locale.advancedCases}</h3>
              <p className="mt-1 text-sm text-stone-500">{locale.advancedCasesText}</p>
            </div>
          </div>
          <button type="button" onClick={() => { setSelectorMode('expert'); setShowAdvanced((value) => !value); }} className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700">{showAdvanced ? (language === 'en' ? 'Hide advanced cases' : language === 'de' ? 'Erweiterte Fälle ausblenden' : language === 'es' ? 'Ocultar casos avanzados' : language === 'ar' ? 'إخفاء الحالات المتقدمة' : 'İleri durumları gizle') : (language === 'en' ? 'Show advanced cases' : language === 'de' ? 'Erweiterte Fälle anzeigen' : language === 'es' ? 'Mostrar casos avanzados' : language === 'ar' ? 'إظهار الحالات المتقدمة' : 'İleri durumları göster')}</button>
        </div>

        {showAdvanced && <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-[22px] border border-stone-200 bg-stone-50/70 p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-900"><GlossaryTerm term={getGlossaryLabel("haml", language)} description={getGlossaryDescription("haml", language)} /> {language === "en" ? "settings" : "ayarları"}</p>
              <p className="mt-1 text-xs text-stone-500 leading-5">{locale.pregnancyText}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button type="button" onClick={() => updatePregnancyConfig({ ...pregnancyConfig, enabled: false })} className={`px-4 py-2 rounded-2xl border text-sm ${!pregnancyConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.none}</button>
              <button type="button" onClick={() => updatePregnancyConfig({ ...pregnancyConfig, enabled: true })} className={`px-4 py-2 rounded-2xl border text-sm ${pregnancyConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.active}</button>
            </div>
            {pregnancyConfig.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-stone-900">{locale.probableChildCount}</span>
                  <select value={pregnancyConfig.count} onChange={(event) => updatePregnancyConfig({ ...pregnancyConfig, count: Number(event.target.value) as 1 | 2 | 3 })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
                    <option value={1}>{language === 'tr' ? '1 çocuk' : language === 'de' ? '1 Kind' : language === 'es' ? '1 hijo' : language === 'ar' ? 'طفل واحد' : '1 child'}</option>
                    <option value={2}>{language === 'tr' ? '2 çocuk' : language === 'de' ? '2 Kinder' : language === 'es' ? '2 hijos' : language === 'ar' ? 'طفلان' : '2 children'}</option>
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-stone-900">{locale.sexInfo}</span>
                  <select value={pregnancyConfig.sexMode} onChange={(event) => updatePregnancyConfig({ ...pregnancyConfig, sexMode: event.target.value as typeof pregnancyConfig.sexMode })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
                    <option value="unknown">{locale.uncertain}</option>
                    <option value="male">{locale.knownMale}</option>
                    <option value="female">{locale.knownFemale}</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <div className="rounded-[22px] border border-stone-200 bg-stone-50/70 p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-900"><GlossaryTerm term={getGlossaryLabel("khunsa", language)} description={getGlossaryDescription("khunsa", language)} /> {language === "en" ? "settings" : "ayarları"}</p>
              <p className="mt-1 text-xs text-stone-500 leading-5">{locale.khunsaText}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button type="button" onClick={() => updateKhunsaConfig({ ...khunsaConfig, enabled: false })} className={`px-4 py-2 rounded-2xl border text-sm ${!khunsaConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.none}</button>
              <button type="button" onClick={() => updateKhunsaConfig({ ...khunsaConfig, enabled: true })} className={`px-4 py-2 rounded-2xl border text-sm ${khunsaConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.active}</button>
            </div>
            {khunsaConfig.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-stone-900">{locale.relationType}</span>
                  <select value={khunsaConfig.relation} onChange={(event) => updateKhunsaConfig({ ...khunsaConfig, relation: event.target.value as typeof khunsaConfig.relation })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
                    {(['child','grandchild','full_sibling','paternal_sibling','maternal_sibling'] as const).map((key) => (
                      <option key={key} value={key}>{getKhunsaRelationLabel(key, language)}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-stone-900">{locale.personCount}</span>
                  <input type="number" min={1} max={4} value={khunsaConfig.count} onChange={(event) => updateKhunsaConfig({ ...khunsaConfig, count: clampCount(Number(event.target.value), 4) || 1 })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900" />
                </label>
              </div>
            )}
          </div>

          <div className="rounded-[22px] border border-stone-200 bg-stone-50/70 p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-stone-900"><GlossaryTerm term={getGlossaryLabel("mafqud", language)} description={getGlossaryDescription("mafqud", language)} /> {language === "en" ? "settings" : "ayarları"}</p>
              <p className="mt-1 text-xs text-stone-500 leading-5">{locale.mafqudText}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button type="button" onClick={() => updateMafqudConfig({ ...mafqudConfig, enabled: false })} className={`px-4 py-2 rounded-2xl border text-sm ${!mafqudConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.none}</button>
              <button type="button" onClick={() => updateMafqudConfig({ ...mafqudConfig, enabled: true })} className={`px-4 py-2 rounded-2xl border text-sm ${mafqudConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.active}</button>
            </div>
            {mafqudConfig.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-stone-900">{locale.mafqudType}</span>
                  <select value={mafqudConfig.heirType} onChange={(event) => updateMafqudConfig({ ...mafqudConfig, heirType: event.target.value as HeirType | '' })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
                    <option value="">{locale.choose}</option>
                    {filteredHeirs.map((heir) => (
                      <option key={heir.type} value={heir.type}>{getHeirLabel(heir.type, language)}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-sm font-medium text-stone-900">{locale.personCount}</span>
                  <input type="number" min={1} max={4} value={mafqudConfig.count} onChange={(event) => updateMafqudConfig({ ...mafqudConfig, count: clampCount(Number(event.target.value), 4) || 1 })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900" />
                </label>
              </div>
            )}
          </div>

          <div className="rounded-[22px] border border-stone-200 bg-stone-50/70 p-4 space-y-4 xl:col-span-2">
            <div>
              <p className="text-sm font-medium text-stone-900"><GlossaryTerm term={getGlossaryLabel("munasakhat", language)} description={getGlossaryDescription("munasakhat", language)} /> {language === "en" ? "settings" : "ayarları"}</p>
              <p className="mt-1 text-xs text-stone-500 leading-5">{locale.munasakhatText}</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button type="button" onClick={() => updateMunasakhatConfig({ ...munasakhatConfig, enabled: false })} className={`px-4 py-2 rounded-2xl border text-sm ${!munasakhatConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.none}</button>
              <button type="button" onClick={() => updateMunasakhatConfig({ ...munasakhatConfig, enabled: true })} className={`px-4 py-2 rounded-2xl border text-sm ${munasakhatConfig.enabled ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.active}</button>
            </div>

            {munasakhatConfig.enabled && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-stone-900">{locale.laterDeceased}</span>
                    <select value={munasakhatConfig.sourceHeirType} onChange={(event) => updateMunasakhatConfig({ ...munasakhatConfig, sourceHeirType: event.target.value as HeirType | '' })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900">
                      <option value="">{locale.chooseMainHeirsFirst}</option>
                      {activeSelected.map((heir) => (
                        <option key={heir.type} value={heir.type}>{getHeirLabel(heir.type, language)}</option>
                      ))}
                    </select>
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-stone-900">{locale.secondGender}</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => updateMunasakhatConfig({ ...munasakhatConfig, deceasedGender: 'male' })} className={`flex-1 rounded-xl border px-3 py-2 text-sm ${munasakhatConfig.deceasedGender === 'male' ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.male}</button>
                      <button type="button" onClick={() => updateMunasakhatConfig({ ...munasakhatConfig, deceasedGender: 'female' })} className={`flex-1 rounded-xl border px-3 py-2 text-sm ${munasakhatConfig.deceasedGender === 'female' ? 'border-stone-900 bg-stone-900 text-white shadow-sm' : 'border-stone-300 bg-white text-stone-700'}`}>{locale.female}</button>
                    </div>
                  </label>
                  <label className="space-y-1">
                    <span className="text-sm font-medium text-stone-900">{locale.extraEstate}</span>
                    <input type="number" min={0} step="0.01" value={munasakhatConfig.extraEstate} onChange={(event) => updateMunasakhatConfig({ ...munasakhatConfig, extraEstate: Math.max(0, Number(event.target.value) || 0) })} className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900" />
                  </label>
                </div>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-stone-900">{locale.note}</span>
                  <textarea value={munasakhatConfig.note} onChange={(event) => updateMunasakhatConfig({ ...munasakhatConfig, note: event.target.value })} rows={3} placeholder={locale.notePlaceholder} className="w-full rounded-[18px] border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none focus:border-stone-700" />
                </label>

                <CompactHeirPicker
                  selectedHeirs={munasakhatConfig.secondaryHeirs}
                  onChange={(secondaryHeirs) => updateMunasakhatConfig({ ...munasakhatConfig, secondaryHeirs })}
                  deceasedGender={munasakhatConfig.deceasedGender}
                  title={locale.secondaryHeirsTitle}
                  description={locale.secondaryHeirsDesc}
                  language={language}
                />
              </div>
            )}
          </div>
        </div>}
      </section>
    </div>
  );
};

export default HeirSelector;
