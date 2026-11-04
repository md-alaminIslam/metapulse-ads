export type CurrencyCode = 'USD' | 'BDT' | 'EUR' | 'GBP' | 'INR';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUSD: number; // For rough conversion if needed
}

export type CampaignObjective = 
  | 'sales' 
  | 'leads' 
  | 'traffic' 
  | 'engagement' 
  | 'app_promotion'
  | 'messages';

export type CampaignStatus = 'active' | 'learning' | 'scaling' | 'fatigue_warning' | 'low_roas' | 'paused';

export interface AdMetrics {
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  linkClicks?: number;
  conversions: number;
  revenue: number;
  cogs?: number; // Cost of goods sold / product delivery cost
  aov?: number;  // Average order value
  threeSecVideoViews?: number;
}

export interface CalculatedMetrics {
  cpm: number;
  cpc: number;
  ctr: number;
  frequency: number;
  cvr: number;
  cpa: number;
  aov: number;
  roas: number;
  breakEvenRoas: number;
  breakEvenCpa: number;
  grossProfit: number;
  netAdProfit: number;
  profitMarginPercent: number;
  hookRate?: number; // (3-sec views / impressions) * 100
  holdRate?: number; // (100% views / 3-sec views) * 100
  healthStatus: CampaignStatus;
  healthScore: number; // 0 to 100
  diagnosis: string[];
  recommendations: string[];
}

export interface Campaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  budgetType: 'daily' | 'lifetime';
  budgetAmount: number;
  startDate: string;
  status: CampaignStatus;
  metrics: AdMetrics;
  notes?: string;
  lastUpdated?: string;
}

export interface TargetGoalInput {
  targetRevenue: number;
  targetConversions: number;
  aov: number;
  expectedCtr: number;
  expectedCpc: number;
  expectedCvr: number;
  profitMarginPercent: number;
}

export interface TargetGoalOutput {
  requiredSpend: number;
  requiredClicks: number;
  requiredImpressions: number;
  expectedRevenue: number;
  expectedRoas: number;
  expectedNetProfit: number;
  maxAllowableCpa: number;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  spend: number;
  cpm: number;
  ctr: number;
  cvr: number;
  aov: number;
  cogsPercent: number;
}

export type Language = 'en' | 'bn';
