import type { AdvancedCaseContext, AdvancedScenarioSummary } from '../../types/inheritance';

export function buildKhunsaNodes(context?: AdvancedCaseContext, scenarioSummaries: AdvancedScenarioSummary[] = []) {
  if (!context?.khunsaConfig?.enabled) return [];
  const prefix = context.khunsaConfig.count > 1 ? `${context.khunsaConfig.count} hünsâ` : 'Hünsâ';
  return ['erkek varsayımı', 'kadın varsayımı'].map((suffix) => ({
    id: `khunsa:${suffix}`,
    kind: 'khunsa' as const,
    label: `${prefix} · ${suffix}`,
    scenario: scenarioSummaries.find((item) => item.label.toLowerCase().includes(suffix.split(' ')[0])),
  }));
}
