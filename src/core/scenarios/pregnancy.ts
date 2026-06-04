import type { AdvancedCaseContext, AdvancedScenarioSummary } from '../../types/inheritance';

export function getPregnancyScenarioLabels(context?: AdvancedCaseContext): string[] {
  if (!context?.pregnancyConfig?.enabled) return [];
  const count = context.pregnancyConfig.count;
  if (context.pregnancyConfig.sexMode === 'male') return [`Haml: ${count} erkek`];
  if (context.pregnancyConfig.sexMode === 'female') return [`Haml: ${count} kız`];

  const labels: string[] = [];
  for (let maleCount = count; maleCount >= 0; maleCount -= 1) {
    const femaleCount = count - maleCount;
    const parts: string[] = [];
    if (maleCount > 0) parts.push(`${maleCount} erkek`);
    if (femaleCount > 0) parts.push(`${femaleCount} kız`);
    labels.push(`Haml: ${parts.join(' + ')}`);
  }
  return labels;
}

export function buildPregnancyNodes(context?: AdvancedCaseContext, scenarioSummaries: AdvancedScenarioSummary[] = []) {
  const labels = getPregnancyScenarioLabels(context);
  return labels.map((label) => ({
    id: `pregnancy:${label}`,
    kind: 'pregnancy' as const,
    label,
    scenario: scenarioSummaries.find((item) => item.label.includes(label)),
  }));
}
