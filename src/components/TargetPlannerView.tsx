import React, { useState } from 'react';
import { CurrencyCode, Language, TargetGoalInput } from '../types/ads';
import { translations } from '../translations';
import { solveTargetGoal, formatCurrency, formatNumber } from '../utils/calculator';
import { Target, ArrowRight, DollarSign, Users, Sparkles, TrendingUp } from 'lucide-react';

interface TargetPlannerViewProps {
  currency: CurrencyCode;
  lang: Language;
}

export const TargetPlannerView: React.FC<TargetPlannerViewProps> = ({ currency, lang }) => {
  const t = translations[lang];

  // Target inputs
  const [targetRevenue, setTargetRevenue] = useState<number>(10000);
  const [targetConversions, setTargetConversions] = useState<number>(0);
  const [aov, setAov] = useState<number>(65);
  const [expectedCtr, setExpectedCtr] = useState<number>(1.8);
  const [expectedCpc, setExpectedCpc] = useState<number>(0.55);
  const [expectedCvr, setExpectedCvr] = useState<number>(2.4);
  const [profitMarginPercent, setProfitMarginPercent] = useState<number>(55);
  const [planningDays, setPlanningDays] = useState<number>(30);

  const goalInput: TargetGoalInput = {
    targetRevenue,
    targetConversions,
    aov,
    expectedCtr,
    expectedCpc,
    expectedCvr,
    profitMarginPercent,
  };

  const output = solveTargetGoal(goalInput);
  const dailySpend = output.requiredSpend / planningDays;
  const dailyConversions = Math.ceil((output.expectedRevenue / (aov || 50)) / planningDays);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'Reverse Target & Budget Planner' : 'টার্গেট ও বাজেট রিভার্স প্ল্যানার'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {lang === 'en'
            ? 'Reverse-engineer your Facebook ad budget: enter your desired revenue, and compute exact required ad spend, clicks, and ROAS.'
            : 'আপনার কাঙ্ক্ষিত বিক্রি বা অর্ডার সংখ্যা লিখুন; স্বয়ংক্রিয়ভাবে বের হয়ে আসবে কত টাকা অ্যাড বাজেট, ক্লিক ও ইম্প্রেশন লাগবে।'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Target className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              {lang === 'en' ? 'Define Your Target Goals' : 'আপনার লক্ষ্য নির্ধারণ করুন'}
            </h2>
          </div>

          {/* Target Revenue */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">{t.metrics.targetRevenue}</span>
              <span className="font-mono font-bold text-slate-900">
                {formatCurrency(targetRevenue, currency)}
              </span>
            </div>
            <input
              type="number"
              step="500"
              value={targetRevenue}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value));
                setTargetRevenue(val);
                setTargetConversions(0);
              }}
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Average Order Value (AOV) */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">{t.metrics.aov}</span>
              <span className="font-mono text-slate-700">{formatCurrency(aov, currency)}</span>
            </div>
            <input
              type="number"
              step="5"
              value={aov}
              onChange={(e) => setAov(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Expected Benchmarks */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Expected CPC</label>
              <input
                type="number"
                step="0.05"
                value={expectedCpc}
                onChange={(e) => setExpectedCpc(Math.max(0.01, Number(e.target.value)))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Expected CTR %</label>
              <input
                type="number"
                step="0.1"
                value={expectedCtr}
                onChange={(e) => setExpectedCtr(Math.max(0.1, Number(e.target.value)))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Website CVR %</label>
              <input
                type="number"
                step="0.1"
                value={expectedCvr}
                onChange={(e) => setExpectedCvr(Math.max(0.1, Number(e.target.value)))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Planning Days</label>
              <select
                value={planningDays}
                onChange={(e) => setPlanningDays(Number(e.target.value))}
                className="w-full text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={7}>7 Days (1 Week)</option>
                <option value={14}>14 Days (2 Weeks)</option>
                <option value={30}>30 Days (1 Month)</option>
                <option value={90}>90 Days (Quarter)</option>
              </select>
            </div>
          </div>

          {/* Product Gross Margin % */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Product Profit Margin</span>
              <span className="font-mono font-bold text-slate-900">{profitMarginPercent}%</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              value={profitMarginPercent}
              onChange={(e) => setProfitMarginPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Output Blueprints (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Required Budget Blueprint */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Required Facebook Ad Budget
                </span>
                <div className="text-3xl font-extrabold font-mono text-slate-900 mt-1 tabular-nums">
                  {formatCurrency(output.requiredSpend, currency)}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  or <strong className="font-mono text-slate-800">{formatCurrency(dailySpend, currency)}/day</strong> over {planningDays} days
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Target ROAS
                </span>
                <div className="text-2xl font-bold font-mono text-emerald-600 mt-1 tabular-nums">
                  {output.expectedRoas.toFixed(2)}x
                </div>
                <div className="text-xs text-slate-400">
                  Break-even: {(100 / profitMarginPercent).toFixed(2)}x
                </div>
              </div>
            </div>

            {/* Pacing Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[11px] text-slate-500">Required Clicks</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">
                  {formatNumber(output.requiredClicks)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ~{Math.ceil(output.requiredClicks / planningDays)} clicks/day
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[11px] text-slate-500">Required Imp.</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">
                  {formatNumber(output.requiredImpressions)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  At {expectedCtr}% CTR
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[11px] text-slate-500">Max Allowable CPA</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">
                  {formatCurrency(output.maxAllowableCpa, currency)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Target: {formatCurrency(output.requiredSpend / Math.max(1, output.expectedRevenue / aov), currency)}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-[11px] text-slate-500">Est. Net Profit</div>
                <div className="text-base font-bold font-mono text-emerald-600 mt-1">
                  {formatCurrency(output.expectedNetProfit, currency)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  After ad spend & COGS
                </div>
              </div>
            </div>
          </div>

          {/* Media Buying Execution Blueprint */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {lang === 'en' ? 'Execution Strategy for this Goal' : 'এই লক্ষ্য অর্জনের কার্যকরী স্ট্র্যাটেজি'}
            </h3>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                <span>
                  <strong>Daily Ad Set Allocation:</strong> Run 2-3 Advantage+ or broad CBO campaigns allocating{' '}
                  <strong>{formatCurrency(dailySpend, currency)}/day</strong> evenly.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                <span>
                  <strong>Target Daily Orders:</strong> You need approximately{' '}
                  <strong>{dailyConversions} orders/leads per day</strong> at an average cart value of{' '}
                  <strong>{formatCurrency(aov, currency)}</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                <span>
                  <strong>CPA Guardrail:</strong> Keep acquisition cost strictly below{' '}
                  <strong>{formatCurrency(output.maxAllowableCpa, currency)}</strong> to guarantee profitability.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
