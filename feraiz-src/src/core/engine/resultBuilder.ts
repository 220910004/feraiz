import type { CaseInput, CalculationResult, ResultBundle } from '../../types/inheritance';
import type { SchoolKey } from '../schools/common';
import { getSchoolPolicy } from '../schools';
import { buildScenarioGraph } from '../scenarios/scenarioGraph';
import { buildTraceSummary } from '../explain/traceBuilder';
import { summarizeImpediments } from '../rules/impediments';
import { summarizeHajb } from '../rules/hajb';
import { detectSpecialCases } from '../specialCases';
import { ENGINE_SCOPE, REFERENCE_MATRIX } from '../references/ruleMatrix';

export function buildResultBundle(base: CalculationResult, input: CaseInput, school: SchoolKey): ResultBundle {
  const policy = getSchoolPolicy(school);
  const scenarioGraph = buildScenarioGraph(input.deceased.caseContext, base);
  const extraWarnings = summarizeImpediments(input.heirs);
  const specialCases = detectSpecialCases(input.heirs);

  return {
    ...base,
    calculationWarnings: Array.from(new Set([...base.calculationWarnings, ...extraWarnings])),
    blockageDetails: base.blockageDetails || summarizeHajb(base),
    trace: buildTraceSummary(base),
    engineScope: base.engineScope || ENGINE_SCOPE,
    referenceMatrix: base.referenceMatrix || REFERENCE_MATRIX,
    inputSummary: {
      deceasedGender: input.deceased.gender,
      heirCount: input.heirs.reduce((sum, heir) => sum + heir.count, 0),
      hasAdvancedContext: Boolean(input.deceased.caseContext && (
        input.deceased.caseContext.pregnancyConfig?.enabled ||
        input.deceased.caseContext.khunsaConfig?.enabled ||
        input.deceased.caseContext.mafqudConfig?.enabled ||
        input.deceased.caseContext.munasakhatConfig?.enabled
      )),
    },
    schoolPolicy: base.schoolPolicy || {
      ...policy,
      zawilArhamMethod: policy.zawilArhamMethod,
      baitAlMalOperational: policy.baitAlMalOperationalByDefault,
      supportedZawilArhamMethods: [...policy.supportedZawilArhamMethods],
      supportedBaitAlMalModes: [...policy.supportedBaitAlMalModes],
    },
    scenarioGraph,
    matchedSpecialCases: specialCases,
    resultVersion: 'core-refactor-v1',
  };
}
