import React, { useMemo } from 'react';
import { ALL_HEIRS, Heir, HeirCategory, HeirType } from '../types/inheritance';
import { UiLanguage, getHeirLabel } from '../utils/uiI18n';

interface CompactHeirPickerProps {
  selectedHeirs: Heir[];
  onChange: (heirs: Heir[]) => void;
  deceasedGender: 'male' | 'female';
  language?: UiLanguage;
  title?: string;
  description?: string;
}

const CATEGORY_META: Record<UiLanguage, { id: HeirCategory; label: string }[]> = {
  tr: [
    { id: 'spouse', label: 'Eşler' }, { id: 'parent', label: 'Anne-Baba' }, { id: 'grandparent', label: 'Dede-Nine' }, { id: 'child', label: 'Çocuklar' }, { id: 'grandchild', label: 'Torunlar' }, { id: 'sibling', label: 'Kardeşler' }, { id: 'extended', label: 'Asabe Devamı' }, { id: 'zawil_arham', label: 'Zevi’l-Erhâm' },
  ],
  en: [
    { id: 'spouse', label: 'Spouses' }, { id: 'parent', label: 'Parents' }, { id: 'grandparent', label: 'Grandparents' }, { id: 'child', label: 'Children' }, { id: 'grandchild', label: 'Grandchildren' }, { id: 'sibling', label: 'Siblings' }, { id: 'extended', label: 'Extended agnates' }, { id: 'zawil_arham', label: 'Dhawu al-Arham' },
  ],
  de: [
    { id: 'spouse', label: 'Ehegatten' }, { id: 'parent', label: 'Eltern' }, { id: 'grandparent', label: 'Großeltern' }, { id: 'child', label: 'Kinder' }, { id: 'grandchild', label: 'Enkel' }, { id: 'sibling', label: 'Geschwister' }, { id: 'extended', label: 'Erweiterte Agnaten' }, { id: 'zawil_arham', label: 'Dhawu al-Arham' },
  ],
  es: [
    { id: 'spouse', label: 'Cónyuges' }, { id: 'parent', label: 'Padres' }, { id: 'grandparent', label: 'Abuelos' }, { id: 'child', label: 'Hijos' }, { id: 'grandchild', label: 'Nietos' }, { id: 'sibling', label: 'Hermanos' }, { id: 'extended', label: 'Agnados ampliados' }, { id: 'zawil_arham', label: 'Dhawu al-Arham' },
  ],
  ar: [
    { id: 'spouse', label: 'الزوجية' }, { id: 'parent', label: 'الأبوان' }, { id: 'grandparent', label: 'الأجداد والجدات' }, { id: 'child', label: 'الأولاد' }, { id: 'grandchild', label: 'الأحفاد' }, { id: 'sibling', label: 'الإخوة' }, { id: 'extended', label: 'بقية العصبة' }, { id: 'zawil_arham', label: 'ذوو الأرحام' },
  ],
};

const MAX_COUNTS: Partial<Record<HeirType, number>> = {
  husband: 1,
  wife: 4,
  father: 1,
  mother: 1,
  grandfather_paternal: 1,
  grandfather_maternal: 1,
  grandmother_paternal: 1,
  grandmother_maternal: 1,
};

function clampCount(value: number, max = 99): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.floor(value)));
}

export const CompactHeirPicker: React.FC<CompactHeirPickerProps> = ({
  selectedHeirs,
  onChange,
  deceasedGender,
  language = 'tr',
  title = 'İkincil mirasçılar',
  description = 'Ardışık vefat eden ikinci kişi için mirasçıları buradan seçin.',
}) => {
  const categories = CATEGORY_META[language] || CATEGORY_META.tr;

  const visibleHeirs = useMemo(() => {
    return ALL_HEIRS.filter((heir) => {
      if (deceasedGender === 'male' && heir.type === 'husband') return false;
      if (deceasedGender === 'female' && heir.type === 'wife') return false;
      return true;
    });
  }, [deceasedGender]);

  const selectedMap = useMemo(() => {
    return selectedHeirs.reduce<Record<string, number>>((acc, heir) => {
      acc[heir.type] = heir.count;
      return acc;
    }, {});
  }, [selectedHeirs]);

  const setCount = (type: HeirType, value: number) => {
    const heirDef = ALL_HEIRS.find((heir) => heir.type === type);
    if (!heirDef) return;
    const maxCount = MAX_COUNTS[type] ?? 99;
    const count = clampCount(value, maxCount);

    if (count <= 0) {
      onChange(selectedHeirs.filter((heir) => heir.type !== type));
      return;
    }

    const existing = selectedHeirs.find((heir) => heir.type === type);
    if (existing) {
      onChange(selectedHeirs.map((heir) => (heir.type === type ? { ...heir, count } : heir)));
      return;
    }

    onChange([...selectedHeirs, { ...heirDef, count }]);
  };

  return (
    <div className="rounded-[22px] border border-stone-200 bg-stone-50/70 p-4 space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-stone-900">{title}</h4>
        <p className="mt-1 text-xs leading-5 text-stone-500">{description}</p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const heirs = visibleHeirs.filter((heir) => heir.category === category.id);
          if (heirs.length === 0) return null;

          return (
            <div key={category.id} className="rounded-2xl border border-stone-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">{category.label}</p>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                {heirs.map((heirDef) => {
                  const count = selectedMap[heirDef.type] || 0;
                  const maxCount = MAX_COUNTS[heirDef.type] ?? 99;

                  return (
                    <div key={heirDef.type} className="rounded-xl border border-stone-200 bg-stone-50/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-stone-900">{getHeirLabel(heirDef.type, language)}</p>
                          <p className="text-[11px] text-stone-500 mt-1">{heirDef.labelArabic}</p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-2 py-1.5">
                          <button type="button" onClick={() => setCount(heirDef.type, count - 1)} className="h-7 w-7 rounded-lg border border-stone-200 text-stone-700">−</button>
                          <input type="number" min={0} max={maxCount} value={count} onChange={(event) => setCount(heirDef.type, Number(event.target.value || 0))} className="w-14 rounded-lg border border-stone-200 bg-white px-2 py-1 text-center text-sm font-semibold text-stone-900 outline-none focus:border-emerald-300" inputMode="numeric" />
                          <button type="button" onClick={() => setCount(heirDef.type, count + 1)} disabled={count >= maxCount} className={`h-7 w-7 rounded-lg border ${count >= maxCount ? 'border-stone-200 text-stone-300' : 'border-stone-200 text-stone-700'}`}>+</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompactHeirPicker;
