import type { UiLanguage } from '../../utils/uiI18n';
import type { CalculationTraceStep } from '../../types/inheritance';
import { translateUiPhrase } from '../../utils/uiI18n';

export function toPlainLanguage(step: CalculationTraceStep, language: UiLanguage): string {
  return translateUiPhrase(`${step.title}: ${step.detail}`, language);
}
