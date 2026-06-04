import type { CaseInput, ResultBundle } from '../../types/inheritance';
import { normalizeInput } from './normalizeInput';
import { buildResultBundle } from './resultBuilder';
import { validateCaseInput } from '../validation/validateCaseInput';
import { APP_VERSION, RULESET_VERSION } from '../../config/version';
import type { SchoolKey } from '../schools/common';
import type { SchoolEngineOptions } from '../schools/runtime';
import { runSchoolMatrix } from '../schools/runtime';

export function calculateCase(
  input: CaseInput,
  school: SchoolKey = 'hanafi',
  engineOptions?: Partial<SchoolEngineOptions>,
): ResultBundle {
  const normalized = normalizeInput(input);
  const matrix = runSchoolMatrix(normalized.input, {
    [school]: engineOptions,
  });
  const selected = matrix.results[school];
  const bundle = buildResultBundle(selected, normalized.input, school);
  const validationIssues = validateCaseInput(input);
  const warnings = Array.from(new Set([
    ...bundle.calculationWarnings,
    ...normalized.warnings,
    ...validationIssues.map((issue) => issue.message),
  ]));

  return {
    ...bundle,
    schoolResults: matrix.snapshots,
    madhhabBases: matrix.madhhabBases,
    madhhabDistributionRows: matrix.madhhabDistributionRows,
    displaySchool: school,
    calculationWarnings: warnings,
    resultVersion: `core-school-matrix-v2 | app:${APP_VERSION} | rules:${RULESET_VERSION}`,
  };
}
