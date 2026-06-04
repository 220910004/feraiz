// İslami Feraiz'in 40 Hali - Miras Hukuku Temel Kuralları

export interface FortyRule {
  id: number;
  category: string;
  categoryAr: string;
  title: string;
  titleAr: string;
  heirs: string;
  shares: string;
  explanation: string;
  dalil: string;
  example?: string;
}

export const fortyRulesCategories = [
  { id: 'spouse', name: 'Eşlerin Durumları', nameAr: 'أحوال الزوجين', icon: '💑', count: 4 },
  { id: 'parents', name: 'Anne-Babanın Durumları', nameAr: 'أحوال الأبوين', icon: '👨‍👩‍👧', count: 6 },
  { id: 'children', name: 'Çocukların Durumları', nameAr: 'أحوال الأولاد', icon: '👶', count: 6 },
  { id: 'grandparents', name: 'Dede-Ninenin Durumları', nameAr: 'أحوال الأجداد', icon: '👴', count: 6 },
  { id: 'siblings', name: 'Kardeşlerin Durumları', nameAr: 'أحوال الإخوة', icon: '👫', count: 10 },
  { id: 'special', name: 'Özel Durumlar', nameAr: 'المسائل الخاصة', icon: '⚖️', count: 8 },
];

export const fortyRules: FortyRule[] = [
  // ========== EŞLERİN DURUMLARI (1-4) ==========
  {
    id: 1,
    category: 'spouse',
    categoryAr: 'أحوال الزوجين',
    title: "Kocanın 1/2 (Yarı) Pay Alması",
    titleAr: "نصيب الزوج النصف",
    heirs: "Koca + çocuksuz eş",
    shares: "Koca: 1/2",
    explanation: "Ölen kadının çocuğu veya çocuğunun çocuğu yoksa, koca terekenin yarısını alır.",
    dalil: "وَلَكُمْ نِصْفُ مَا تَرَكَ أَزْوَاجُكُمْ إِن لَّمْ يَكُن لَّهُنَّ وَلَدٌ (Nisa, 12)",
    example: "Kadın vefat etti. Geride kocası ve anne-babası kaldı. Koca 1/2 alır."
  },
  {
    id: 2,
    category: 'spouse',
    categoryAr: 'أحوال الزوجين',
    title: "Kocanın 1/4 (Çeyrek) Pay Alması",
    titleAr: "نصيب الزوج الربع",
    heirs: "Koca + çocuklu eş",
    shares: "Koca: 1/4",
    explanation: "Ölen kadının çocuğu veya çocuğunun çocuğu (torun) varsa, koca terekenin çeyreğini alır.",
    dalil: "فَإِن كَانَ لَهُنَّ وَلَدٌ فَلَكُمُ الرُّبُعُ مِمَّا تَرَكْنَ (Nisa, 12)",
    example: "Kadın vefat etti. Geride kocası ve oğlu kaldı. Koca 1/4, oğul kalan 3/4'ü alır."
  },
  {
    id: 3,
    category: 'spouse',
    categoryAr: 'أحوال الزوجين',
    title: "Karının 1/4 (Çeyrek) Pay Alması",
    titleAr: "نصيب الزوجة الربع",
    heirs: "Karı + çocuksuz koca",
    shares: "Karı: 1/4",
    explanation: "Ölen erkeğin çocuğu veya çocuğunun çocuğu yoksa, karı terekenin çeyreğini alır.",
    dalil: "وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ (Nisa, 12)",
    example: "Erkek vefat etti. Geride karısı ve kardeşleri kaldı. Karı 1/4 alır."
  },
  {
    id: 4,
    category: 'spouse',
    categoryAr: 'أحوال الزوجين',
    title: "Karının 1/8 (Sekizde Bir) Pay Alması",
    titleAr: "نصيب الزوجة الثمن",
    heirs: "Karı + çocuklu koca",
    shares: "Karı: 1/8",
    explanation: "Ölen erkeğin çocuğu veya çocuğunun çocuğu varsa, karı terekenin sekizde birini alır. Birden fazla karı varsa bu payı aralarında eşit bölüşürler.",
    dalil: "فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُم (Nisa, 12)",
    example: "Erkek vefat etti. Geride karısı, oğlu ve kızı kaldı. Karı 1/8 alır."
  },

  // ========== ANNE-BABANIN DURUMLARI (5-10) ==========
  {
    id: 5,
    category: 'parents',
    categoryAr: 'أحوال الأبوين',
    title: "Babanın Asabe Olarak Miras Alması",
    titleAr: "إرث الأب بالتعصيب",
    heirs: "Baba + çocuk veya torun yok",
    shares: "Baba: Kalan veya tamamı",
    explanation: "Ölenin oğlu, kızı veya oğul tarafından torunu yoksa baba asabe olur. Farz sahipleri payını aldıktan sonra kalan kısmı alır; tek başınaysa bütün terekeye varis olabilir.",
    dalil: "Hz. Peygamber: 'Farz paylarını sahiplerine verin, kalan en yakın erkek akrabaya aittir.' (Buhari, Müslim)",
    example: "Vefat eden: Baba ve koca bıraktıysa koca 1/2 alır, baba kalan 1/2'yi asabe olarak alır."
  },
  {
    id: 6,
    category: 'parents',
    categoryAr: 'أحوال الأبوين',
    title: "Babanın 1/6 + Asabe Alması",
    titleAr: "إرث الأب السدس والتعصيب",
    heirs: "Baba + Sadece kız çocuk(lar)",
    shares: "Baba: 1/6 + Asabe",
    explanation: "Sadece kız çocuk varsa (oğul yoksa), baba hem 1/6 farz hem de kalan asabe payını alır.",
    dalil: "Nisa Suresi 11 ve asabe hükümleri birlikte",
    example: "Vefat eden: Baba, kız. Kız 1/2, baba 1/6 + kalan (2/6) = 3/6 alır."
  },
  {
    id: 7,
    category: 'parents',
    categoryAr: 'أحوال الأبوين',
    title: "Babanın Sadece 1/6 Alması",
    titleAr: "إرث الأب السدس فقط",
    heirs: "Baba + Oğul (veya oğlun oğlu)",
    shares: "Baba: 1/6",
    explanation: "Oğul veya oğlun oğlu varsa, baba sadece 1/6 farz payını alır.",
    dalil: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ (Nisa, 11)",
    example: "Vefat eden: Baba, anne, oğul. Baba 1/6, anne 1/6, oğul kalanı alır."
  },
  {
    id: 8,
    category: 'parents',
    categoryAr: 'أحوال الأبوين',
    title: "Annenin 1/6 Alması (Çocuk Varken)",
    titleAr: "إرث الأم السدس مع الولد",
    heirs: "Anne + Çocuk",
    shares: "Anne: 1/6",
    explanation: "Ölenin çocuğu veya çocuğunun çocuğu varsa, anne 1/6 alır.",
    dalil: "وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ إِن كَانَ لَهُ وَلَدٌ (Nisa, 11)",
    example: "Vefat eden: Anne, baba, oğul. Anne 1/6, baba 1/6, oğul kalan."
  },
  {
    id: 9,
    category: 'parents',
    categoryAr: 'أحوال الأبوين',
    title: "Annenin 1/6 Alması (Çoğul Kardeş Varken)",
    titleAr: "إرث الأم السدس مع الإخوة",
    heirs: "Anne + 2 veya daha fazla kardeş",
    shares: "Anne: 1/6",
    explanation: "İki veya daha fazla kardeş varsa (erkek veya kız), anne 1/3 yerine 1/6 alır. Bu kardeşler bizzat miras alamasalar bile anneyi hacb ederler (payını azaltırlar).",
    dalil: "فَإِن كَانَ لَهُ إِخْوَةٌ فَلِأُمِّهِ السُّدُسُ (Nisa, 11)",
    example: "Vefat eden: Anne, baba, 2 erkek kardeş. Anne 1/6, baba asabe. Kardeşler baba varken miras alamaz ama anneyi hacb eder."
  },
  {
    id: 10,
    category: 'parents',
    categoryAr: 'أحوال الأبوين',
    title: "Annenin 1/3 Alması",
    titleAr: "إرث الأم الثلث",
    heirs: "Anne + çocuksuz + tek kardeş veya kardeşsiz",
    shares: "Anne: 1/3",
    explanation: "Çocuk ve çocuğun çocuğu yoksa, iki veya daha fazla kardeş yoksa, anne 1/3 alır.",
    dalil: "فَإِن لَّمْ يَكُن لَّهُ وَلَدٌ وَوَرِثَهُ أَبَوَاهُ فَلِأُمِّهِ الثُّلُثُ (Nisa, 11)",
    example: "Vefat eden: Anne, baba. Anne 1/3, baba kalan 2/3'ü alır."
  },

  // ========== ÇOCUKLARIN DURUMLARI (11-16) ==========
  {
    id: 11,
    category: 'children',
    categoryAr: 'أحوال الأولاد',
    title: "Tek Kızın 1/2 Alması",
    titleAr: "إرث البنت الواحدة النصف",
    heirs: "Tek kız (oğul yok)",
    shares: "Kız: 1/2",
    explanation: "Tek kız çocuğu varsa ve erkek çocuk yoksa, kız terekenin yarısını alır.",
    dalil: "وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ (Nisa, 11)",
    example: "Vefat eden: Kız, anne, baba. Kız 1/2, anne 1/6, baba 1/6 + kalan."
  },
  {
    id: 12,
    category: 'children',
    categoryAr: 'أحوال الأولاد',
    title: "İki veya Daha Fazla Kızın 2/3 Alması",
    titleAr: "إرث البنتين فأكثر الثلثين",
    heirs: "2+ kız (oğul yok)",
    shares: "Kızlar: 2/3 (aralarında eşit)",
    explanation: "İki veya daha fazla kız çocuğu varsa ve erkek çocuk yoksa, kızlar terekenin 2/3'ünü aralarında eşit bölüşürler.",
    dalil: "فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ (Nisa, 11)",
    example: "Vefat eden: 3 kız, anne. 3 kız 2/3'ü eşit bölüşür (her biri 2/9), anne 1/6."
  },
  {
    id: 13,
    category: 'children',
    categoryAr: 'أحوال الأولاد',
    title: "Oğulun Asabe Olarak Miras Alması",
    titleAr: "إرث الابن بالتعصيب",
    heirs: "Sadece oğul(lar)",
    shares: "Oğul: Asabe (tamamı veya kalan)",
    explanation: "Oğul asabe bi-nefsihi'dir. Farz sahipleri paylarını aldıktan sonra kalanı alır. Tek başınaysa tamamını alır.",
    dalil: "'Farzları ehline verin, kalan en yakın erkeğe aittir.' (Buhari-Müslim)",
    example: "Vefat eden: Oğul. Oğul terekenin tamamını alır."
  },
  {
    id: 14,
    category: 'children',
    categoryAr: 'أحوال الأولاد',
    title: "Oğul ve Kızın Birlikte Miras Alması",
    titleAr: "إرث الابن والبنت معاً",
    heirs: "Oğul + Kız",
    shares: "Oğul: 2 birim, Kız: 1 birim (asabe)",
    explanation: "Oğul ve kız birlikte olunca, kız asabe bi-gayrihi olur. Erkek kadının iki katı alır.",
    dalil: "يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ (Nisa, 11)",
    example: "Vefat eden: 1 oğul, 2 kız. Toplam 4 birim: Oğul 2/4, her kız 1/4 alır."
  },
  {
    id: 15,
    category: 'children',
    categoryAr: 'أحوال الأولاد',
    title: "Oğlun Oğlunun Miras Alması",
    titleAr: "إرث ابن الابن",
    heirs: "Oğlun oğlu (baba yok)",
    shares: "Oğlun oğlu: Asabe",
    explanation: "Oğul yoksa, oğlun oğlu onun yerine geçer ve asabe olarak miras alır. Ne kadar aşağı inerse insin aynı kural geçerlidir.",
    dalil: "Asabe hükümleri - İcma",
    example: "Vefat eden: Oğlun oğlu, kız. Kız 1/2, oğlun oğlu kalan 1/2'yi alır."
  },
  {
    id: 16,
    category: 'children',
    categoryAr: 'أحوال الأولاد',
    title: "Oğlun Kızının Miras Alması",
    titleAr: "إرث بنت الابن",
    heirs: "Oğlun kızı",
    shares: "Tek: 1/2, İki+: 2/3, Kızla: 1/6 (tamamlama)",
    explanation: "Oğlun kızı, öz kız yoksa onun hükmündedir. Tek öz kız varsa 1/6 tamamlama payı alır (2/3'e tamamlar).",
    dalil: "Hz. Peygamber'in hükmü (Buhari)",
    example: "Vefat eden: 1 kız, 1 oğlun kızı. Kız 1/2, oğlun kızı 1/6 (2/3'e tamamlama)."
  },

  // ========== DEDE-NİNENİN DURUMLARI (17-22) ==========
  {
    id: 17,
    category: 'grandparents',
    categoryAr: 'أحوال الأجداد',
    title: "Dedenin 1/6 Alması",
    titleAr: "إرث الجد السدس",
    heirs: "Dede + Oğul (baba yok)",
    shares: "Dede: 1/6",
    explanation: "Baba yokken dede, baba gibi miras alır. Oğul veya oğlun oğlu varsa 1/6 alır.",
    dalil: "Baba hükmünde - İcma",
    example: "Vefat eden: Dede, oğul. Dede 1/6, oğul kalan 5/6'yı alır."
  },
  {
    id: 18,
    category: 'grandparents',
    categoryAr: 'أحوال الأجداد',
    title: "Dedenin 1/6 + Asabe Alması",
    titleAr: "إرث الجد السدس والتعصيب",
    heirs: "Dede + Sadece kız (baba yok)",
    shares: "Dede: 1/6 + Asabe",
    explanation: "Baba yokken, sadece kız çocuk varsa, dede hem 1/6 hem de kalan asabeyi alır.",
    dalil: "Baba hükmünde - İcma",
    example: "Vefat eden: Dede, kız. Kız 1/2, dede 1/6 + kalan 2/6 = 3/6."
  },
  {
    id: 19,
    category: 'grandparents',
    categoryAr: 'أحوال الأجداد',
    title: "Dedenin Asabe Olarak Miras Alması",
    titleAr: "إرث الجد بالتعصيب فقط",
    heirs: "Dede + çocuksuz (baba yok)",
    shares: "Dede: Asabe (kalan veya tamamı)",
    explanation: "Çocuk ve baba yoksa, dede asabe olarak kalandan veya tamamından miras alır.",
    dalil: "Asabe hükümleri",
    example: "Vefat eden: Dede, karı. Karı 1/4, dede kalan 3/4'ü alır."
  },
  {
    id: 20,
    category: 'grandparents',
    categoryAr: 'أحوال الأجداد',
    title: "Ninenin 1/6 Alması",
    titleAr: "إرث الجدة السدس",
    heirs: "Nine (anne yok)",
    shares: "Nine: 1/6",
    explanation: "Anne yokken, nine (hem anne tarafı hem baba tarafı) 1/6 alır. Birden fazla nine varsa 1/6'yı paylaşırlar.",
    dalil: "Hz. Peygamber nineye 1/6 verdi (Ebu Davud, Tirmizi)",
    example: "Vefat eden: Babaanne, anneanne, oğul. İki nine 1/6'yı eşit paylaşır (her biri 1/12)."
  },
  {
    id: 21,
    category: 'grandparents',
    categoryAr: 'أحوال الأجداد',
    title: "Ninenin Anne Tarafından Hacb Olması",
    titleAr: "حجب الجدة بالأم",
    heirs: "Nine + Anne",
    shares: "Nine: Hacb (pay yok)",
    explanation: "Anne hayattaysa, tüm nineler (anne tarafı ve baba tarafı) hacb olur ve miras alamaz.",
    dalil: "Yakın akraba uzak akrabayı hacb eder - İcma",
    example: "Vefat eden: Anne, babaanne. Anne 1/3, babaanne miras alamaz."
  },
  {
    id: 22,
    category: 'grandparents',
    categoryAr: 'أحوال الأجداد',
    title: "Dedenin Baba Tarafından Hacb Olması",
    titleAr: "حجب الجد بالأب",
    heirs: "Dede + Baba",
    shares: "Dede: Hacb (pay yok)",
    explanation: "Baba hayattaysa, dede hacb olur ve miras alamaz.",
    dalil: "Yakın akraba uzak akrabayı hacb eder - İcma",
    example: "Vefat eden: Baba, dede, oğul. Baba 1/6, oğul kalan. Dede hacb."
  },

  // ========== KARDEŞLERİN DURUMLARI (23-32) ==========
  {
    id: 23,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Öz Kız Kardeşin 1/2 Alması",
    titleAr: "إرث الأخت الشقيقة النصف",
    heirs: "Tek öz kız kardeş (çocuk ve baba yok)",
    shares: "Öz kız kardeş: 1/2",
    explanation: "Çocuk, oğlun çocuğu ve baba yoksa, tek öz kız kardeş 1/2 alır.",
    dalil: "إِنِ امْرُؤٌ هَلَكَ لَيْسَ لَهُ وَلَدٌ وَلَهُ أُخْتٌ فَلَهَا نِصْفُ مَا تَرَكَ (Nisa, 176)",
    example: "Vefat eden: Öz kız kardeş, anne. Öz kız kardeş 1/2, anne 1/3."
  },
  {
    id: 24,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "İki+ Öz Kız Kardeşin 2/3 Alması",
    titleAr: "إرث الأختين الشقيقتين الثلثين",
    heirs: "2+ öz kız kardeş (çocuk ve baba yok)",
    shares: "Öz kız kardeşler: 2/3 (eşit)",
    explanation: "İki veya daha fazla öz kız kardeş, 2/3'ü aralarında eşit bölüşürler.",
    dalil: "فَإِن كَانَتَا اثْنَتَيْنِ فَلَهُمَا الثُّلُثَانِ مِمَّا تَرَكَ (Nisa, 176)",
    example: "Vefat eden: 3 öz kız kardeş. Her biri 2/9 (2/3 ÷ 3) alır."
  },
  {
    id: 25,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Öz Erkek Kardeşin Asabe Olması",
    titleAr: "إرث الأخ الشقيق بالتعصيب",
    heirs: "Öz erkek kardeş (çocuk ve baba yok)",
    shares: "Öz erkek kardeş: Asabe",
    explanation: "Öz erkek kardeş asabe bi-nefsihi'dir. Farz sahiplerinden sonra kalanı alır.",
    dalil: "وَهُوَ يَرِثُهَا إِن لَّمْ يَكُن لَّهَا وَلَدٌ (Nisa, 176)",
    example: "Vefat eden: Öz erkek kardeş, anne. Anne 1/3, öz erkek kardeş kalan 2/3."
  },
  {
    id: 26,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Öz Kardeşlerin Birlikte Miras Alması",
    titleAr: "إرث الإخوة الأشقاء معاً",
    heirs: "Öz erkek + öz kız kardeş",
    shares: "Erkek: 2, Kız: 1 birim (asabe)",
    explanation: "Öz erkek ve kız kardeşler birlikte olunca, kız asabe bi-gayrihi olur. Erkek kadının iki katı alır.",
    dalil: "وَإِن كَانُوا إِخْوَةً رِّجَالًا وَنِسَاءً فَلِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ (Nisa, 176)",
    example: "Vefat eden: 1 öz erkek kardeş, 1 öz kız kardeş. Erkek 2/3, kız 1/3."
  },
  {
    id: 27,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Baba Bir Kardeşlerin Durumu",
    titleAr: "إرث الإخوة لأب",
    heirs: "Baba bir kardeş (öz kardeş yok)",
    shares: "Öz kardeş gibi",
    explanation: "Öz kardeş yoksa, baba bir kardeşler öz kardeşlerin hükmündedir. Aynı pay kuralları geçerlidir.",
    dalil: "Kıyas - öz kardeş yokken baba bir kardeş onun yerine geçer",
    example: "Vefat eden: 1 baba bir kız kardeş. Öz kardeş yok. Baba bir kız 1/2 alır."
  },
  {
    id: 28,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Baba Bir Kız Kardeşin 1/6 Alması",
    titleAr: "إرث الأخت لأب السدس",
    heirs: "Baba bir kız kardeş + tek öz kız kardeş",
    shares: "Baba bir kız: 1/6 (tamamlama)",
    explanation: "Tek öz kız kardeş 1/2 aldığında, baba bir kız kardeş 1/6 tamamlama payı alır (2/3'e tamamlar).",
    dalil: "Oğlun kızı kıyası - İcma",
    example: "Vefat eden: 1 öz kız kardeş, 1 baba bir kız kardeş. Öz kız 1/2, baba bir kız 1/6."
  },
  {
    id: 29,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Anne Bir Kardeşin 1/6 Alması",
    titleAr: "إرث الأخ لأم السدس",
    heirs: "Tek anne bir kardeş",
    shares: "Anne bir kardeş: 1/6",
    explanation: "Anne bir kardeş (erkek veya kız fark etmez) tek olunca 1/6 alır. Çocuk veya baba/dede varsa hacb olur.",
    dalil: "وَلَهُ أَخٌ أَوْ أُخْتٌ فَلِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ (Nisa, 12)",
    example: "Vefat eden: Anne bir erkek kardeş, eş. Anne bir kardeş 1/6."
  },
  {
    id: 30,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "İki+ Anne Bir Kardeşin 1/3 Alması",
    titleAr: "إرث الإخوة لأم الثلث",
    heirs: "2+ anne bir kardeş",
    shares: "Anne bir kardeşler: 1/3 (eşit)",
    explanation: "İki veya daha fazla anne bir kardeş, 1/3'ü aralarında eşit bölüşürler. Erkek-kız fark etmez, hepsi eşit alır.",
    dalil: "فَإِن كَانُوا أَكْثَرَ مِن ذَٰلِكَ فَهُمْ شُرَكَاءُ فِي الثُّلُثِ (Nisa, 12)",
    example: "Vefat eden: 1 anne bir erkek, 2 anne bir kız kardeş. 3 kişi 1/3'ü eşit bölüşür (her biri 1/9)."
  },
  {
    id: 31,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Kardeşlerin Oğul/Baba ile Hacb Olması",
    titleAr: "حجب الإخوة بالابن والأب",
    heirs: "Kardeşler + Oğul veya Baba",
    shares: "Kardeşler: Hacb (pay yok)",
    explanation: "Oğul, oğlun oğlu veya baba varsa, tüm kardeşler (öz, baba bir, anne bir) hacb olur.",
    dalil: "Yakın asabe uzak asabeyi hacb eder",
    example: "Vefat eden: Öz erkek kardeş, oğul. Kardeş hacb, oğul tamamını alır."
  },
  {
    id: 32,
    category: 'siblings',
    categoryAr: 'أحوال الإخوة',
    title: "Öz Kız Kardeşin Asabe Maa Gayrihi Olması",
    titleAr: "الأخت الشقيقة عصبة مع الغير",
    heirs: "Öz kız kardeş + Kız çocuk",
    shares: "Öz kız kardeş: Asabe (kalan)",
    explanation: "Kız çocuk veya oğlun kızı varsa ve erkek kardeş yoksa, öz kız kardeş asabe maa gayrihi olur ve kalanı alır.",
    dalil: "İbn Mesud'un fetvası ve İcma",
    example: "Vefat eden: Kız, öz kız kardeş. Kız 1/2, öz kız kardeş kalan 1/2'yi asabe olarak alır."
  },

  // ========== ÖZEL DURUMLAR (33-40) ==========
  {
    id: 33,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Ömeriyyeteyn (Garraweyn) - 1. Durum",
    titleAr: "العمريتان - الأولى",
    heirs: "Koca + Anne + Baba",
    shares: "Koca: 1/2, Anne: 1/3 kalanın (1/6), Baba: Kalan",
    explanation: "Hz. Ömer'in içtihadı: Eş + anne + baba olunca, anne tüm terekenin değil, eşin payından sonra kalanın 1/3'ünü alır. Böylece baba anneden fazla alır.",
    dalil: "Hz. Ömer, İbn Abbas ve Zeyd b. Sabit'in fetvası",
    example: "Tereke 6 birim: Koca 3 (1/2), Anne 1 (1/6), Baba 2 (1/3)."
  },
  {
    id: 34,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Ömeriyyeteyn (Garraweyn) - 2. Durum",
    titleAr: "العمريتان - الثانية",
    heirs: "Karı + Anne + Baba",
    shares: "Karı: 1/4, Anne: 1/3 kalanın (1/4), Baba: Kalan",
    explanation: "Karı + anne + baba olunca, anne kalanın 1/3'ünü alır.",
    dalil: "Hz. Ömer'in içtihadı",
    example: "Tereke 12 birim: Karı 3 (1/4), Anne 3 (1/4), Baba 6 (1/2)."
  },
  {
    id: 35,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Müşerrike (Himariyye)",
    titleAr: "المشتركة (الحمارية)",
    heirs: "Koca + Anne + Anne bir kardeşler + Öz kardeşler",
    shares: "Anne bir ve öz kardeşler 1/3'ü eşit paylaşır",
    explanation: "Hz. Ömer'in ikinci içtihadı: Anne bir kardeşlerle öz kardeşler aynı anneden olduklarından 1/3'ü eşit paylaşırlar. 'Babamız eşek olsa ne fark eder?' dendiği için 'Himariyye' de denir.",
    dalil: "Hz. Ömer ve bazı sahabelerin görüşü",
    example: "Koca 1/2, anne 1/6, anne bir ve öz kardeşler 1/3'ü eşit paylaşır."
  },
  {
    id: 36,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Akdariyye",
    titleAr: "الأكدرية",
    heirs: "Koca + Anne + Dede + Öz/Baba bir kız kardeş",
    shares: "Özel hesaplama ile avl ve düzeltme",
    explanation: "Koca 1/2, anne 1/3, kız kardeş 1/2, dede 1/6 toplamı 1'i aşar. Avl yapılır, sonra kız kardeş ve dede payları birleştirilip 2:1 bölünür.",
    dalil: "Zeyd b. Sabit'in içtihadı",
    example: "Çok karmaşık hesaplama gerektirir. Ayrıntılı feraiz kitaplarına bakınız."
  },
  {
    id: 37,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Avl (Artırma)",
    titleAr: "العول",
    heirs: "Farz payları toplamı > 1",
    shares: "Orantılı azaltma",
    explanation: "Farz paylarının toplamı 1'i (terekenin tamamını) aştığında, tüm paylar orantılı olarak azaltılır. Payda artırılarak herkesin payı küçülür.",
    dalil: "Hz. Ömer zamanında ortaya çıktı, sahabe icması ile kabul edildi",
    example: "Koca 1/2, 2 kız kardeş 2/3, anne 1/6 = 8/6. Payda 6'dan 8'e çıkar, herkesin payı azalır."
  },
  {
    id: 38,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Redd (İade)",
    titleAr: "الرد",
    heirs: "Farz payları toplamı < 1, asabe yok",
    shares: "Kalan farz sahiplerine iade",
    explanation: "Farz paylarının toplamı 1'den az ve asabe yoksa, kalan pay farz sahiplerine payları oranında iade edilir. Eşler redde dahil değildir (çoğunluk görüşü).",
    dalil: "Sahabe içtihadı - çoğunluk görüşü",
    example: "Anne 1/6, kız 1/2 = 4/6. Kalan 2/6 anne ve kıza payları oranında iade edilir."
  },
  {
    id: 39,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Zevil-Erham Mirasçılığı",
    titleAr: "ميراث ذوي الأرحام",
    heirs: "Farz sahibi ve asabe yoksa",
    shares: "Zevil-erham (diğer akrabalar)",
    explanation: "Farz sahibi ve asabe yoksa, zevil-erham (kızın çocukları, teyze, dayı, hala vb.) mirasçı olur. Hanefi mezhebine göre.",
    dalil: "وَأُولُو الْأَرْحَامِ بَعْضُهُمْ أَوْلَىٰ بِبَعْضٍ (Enfal, 75)",
    example: "Hiç farz sahibi ve asabe yoksa, teyze, dayı gibi akrabalar mirasçı olabilir."
  },
  {
    id: 40,
    category: 'special',
    categoryAr: 'المسائل الخاصة',
    title: "Miras Engelleri",
    titleAr: "موانع الإرث",
    heirs: "Engelli kişiler",
    shares: "Miras hakkı yok",
    explanation: "Üç durumda miras alınamaz: 1) Katl (miras bırakanı öldürmek), 2) Küfür (din farkı), 3) Kölelik. Ayrıca li'an çocuğu babadan miras alamaz.",
    dalil: "'Katil mirasçı olamaz' (Tirmizi). 'Müslüman kafirden, kafir Müslümandan miras alamaz' (Buhari-Müslim)",
    example: "Babasını öldüren oğul, babasından miras alamaz."
  },
];
