import type { AdvancedCaseContext, SecondaryDistribution } from '../../types/inheritance';

export function buildMunasakhatNodes(context?: AdvancedCaseContext, secondary?: SecondaryDistribution) {
  if (!context?.munasakhatConfig?.enabled || !secondary) return [];
  return [
    {
      id: 'munasakhat:primary',
      kind: 'munasakhat' as const,
      label: `${secondary.sourceHeirLabel} üzerinden ikinci tereke`,
      scenario: secondary,
    },
  ];
}
