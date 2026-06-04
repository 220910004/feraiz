import type { AdvancedCaseContext, Heir } from '../types/inheritance';
import type { SchoolKey } from '../core/schools/common';

export interface ShareableCaseState {
  gender: 'male' | 'female';
  selectedHeirs: Heir[];
  caseContext: AdvancedCaseContext;
  selectedSchool: SchoolKey;
}

const PARAM_NAME = 'case';

function encodeBase64(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

function decodeBase64(value: string) {
  return decodeURIComponent(escape(atob(value)));
}

export function serializeCaseState(state: ShareableCaseState): string {
  return encodeBase64(JSON.stringify(state));
}

export function deserializeCaseState(raw: string | null): ShareableCaseState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeBase64(raw));
    if (!parsed || !Array.isArray(parsed.selectedHeirs)) return null;
    if (parsed.gender !== 'male' && parsed.gender !== 'female') return null;
    return parsed as ShareableCaseState;
  } catch {
    return null;
  }
}

export function buildShareUrl(state: ShareableCaseState): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM_NAME, serializeCaseState(state));
  return url.toString();
}

export function readShareStateFromLocation(): ShareableCaseState | null {
  if (typeof window === 'undefined') return null;
  const url = new URL(window.location.href);
  return deserializeCaseState(url.searchParams.get(PARAM_NAME));
}

export function writeShareStateToLocation(state: ShareableCaseState | null) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (state) {
    url.searchParams.set(PARAM_NAME, serializeCaseState(state));
  } else {
    url.searchParams.delete(PARAM_NAME);
  }
  window.history.replaceState({}, '', url.toString());
}
