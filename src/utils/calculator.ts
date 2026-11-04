import { AdMetrics, CalculatedMetrics, CampaignStatus, TargetGoalInput, TargetGoalOutput } from '../types/ads';

export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1 },
  BDT: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rateToUSD: 120 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.78 },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 85 },
} as const;

export function formatCurrency(amount: number, currency: keyof typeof CURRENCIES = 'USD'): string {
  const symbol = CURRENCIES[currency]?.symbol || '$';
  const formatted = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

export function formatNumber(num: number, decimals: number = 0): string {
  if (num === undefined || isNaN(num)) return '0';
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(num: number, decimals: number = 2): string {
  if (num === undefined || isNaN(num)) return '0%';
  return `${num.toFixed(decimals)}%`;
}

export function calculateAdMetrics(
  metrics: AdMetrics,
  marginPercent: number = 45
): CalculatedMetrics {
  const spend = Math.max(0, metrics.spend || 0);
  const impressions = Math.max(0, metrics.impressions || 0);
  const reach = Math.max(0, metrics.reach || (impressions > 0 ? Math.round(impressions * 0.75) : 0));
  const clicks = Math.max(0, metrics.clicks || 0);
  const conversions = Math.max(0, metrics.conversions || 0);
  
  // Calculate or infer revenue
  let revenue = metrics.revenue || 0;
  let aov = metrics.aov || 0;
  if (conversions > 0) {
    if (revenue > 0 && aov === 0) {
      aov = revenue / conversions;
    } else if (aov > 0 && revenue === 0) {
      revenue = conversions * aov;
    } else if (revenue > 0 && aov > 0) {
      // both given
    }
  }

  // Cost of goods sold / product cost
  const cogs = metrics.cogs !== undefined 
    ? metrics.cogs 
    : (revenue * (1 - (marginPercent / 100)));

  // Derived metrics
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : 0;
  const cpc = clicks > 0 ? spend / clicks : 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const frequency = reach > 0 ? impressions / reach : (impressions > 0 ? 1 : 0);
  const cvr = clicks > 0 ? (conversions / clicks) * 100 : 0;
  const cpa = conversions > 0 ? spend / conversions : 0;
  const roas = spend > 0 ? revenue / spend : 0;

  // Break-even math
  const effectiveMargin = Math.max(1, Math.min(99, marginPercent));
  const breakEvenRoas = 100 / effectiveMargin;
  const breakEvenCpa = (aov > 0 ? aov : 50) * (effectiveMargin / 100);

  const grossProfit = revenue - cogs;
  const netAdProfit = revenue - spend - cogs;
  const profitMarginPercent = revenue > 0 ? (netAdProfit / revenue) * 100 : 0;

  // Video rates if available
  const hookRate = (metrics.threeSecVideoViews && impressions > 0)
    ? (metrics.threeSecVideoViews / impressions) * 100
    : undefined;

  // Health diagnosis & scoring
  let score = 70;
  const diagnosis: string[] = [];
  const recommendations: string[] = [];

  // 1. ROAS & Profitability Audit
  if (spend > 0) {
    if (roas >= breakEvenRoas * 1.35) {
      score += 15;
      diagnosis.push(`High Profitability: Current ROAS (${roas.toFixed(2)}x) is well above Break-even (${breakEvenRoas.toFixed(2)}x).`);
      recommendations.push('Campaign is a winner! Gradually increase daily budget by 15-20% every 48-72 hours.');
    } else if (roas >= breakEvenRoas) {
      score += 5;
      diagnosis.push(`Profitable: Operating above break-even margin (${roas.toFixed(2)}x vs ${breakEvenRoas.toFixed(2)}x).`);
      recommendations.push('Maintain budget. Test fresh creative hooks to push ROAS higher.');
    } else if (revenue > 0) {
      score -= 20;
      diagnosis.push(`Unprofitable: ROAS (${roas.toFixed(2)}x) is below break-even (${breakEvenRoas.toFixed(2)}x). Losing net money.`);
      recommendations.push('Target CPA is too high. Pause underperforming ad sets and improve website checkout conversion.');
    } else if (conversions === 0 && spend > 30) {
      score -= 25;
      diagnosis.push('Zero Conversions: Spent budget without recording results.');
      recommendations.push('Check Meta Pixel / CAPI event tracking, test audience alignment, and verify landing page functionality.');
    }
  }

  // 2. Frequency & Creative Fatigue Audit
  if (frequency >= 3.8) {
    score -= 15;
    diagnosis.push(`Severe Ad Fatigue: Frequency is ${frequency.toFixed(2)} (audience has seen this ad ~4 times).`);
    recommendations.push('Urgent: Refresh creatives, introduce new video hooks, or expand lookalike/broad audience size.');
  } else if (frequency >= 2.8) {
    score -= 5;
    diagnosis.push(`Approaching Fatigue: Frequency is ${frequency.toFixed(2)}.`);
    recommendations.push('Prepare replacement creative variations before CTR drops significantly.');
  } else {
    diagnosis.push(`Healthy Frequency: Audience saturation is low (${frequency.toFixed(2)}).`);
  }

  // 3. Click-Through Rate (CTR) Audit
  if (impressions > 500) {
    if (ctr >= 2.0) {
      score += 10;
      diagnosis.push(`Strong Ad Engagement: CTR is ${ctr.toFixed(2)}% (benchmark is 1.0-1.5%).`);
    } else if (ctr < 0.8) {
      score -= 10;
      diagnosis.push(`Low CTR: ${ctr.toFixed(2)}% indicates ad hook/creative is not capturing attention in the feed.`);
      recommendations.push('Improve thumb-stop rate: test high-contrast visual hooks in the first 3 seconds and punchy copy.');
    }
  }

  // Determine health status
  let healthStatus: CampaignStatus = 'active';
  if (spend === 0) {
    healthStatus = 'paused';
  } else if (frequency >= 3.5) {
    healthStatus = 'fatigue_warning';
  } else if (roas < breakEvenRoas && conversions > 0) {
    healthStatus = 'low_roas';
  } else if (conversions < 10 && spend < 100) {
    healthStatus = 'learning';
  } else if (roas >= breakEvenRoas * 1.3 && frequency < 2.6) {
    healthStatus = 'scaling';
  }

  const boundedScore = Math.max(10, Math.min(99, score));

  return {
    cpm,
    cpc,
    ctr,
    frequency,
    cvr,
    cpa,
    aov,
    roas,
    breakEvenRoas,
    breakEvenCpa,
    grossProfit,
    netAdProfit,
    profitMarginPercent,
    hookRate,
    healthStatus,
    healthScore: boundedScore,
    diagnosis,
    recommendations,
  };
}

export function solveTargetGoal(input: TargetGoalInput): TargetGoalOutput {
  const {
    targetRevenue,
    targetConversions,
    aov,
    expectedCtr,
    expectedCpc,
    expectedCvr,
    profitMarginPercent,
  } = input;

  // Resolve target conversions from target revenue if given
  let conversions = targetConversions;
  let revenue = targetRevenue;
  const effectiveAov = aov > 0 ? aov : 50;

  if (revenue > 0 && conversions <= 0) {
    conversions = Math.ceil(revenue / effectiveAov);
  } else if (conversions > 0 && revenue <= 0) {
    revenue = conversions * effectiveAov;
  }

  const cvrRate = (expectedCvr > 0 ? expectedCvr : 2.5) / 100;
  const ctrRate = (expectedCtr > 0 ? expectedCtr : 1.5) / 100;
  const cpc = expectedCpc > 0 ? expectedCpc : 0.65;

  const requiredClicks = cvrRate > 0 ? Math.ceil(conversions / cvrRate) : 0;
  const requiredSpend = requiredClicks * cpc;
  const requiredImpressions = ctrRate > 0 ? Math.ceil(requiredClicks / ctrRate) : 0;

  const expectedRoas = requiredSpend > 0 ? revenue / requiredSpend : 0;
  const cogs = revenue * (1 - (profitMarginPercent / 100));
  const expectedNetProfit = revenue - requiredSpend - cogs;
  const maxAllowableCpa = effectiveAov * (profitMarginPercent / 100);

  return {
    requiredSpend,
    requiredClicks,
    requiredImpressions,
    expectedRevenue: revenue,
    expectedRoas,
    expectedNetProfit,
    maxAllowableCpa,
  };
}

export function simulateCampaignAutoTrackStep(metrics: AdMetrics): AdMetrics {
  // Realistic increment simulating 1 hour of live Facebook ad pacing
  const baseImpressions = Math.max(100, Math.round(metrics.impressions * 0.035 + (Math.random() * 80 + 20)));
  const ctrVariance = (Math.random() * 0.4 - 0.2); // slight natural variance
  const estimatedCtr = metrics.impressions > 0 
    ? Math.max(0.5, (metrics.clicks / metrics.impressions) * 100 + ctrVariance) 
    : 1.4;
  const newClicks = Math.max(1, Math.round((baseImpressions * estimatedCtr) / 100));

  const currentCpm = metrics.impressions > 0 ? (metrics.spend / metrics.impressions) * 1000 : 12.5;
  const addedSpend = Number(((baseImpressions / 1000) * currentCpm).toFixed(2));

  const currentCvr = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 2.2;
  const conversionChance = (newClicks * (currentCvr / 100));
  const addedConversions = Math.random() < (conversionChance % 1) 
    ? Math.floor(conversionChance) + 1 
    : Math.floor(conversionChance);

  const aov = metrics.conversions > 0 && metrics.revenue > 0 
    ? (metrics.revenue / metrics.conversions) 
    : 45;
  const addedRevenue = addedConversions * aov;

  return {
    ...metrics,
    spend: Number((metrics.spend + addedSpend).toFixed(2)),
    impressions: metrics.impressions + baseImpressions,
    reach: metrics.reach + Math.round(baseImpressions * 0.8),
    clicks: metrics.clicks + newClicks,
    conversions: metrics.conversions + addedConversions,
    revenue: Number((metrics.revenue + addedRevenue).toFixed(2)),
  };
}
