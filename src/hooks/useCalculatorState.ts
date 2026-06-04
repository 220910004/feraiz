import { useEffect, useMemo, useState } from 'react';
import type { AdvancedCaseContext, CalculationResult, Heir, HeirType } from '../types/inheritance';
import type { SchoolKey } from '../core/schools/common';
import { calculateCase } from '../core/engine/calculateCase';
import { explainProspectiveBlock } from '../core/runtime/baseCalculator';
import { validateCaseInput } from '../core/validation/validateCaseInput';
import { readShareStateFromLocation, writeShareStateToLocation } from '../utils/shareState';

const UNIT_ESTATE = 1;

function isHeirTypeValidForGender(type: HeirType | '', selectedGender: 'male' | 'female') {
  if (!type) return true;
  if (selectedGender === 'male' && type === 'husband') return false;
  if (selectedGender === 'female' && type === 'wife') return false;
  return true;
}

function sanitizeSelectedHeirsForGender(heirs: Heir[], selectedGender: 'male' | 'female'): Heir[] {
  return heirs.filter((heir) => isHeirTypeValidForGender(heir.type, selectedGender));
}

function sanitizeCaseContextForGender(
  context: AdvancedCaseContext,
  selectedGender: 'male' | 'female',
  heirs: Heir[],
): AdvancedCaseContext {
  const nextMafqudType = isHeirTypeValidForGender(context.mafqudConfig?.heirType || '', selectedGender)
    ? context.mafqudConfig?.heirType || ''
    : '';

  const sourceHeirType = context.munasakhatConfig?.sourceHeirType || '';
  const hasSourceHeir = !sourceHeirType || heirs.some((heir) => heir.type === sourceHeirType);

  return {
    ...context,
    mafqudConfig: context.mafqudConfig ? { ...context.mafqudConfig, heirType: nextMafqudType } : context.mafqudConfig,
    munasakhatConfig: context.munasakhatConfig
      ? { ...context.munasakhatConfig, sourceHeirType: hasSourceHeir ? sourceHeirType : '' }
      : context.munasakhatConfig,
  };
}

function sanitizeBlockedSelectedHeirs(heirs: Heir[]): Heir[] {
  return heirs.filter((heir) => {
    const otherHeirs = heirs.filter((candidate) => candidate.type !== heir.type && candidate.count > 0);
    return !explainProspectiveBlock(heir.type, otherHeirs).blocked;
  });
}

interface UseCalculatorStateArgs {
  initialCaseContext: AdvancedCaseContext;
  initialSchool?: SchoolKey;
}

export function useCalculatorState({ initialCaseContext, initialSchool = 'hanafi' }: UseCalculatorStateArgs) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [selectedHeirs, setSelectedHeirs] = useState<Heir[]>([]);
  const [caseContext, setCaseContext] = useState<AdvancedCaseContext>(initialCaseContext);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<SchoolKey>(initialSchool);
  const [hydratedFromUrl, setHydratedFromUrl] = useState(false);


  useEffect(() => {
    if (hydratedFromUrl) return;
    const shared = readShareStateFromLocation();
    if (!shared) {
      setHydratedFromUrl(true);
      return;
    }

    const nextHeirs = sanitizeBlockedSelectedHeirs(sanitizeSelectedHeirsForGender(shared.selectedHeirs || [], shared.gender));
    const nextContext = sanitizeCaseContextForGender(shared.caseContext || initialCaseContext, shared.gender, nextHeirs);
    const nextSchool = shared.selectedSchool || initialSchool;

    setGender(shared.gender);
    setSelectedHeirs(nextHeirs);
    setCaseContext(nextContext);
    setSelectedSchool(nextSchool);

    if (nextHeirs.length > 0) {
      const calcResult = calculateCase({
        heirs: nextHeirs,
        deceased: { gender: shared.gender, totalEstate: UNIT_ESTATE, caseContext: nextContext },
      }, nextSchool);
      setResult(calcResult);
      setStep(4);
    }

    setHydratedFromUrl(true);
  }, [hydratedFromUrl, initialCaseContext, initialSchool]);

  useEffect(() => {
    if (!hydratedFromUrl) return;
    if (!result || step !== 4) return;
    writeShareStateToLocation({
      gender,
      selectedHeirs,
      caseContext,
      selectedSchool,
    });
  }, [hydratedFromUrl, result, step, gender, selectedHeirs, caseContext, selectedSchool]);

  const validationIssues = useMemo(() => validateCaseInput({
    heirs: selectedHeirs,
    deceased: { gender, totalEstate: UNIT_ESTATE, caseContext },
  }), [selectedHeirs, gender, caseContext]);

  const blockingIssues = validationIssues.filter((issue) => issue.severity === 'error');

  const canCalculate = (
    selectedHeirs.length > 0 ||
    Boolean(caseContext.pregnancyConfig?.enabled) ||
    Boolean(caseContext.khunsaConfig?.enabled) ||
    Boolean(caseContext.mafqudConfig?.enabled)
  ) && blockingIssues.length === 0;

  useEffect(() => {
    const normalized = sanitizeBlockedSelectedHeirs(sanitizeSelectedHeirsForGender(selectedHeirs, gender));
    if (normalized.length !== selectedHeirs.length) {
      setSelectedHeirs(normalized);
      setCaseContext((current) => sanitizeCaseContextForGender(current, gender, normalized));
      setResult(null);
    }
  }, [selectedHeirs, gender]);

  const handleGenderSelect = (selectedGender: 'male' | 'female') => {
    const nextHeirs = sanitizeSelectedHeirsForGender(selectedHeirs, selectedGender);
    const nextCaseContext = sanitizeCaseContextForGender(caseContext, selectedGender, nextHeirs);

    setGender(selectedGender);
    setSelectedHeirs(nextHeirs);
    setCaseContext(nextCaseContext);
    setResult(null);
    setStep(3);
    writeShareStateToLocation(null);
  };

  const handleSelectedHeirsChange = (heirs: Heir[]) => {
    const genderSafeHeirs = sanitizeSelectedHeirsForGender(heirs, gender);
    const nextHeirs = sanitizeBlockedSelectedHeirs(genderSafeHeirs);
    setSelectedHeirs(nextHeirs);
    setCaseContext((current) => sanitizeCaseContextForGender(current, gender, nextHeirs));
    setResult(null);
    writeShareStateToLocation(null);
  };

  const handleSchoolSelect = (school: SchoolKey) => {
    setSelectedSchool(school);
    setResult(null);
    setStep(2);
    writeShareStateToLocation(null);
  };

  const handleCaseContextChange = (nextContext: AdvancedCaseContext) => {
    setCaseContext(sanitizeCaseContextForGender(nextContext, gender, selectedHeirs));
    setResult(null);
    writeShareStateToLocation(null);
  };

  const handleCalculate = () => {
    if (!canCalculate) return;
    const calcResult = calculateCase({
      heirs: selectedHeirs,
      deceased: { gender, totalEstate: UNIT_ESTATE, caseContext },
    }, selectedSchool);
    setResult(calcResult);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setGender('male');
    setSelectedHeirs([]);
    setCaseContext(initialCaseContext);
    setSelectedSchool(initialSchool);
    setResult(null);
    writeShareStateToLocation(null);
  };

  return {
    step,
    setStep,
    gender,
    selectedHeirs,
    caseContext,
    result,
    selectedSchool,
    canCalculate,
    validationIssues,
    handleGenderSelect,
    handleSelectedHeirsChange,
    handleSchoolSelect,
    handleCaseContextChange,
    handleCalculate,
    handleReset,
  };
}
