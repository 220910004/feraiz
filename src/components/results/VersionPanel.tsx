import React from 'react';
import { VERSION_INFO } from '../../config/version';
import type { UiLanguage } from '../../utils/uiI18n';

interface VersionPanelProps {
  resultVersion?: string;
  language?: UiLanguage;
}

const COPY: Record<UiLanguage, string> = {
  tr: 'Sürüm',
  en: 'Version',
  de: 'Version',
  es: 'Versión',
  ar: 'الإصدار',
};

const VERIFIED_COPY: Record<UiLanguage, string> = {
  tr: 'Doğrulama',
  en: 'Verified',
  de: 'Geprüft',
  es: 'Verificación',
  ar: 'التحقق',
};

const ENGINE_COPY: Record<UiLanguage, string> = {
  tr: 'Motor',
  en: 'Engine',
  de: 'Engine',
  es: 'Motor',
  ar: 'المحرك',
};

export function VersionPanel({ resultVersion, language = 'tr' }: VersionPanelProps) {
  return (
    <p className="text-xs leading-5 text-stone-500">
      {COPY[language]} {VERSION_INFO.appVersion} · kural seti {VERSION_INFO.rulesetVersion} · {ENGINE_COPY[language]} {resultVersion || 'core-school-matrix-v2'} · {VERIFIED_COPY[language]} {VERSION_INFO.lastVerifiedAt}
    </p>
  );
}
