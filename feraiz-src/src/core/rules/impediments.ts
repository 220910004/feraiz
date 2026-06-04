import type { Heir, ImpedimentType } from '../../types/inheritance';

export interface ImpedimentRule {
  key: ImpedimentType;
  title: string;
  description: string;
}

export const IMPEDIMENT_RULES: ImpedimentRule[] = [
  { key: 'murder', title: 'Katl', description: 'Mirasçı, murisi haksız yere öldürdüyse mirastan düşer.' },
  { key: 'religion', title: 'Din farkı', description: 'Din farklılığı mirasa engel kabul edilen temel başlıklardan biridir.' },
  { key: 'slavery', title: 'Kölelik', description: 'Klasik kuralda kölelik mirasa ehliyeti etkileyen engellerdendir.' },
  { key: 'lian', title: 'Liân / nesep engeli', description: 'Liân veya sahih nesep bağının kopması bazı ilişkileri mirastan düşürür.' },
];

export function summarizeImpediments(heirs: Heir[]): string[] {
  return heirs.flatMap((heir) =>
    Object.entries(heir.impediments || {})
      .filter(([, count]) => Boolean(count))
      .map(([key, count]) => `${heir.label}: ${count} kişi ${IMPEDIMENT_RULES.find((item) => item.key === key)?.title || key} sebebiyle hariç tutulur.`),
  );
}
