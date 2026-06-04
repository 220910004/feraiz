import type { AdvancedCaseContext, CaseInput, Heir, NormalizedHeir } from '../../types/inheritance';
import { ALL_HEIRS } from '../../types/inheritance';

function heirMap() {
  return new Map(ALL_HEIRS.map((item) => [item.type, item]));
}

export interface NormalizedInput {
  input: CaseInput;
  warnings: string[];
}

export function normalizeInput(input: CaseInput): NormalizedInput {
  const warnings: string[] = [];
  const templates = heirMap();
  const normalizedHeirs: NormalizedHeir[] = input.heirs
    .filter((heir) => heir.count > 0)
    .map((heir) => {
      const template = templates.get(heir.type);
      if (!template) {
        warnings.push(`Bilinmeyen mirasçı türü atlandı: ${heir.type}`);
        return null;
      }
      const count = Math.max(0, Math.floor(heir.count));
      if (count !== heir.count) {
        warnings.push(`${template.label} adedi tam sayıya yuvarlandı.`);
      }
      return {
        ...template,
        ...heir,
        count,
        impediments: heir.impediments ? { ...heir.impediments } : undefined,
      } as NormalizedHeir;
    })
    .filter(Boolean) as NormalizedHeir[];

  const caseContext: AdvancedCaseContext | undefined = input.deceased.caseContext
    ? JSON.parse(JSON.stringify(input.deceased.caseContext))
    : undefined;

  return {
    input: {
      heirs: normalizedHeirs,
      deceased: {
        ...input.deceased,
        totalEstate: Number.isFinite(input.deceased.totalEstate) && input.deceased.totalEstate > 0 ? input.deceased.totalEstate : 1,
        caseContext,
      },
    },
    warnings,
  };
}
