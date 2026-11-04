import React, { useState } from 'react';
import { Campaign, CurrencyCode, Language, CampaignObjective, CampaignStatus } from '../types/ads';
import { translations } from '../translations';
import { calculateAdMetrics, formatCurrency, formatNumber, formatPercent } from '../utils/calculator';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Flame,
  ArrowUpRight,
  ExternalLink,
  Info
} from 'lucide-react';

interface CampaignTrackerViewProps {
  campaigns: Campaign[];
  setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
  currency: CurrencyCode;
  lang: Language;
  autoTrackActive: boolean;
  setAutoTrackActive: (active: boolean) => void;
  onSimulateTick: () => void;
  onOpenNewCampaign: () => void;
  onSelectCampaignForReport: (campaign: Campaign) => void;
}

export const CampaignTrackerView: React.FC<CampaignTrackerViewProps> = ({
  campaigns,
  setCampaigns,
  currency,
  lang,
  autoTrackActive,
  setAutoTrackActive,
  onSimulateTick,
  onOpenNewCampaign,
  onSelectCampaignForReport,
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [objectiveFilter, setObjectiveFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'spend' | 'roas' | 'conversions' | 'cpa'>('roas');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  // Filtered and sorted campaigns
  const filteredCampaigns = campaigns
    .filter((cmp) => {
      const matchesSearch = cmp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesObjective = objectiveFilter === 'all' || cmp.objective === objectiveFilter;
      
      const calc = calculateAdMetrics(cmp.metrics);
      const matchesStatus = statusFilter === 'all' || calc.healthStatus === statusFilter;
      return matchesSearch && matchesObjective && matchesStatus;
    })
    .sort((a, b) => {
      const calcA = calculateAdMetrics(a.metrics);
      const calcB = calculateAdMetrics(b.metrics);
      if (sortBy === 'roas') return calcB.roas - calcA.roas;
      if (sortBy === 'spend') return b.metrics.spend - a.metrics.spend;
      if (sortBy === 'conversions') return b.metrics.conversions - a.metrics.conversions;
      if (sortBy === 'cpa') return calcA.cpa - calcB.cpa;
      return 0;
    });

  // Aggregate Account Metrics
  const aggregate = campaigns.reduce(
    (acc, cur) => {
      acc.spend += cur.metrics.spend || 0;
      acc.revenue += cur.metrics.revenue || 0;
      acc.impressions += cur.metrics.impressions || 0;
      acc.reach += cur.metrics.reach || 0;
      acc.clicks += cur.metrics.clicks || 0;
      acc.conversions += cur.metrics.conversions || 0;
      acc.cogs += cur.metrics.cogs || 0;
      return acc;
    },
    { spend: 0, revenue: 0, impressions: 0, reach: 0, clicks: 0, conversions: 0, cogs: 0 }
  );

  const aggregateCalc = calculateAdMetrics(aggregate);

  // Campaign management actions
  const togglePause = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus: CampaignStatus = c.status === 'paused' ? 'active' : 'paused';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const duplicateCampaign = (campaign: Campaign) => {
    const clone: Campaign = {
      ...campaign,
      id: `cmp-${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      lastUpdated: 'Just now',
    };
    setCampaigns((prev) => [clone, ...prev]);
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    if (selectedCampaignId === id) setSelectedCampaignId(null);
  };

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId);
  const selectedCalc = selectedCampaign ? calculateAdMetrics(selectedCampaign.metrics) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* View Header with Auto-Track Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {lang === 'en' ? 'Live Campaign Performance Tracker' : 'লাইভ ক্যাম্পেইন পারফরম্যান্স ট্র্যাকার'}
            </h1>
            {autoTrackActive && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-Tracking Live</span>
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {lang === 'en'
              ? 'Real-time performance monitoring, automated ad fatigue diagnostics, and conversion pacing.'
              : 'সব ক্যাম্পেইনের পারফরম্যান্স স্বয়ংক্রিয়ভাবে ট্র্যাক ও পর্যবেক্ষণ করুন।'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setAutoTrackActive(!autoTrackActive)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
              autoTrackActive
                ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {autoTrackActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.actions.autoTrackStop}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.actions.autoTrackStart}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onSimulateTick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
            title="Simulate 1 hour of traffic & sales pacing"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>{t.actions.simulateTick}</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewCampaign}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.actions.newCampaign}</span>
          </button>
        </div>
      </div>

      {/* Account KPI Banner (Aggregated Across All Campaigns) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Spend */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {t.metrics.spend}
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(aggregate.spend, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {campaigns.length} total campaigns
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {t.metrics.revenue}
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(aggregate.revenue, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            From {aggregate.conversions} orders/leads
          </div>
        </div>

        {/* Blended ROAS */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Blended ROAS
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums flex items-baseline gap-1">
            <span className={aggregateCalc.roas >= 2.0 ? 'text-emerald-600' : 'text-slate-900'}>
              {aggregateCalc.roas.toFixed(2)}x
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Target Break-even: ~2.2x
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {t.metrics.netProfit}
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            <span className={aggregateCalc.netAdProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
              {formatCurrency(aggregateCalc.netAdProfit, currency)}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            After ads & estimated COGS
          </div>
        </div>

        {/* Blended CPA & CTR */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 col-span-2 md:col-span-1">
          <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Blended CPA / CTR
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
            {formatCurrency(aggregateCalc.cpa, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            CTR: {formatPercent(aggregateCalc.ctr)}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'en' ? 'Search campaigns...' : 'ক্যাম্পেইন খুঁজুন...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Segmented Controls / Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Objective Filter */}
          <select
            value={objectiveFilter}
            onChange={(e) => setObjectiveFilter(e.target.value)}
            className="text-xs font-medium px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
          >
            <option value="all">{lang === 'en' ? 'All Objectives' : 'সব অবজেক্টিভ'}</option>
            <option value="sales">Sales</option>
            <option value="leads">Leads</option>
            <option value="messages">Messages / WhatsApp</option>
            <option value="traffic">Traffic</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
          >
            <option value="all">{lang === 'en' ? 'All Health Status' : 'সব স্ট্যাটাস'}</option>
            <option value="scaling">Scaling Winner</option>
            <option value="active">Active & Stable</option>
            <option value="fatigue_warning">Fatigue Alert</option>
            <option value="low_roas">Low ROAS</option>
            <option value="learning">Learning Phase</option>
            <option value="paused">Paused</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-medium px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none"
          >
            <option value="roas">Sort: Highest ROAS</option>
            <option value="spend">Sort: Highest Spend</option>
            <option value="conversions">Sort: Most Conversions</option>
            <option value="cpa">Sort: Lowest CPA</option>
          </select>
        </div>
      </div>

      {/* Campaigns Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-3">Objective</th>
                <th className="py-3 px-3 text-right">Spend</th>
                <th className="py-3 px-3 text-right">Frequency</th>
                <th className="py-3 px-3 text-right">CPM</th>
                <th className="py-3 px-3 text-right">CTR</th>
                <th className="py-3 px-3 text-right">Results</th>
                <th className="py-3 px-3 text-right">CPA</th>
                <th className="py-3 px-3 text-right">ROAS</th>
                <th className="py-3 px-3">Health Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    {lang === 'en'
                      ? 'No campaigns found matching the filter.'
                      : 'কোন ক্যাম্পেইন পাওয়া যায়নি।'}
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((cmp) => {
                  const calc = calculateAdMetrics(cmp.metrics);
                  const isSelected = cmp.id === selectedCampaignId;

                  return (
                    <tr
                      key={cmp.id}
                      onClick={() => setSelectedCampaignId(isSelected ? null : cmp.id)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Name & Note */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate">{cmp.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">
                          Budget: {formatCurrency(cmp.budgetAmount, currency)}/day · updated {cmp.lastUpdated || 'recently'}
                        </div>
                      </td>

                      {/* Objective */}
                      <td className="py-3 px-3">
                        <span className="text-slate-600 font-medium capitalize">
                          {cmp.objective.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Spend */}
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 tabular-nums">
                        {formatCurrency(cmp.metrics.spend, currency)}
                      </td>

                      {/* Frequency */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums">
                        <span
                          className={
                            calc.frequency >= 3.5
                              ? 'text-amber-600 font-bold'
                              : 'text-slate-700'
                          }
                        >
                          {calc.frequency.toFixed(2)}
                        </span>
                      </td>

                      {/* CPM */}
                      <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                        {formatCurrency(calc.cpm, currency)}
                      </td>

                      {/* CTR */}
                      <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                        <span className={calc.ctr >= 2.0 ? 'text-emerald-600 font-semibold' : ''}>
                          {formatPercent(calc.ctr)}
                        </span>
                      </td>

                      {/* Results / Conversions */}
                      <td className="py-3 px-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                        {cmp.metrics.conversions}
                      </td>

                      {/* CPA */}
                      <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                        {formatCurrency(calc.cpa, currency)}
                      </td>

                      {/* ROAS */}
                      <td className="py-3 px-3 text-right font-mono font-bold tabular-nums">
                        <span
                          className={
                            calc.roas >= 3.0
                              ? 'text-emerald-600'
                              : calc.roas >= calc.breakEvenRoas
                              ? 'text-blue-600'
                              : 'text-rose-600'
                          }
                        >
                          {calc.roas.toFixed(2)}x
                        </span>
                      </td>

                      {/* Health Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                            calc.healthStatus === 'scaling'
                              ? 'bg-emerald-50 text-emerald-700'
                              : calc.healthStatus === 'fatigue_warning'
                              ? 'bg-amber-50 text-amber-700'
                              : calc.healthStatus === 'low_roas'
                              ? 'bg-rose-50 text-rose-700'
                              : calc.healthStatus === 'learning'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {t.status[calc.healthStatus] || calc.healthStatus}
                        </span>
                      </td>

                      {/* Row Action Buttons */}
                      <td className="py-3 px-4 text-center">
                        <div
                          className="flex items-center justify-center gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Pause / Play */}
                          <button
                            type="button"
                            onClick={() => togglePause(cmp.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title={cmp.status === 'paused' ? 'Resume Campaign' : 'Pause Campaign'}
                          >
                            {cmp.status === 'paused' ? (
                              <Play className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Pause className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            onClick={() => duplicateCampaign(cmp)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Duplicate Campaign"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => deleteCampaign(cmp.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Campaign Deep-Dive Drawer (When a campaign is clicked) */}
      {selectedCampaign && selectedCalc && (
        <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Campaign Deep Dive
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-mono">ID: {selectedCampaign.id}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedCampaign.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSelectCampaignForReport(selectedCampaign)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
              >
                <span>Include in Report</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Metric Highlights Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">Impressions</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatNumber(selectedCampaign.metrics.impressions)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">Reach</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatNumber(selectedCampaign.metrics.reach)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">Clicks</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatNumber(selectedCampaign.metrics.clicks)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">Revenue</div>
              <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
                {formatCurrency(selectedCampaign.metrics.revenue, currency)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">Net Profit</div>
              <div className="text-sm font-bold font-mono text-emerald-600 mt-0.5">
                {formatCurrency(selectedCalc.netAdProfit, currency)}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="text-[11px] text-slate-500">Health Score</div>
              <div className="text-sm font-bold font-mono text-blue-600 mt-0.5">
                {selectedCalc.healthScore}/100
              </div>
            </div>
          </div>

          {/* Diagnosis & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-lg space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Audited Diagnosis
              </h3>
              {selectedCalc.diagnosis.map((d, i) => (
                <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">·</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50/50 rounded-lg space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
                Action Plan & Scaling Advice
              </h3>
              {selectedCalc.recommendations.map((r, i) => (
                <div key={i} className="text-xs text-slate-800 flex items-start gap-1.5 font-medium">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
