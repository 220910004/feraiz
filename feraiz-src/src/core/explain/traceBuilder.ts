import type { CalculationTraceStep, InheritanceResult } from '../../types/inheritance';

export function buildTraceSummary(result: InheritanceResult): CalculationTraceStep[] {
  if (result.trace && result.trace.length > 0) return result.trace;
  const steps: CalculationTraceStep[] = [];
  steps.push({ stage: 'input', title: 'Girdi', detail: `${result.heirs.length} mirasçı satırı işlendi.` });
  if (result.hasAvl) steps.push({ stage: 'adjustment', title: 'Avl', detail: 'Farz payların toplamı terekeyi aştığı için payda büyütüldü.' });
  if (result.hasRadd) steps.push({ stage: 'adjustment', title: 'Redd', detail: 'Asabe kalmadığı için artan kısım uygun mirasçılara döndü.' });
  if (result.specialCase) steps.push({ stage: 'special_case', title: 'Özel mesele', detail: result.specialCase });
  if (result.tentative) steps.push({ stage: 'advanced', title: 'İhtiyatlı sonuç', detail: 'Belirsizlik içeren ileri senaryo nedeniyle güvenli pay ve rezerv mantığı uygulandı.' });
  steps.push({ stage: 'output', title: 'Çıktı', detail: `Nihai payda ${result.adjustedBase || result.baseShare || 1} olarak gösterildi.` });
  return steps;
}
