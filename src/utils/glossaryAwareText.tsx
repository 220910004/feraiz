import React from 'react';
import { GlossaryTerm } from '../components/GlossaryTerm';
import { getGlossaryDescription, getGlossaryLabel, type GlossaryKey } from '../data/glossary';
import type { UiLanguage } from './uiI18n';

interface InlineGlossaryEntry {
  pattern: string;
  label: string;
  description: string;
}

const SCHOOL_DESCRIPTIONS: Record<string, string> = {
  'Hanefî': 'Hanefî mezhebi, bu vakada ana görünüm ve dağıtım yorumunun dayandığı fıkhî çizgiyi ifade eder.',
  'Mâlikî': 'Mâlikî mezhebi, bazı özel meselelerde diğer mezheplerden ayrılan dağıtım tercihleri içerebilir.',
  'Şâfiî': 'Şâfiî mezhebi, feraiz meselelerinde belirli özel vakalarda farklı sonuçlara ulaşabilen yorum çizgisidir.',
  'Hanbelî': 'Hanbelî mezhebi, özellikle bazı ihtilaflı miras vakalarında kendine özgü tercihleri olan yorum çizgisidir.',
};

function glossaryEntries(language: UiLanguage): InlineGlossaryEntry[] {
  const keys: Array<{ key: GlossaryKey; patterns: string[] }> = [
    { key: 'hajb', patterns: ['Hacb', 'hacb'] },
    { key: 'hajbHirman', patterns: ['Hacb-i hırman', 'hacb-i hırman'] },
    { key: 'hajbNuqsan', patterns: ['Hacb-i nuksan', 'hacb-i nuksan'] },
    { key: 'awl', patterns: ['Avl', 'avl'] },
    { key: 'radd', patterns: ['Redd', 'redd'] },
    { key: 'zawilArham', patterns: ['Zevi’l-erhâm', 'zevi’l-erhâm', 'Zevi\'l-erhâm', 'zevi\'l-erhâm'] },
    { key: 'beytulmal', patterns: ['Beytülmâl', 'beytülmâl'] },
    { key: 'munasakhat', patterns: ['Münâsehat', 'münâsehat'] },
    { key: 'khunsa', patterns: ['Hünsâ', 'hünsâ'] },
    { key: 'mafqud', patterns: ['Mefkud', 'mefkud'] },
    { key: 'haml', patterns: ['Haml', 'haml'] },
    { key: 'baseShare', patterns: ['Meselenin aslı'] },
    { key: 'finalBase', patterns: ['Nihai payda'] },
    { key: 'perPersonBase', patterns: ['Kişi paydası'] },
  ];

  const entries: InlineGlossaryEntry[] = [];

  for (const { key, patterns } of keys) {
    const label = getGlossaryLabel(key, language);
    const description = getGlossaryDescription(key, language);
    for (const pattern of patterns) {
      entries.push({ pattern, label, description });
    }
  }

  for (const [label, description] of Object.entries(SCHOOL_DESCRIPTIONS)) {
    entries.push({ pattern: label, label, description });
  }

  return entries;
}

export function renderGlossaryAwareText(text: string, language: UiLanguage = 'tr'): React.ReactNode {
  const entries = glossaryEntries(language);
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  while (remaining.length > 0) {
    let bestMatch: (InlineGlossaryEntry & { index: number }) | null = null;

    for (const entry of entries) {
      const index = remaining.indexOf(entry.pattern);
      if (index === -1) continue;
      if (!bestMatch || index < bestMatch.index || (index === bestMatch.index && entry.pattern.length > bestMatch.pattern.length)) {
        bestMatch = { index, ...entry };
      }
    }

    if (!bestMatch) {
      parts.push(remaining);
      break;
    }

    if (bestMatch.index > 0) {
      parts.push(remaining.slice(0, bestMatch.index));
    }

    parts.push(
      <GlossaryTerm
        key={`inline-glossary-${keyIndex}`}
        term={bestMatch.label}
        description={bestMatch.description}
        className="align-baseline"
      />,
    );

    keyIndex += 1;
    remaining = remaining.slice(bestMatch.index + bestMatch.pattern.length);
  }

  return parts;
}
