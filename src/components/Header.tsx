import React from 'react';
import { CurrencyCode, Language } from '../types/ads';
import { translations } from '../translations';
import { CURRENCIES } from '../utils/calculator';
import { Plus } from 'lucide-react';

interface HeaderProps {
  activeTab: 'calculator' | 'tracker' | 'report' | 'planner' | 'formulas';
  setActiveTab: (tab: 'calculator' | 'tracker' | 'report' | 'planner' | 'formulas') => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  lang: Language;
  setLang: (l: Language) => void;
  onOpenNewCampaign: () => void;
  onOpenAndroid: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  lang,
  setLang,
  onOpenNewCampaign,
  onOpenAndroid,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Single text element wordmark */}
      <div 
        onClick={() => setActiveTab('tracker')} 
        className="cursor-pointer text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 select-none flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
        <span>MetaPulse</span>
      </div>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
        <button
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
            activeTab === 'calculator'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {t.nav.calculator}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tracker')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
            activeTab === 'tracker'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {t.nav.tracker}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
            activeTab === 'report'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {t.nav.report}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('planner')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
            activeTab === 'planner'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {t.nav.planner}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('formulas')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-1 border-b-2 ${
            activeTab === 'formulas'
              ? 'border-blue-600 text-blue-600 font-semibold'
              : 'border-transparent hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          {t.nav.formulas}
        </button>
      </nav>

      {/* Zone 3: Primary Action & Preferences */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Android App Button */}
        <button
          type="button"
          onClick={onOpenAndroid}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md transition-colors whitespace-nowrap shrink-0"
          title="Android App & APK"
        >
          <span>🤖</span>
          <span>{lang === 'en' ? 'Android APK' : 'অ্যান্ড্রয়েড APK'}</span>
        </button>

        {/* Currency Switcher */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
          className="text-xs font-medium px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
          title="Select Currency"
        >
          {Object.entries(CURRENCIES).map(([code, cur]) => (
            <option key={code} value={code}>
              {cur.symbol} {code}
            </option>
          ))}
        </select>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
          className="text-xs font-semibold px-2 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors whitespace-nowrap"
          title="Toggle Language"
        >
          {lang === 'en' ? 'বাংলা' : 'EN'}
        </button>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={onOpenNewCampaign}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.actions.newCampaign}</span>
        </button>
      </div>
    </header>
  );
};
