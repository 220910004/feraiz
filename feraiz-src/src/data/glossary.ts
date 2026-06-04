import type { UiLanguage } from '../utils/uiI18n';

export const GLOSSARY = {
  faraid: 'Faraid, İslam miras hukukunda payların kimlere ve hangi oranda verileceğini inceleyen ilim dalıdır.',
  ashabulFuruz: 'Ashâbu’l-furûz, payı nasla belirlenmiş mirasçılardır. Eş, anne, baba, kız gibi bazı mirasçılar bu grupta yer alır.',
  asaba: 'Asabe, belirli farz paylar verildikten sonra kalan bakiyeyi alan mirasçılardır.',
  asabaBiNafsihi: 'Bi-nefsihi asabe, başka birine ihtiyaç duymadan kendi başına bakiye alan mirasçıdır. Oğul ve öz erkek kardeş buna örnektir.',
  asabaBiGayrihi: 'Bi-gayrihi asabe, yanında aynı derecede bir erkek bulunduğu için asabe olan kadındır. Oğulla birlikte kız buna örnektir.',
  asabaMaaGayrihi: 'Ma’a-gayrihi asabe, kız veya oğlun kızı ile birlikte bulunduğunda bakiye alan kız kardeştir.',
  zawilArham: 'Zevi’l-erhâm, ashâbu’l-furûz veya asabe olmayan rahim akrabalarıdır. Bazı mezheplerde belirli şartlarla mirasa dahil olurlar.',
  hajb: 'Hacb, daha yakın veya daha güçlü bir mirasçı sebebiyle başka bir mirasçının tamamen düşmesi ya da payının azalmasıdır.',
  hajbHirman: 'Hacb-i hırman, mirasçının tamamen düşmesidir. Mesela baba varken dede miras alamaz.',
  hajbNuqsan: 'Hacb-i nuksan, mirasçının tamamen düşmeyip payının azalmasıdır. Mesela çocuk varken annenin payı 1/3 yerine 1/6 olur.',
  awl: 'Avl, farz paylarının toplamı terekeyi aştığında ortak paydanın büyütülmesi ve bütün payların buna göre küçülmesidir.',
  radd: 'Redd, asabe bulunmadığında artan kısmın eş dışındaki farz sahiplerine payları oranında geri verilmesidir.',
  netEstate: 'Net tereke; techiz-tekfin, borçlar ve geçerli vasiyet düşüldükten sonra paylaşıma kalan miktardır.',
  baseShare: 'Meselenin aslı, ilk dağıtımı kurarken kullanılan başlangıç ortak paydadır.',
  finalBase: 'Nihai payda, avl veya redd gibi işlemlerden sonra bütün aktif payların aynı payda üzerinde okunmasını sağlayan son ortak paydadır.',
  perPersonBase: 'Kişi paydası, kişi başı payları ortak payda ile gösterebilmek için kullanılan yardımcı paydayı ifade eder.',
  haml: 'Haml, anne rahmindeki çocuktur. Doğum gerçekleşmeden önce onun muhtemel payı için ihtiyatlı rezerv ayrılır.',
  khunsa: 'Hünsâ, cinsiyet hükmü açık olmayan kişidir. Faraid hesabında erkek ve kadın ihtimalleri dikkate alınır.',
  mafqud: 'Mefkud, hayatta olup olmadığı bilinmeyen kayıp kişidir. Payı, belirsizlik çözülene kadar ihtiyatla değerlendirilir.',
  munasakhat: 'Münâsehat, ilk miras henüz fiilen paylaşılmadan önce mirasçılardan birinin ölmesi ve ikinci bir terekenin ortaya çıkması hâlidir.',
  beytulmal: 'Beytülmâl, kamu hazinesidir. Bazı mezheplerde belirli durumlarda artık pay veya zevi’l-erhâm öncesi/sonrası onun hakkı gündeme gelir.',
  schoolComparison: 'Mezhep karşılaştırması, aynı mirasçı kümesinin dört mezhepte nasıl farklı sonuç verebildiğini özetler.',
  impediment: 'Miras engeli, kişiyi mirastan tamamen çıkaran hukukî sebeptir. Katl ve din farkı bunun en bilinen örneklerindendir.',
} as const;

