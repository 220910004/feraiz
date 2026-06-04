# Tam Motor Çalışma Listesi

Bu belge, projeyi tam motor hedefine taşımak için daha önce çıkarılan eksik listesinin her maddesine karşılık projede yapılan mimari düzenlemeleri özetler.

## 1. Kapsam tanımı
- `src/utils/faraidReferenceMatrix.ts` içine motor kapsamı eklendi.
- Sonuç nesnesine `engineScope` alanı bağlandı.
- Motorun net tereke üzerinden çalıştığı açık hale getirildi.

## 2. Tek ve tutarlı çekirdek
- UI'ye dönen tüm ana sonuçlar tek `calculateInheritance()` çekirdeğinden üretilir.
- Sonuç nesnesine standart ek alanlar eklendi: `schoolResults`, `blockageDetails`, `trace`, `engineScope`, `referenceMatrix`.

## 3. Mezhep motorları
- Hanefî, Mâlikî, Şâfiî ve Hanbelî sonuçları aynı girdiyi ayrı ayrı çalıştıran standart bir mezhep demeti olarak üretilir.
- Bu sonuçlar `schoolResults` altında tutulur.

## 4. Hacb sistemi
- Hacb edilenler için `blockageDetails` üretildi.
- Gerekçe metinleri sonuç nesnesinde ayrı taşınır.

## 5. Ashab al-furud kuralları
- Temel pay sahipleri çekirdek fonksiyonda kurallı olarak tanımlıdır.
- Bu alanlar kritik testlerde doğrulanır.

## 6. Asabe sistemi
- Asabe sıralaması ve birim hesabı tek fonksiyonda tutulur.
- Kızlarla birlikte asabe olan ve yalnız asabe olan türler ayırt edilir.

## 7. Dede-kardeşler
- Dede ile kardeşler bahsi için ayrı dal korunmuştur.
- İz adımlarında bu dalın tetiklendiği açıkça kaydedilir.

## 8. Özel mesele kataloğu
- Ömeriyyeteyn, Müşerrike ve Akdariyye çekirdekte açık mesele olarak tanınır.
- Sonuç nesnesindeki `specialCase` ve `trace` alanlarına yansır.

## 9. Avl ve redd
- Avl ve redd bayrakları sonuç nesnesinde korunur.
- Test dosyasında klasik avl ve redd örnekleri bulunur.

## 10. Zevi'l-erham
- Zevi'l-erham yalnız daha yakın sharer ve asabe tükendiğinde devreye alınır.
- Hacb ve ertelenme gerekçeleri açık şekilde üretilir.

## 11. Miras engelleri
- Sayısal düşüm hesaplama başında yapılır.
- Sonuç nesnesinde `excludedSummaries` ve `blockageDetails` ile görünür.

## 12. Haml
- Haml için senaryo demeti oluşturulur.
- Güvenli pay, bekletilen pay ve senaryo açıklamaları aynı sonuçta toplanır.

## 13. Hünsâ
- Hünsâ için ilişki bazlı senaryo üretimi korunur.
- Sonuç nesnesinde ihtiyatlı dağıtım ve senaryo özetleri yer alır.

## 14. Mefkud
- Mefkud için sağ / ölü kabul dalları oluşturulur.
- Güvenli pay mantığı standart sonuca bağlanır.

## 15. Münâsehat
- İkinci tereke için standart sonuç yapısı korunur.
- İlk mirastan gelen paydan ikinci dağıtım üretildiğinde trace kaydı düşülür.

## 16. Çoklu olay zincirleri
- Veri modeli zincir genişletmeye uygun hale getirildi.
- `trace`, `schoolResults` ve standart sonuç nesnesi bu zincirin genişletilebilmesini kolaylaştırır.

## 17. Veri modeli
- Blokaj, iz adımı, referans matrisi ve mezhep snapshot alanları eklendi.

## 18. Açıklama motoru
- `trace` alanı ile sade, aşama bazlı açıklama hattı eklendi.
- `blockageDetails` ile neden düştüğü ayrı okunabilir hale getirildi.

## 19. Sonuç nesnesi
- Sonuç nesnesi tek tip alanlarla zenginleştirildi.
- UI ile test katmanı aynı nesneyi kullanabilir.

## 20. Render güvenliği
- Yeni alanların tamamı opsiyonel tutuldu.
- Sonuç ekranı eski alanlara da uyumlu kaldı.

## 21. Çeviri ile motor ayrımı
- Motor tarafındaki açıklama alanları daha yapılandırılmış hale getirildi.
- İleride tam i18n ayrımı yapılabilmesi için `trace` ve `blockageDetails` ayrıştırıldı.

## 22. Test altyapısı
- `tests/engine-verification.mts` eklendi.
- `npm run test:engine` ile 24 senaryoluk çekirdek doğrulama çalışır.

## 23. Referans matrisi
- `src/utils/faraidReferenceMatrix.ts` ile kural-test eşleştirmesi eklendi.
- Sonuç nesnesine `referenceMatrix` bağlandı.

## 24. Kullanıcı akışı ve fıkhî akış ayrımı
- Hesap adımları UI'de kalırken fıkhî akış `trace` içinde ayrı temsil edilir.
- Böylece arayüz akışı ile miras mantığı daha temiz ayrılır.
