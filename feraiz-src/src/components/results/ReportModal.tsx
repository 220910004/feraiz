import React from 'react';
import type { CalculationResult } from '../../types/inheritance';
import type { UiLanguage } from '../../utils/uiI18n';

interface ReportModalProps {
  result: CalculationResult;
  language: UiLanguage;
  onClose: () => void;
}

const COPY: Record<UiLanguage, {
  title: string;
  subtitle: string;
  close: string;
  traceTitle: string;
  blockedTitle: string;
  warningsTitle: string;
  refsTitle: string;
  noTrace: string;
  noBlocked: string;
  noWarnings: string;
  noRefs: string;
  disclaimer: string;
  stageLabels: Record<string, string>;
}> = {
  tr: {
    title: 'Hesaplama Raporu',
    subtitle: 'Bu hesaplamaya ulaşmak için işletilen adımlar, hacb gerekçeleri ve fıkhî kaynak referansları.',
    close: 'Kapat',
    traceTitle: 'Hesap Akışı',
    blockedTitle: 'Hacb Edilen Mirasçılar',
    warningsTitle: 'Uyarılar ve İhtiyat Notları',
    refsTitle: 'Fıkhî Kaynak Referansları',
    noTrace: 'Bu hesaplama için adım kaydı üretilmedi.',
    noBlocked: 'Hacb edilen mirasçı yok.',
    noWarnings: 'Uyarı yok.',
    noRefs: 'Bu hesaplama için referans matrisi üretilmedi.',
    disclaimer: 'Bu rapor öğretici amaçlıdır. Resmî veya ihtilaflı işlemlerde ehil bir fetva makamına başvurunuz.',
    stageLabels: {
      input: 'Girdi',
      impediments: 'Miras Engelleri',
      hajb: 'Hacb',
      furud: 'Farz Paylar',
      asaba: 'Asabe',
      adjustment: 'Düzeltme',
      special_case: 'Özel Mesele',
      advanced: 'İleri Senaryo',
      secondary: 'İkinci Dağıtım',
      output: 'Çıktı',
    },
  },
  en: {
    title: 'Calculation Report',
    subtitle: 'Steps executed to reach this result, blockage reasons, and juristic source references.',
    close: 'Close',
    traceTitle: 'Calculation Flow',
    blockedTitle: 'Blocked Heirs',
    warningsTitle: 'Warnings & Caution Notes',
    refsTitle: 'Juristic Source References',
    noTrace: 'No step trace was generated for this calculation.',
    noBlocked: 'No heirs were blocked.',
    noWarnings: 'No warnings.',
    noRefs: 'No reference matrix was generated for this calculation.',
    disclaimer: 'This report is for educational purposes. For official or disputed cases, consult a qualified scholar.',
    stageLabels: {
      input: 'Input',
      impediments: 'Impediments',
      hajb: 'Blockage (Hajb)',
      furud: 'Fixed Shares (Furūḍ)',
      asaba: 'Residuaries (ʿAṣaba)',
      adjustment: 'Adjustment',
      special_case: 'Special Case',
      advanced: 'Advanced Scenario',
      secondary: 'Secondary Distribution',
      output: 'Output',
    },
  },
  de: {
    title: 'Berechnungsbericht',
    subtitle: 'Schritte zur Ermittlung dieses Ergebnisses, Ausschlussgründe und juristische Quellenverweise.',
    close: 'Schließen',
    traceTitle: 'Rechenablauf',
    blockedTitle: 'Ausgeschlossene Erben',
    warningsTitle: 'Warnungen und Hinweise',
    refsTitle: 'Juristische Quellenverweise',
    noTrace: 'Für diese Berechnung wurde kein Ablaufprotokoll erstellt.',
    noBlocked: 'Keine Erben ausgeschlossen.',
    noWarnings: 'Keine Warnungen.',
    noRefs: 'Für diese Berechnung wurde keine Referenzmatrix erstellt.',
    disclaimer: 'Dieser Bericht dient nur zu Bildungszwecken. Bei offiziellen oder strittigen Fällen wenden Sie sich an eine qualifizierte Stelle.',
    stageLabels: {
      input: 'Eingabe',
      impediments: 'Erbhindernisse',
      hajb: 'Ausschluss (Ḥajb)',
      furud: 'Pflichtanteile (Furūḍ)',
      asaba: 'Resterbfolge (ʿAṣaba)',
      adjustment: 'Anpassung',
      special_case: 'Sonderfall',
      advanced: 'Erweitertes Szenario',
      secondary: 'Zweitverteilung',
      output: 'Ausgabe',
    },
  },
  es: {
    title: 'Informe de cálculo',
    subtitle: 'Pasos ejecutados para obtener este resultado, motivos de exclusión y referencias jurídicas.',
    close: 'Cerrar',
    traceTitle: 'Flujo del cálculo',
    blockedTitle: 'Herederos excluidos',
    warningsTitle: 'Advertencias y notas de precaución',
    refsTitle: 'Referencias jurídicas',
    noTrace: 'No se generó registro de pasos para este cálculo.',
    noBlocked: 'Ningún heredero excluido.',
    noWarnings: 'Sin advertencias.',
    noRefs: 'No se generó matriz de referencia para este cálculo.',
    disclaimer: 'Este informe es solo orientativo. Para casos oficiales o controvertidos, consulte a una autoridad cualificada.',
    stageLabels: {
      input: 'Entrada',
      impediments: 'Impedimentos',
      hajb: 'Exclusión (Ḥajb)',
      furud: 'Cuotas fijas (Furūḍ)',
      asaba: 'Residuarios (ʿAṣaba)',
      adjustment: 'Ajuste',
      special_case: 'Caso especial',
      advanced: 'Escenario avanzado',
      secondary: 'Distribución secundaria',
      output: 'Resultado',
    },
  },
  ar: {
    title: 'تقرير الحساب',
    subtitle: 'الخطوات المُنفَّذة للوصول إلى هذه النتيجة، وأسباب الحجب، والمراجع الفقهية.',
    close: 'إغلاق',
    traceTitle: 'مسار الحساب',
    blockedTitle: 'الورثة المحجوبون',
    warningsTitle: 'التحذيرات وملاحظات الاحتياط',
    refsTitle: 'المراجع الفقهية',
    noTrace: 'لم يُنتَج سجل خطوات لهذا الحساب.',
    noBlocked: 'لا يوجد ورثة محجوبون.',
    noWarnings: 'لا توجد تحذيرات.',
    noRefs: 'لم تُنتَج مصفوفة مرجعية لهذا الحساب.',
    disclaimer: 'هذا التقرير لأغراض تعليمية فحسب. في المسائل الرسمية أو المتنازع عليها يُرجى الرجوع إلى جهة علمية مؤهلة.',
    stageLabels: {
      input: 'المدخلات',
      impediments: 'موانع الإرث',
      hajb: 'الحجب',
      furud: 'الفروض',
      asaba: 'العصبة',
      adjustment: 'التعديل',
      special_case: 'المسألة الخاصة',
      advanced: 'السيناريو المتقدم',
      secondary: 'التوزيع الثانوي',
      output: 'المخرجات',
    },
  },
};