const GLOSSARY_EN: Record<keyof typeof GLOSSARY, string> = {
  faraid: 'Faraid is the branch of Islamic inheritance law that explains who inherits, under which conditions, and in which proportions.',
  ashabulFuruz: 'Ashab al-furud are heirs whose shares are fixed by revelation, such as the spouse, mother, father, and daughter.',
  asaba: 'Asaba are residuary heirs who take what remains after the fixed shares are distributed.',
  asabaBiNafsihi: 'Asaba bi-nafsihi is a residuary heir who inherits by himself without needing another heir of the same level.',
  asabaBiGayrihi: 'Asaba bi-ghayrihi is a female heir who becomes residuary because a male heir of the same level is present with her.',
  asabaMaaGayrihi: 'Asaba maʿa al-ghayr refers to a sister who becomes residuary when she is together with a daughter or son’s daughter.',
  zawilArham: 'Dhawu al-Arham are uterine relatives who are neither fixed-share heirs nor residuary heirs. Some schools admit them under specific conditions.',
  hajb: 'Hajb means exclusion or reduction of an heir because a closer or stronger heir is present.',
  hajbHirman: 'Hajb al-hirman means complete exclusion from inheritance, such as a grandfather being excluded when the father is alive.',
  hajbNuqsan: 'Hajb al-nuqsan means a reduction in share rather than total exclusion, such as the mother dropping from one third to one sixth when there are children.',
  awl: 'Awl means proportionally reducing the fixed shares when their total exceeds the estate.',
  radd: 'Radd means returning the residue to eligible fixed-share heirs when no residuary heir exists.',
  netEstate: 'The net estate is the amount left for distribution after funeral expenses, debts, and a valid will have been settled.',
  baseShare: 'The original base is the starting common denominator used when the inheritance problem is first structured.',
  finalBase: 'The final denominator is the last common denominator used after operations such as awl or radd.',
  perPersonBase: 'The per-person denominator helps display individual shares on a unified denominator.',
  haml: 'Haml means an unborn child in the womb. A precautionary reserve is kept until the birth is known.',
  khunsa: 'Khunsa is a person whose legal sex classification is unclear. Both male and female scenarios are considered in faraid calculations.',
  mafqud: 'Mafqud is a missing person whose life or death is uncertain. Their share is treated cautiously until the uncertainty is resolved.',
  munasakhat: 'Munasakhat occurs when one heir dies before the first inheritance has been fully distributed, creating a second linked estate.',
  beytulmal: 'Bayt al-mal is the public treasury. In some schools it becomes relevant when residue remains or when Dhawu al-Arham are considered.',
  schoolComparison: 'School comparison summarizes how the same set of heirs may lead to different outcomes across the four Sunni schools.',
  impediment: 'A legal impediment is a reason that removes a person from inheritance altogether, such as unlawful killing or difference of religion.',
};

const TERM_LABELS = {
  tr: {
    faraid: 'Faraid', ashabulFuruz: 'Ashâbu’l-furûz', asaba: 'Asabe', asabaBiNafsihi: 'Asabe bi-nefsihi', asabaBiGayrihi: 'Asabe bi-gayrihi', asabaMaaGayrihi: 'Asabe ma’a al-gayr', zawilArham: 'Zevi’l-erhâm', hajb: 'Hacb', hajbHirman: 'Hacb-i hırman', hajbNuqsan: 'Hacb-i nuksan', awl: 'Avl', radd: 'Redd', netEstate: 'Net tereke', baseShare: 'Meselenin aslı', finalBase: 'Nihai payda', perPersonBase: 'Kişi paydası', haml: 'Haml', khunsa: 'Hünsâ', mafqud: 'Mefkud', munasakhat: 'Münâsehat', beytulmal: 'Beytülmâl', schoolComparison: 'Mezhep karşılaştırması', impediment: 'Miras engeli',
  },
  en: {
    faraid: 'Faraid', ashabulFuruz: 'Ashab al-furud', asaba: 'Asaba', asabaBiNafsihi: 'Asaba bi-nafsihi', asabaBiGayrihi: 'Asaba bi-ghayrihi', asabaMaaGayrihi: 'Asaba maʿa al-ghayr', zawilArham: 'Dhawu al-Arham', hajb: 'Hajb', hajbHirman: 'Hajb al-hirman', hajbNuqsan: 'Hajb al-nuqsan', awl: 'Awl', radd: 'Radd', netEstate: 'Net estate', baseShare: 'Original base', finalBase: 'Final denominator', perPersonBase: 'Per-person denominator', haml: 'Haml', khunsa: 'Khunsa', mafqud: 'Mafqud', munasakhat: 'Munasakhat', beytulmal: 'Bayt al-mal', schoolComparison: 'School comparison', impediment: 'Legal impediment',
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;

export function getGlossaryDescription(key: GlossaryKey, language: UiLanguage = 'tr'): string {
  return language === 'en' ? GLOSSARY_EN[key] : GLOSSARY[key];
}

export function getGlossaryLabel(key: GlossaryKey, language: UiLanguage = 'tr'): string {
  return (TERM_LABELS as any)[language]?.[key] || (TERM_LABELS as any).tr[key] || key;
}
