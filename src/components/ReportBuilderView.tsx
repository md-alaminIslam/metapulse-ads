import React, { useState } from 'react';
import { Campaign, CurrencyCode, Language } from '../types/ads';
import { translations } from '../translations';
import { calculateAdMetrics, formatCurrency, formatNumber, formatPercent } from '../utils/calculator';
import { 
  Printer, 
  Download, 
  Share2, 
  Check, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Building,
  User,
  Layers,
  Sparkles
} from 'lucide-react';

interface ReportBuilderViewProps {
  campaigns: Campaign[];
  currency: CurrencyCode;
  lang: Language;
}

export const ReportBuilderView: React.FC<ReportBuilderViewProps> = ({
  campaigns,
  currency,
  lang,
}) => {
  const t = translations[lang];

  // Report metadata form
  const [reportTitle, setReportTitle] = useState('Facebook Ads Performance & ROI Report');
  const [clientName, setClientName] = useState('Global Retail E-Commerce');
  const [period, setPeriod] = useState('October 1 - October 31, 2026');
  const [preparedBy, setPreparedBy] = useState('Growth Media Buyer');
  const [executiveNotes, setExecutiveNotes] = useState(
    'Overall account scaled healthily this month with strong ROAS in broad dynamic catalog campaigns. Retargeting creative needs refresh due to frequency fatigue.'
  );

  // Selected campaigns for this report
  const [selectedIds, setSelectedIds] = useState<string[]>(campaigns.map((c) => c.id));
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const activeReportCampaigns = campaigns.filter((c) => selectedIds.includes(c.id));

  // Aggregate stats
  const totals = activeReportCampaigns.reduce(
    (acc, c) => {
      acc.spend += c.metrics.spend || 0;
      acc.revenue += c.metrics.revenue || 0;
      acc.impressions += c.metrics.impressions || 0;
      acc.reach += c.metrics.reach || 0;
      acc.clicks += c.metrics.clicks || 0;
      acc.conversions += c.metrics.conversions || 0;
      acc.cogs += c.metrics.cogs || 0;
      return acc;
    },
    { spend: 0, revenue: 0, impressions: 0, reach: 0, clicks: 0, conversions: 0, cogs: 0 }
  );

  const totalCalculated = calculateAdMetrics(totals);

  // Identify top winner and fatigue risk
  const sortedByRoas = [...activeReportCampaigns].sort((a, b) => {
    return calculateAdMetrics(b.metrics).roas - calculateAdMetrics(a.metrics).roas;
  });
  const topWinner = sortedByRoas[0];
  const topWinnerCalc = topWinner ? calculateAdMetrics(topWinner.metrics) : null;

  // Toggle selection
  const toggleCampaign = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Download CSV
  const handleDownloadCsv = () => {
    const headers = [
      'Campaign Name',
      'Objective',
      'Spend',
      'Impressions',
      'Reach',
      'Frequency',
      'Clicks',
      'CTR (%)',
      'CPM',
      'CPC',
      'Conversions',
      'CPA',
      'Revenue',
      'ROAS',
      'Net Profit',
    ];

    const rows = activeReportCampaigns.map((c) => {
      const calc = calculateAdMetrics(c.metrics);
      return [
        `"${c.name.replace(/"/g, '""')}"`,
        c.objective,
        c.metrics.spend.toFixed(2),
        c.metrics.impressions,
        c.metrics.reach,
        calc.frequency.toFixed(2),
        c.metrics.clicks,
        calc.ctr.toFixed(2),
        calc.cpm.toFixed(2),
        calc.cpc.toFixed(2),
        c.metrics.conversions,
        calc.cpa.toFixed(2),
        c.metrics.revenue.toFixed(2),
        calc.roas.toFixed(2),
        calc.netAdProfit.toFixed(2),
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Facebook_Ads_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy WhatsApp / Slack formatted text
  const handleCopyTextReport = () => {
    const summaryText = `📊 *${reportTitle.toUpperCase()}*
🏢 *Client:* ${clientName}
📅 *Period:* ${period}
👤 *Prepared By:* ${preparedBy}

━━━━━━━━━━━━━━━━━━━━━
📈 *EXECUTIVE KPI SUMMARY:*
💰 *Total Ad Spend:* ${formatCurrency(totals.spend, currency)}
🛒 *Total Revenue:* ${formatCurrency(totals.revenue, currency)}
🚀 *Blended ROAS:* ${totalCalculated.roas.toFixed(2)}x
🎯 *Total Results/Conversions:* ${totals.conversions}
💵 *Blended CPA:* ${formatCurrency(totalCalculated.cpa, currency)}
📊 *Overall CTR:* ${formatPercent(totalCalculated.ctr)}
💎 *Estimated Net Profit:* ${formatCurrency(totalCalculated.netAdProfit, currency)}

━━━━━━━━━━━━━━━━━━━━━
🏆 *TOP PERFORMING CAMPAIGN:*
• *${topWinner?.name || 'N/A'}*
  - Spend: ${formatCurrency(topWinner?.metrics.spend || 0, currency)}
  - ROAS: ${topWinnerCalc?.roas.toFixed(2) || '0'}x
  - Conversions: ${topWinner?.metrics.conversions || 0}
  - CPA: ${formatCurrency(topWinnerCalc?.cpa || 0, currency)}

━━━━━━━━━━━━━━━━━━━━━
📝 *KEY NOTES & NEXT STEPS:*
${executiveNotes}

_Generated via MetaPulse Facebook Ads Intelligence_`;

    navigator.clipboard.writeText(summaryText);
    setCopiedFeedback(true);
    setTimeout(() => setCopiedFeedback(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Configuration Header Controls (Hidden during print) */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              {lang === 'en' ? 'Facebook Ads Client Report Builder' : 'ক্লায়েন্ট রিপোর্ট বিল্ডার'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {lang === 'en'
                ? 'Customize your reporting header, select campaigns, and generate instant PDF, CSV, or WhatsApp briefings.'
                : 'রিপোর্ট কাস্টমাইজ করুন এবং ১-ক্লিকে PDF, CSV বা WhatsApp-এ পাঠানোর উপযোগী রিপোর্ট তৈরি করুন।'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyTextReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              {copiedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.actions.copied}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t.actions.copySummary}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{t.actions.downloadCsv}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.actions.printReport}</span>
            </button>
          </div>
        </div>

        {/* Customization Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Report Title</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Client / Brand</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Date Range</label>
            <input
              type="text"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Author / Media Buyer</label>
            <input
              type="text"
              value={preparedBy}
              onChange={(e) => setPreparedBy(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Campaign Inclusion Selector */}
        <div className="pt-2">
          <label className="text-[11px] font-semibold text-slate-600 block mb-2">
            Select Campaigns to Include ({selectedIds.length} of {campaigns.length} selected):
          </label>
          <div className="flex flex-wrap gap-2">
            {campaigns.map((c) => {
              const isChecked = selectedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCampaign(c.id)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    isChecked
                      ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isChecked ? '✓ ' : '+ '} {c.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actual Printable Document Paper Frame */}
      <div className="print-clean bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-8">
        {/* Report Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
              <span className="w-2 h-2 rounded-xs bg-blue-600 inline-block" />
              <span>Official Meta Ads Performance Audit</span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              {reportTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="font-semibold text-slate-700">Client: {clientName}</span>
              <span>·</span>
              <span>Period: {period}</span>
              <span>·</span>
              <span>Prepared By: {preparedBy}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400">MetaPulse Analytics</span>
            <div className="text-xs font-semibold text-slate-700 mt-0.5">
              Generated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            01. Account Performance Executive Summary
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Total Ad Spend</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {formatCurrency(totals.spend, currency)}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">Generated Revenue</div>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
                {formatCurrency(totals.revenue, currency)}
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-lg">
              <div className="text-xs text-blue-700 font-medium">Blended ROAS</div>
              <div className="text-xl font-bold font-mono text-blue-900 mt-1 tabular-nums">
                {totalCalculated.roas.toFixed(2)}x
              </div>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-lg">
              <div className="text-xs text-emerald-700 font-medium">Estimated Net Ad Profit</div>
              <div className="text-xl font-bold font-mono text-emerald-900 mt-1 tabular-nums">
                {formatCurrency(totalCalculated.netAdProfit, currency)}
              </div>
            </div>
          </div>
        </div>

        {/* Key Strategy Notes & Narrative Analysis */}
        <div className="p-5 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            02. Media Buyer Strategic Notes & Analysis
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            {executiveNotes}
          </p>
          {topWinner && (
            <div className="text-xs text-slate-600 pt-2 border-t border-slate-200">
              <strong className="text-slate-900">Highest Yield Campaign:</strong> {topWinner.name} produced{' '}
              {formatCurrency(topWinner.metrics.revenue, currency)} at {topWinnerCalc?.roas.toFixed(2)}x ROAS and{' '}
              {formatCurrency(topWinnerCalc?.cpa || 0, currency)} CPA.
            </div>
          )}
        </div>

        {/* Detailed Campaign Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            03. Campaign-Level Performance Ledger
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Campaign</th>
                  <th className="py-2.5 px-2 text-right">Spend</th>
                  <th className="py-2.5 px-2 text-right">Imp.</th>
                  <th className="py-2.5 px-2 text-right">Freq.</th>
                  <th className="py-2.5 px-2 text-right">CTR</th>
                  <th className="py-2.5 px-2 text-right">Results</th>
                  <th className="py-2.5 px-2 text-right">CPA</th>
                  <th className="py-2.5 px-2 text-right">Revenue</th>
                  <th className="py-2.5 px-3 text-right">ROAS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeReportCampaigns.map((c) => {
                  const calc = calculateAdMetrics(c.metrics);
                  return (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[200px] truncate">
                        {c.name}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-700 tabular-nums">
                        {formatCurrency(c.metrics.spend, currency)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-500 tabular-nums">
                        {formatNumber(c.metrics.impressions)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                        <span className={calc.frequency > 3.5 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                          {calc.frequency.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-700 tabular-nums">
                        {formatPercent(calc.ctr)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {c.metrics.conversions}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-700 tabular-nums">
                        {formatCurrency(calc.cpa, currency)}
                      </td>
                      <td className="py-2.5 px-2 text-right font-mono text-slate-700 tabular-nums">
                        {formatCurrency(c.metrics.revenue, currency)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                        <span className={calc.roas >= 2.5 ? 'text-emerald-600' : 'text-slate-900'}>
                          {calc.roas.toFixed(2)}x
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td className="py-2.5 px-3 text-slate-900">Total / Blended</td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-900 tabular-nums">
                    {formatCurrency(totals.spend, currency)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-700 tabular-nums">
                    {formatNumber(totals.impressions)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-700 tabular-nums">
                    {totalCalculated.frequency.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-900 tabular-nums">
                    {formatPercent(totalCalculated.ctr)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-900 tabular-nums">
                    {totals.conversions}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-900 tabular-nums">
                    {formatCurrency(totalCalculated.cpa, currency)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-900 tabular-nums">
                    {formatCurrency(totals.revenue, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-600 tabular-nums">
                    {totalCalculated.roas.toFixed(2)}x
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Funnel Visualizer */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            04. Advertising Conversion Funnel Flow
          </h3>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">1. Impressions</div>
              <div className="text-base font-bold font-mono text-slate-900 mt-1">
                {formatNumber(totals.impressions)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Top of funnel</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">2. Clicks (Traffic)</div>
              <div className="text-base font-bold font-mono text-blue-600 mt-1">
                {formatNumber(totals.clicks)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                CTR: {formatPercent(totalCalculated.ctr)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">3. Conversions</div>
              <div className="text-base font-bold font-mono text-purple-600 mt-1">
                {formatNumber(totals.conversions)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                CVR: {formatPercent(totalCalculated.cvr)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">4. Revenue</div>
              <div className="text-base font-bold font-mono text-emerald-600 mt-1">
                {formatCurrency(totals.revenue, currency)}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                ROAS: {totalCalculated.roas.toFixed(2)}x
              </div>
            </div>
          </div>
        </div>

        {/* Sign-off Footer */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
          <div>Report prepared for {clientName}</div>
          <div>Confidential & Proprietary Media Buying Analysis</div>
        </div>
      </div>
    </div>
  );
};
