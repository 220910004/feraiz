import React from 'react';
import type { ResultExplanation } from '../../core/explain/explanationBuilder';
import type { UiLanguage } from '../../utils/uiI18n';
import { renderGlossaryAwareText } from '../../utils/glossaryAwareText';

interface ExplanationPanelProps {
  explanation: ResultExplanation;
  language?: UiLanguage;
}

export function ExplanationPanel({ explanation, language = 'tr' }: ExplanationPanelProps) {
  if (!explanation.sections.length) return null;

  return (
    <div className="rounded-[24px] border border-stone-200 bg-white/90 p-5 md:p-6 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-stone-900">Açıklama sistemi</h3>
        <span className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[11px] text-stone-500">
          Hesabın mantığı kısa başlıklarla verilir
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {explanation.sections.map((section) => {
          const visibleItems = section.items.slice(0, 4);
          const isFlowSection = section.title.toLowerCase().includes('akış') || section.title.toLowerCase().includes('flow') || section.title.toLowerCase().includes('ablauf') || section.title.toLowerCase().includes('مسار');

          return (
            <section key={section.title} className="rounded-[18px] border border-stone-200 bg-stone-50/70 p-4">
              <h4 className="text-sm font-semibold text-stone-900">{section.title}</h4>
              {isFlowSection ? (
                <p className="mt-2 text-sm leading-6 text-stone-700">
                  {visibleItems.map((item, index) => (
                    <React.Fragment key={`${section.title}-${index}`}>
                      {index > 0 && <span className="text-stone-400"> • </span>}
                      {renderGlossaryAwareText(item, language)}
                    </React.Fragment>
                  ))}
                </p>
              ) : (
                <ul className="mt-2 space-y-2 text-sm text-stone-700">
                  {visibleItems.map((item, index) => (
                    <li key={`${section.title}-${index}`} className="leading-5 flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span>{renderGlossaryAwareText(item, language)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
