import type { AdvancedCaseContext, AdvancedScenarioSummary } from '../../types/inheritance';

export function buildMafqudNodes(context?: AdvancedCaseContext, scenarioSummaries: AdvancedScenarioSummary[] = []) {
  if (!context?.mafqudConfig?.enabled) return [];
  return ['sağ kabulü', 'ölü kabulü'].map((suffix) => ({
    id: `mafqud:${suffix}`,
    kind: 'mafqud' as const,
    label: `Mefkud · ${suffix}`,
    scenario: scenarioSummaries.find((item) => item.label.toLowerCase().includes(suffix.split(' ')[0])),
  }));
}
