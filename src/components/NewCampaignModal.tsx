import React, { useState } from 'react';
import { Campaign, CurrencyCode, Language, CampaignObjective } from '../types/ads';
import { translations } from '../translations';
import { calculateAdMetrics, formatCurrency } from '../utils/calculator';
import { X, Plus, Calculator, Check } from 'lucide-react';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (campaign: Campaign) => void;
  currency: CurrencyCode;
  lang: Language;
}

export const NewCampaignModal: React.FC<NewCampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCampaign,
  currency,
  lang,
}) => {
  const t = translations[lang];

  const [name, setName] = useState('');
  const [objective, setObjective] = useState<CampaignObjective>('sales');
  const [budgetAmount, setBudgetAmount] = useState<number>(50);
  const [spend, setSpend] = useState<number>(350);
  const [impressions, setImpressions] = useState<number>(28000);
  const [reach, setReach] = useState<number>(20000);
  const [clicks, setClicks] = useState<number>(560);
  const [conversions, setConversions] = useState<number>(24);
  const [revenue, setRevenue] = useState<number>(1440);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const currentMetrics = {
    spend,
    impressions,
    reach,
    clicks,
    conversions,
    revenue,
  };
  const preview = calculateAdMetrics(currentMetrics);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      name: name.trim() || 'New Facebook Campaign',
      objective,
      budgetType: 'daily',
      budgetAmount,
      startDate: new Date().toISOString().split('T')[0],
      status: preview.healthStatus,
      metrics: {
        spend,
        impressions,
        reach,
        clicks,
        conversions,
        revenue,
        aov: conversions > 0 ? Number((revenue / conversions).toFixed(2)) : 0,
        cogs: revenue * 0.45,
      },
      notes: notes.trim(),
      lastUpdated: 'Just now',
    };

    onAddCampaign(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              {lang === 'en' ? 'Add Facebook Ad Campaign' : 'নতুন ক্যাম্পেইন যোগ করুন'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Campaign Name */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Campaign Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Advantage+ Shopping - Bangladesh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Objective & Daily Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Campaign Objective</label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value as CampaignObjective)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
              >
                <option value="sales">Sales (E-Commerce)</option>
                <option value="leads">Leads</option>
                <option value="messages">Messages / WhatsApp</option>
                <option value="traffic">Traffic</option>
                <option value="engagement">Engagement</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Daily Budget ({currency})</label>
              <input
                type="number"
                min="1"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(Number(e.target.value))}
                className="w-full font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Metrics Inputs */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
            <span className="font-semibold text-slate-700 block uppercase tracking-wider text-[11px]">
              Actual Performance Data
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600">Total Spend ({currency})</label>
                <input
                  type="number"
                  min="0"
                  value={spend}
                  onChange={(e) => setSpend(Number(e.target.value))}
                  className="w-full font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600">Total Revenue ({currency})</label>
                <input
                  type="number"
                  min="0"
                  value={revenue}
                  onChange={(e) => setRevenue(Number(e.target.value))}
                  className="w-full font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600">Impressions</label>
                <input
                  type="number"
                  min="0"
                  value={impressions}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setImpressions(val);
                    if (reach > val) setReach(Math.round(val * 0.75));
                  }}
                  className="w-full font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600">Reach</label>
                <input
                  type="number"
                  min="0"
                  value={reach}
                  onChange={(e) => setReach(Number(e.target.value))}
                  className="w-full font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600">Clicks</label>
                <input
                  type="number"
                  min="0"
                  value={clicks}
                  onChange={(e) => setClicks(Number(e.target.value))}
                  className="w-full font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600">Conversions / Orders</label>
                <input
                  type="number"
                  min="0"
                  value={conversions}
                  onChange={(e) => setConversions(Number(e.target.value))}
                  className="w-full font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Instant Auto-Computed Strip */}
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500">Predicted ROAS:</span>{' '}
              <strong className="font-mono text-blue-900">{preview.roas.toFixed(2)}x</strong>
            </div>
            <div>
              <span className="text-slate-500">CPA:</span>{' '}
              <strong className="font-mono text-slate-800">{formatCurrency(preview.cpa, currency)}</strong>
            </div>
            <div>
              <span className="text-slate-500">CTR:</span>{' '}
              <strong className="font-mono text-slate-800">{preview.ctr.toFixed(2)}%</strong>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Notes / Strategy</label>
            <textarea
              rows={2}
              placeholder="e.g. Targeting lookalike 1-3% with carousel creative"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-semibold transition-colors"
            >
              {lang === 'en' ? 'Save & Start Tracking' : 'সংরক্ষণ ও ট্র্যাকিং শুরু করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
