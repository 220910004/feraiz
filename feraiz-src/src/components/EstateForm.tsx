import React, { useEffect, useState } from 'react';
import { EstateInfo } from '../types/inheritance';

interface EstateFormProps {
  onSubmit: (info: EstateInfo) => void;
}

export const EstateForm: React.FC<EstateFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    totalEstate: '',
    techizTekfin: '',
    debts: '',
    waspiyet: '',
  });
  const [wasiyetWarning, setWasiyetWarning] = useState<string | null>(null);
  const [netEstate, setNetEstate] = useState(0);

  useEffect(() => {
    const total = parseFloat(formData.totalEstate) || 0;
    const techiz = parseFloat(formData.techizTekfin) || 0;
    const borclar = parseFloat(formData.debts) || 0;
    let vasiyet = parseFloat(formData.waspiyet) || 0;

    const afterDeductions = total - techiz - borclar;
    const maxVasiyet = Math.max(0, afterDeductions / 3);

    if (vasiyet > maxVasiyet && afterDeductions > 0) {
      setWasiyetWarning(`Vasiyet en fazla ${formatCurrency(maxVasiyet)} olabilir.`);
      vasiyet = maxVasiyet;
    } else if (afterDeductions <= 0 && vasiyet > 0) {
      setWasiyetWarning('Borçlar ve techiz-tekfin toplamı terekeyi aştığı için vasiyet uygulanamaz.');
      vasiyet = 0;
    } else {
      setWasiyetWarning(null);
    }

    setNetEstate(Math.max(0, afterDeductions - vasiyet));
  }, [formData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const total = parseFloat(formData.totalEstate) || 0;
    if (total <= 0) return;

    const techiz = Math.max(0, parseFloat(formData.techizTekfin) || 0);
    const borclar = Math.max(0, parseFloat(formData.debts) || 0);
    const afterDeductions = total - techiz - borclar;
    const maxVasiyet = Math.max(0, afterDeductions / 3);
    const vasiyet = Math.min(Math.max(0, parseFloat(formData.waspiyet) || 0), maxVasiyet);

    onSubmit({
      totalEstate: total,
      techizTekfin: techiz,
      debts: borclar,
      waspiyet: vasiyet,
      netEstate: Math.max(0, afterDeductions - vasiyet),
    });
  };

  const inputFields: Array<{
    key: keyof typeof formData;
    label: string;
    arabic: string;
    description: string;
    required?: boolean;
  }> = [
    {
      key: 'totalEstate',
      label: 'Toplam Tereke',
      arabic: 'التركة',
      description: 'Miras bırakanın toplam mal varlığı',
      required: true,
    },
    {
      key: 'techizTekfin',
      label: 'Techiz ve Tekfin',
      arabic: 'تجهيز وتكفين',
      description: 'Cenaze ve defin masrafları',
    },
    {
      key: 'debts',
      label: 'Borçlar',
      arabic: 'الديون',
      description: 'Miras bırakanın tespit edilmiş borçları',
    },
    {
      key: 'waspiyet',
      label: 'Vasiyet',
      arabic: 'الوصية',
      description: 'Mirasçı olmayanlara en fazla kalanın 1/3’ü kadar',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[28px] border border-stone-200 bg-white/90 p-6 md:p-8 shadow-[0_14px_40px_rgba(28,25,23,0.05)] backdrop-blur-xl">
        <div className="mb-8 pb-6 border-b border-stone-100">
          <h3 className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">
            İslami sıralama
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full px-3 py-1.5 bg-stone-100 text-stone-700 font-medium">
              1. Techiz-Tekfin
            </span>
            <span className="text-stone-300">→</span>
            <span className="rounded-full px-3 py-1.5 bg-stone-100 text-stone-700 font-medium">
              2. Borçlar
            </span>
            <span className="text-stone-300">→</span>
            <span className="rounded-full px-3 py-1.5 bg-stone-100 text-stone-700 font-medium">
              3. Vasiyet
            </span>
            <span className="text-stone-300">→</span>
            <span className="rounded-full px-3 py-1.5 bg-stone-900 text-white font-medium">
              4. Miras
            </span>
          </div>
        </div>

        <div className="space-y-5">
          {inputFields.map((field) => (
            <div key={field.key} className="group">
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <div>
                  <label className="text-sm font-medium text-stone-900">
                    {field.label}
                    {field.required && <span className="text-emerald-600 ml-1">*</span>}
                  </label>
                  <p className="text-xs text-stone-500 mt-1">{field.description}</p>
                </div>
                <span className="font-arabic text-stone-400 text-sm">{field.arabic}</span>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required={field.required}
                  value={formData[field.key]}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.key]: event.target.value,
                    }))
                  }
                  placeholder="0"
                  className="input pr-12"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 font-medium">
                  ₺
                </span>
              </div>
            </div>
          ))}
        </div>

        {wasiyetWarning && (
          <div className="mt-5 rounded-[20px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {wasiyetWarning}
          </div>
        )}

        <div className="mt-8 rounded-[24px] border border-stone-200 bg-gradient-to-r from-stone-950 to-stone-800 p-5 text-white shadow-[0_16px_36px_rgba(28,25,23,0.22)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-stone-400">Net miras</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(netEstate)}</p>
            </div>
            <p className="text-sm text-stone-300 md:max-w-md md:text-right">
              Borçlar ve techiz-tekfin düşüldükten, vasiyet 1/3 sınırına göre düzenlendikten sonra dağıtıma esas kalan meblağ.
            </p>
          </div>

          {parseFloat(formData.totalEstate) > 0 && (
            <div className="mt-5 border-t border-stone-700 pt-4 space-y-2 text-sm text-stone-300">
              <div className="flex justify-between">
                <span>Toplam tereke</span>
                <span>{formatCurrency(parseFloat(formData.totalEstate) || 0)}</span>
              </div>
              {parseFloat(formData.techizTekfin) > 0 && (
                <div className="flex justify-between">
                  <span>− Techiz-Tekfin</span>
                  <span>{formatCurrency(parseFloat(formData.techizTekfin) || 0)}</span>
                </div>
              )}
              {parseFloat(formData.debts) > 0 && (
                <div className="flex justify-between">
                  <span>− Borçlar</span>
                  <span>{formatCurrency(parseFloat(formData.debts) || 0)}</span>
                </div>
              )}
              {parseFloat(formData.waspiyet) > 0 && (
                <div className="flex justify-between">
                  <span>− Vasiyet</span>
                  <span>
                    {formatCurrency(
                      Math.min(
                        parseFloat(formData.waspiyet) || 0,
                        Math.max(
                          0,
                          ((parseFloat(formData.totalEstate) || 0) -
                            (parseFloat(formData.techizTekfin) || 0) -
                            (parseFloat(formData.debts) || 0)) /
                            3,
                        ),
                      ),
                    )}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!parseFloat(formData.totalEstate)}
          className={`btn btn-primary ${!parseFloat(formData.totalEstate) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Devam Et
        </button>
      </div>
    </form>
  );
};

export default EstateForm;
