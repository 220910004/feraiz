import type { AdvancedCaseContext, AdvancedScenarioSummary, InheritanceResult, SecondaryDistribution } from '../../types/inheritance';
import { buildPregnancyNodes } from './pregnancy';
import { buildKhunsaNodes } from './khunsa';
import { buildMafqudNodes } from './mafqud';
import { buildMunasakhatNodes } from './munasakhat';

export interface ScenarioGraphNode {
  id: string;
  kind: 'pregnancy' | 'khunsa' | 'mafqud' | 'munasakhat';
  label: string;
  scenario?: AdvancedScenarioSummary | SecondaryDistribution;
}

export function buildScenarioGraph(caseContext?: AdvancedCaseContext, result?: InheritanceResult): ScenarioGraphNode[] {
  const summaries = result?.advancedAdjustments?.scenarioSummaries || [];
  return [
    ...buildPregnancyNodes(caseContext, summaries),
    ...buildKhunsaNodes(caseContext, summaries),
    ...buildMafqudNodes(caseContext, summaries),
    ...buildMunasakhatNodes(caseContext, result?.munasakhatOutcome),
  ];
}
