import React from 'react';
import type { ValidationIssue } from '../../core/validation/validateCaseInput';

interface ValidationSummaryProps {
  issues: ValidationIssue[];
  title?: string;
}

export function ValidationSummary({ issues, title = 'Doğrulama Özeti' }: ValidationSummaryProps) {
  if (!issues.length) {
    return (
      <div className="rounded-[20px] border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-800">
        <p className="font-semibold">{title}</p>
        <p className="mt-1">Zorlayıcı bir veri hatası görünmüyor. Hesaplama devam edebilir.</p>
      </div>
    );
  }

  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');

  return (
    <div className="rounded-[20px] border border-stone-200 bg-white p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
        <p className="mt-1 text-sm text-stone-500">Hesaplamadan önce tutarsız veri girişleri ve muhtemel hacb uyarıları burada toplanır.</p>
      </div>

      {errors.length > 0 && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3">
          <p className="text-sm font-semibold text-red-800">Engelleyen hatalar</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-red-700 space-y-1">
            {errors.map((issue, index) => <li key={`error-${issue.code}-${index}`}>{issue.message}</li>)}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-semibold text-amber-800">Uyarılar</p>
          <ul className="mt-2 list-disc pl-5 text-sm text-amber-700 space-y-1">
            {warnings.map((issue, index) => <li key={`warning-${issue.code}-${index}`}>{issue.message}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
