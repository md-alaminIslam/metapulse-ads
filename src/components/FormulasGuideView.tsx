import React from 'react';
import { Language } from '../types/ads';
import { BookOpen, CheckCircle, HelpCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface FormulasGuideViewProps {
  lang: Language;
}

export const FormulasGuideView: React.FC<FormulasGuideViewProps> = ({ lang }) => {
  const formulas = [
    {
      metric: 'ROAS (Return On Ad Spend)',
      formula: 'Revenue ÷ Ad Spend',
      descEn: 'Measures gross revenue generated for every dollar spent on Facebook ads.',
      descBn: 'বিজ্ঞাপনে প্রতি ১ টাকা খরচে কত টাকার বিক্রি বা রেভিনিউ হয়েছে।',
      example: '$5,000 Revenue ÷ $1,000 Spend = 5.0x ROAS',
      benchmark: 'Good: > 3.0x | Minimum: > Break-Even ROAS',
    },
    {
      metric: 'Break-Even ROAS',
      formula: '1 ÷ Profit Margin %',
      descEn: 'The exact ROAS needed so your business neither loses nor makes money on ads.',
      descBn: 'ন্যূনতম যে পরিমাণ ROAS হলে বিজ্ঞাপন খরচে কোন লস হবে না।',
      example: 'If Profit Margin is 40% (0.40): 1 ÷ 0.40 = 2.5x Break-Even ROAS',
      benchmark: 'Depends on product margin (e.g. 50% margin = 2.0x break-even)',
    },
    {
      metric: 'CPM (Cost Per Mille / 1,000 Impressions)',
      formula: '(Ad Spend ÷ Total Impressions) × 1,000',
      descEn: 'Cost to show your ad 1,000 times in user feeds.',
      descBn: 'বিজ্ঞাপনটি ১০০০ বার ব্যবহারকারীদের ফিডে দেখাতে কত খরচ হয়।',
      example: '($500 Spend ÷ 50,000 Imp.) × 1,000 = $10.00 CPM',
      benchmark: 'Normal: $8 - $18 | High: > $25 (Bangladesh: $1.50 - $4.00)',
    },
    {
      metric: 'CTR (Click-Through Rate %)',
      formula: '(Total Clicks ÷ Impressions) × 100',
      descEn: 'The percentage of people who viewed your ad and clicked on it.',
      descBn: 'বিজ্ঞাপন দেখে শতকরা কতজন মানুষ ক্লিক করেছে।',
      example: '(1,200 Clicks ÷ 60,000 Imp.) × 100 = 2.0% CTR',
      benchmark: 'Average: 1.0% - 1.5% | Strong Hook: > 2.0%',
    },
    {
      metric: 'CPC (Cost Per Click)',
      formula: 'Ad Spend ÷ Total Clicks',
      descEn: 'The actual cost paid for each visitor click.',
      descBn: 'প্রতিটি ক্লিকের জন্য গড়ে কত খরচ হয়েছে।',
      example: '$300 Spend ÷ 600 Clicks = $0.50 CPC',
      benchmark: 'Normal: $0.30 - $0.80',
    },
    {
      metric: 'CPA / CAC (Cost Per Acquisition / Result)',
      formula: 'Ad Spend ÷ Total Conversions',
      descEn: 'The cost to acquire one purchase, order, or lead.',
      descBn: 'একটি সফল অর্ডার বা লিড পেতে বিজ্ঞাপনে কত খরচ হয়েছে।',
      example: '$1,000 Spend ÷ 50 Orders = $20.00 CPA',
      benchmark: 'Must remain below Break-even CPA (AOV × Margin %)',
    },
    {
      metric: 'Frequency',
      formula: 'Total Impressions ÷ Reach',
      descEn: 'Average number of times a single person has seen your ad.',
      descBn: 'গড়ে একজন ব্যক্তি আপনার বিজ্ঞাপনটি কতবার দেখেছে।',
      example: '100,000 Imp. ÷ 25,000 Reach = 4.0 Frequency',
      benchmark: 'Prospecting: 1.2 - 2.2 | Fatigue Warning: > 3.5',
    },
    {
      metric: 'Hook Rate (Thumbstop Rate %)',
      formula: '(3-Second Video Plays ÷ Total Impressions) × 100',
      descEn: 'Measures how effectively the first 3 seconds stop users from scrolling.',
      descBn: 'ভিডিও বিজ্ঞাপনের প্রথম ৩ সেকেন্ড দেখে কতজন থেমেছে।',
      example: '(15,000 3-sec views ÷ 50,000 Imp.) × 100 = 30% Hook Rate',
      benchmark: 'Average: 20% - 25% | Winning Creative: > 35%',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* View Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {lang === 'en' ? 'Facebook Ads Formula Cheatsheet & Benchmark Guide' : 'ফেসবুক অ্যাডস সকল সূত্র ও বেঞ্চমার্ক গাইড'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {lang === 'en'
            ? 'Complete mathematical formulas, industry standards, and media buying diagnostic rules.'
            : 'প্রতিটি ফেসবুক মেট্রিক্সের সঠিক হিসাব, গাণিতিক সূত্র ও ক্যাম্পেইন অপ্টিমাইজেশন গাইড।'}
        </p>
      </div>

      {/* Grid of Formulas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {formulas.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">{item.metric}</h2>
              <span className="text-[11px] font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Formula
              </span>
            </div>

            {/* Formula Block */}
            <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs font-semibold">
              {item.formula}
            </div>

            <p className="text-xs text-slate-600">
              {lang === 'en' ? item.descEn : item.descBn}
            </p>

            <div className="text-[11px] font-mono text-slate-500 pt-1 border-t border-slate-100">
              <strong className="text-slate-700">Example:</strong> {item.example}
            </div>

            <div className="text-[11px] text-emerald-700 bg-emerald-50/60 p-2 rounded font-medium">
              Target Benchmark: {item.benchmark}
            </div>
          </div>
        ))}
      </div>

      {/* Pro Media Buying Rules Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
          {lang === 'en' ? 'Core Media Buying Rules for Scaling' : 'ক্যাম্পেইন সফল ও স্কেল করার ৫টি গোপন নিয়ম'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-lg space-y-1.5">
            <div className="font-bold text-slate-900">1. Combat Ad Fatigue (ফ্যাটিগ)</div>
            <p className="text-slate-600">
              When frequency exceeds 3.5, CTR starts tumbling. Always test 2-3 new visual hooks every week to prevent ad fatigue.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg space-y-1.5">
            <div className="font-bold text-slate-900">2. Respect the 20% Scale Rule</div>
            <p className="text-slate-600">
              When scaling winning campaigns, increase daily budget by 15-20% every 48-72 hours to prevent resetting Meta&apos;s learning phase.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg space-y-1.5">
            <div className="font-bold text-slate-900">3. Break-Even ROAS Discipline</div>
            <p className="text-slate-600">
              Never judge a campaign by ROAS alone. Always compare against your product gross margin so you never scale an ad set that is losing net money.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