const STAGE_COLORS: Record<string, string> = {
  input: 'bg-stone-100 text-stone-600',
  impediments: 'bg-red-50 text-red-700',
  hajb: 'bg-orange-50 text-orange-700',
  furud: 'bg-blue-50 text-blue-700',
  asaba: 'bg-violet-50 text-violet-700',
  adjustment: 'bg-amber-50 text-amber-700',
  special_case: 'bg-emerald-50 text-emerald-700',
  advanced: 'bg-cyan-50 text-cyan-700',
  secondary: 'bg-teal-50 text-teal-700',
  output: 'bg-stone-900 text-white',
};

export function ReportModal({ result, language, onClose }: ReportModalProps) {
  const c = COPY[language] || COPY.tr;
  const isArabic = language === 'ar';
  const trace = result.trace || [];
  const blocked = result.blockageDetails || [];
  const warnings = result.calculationWarnings || [];
  const refs = result.referenceMatrix || [];

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-stone-950/60 backdrop-blur-sm p-0 sm:p-4"
      onClick={handleBackdrop}
    >
      <div
        className="relative w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-white shadow-[0_32px_80px_rgba(28,25,23,0.22)]"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-stone-100 bg-white/95 backdrop-blur px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-stone-950">{c.title}</h2>
            <p className="mt-1 text-sm text-stone-500 leading-5">{c.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-0.5 shrink-0 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            {c.close}
          </button>
        </div>

        <div className="px-6 py-6 space-y-8">

          {/* 1. Hesap Akışı */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-stone-500 mb-4">{c.traceTitle}</h3>
            {trace.length === 0 ? (
              <p className="text-sm text-stone-400">{c.noTrace}</p>
            ) : (
              <ol className="space-y-3">
                {trace.map((step, i) => (
                  <li key={`trace-${i}`} className="flex gap-3">
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs font-semibold text-white">
                        {i + 1}
                      </div>
                      {i < trace.length - 1 && <div className="w-px flex-1 bg-stone-200" />}
                    </div>
                    <div className="pb-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STAGE_COLORS[step.stage] || 'bg-stone-100 text-stone-600'}`}>
                          {c.stageLabels[step.stage] || step.stage}
                        </span>
                        <span className="text-sm font-medium text-stone-900">{step.title}</span>
                      </div>
                      <p className="text-sm text-stone-600 leading-5">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {/* 2. Hacb Edilen Mirasçılar */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-stone-500 mb-4">{c.blockedTitle}</h3>
            {blocked.length === 0 ? (
              <p className="text-sm text-stone-400">{c.noBlocked}</p>
            ) : (
              <div className="space-y-2">
                {blocked.map((b, i) => (
                  <div key={`blocked-${i}`} className="rounded-[16px] border border-orange-100 bg-orange-50/60 p-4">
                    <p className="text-sm font-medium text-stone-900">{b.label}</p>
                    <p className="mt-1 text-sm text-stone-600 leading-5">{b.explanation}</p>
                    {b.blockedBy?.length > 0 && (
                      <p className="mt-2 text-xs text-stone-400">
                        {language === 'ar' ? 'محجوب بسبب: ' : language === 'en' ? 'Blocked by: ' : language === 'de' ? 'Ausgeschlossen durch: ' : language === 'es' ? 'Excluido por: ' : 'Hacb eden: '}
                        {b.blockedBy.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. Uyarılar */}
          {warnings.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-stone-500 mb-4">{c.warningsTitle}</h3>
              <div className="space-y-2">
                {warnings.map((w, i) => (
                  <div key={`warn-${i}`} className="flex gap-3 rounded-[16px] border border-amber-100 bg-amber-50/60 p-4">
                    <span className="mt-0.5 text-amber-500 shrink-0">⚠</span>
                    <p className="text-sm text-stone-700 leading-5">{w}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Fıkhî Kaynak Referansları */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-stone-500 mb-4">{c.refsTitle}</h3>
            {refs.length === 0 ? (
              <p className="text-sm text-stone-400">{c.noRefs}</p>
            ) : (
              <div className="space-y-2">
                {refs.map((ref, i) => (
                  <div key={`ref-${i}`} className="rounded-[16px] border border-stone-200 bg-stone-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-medium text-stone-900">{ref.topic}</p>
                      {ref.schools?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {ref.schools.map((s) => (
                            <span key={s} className="rounded-full bg-stone-200 px-2 py-0.5 text-[11px] text-stone-600">{s}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-stone-600 leading-5">{ref.rule}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Disclaimer */}
          <p className="text-xs text-stone-400 leading-5 border-t border-stone-100 pt-4">{c.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
