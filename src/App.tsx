import React, { useState, useEffect } from 'react';
import { Campaign, CurrencyCode, Language, AdMetrics } from './types/ads';
import { INITIAL_CAMPAIGNS } from './data/sampleCampaigns';
import { simulateCampaignAutoTrackStep } from './utils/calculator';
import { Header } from './components/Header';
import { AdsCalculatorView } from './components/AdsCalculatorView';
import { CampaignTrackerView } from './components/CampaignTrackerView';
import { ReportBuilderView } from './components/ReportBuilderView';
import { TargetPlannerView } from './components/TargetPlannerView';
import { FormulasGuideView } from './components/FormulasGuideView';
import { NewCampaignModal } from './components/NewCampaignModal';
import { AndroidAppModal } from './components/AndroidAppModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'calculator' | 'tracker' | 'report' | 'planner' | 'formulas'>('calculator');
  
  // Currency & Language
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [lang, setLang] = useState<Language>('bn'); // Default to Bengali since user requested in Bangla!

  // Campaigns State with LocalStorage Persistence
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const stored = localStorage.getItem('metapulse_campaigns');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to load campaigns from storage:', e);
    }
    return INITIAL_CAMPAIGNS;
  });

  // Save to localStorage whenever campaigns change
  useEffect(() => {
    try {
      localStorage.setItem('metapulse_campaigns', JSON.stringify(campaigns));
    } catch (e) {
      console.error('Failed to persist campaigns:', e);
    }
  }, [campaigns]);

  // Auto-Tracking Live Interval Simulation
  const [autoTrackActive, setAutoTrackActive] = useState<boolean>(false);

  useEffect(() => {
    if (!autoTrackActive) return;

    const interval = setInterval(() => {
      setCampaigns((prev) => {
        if (prev.length === 0) return prev;
        // Pick one active campaign to simulate delivery for this pacing cycle
        const activeOnly = prev.filter((c) => c.status !== 'paused');
        if (activeOnly.length === 0) return prev;

        const targetCampaign = activeOnly[Math.floor(Math.random() * activeOnly.length)];
        const updatedMetrics = simulateCampaignAutoTrackStep(targetCampaign.metrics);

        return prev.map((c) =>
          c.id === targetCampaign.id
            ? { ...c, metrics: updatedMetrics, lastUpdated: 'Just now' }
            : c
        );
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [autoTrackActive]);

  // Manual simulation tick button
  const handleSimulateTick = () => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.status === 'paused') return c;
        return {
          ...c,
          metrics: simulateCampaignAutoTrackStep(c.metrics),
          lastUpdated: 'Just now',
        };
      })
    );
  };

  // Add campaign from calculator directly
  const handleSaveCalculatorAsCampaign = (name: string, metrics: AdMetrics) => {
    const newCamp: Campaign = {
      id: `cmp-${Date.now()}`,
      name,
      objective: 'sales',
      budgetType: 'daily',
      budgetAmount: Math.round(metrics.spend / 7) || 50,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      metrics,
      notes: 'Added from MetaPulse Ads Calculator.',
      lastUpdated: 'Just now',
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  // New Campaign Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  const handleAddNewCampaign = (newCamp: Campaign) => {
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  const handleSelectCampaignForReport = (campaign: Campaign) => {
    setActiveTab('report');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Bar Header strictly conforming to contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        lang={lang}
        setLang={setLang}
        onOpenNewCampaign={() => setIsNewModalOpen(true)}
        onOpenAndroid={() => setIsAndroidModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'calculator' && (
          <AdsCalculatorView
            currency={currency}
            lang={lang}
            onSaveAsCampaign={handleSaveCalculatorAsCampaign}
          />
        )}

        {activeTab === 'tracker' && (
          <CampaignTrackerView
            campaigns={campaigns}
            setCampaigns={setCampaigns}
            currency={currency}
            lang={lang}
            autoTrackActive={autoTrackActive}
            setAutoTrackActive={setAutoTrackActive}
            onSimulateTick={handleSimulateTick}
            onOpenNewCampaign={() => setIsNewModalOpen(true)}
            onSelectCampaignForReport={handleSelectCampaignForReport}
          />
        )}

        {activeTab === 'report' && (
          <ReportBuilderView
            campaigns={campaigns}
            currency={currency}
            lang={lang}
          />
        )}

        {activeTab === 'planner' && (
          <TargetPlannerView
            currency={currency}
            lang={lang}
          />
        )}

        {activeTab === 'formulas' && (
          <FormulasGuideView
            lang={lang}
          />
        )}
      </main>

      {/* Modal for adding new campaigns */}
      <NewCampaignModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddCampaign={handleAddNewCampaign}
        currency={currency}
        lang={lang}
      />

      {/* Modal for Android installation & APK project generation */}
      <AndroidAppModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}
