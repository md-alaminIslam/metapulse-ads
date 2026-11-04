import React, { useState } from 'react';
import { CurrencyCode, Language, AdMetrics } from '../types/ads';
import { translations } from '../translations';
import { calculateAdMetrics, formatCurrency, formatNumber, formatPercent } from '../utils/calculator';
import { Calculator, ArrowRight, TrendingUp, Sliders, CheckCircle2, AlertCircle, BookmarkPlus } from 'lucide-react';

interface AdsCalculatorViewProps {
  currency: CurrencyCode;
  lang: Language;
  onSaveAsCampaign: (name: string, metrics: AdMetrics) => void;
}

export const AdsCalculatorView: React.FC<AdsCalculatorViewProps> = ({
  currency,
  lang,
  onSaveAsCampaign,
}) => {
  const t = translations[lang];

  // Primary calculator state
  const [spend, setSpend] = useState<number>(500);
  const [impressions, setImpressions] = useState<number>(35000);
  const [reach, setReach] = useState<number>(26000);
  const [clicks, setClicks] = useState<number>(875);
  const [conversions, setConversions] = useState<number>(38);
  const [revenue, setRevenue] = useState<number>(2280);
  const [aov, setAov] = useState<number>(60);
  const [marginPercent, setMarginPercent] = useState<number>(50);
  const [cogs, setCogs] = useState<number>(1140);
  const [campaignName, setCampaignName] = useState<string>('My Calculated Campaign');
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  // Active sub-mode: 'standard' | 'scenarios'
  const [calcSubTab, setCalcSubTab] = useState<'standard' | 'scenarios'>('standard');

  // Handle revenue or AOV change
  const handleAovChange = (newAov: number) => {
    setAov(newAov);
    if (conversions > 0) {
      const newRev = conversions * newAov;
      setRevenue(newRev);
      setCogs(newRev * (1 - marginPercent / 100));
    }
  };

  const handleConversionsChange = (newConversions: number) => {
    setConversions(newConversions);
    if (aov > 0) {
      const newRev = newConversions * aov;
      setRevenue(newRev);
      setCogs(newRev * (1 - marginPercent / 100));
    }
  };

  const handleMarginChange = (newMargin: number) => {
    setMarginPercent(newMargin);
    setCogs(revenue * (1 - newMargin / 100));
  };

  // Pre-load common presets
  const applyPreset = (preset: 'ecommerce' | 'leads' | 'testing') => {
    if (preset === 'ecommerce') {
      setSpend(1000);
      setImpressions(70000);
      setReach(52000);
      setClicks(1750);
      setConversions(70);
      setAov(65);
      setRevenue(4550);
      setMarginPercent(55);
      setCogs(2047.5);
      setCampaignName('E-Commerce Fashion Drop');
    } else if (preset === 'leads') {
      setSpend(400);
      setImpressions(25000);
      setReach(19000);
      setClicks(650);
      setConversions(45);
      setAov(40);
      setRevenue(1800);
      setMarginPercent(80);
      setCogs(360);
      setCampaignName('B2B Coaching Lead Gen');
    } else {
      setSpend(100);
      setImpressions(8000);
      setReach(7200);
      setClicks(160);
      setConversions(4);
      setAov(50);
      setRevenue(200);
      setMarginPercent(45);
      setCogs(110);
      setCampaignName('Testing New Angle Creative');
    }
  };

  // Run calculation
  const metricsInput: AdMetrics = {
    spend,
    impressions,
    reach,
    clicks,
    conversions,
    revenue,
    cogs,
    aov,
  };
  const result = calculateAdMetrics(metricsInput, marginPercent);

  const handleSaveToTracker = () => {
    onSaveAsCampaign(campaignName || 'Calculated Campaign', metricsInput);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  // What-If Scenarios
  const scenarioBase = result;
  // Scenario 1: Better Creative (CTR increases to 3.5%, CPC lowers proportionally)
  const s1Clicks = Math.round(impressions * 0.035);
  const s1Conversions = Math.round(s1Clicks * (result.cvr / 100));
  const s1Revenue = s1Conversions * (aov > 0 ? aov : 60);
  const s1 = calculateAdMetrics({
    ...metricsInput,
    clicks: s1Clicks,
    conversions: s1Conversions,
    revenue: s1Revenue,
    cogs: s1Revenue * (1 - marginPercent / 100),
  }, marginPercent);

  // Scenario 2: Landing Page CRO (+30% CVR)
  const s2Cvr = (result.cvr * 1.35) / 100;
  const s2Conversions = Math.round(clicks * s2Cvr);
  const s2Revenue = s2Conversions * (aov > 0 ? aov : 60);
  const s2 = calculateAdMetrics({
    ...metricsInput,
    conversions: s2Conversions,
    revenue: s2Revenue,
    cogs: s2Revenue * (1 - marginPercent / 100),
  }, marginPercent);

  // Scenario 3: Scale Budget (+50% Spend with slight fatigue)
  const s3Spend = spend * 1.5;
  const s3Impressions = Math.round(impressions * 1.45);
  const s3Clicks = Math.round(clicks * 1.4);
  const s3Conversions = Math.round(conversions * 1.38);
  const s3Revenue = s3Conversions * (aov > 0 ? aov : 60);
  const s3 = calculateAdMetrics({
    spend: s3Spend,
    impressions: s3Impressions,
    reach: Math.round(reach * 1.3),
    clicks: s3Clicks,
    conversions: s3Conversions,
    revenue: s3Revenue,
    cogs: s3Revenue * (1 - marginPercent / 100),
  }, marginPercent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header with Presets & Mode Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {lang === 'en' ? 'Facebook Ads Full Metric Calculator' : 'ফেসবুক অ্যাডস পূর্ণাঙ্গ মেট্রিক্স ক্যালকুলেটর'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'en'
              ? 'Calculate ROAS, CPM, CTR, Break-even metrics, and simulate live performance scenarios.'
              : 'ROAS, CPM, CTR, ব্রেক-ইভেন পয়েন্ট এবং যেকোনো ক্যাম্পেইনের পারফরম্যান্স রিয়েল-টাইমে হিসাব করুন।'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setCalcSubTab('standard')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                calcSubTab === 'standard'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'en' ? 'Standard Calculator' : 'মূল ক্যালকুলেটর'}
            </button>
            <button
              type="button"
              onClick={() => setCalcSubTab('scenarios')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                calcSubTab === 'scenarios'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'en' ? 'What-If Scenarios' : 'হোয়াট-ইফ সিনারিও'}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-xs text-slate-400 font-medium">
              {lang === 'en' ? 'Presets:' : 'নমুনা:'}
            </span>
            <button
              type="button"
              onClick={() => applyPreset('ecommerce')}
              className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 transition-colors"
            >
              E-Commerce
            </button>
            <button
              type="button"
              onClick={() => applyPreset('leads')}
              className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Lead Gen
            </button>
            <button
              type="button"
              onClick={() => applyPreset('testing')}
              className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Low Budget
            </button>
          </div>
        </div>
      </div>

      {calcSubTab === 'standard' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Inputs & Sliders (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  {lang === 'en' ? 'Campaign Input Parameters' : 'ক্যাম্পেইনের তথ্য দিন'}
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500">Live Auto-Compute</span>
            </div>

            {/* Campaign Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                {lang === 'en' ? 'Campaign Label / Name' : 'ক্যাম্পেইনের নাম'}
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Summer Catalog Dynamic Ads"
                className="w-full text-xs font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* 1. Spend & Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">{t.metrics.spend}</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(spend, currency)}
                </span>
              </div>
              <input
                type="number"
                min="1"
                step="10"
                value={spend}
                onChange={(e) => setSpend(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <input
                type="range"
                min="10"
                max="10000"
                step="25"
                value={spend}
                onChange={(e) => setSpend(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            {/* 2. Impressions & Reach */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.metrics.impressions}</label>
                <input
                  type="number"
                  min="1"
                  step="500"
                  value={impressions}
                  onChange={(e) => {
                    const val = Math.max(0, Number(e.target.value));
                    setImpressions(val);
                    if (reach > val) setReach(Math.round(val * 0.75));
                  }}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.metrics.reach}</label>
                <input
                  type="number"
                  min="1"
                  step="500"
                  value={reach}
                  onChange={(e) => setReach(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 3. Clicks & Conversions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.metrics.clicks}</label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={clicks}
                  onChange={(e) => setClicks(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.metrics.conversions}</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={conversions}
                  onChange={(e) => handleConversionsChange(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 4. Average Order Value (AOV) & Total Revenue */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.metrics.aov}</label>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={aov}
                  onChange={(e) => handleAovChange(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">{t.metrics.revenue}</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={revenue}
                  onChange={(e) => {
                    const rev = Math.max(0, Number(e.target.value));
                    setRevenue(rev);
                    if (conversions > 0) setAov(Number((rev / conversions).toFixed(2)));
                    setCogs(rev * (1 - marginPercent / 100));
                  }}
                  className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 5. Gross Margin % (Used for Break-Even ROAS calculation) */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">
                  {lang === 'en' ? 'Product Gross Margin %' : 'পণ্যের প্রফিট মার্জিন %'}
                </span>
                <span className="font-mono font-bold text-slate-900">{marginPercent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={marginPercent}
                onChange={(e) => handleMarginChange(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>10% (Low Margin / Electronics)</span>
                <span>50% (Standard)</span>
                <span>80% (Digital / Info)</span>
              </div>
            </div>

            {/* Save to tracker CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveToTracker}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors"
              >
                {savedFeedback ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'en' ? 'Added to Campaign Tracker!' : 'ক্যাম্পেইনে যোগ করা হয়েছে!'}</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Save to Campaign Tracker' : 'ক্যাম্পেইন ট্র্যাকার-এ যোগ করুন'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Calculated Results, Visual Gauge & Diagnostics (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Primary ROAS & Profit Banner */}
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {lang === 'en' ? 'Primary Performance Engine' : 'প্রধান পারফরম্যান্স রেজাল্ট'}
                  </span>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-900 tabular-nums">
                      {result.roas.toFixed(2)}x
                    </span>
                    <span className="text-xs text-slate-500 font-medium">ROAS</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {t.metrics.netProfit}
                  </span>
                  <div className="text-2xl font-bold font-mono tabular-nums mt-1">
                    <span className={result.netAdProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                      {formatCurrency(result.netAdProfit, currency)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    Margin: {result.profitMarginPercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Break-Even Visual Scale */}
              <div className="pt-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">
                    {lang === 'en' ? 'Break-Even ROAS Gauge' : 'ব্রেক-ইভেন তুলনা'}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Break-even: {result.breakEvenRoas.toFixed(2)}x · Actual: {result.roas.toFixed(2)}x
                  </span>
                </div>

                {/* Progress bar scale */}
                <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  {/* Break-even marker zone */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-rose-200 rounded-l-full"
                    style={{
                      width: `${Math.min(100, (result.breakEvenRoas / Math.max(5, result.roas * 1.3)) * 100)}%`,
                    }}
                  />
                  {/* Current ROAS bar */}
                  <div
                    className={`h-full transition-all duration-300 ${
                      result.roas >= result.breakEvenRoas ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (result.roas / Math.max(5, result.roas * 1.3)) * 100)}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-rose-600">Loss Zone (&lt; {result.breakEvenRoas.toFixed(2)}x)</span>
                  <span className="text-emerald-600">
                    Profit Zone (&gt; {result.breakEvenRoas.toFixed(2)}x)
                  </span>
                </div>
              </div>
            </div>

            {/* Core Calculated Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* CPM */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">CPM (1,000 Imp.)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatCurrency(result.cpm, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {result.cpm > 22 ? 'High CPM' : result.cpm < 10 ? 'Low & Cheap CPM' : 'Average'}
                </div>
              </div>

              {/* CTR */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">CTR (Click Rate)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatPercent(result.ctr)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {result.ctr >= 2 ? 'Great Hook' : result.ctr < 1 ? 'Needs Better Hook' : 'Normal'}
                </div>
              </div>

              {/* CPC */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">CPC (Cost/Click)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatCurrency(result.cpc, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {clicks} clicks recorded
                </div>
              </div>

              {/* Frequency */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">Frequency</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {result.frequency.toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {result.frequency > 3.5 ? 'Fatigue Alert' : 'Healthy reach'}
                </div>
              </div>

              {/* CVR */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">CVR (Conv. Rate)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatPercent(result.cvr)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {conversions} conversions
                </div>
              </div>

              {/* CPA */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">CPA (Cost/Result)</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatCurrency(result.cpa, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Max allowable: {formatCurrency(result.breakEvenCpa, currency)}
                </div>
              </div>

              {/* Break-Even CPA */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">Target Max CPA</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatCurrency(result.breakEvenCpa, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Based on {marginPercent}% margin
                </div>
              </div>

              {/* Gross Profit */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 font-medium">Product COGS</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatCurrency(cogs, currency)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Revenue - Spend - COGS
                </div>
              </div>
            </div>

            {/* Algorithmic Audit & Actionable Advice */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {lang === 'en' ? 'Automated Campaign Audit & Diagnosis' : 'অটোমেটিক ক্যাম্পেইন অডিট ও পরামর্শ'}
                </h3>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Health Score: {result.healthScore}/100
                </span>
              </div>

              {/* Diagnosis Points */}
              <div className="space-y-2">
                {result.diagnosis.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="text-blue-500 font-bold shrink-0">·</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {lang === 'en' ? 'Actionable Recommendations:' : 'করণীয় পদক্ষেপ:'}
                  </span>
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs font-medium text-slate-900">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* What-If Scenarios Comparison Sandbox */
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-900 mb-2">
              {lang === 'en' ? 'What-If Growth Scenario Simulation' : 'হোয়াট-ইফ গ্রোথ সিনারিও সিমুলেশন'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {lang === 'en'
                ? 'Compare your baseline campaign against 3 distinct media buying levers: Creative Hook Optimization, Landing Page CRO, and Budget Scaling.'
                : 'আপনার বর্তমান ক্যাম্পেইনের সাথে ৩টি ভিন্ন কৌশল তুলনা করুন: ভালো ক্রিয়েটিভ, ল্যান্ডিং পেইজ কনভার্শন ও বাজেট বৃদ্ধি।'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Baseline */}
              <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Current Baseline</span>
                  <span className="text-[11px] font-mono text-slate-500">Base</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spend:</span>
                    <span className="font-mono font-medium">{formatCurrency(spend, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CTR:</span>
                    <span className="font-mono font-medium">{formatPercent(scenarioBase.ctr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CVR:</span>
                    <span className="font-mono font-medium">{formatPercent(scenarioBase.cvr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROAS:</span>
                    <span className="font-mono font-bold">{scenarioBase.roas.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200">
                    <span className="font-semibold text-slate-700">Net Profit:</span>
                    <span className={`font-mono font-bold ${scenarioBase.netAdProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formatCurrency(scenarioBase.netAdProfit, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario 1: Creative Optimization */}
              <div className="border border-blue-200 bg-blue-50/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="text-xs font-bold text-blue-900">1. Creative Hook Boost</span>
                  <span className="text-[11px] font-mono text-blue-600">+CTR to 3.5%</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spend:</span>
                    <span className="font-mono font-medium">{formatCurrency(spend, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CTR:</span>
                    <span className="font-mono font-bold text-blue-600">3.50%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Conversions:</span>
                    <span className="font-mono font-bold">{s1Conversions} ({s1Conversions - conversions >= 0 ? `+${s1Conversions - conversions}` : s1Conversions - conversions})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROAS:</span>
                    <span className="font-mono font-bold text-emerald-600">{s1.roas.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="font-semibold text-blue-900">Net Profit:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {formatCurrency(s1.netAdProfit, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario 2: Landing Page CRO */}
              <div className="border border-purple-200 bg-purple-50/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-purple-200">
                  <span className="text-xs font-bold text-purple-900">2. Landing Page CRO</span>
                  <span className="text-[11px] font-mono text-purple-600">+35% Conv Rate</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spend:</span>
                    <span className="font-mono font-medium">{formatCurrency(spend, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">CVR:</span>
                    <span className="font-mono font-bold text-purple-600">{formatPercent(s2.cvr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Conversions:</span>
                    <span className="font-mono font-bold">{s2Conversions} (+{s2Conversions - conversions})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROAS:</span>
                    <span className="font-mono font-bold text-emerald-600">{s2.roas.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-200">
                    <span className="font-semibold text-purple-900">Net Profit:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {formatCurrency(s2.netAdProfit, currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Scenario 3: Scale Budget */}
              <div className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900">3. Scale Budget +50%</span>
                  <span className="text-[11px] font-mono text-emerald-600">+50% Spend</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Spend:</span>
                    <span className="font-mono font-bold">{formatCurrency(s3Spend, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Revenue:</span>
                    <span className="font-mono font-medium">{formatCurrency(s3Revenue, currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Conversions:</span>
                    <span className="font-mono font-bold">{s3Conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ROAS:</span>
                    <span className="font-mono font-bold">{s3.roas.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-emerald-200">
                    <span className="font-semibold text-emerald-900">Net Profit:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {formatCurrency(s3.netAdProfit, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
