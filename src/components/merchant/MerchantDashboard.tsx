/**
 * MerchantDashboard.tsx
 * Professional Merchant Performance Dashboard
 * Displays core financial metrics (Revenue, Gross Profit, Expenses, Net Profit),
 * sales timeline with detected -18.4% decline anomaly, and quick triggers.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Package,
  Users,
  PieChart,
  ShieldAlert,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

interface Props {
  metrics: any;
  timeline: any[];
  onOpenEvidence: () => void;
  onOpenDecisionTwin: () => void;
  onOpenRealityCheck?: () => void;
  hasActiveCampaign: boolean;
}

export function MerchantDashboard({
  metrics,
  timeline,
  onOpenEvidence,
  onOpenDecisionTwin,
  onOpenRealityCheck,
  hasActiveCampaign,
}: Props) {
  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Top Welcome & Anomaly Kicker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400">
            <span>Merchant Business Twin &middot; Consumer Electronics Store</span>
            <span aria-hidden="true">&middot;</span>
            <span className="text-slate-400">Live POS &amp; Catalog Synced</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sales &amp; Financial Performance Console
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{metrics.period}</span>
        </div>
      </div>

      {/* Sales Decline Critical Alert Banner */}
      {metrics.declineAlert?.isDetected && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-950/70 via-slate-900 to-amber-950/40 border border-red-800/80 p-5 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-red-900/60 text-red-300 border border-red-700/60 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse text-red-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-900/80 text-red-200 uppercase tracking-wide">
                    Sales Decline Anomaly Detected
                  </span>
                  <span className="text-xs font-mono text-red-300">
                    -{metrics.declineAlert.dropPercent}% drop over last {metrics.declineAlert.windowDays} days
                  </span>
                </div>
                <h2 className="text-base font-bold text-white mt-1">
                  Revenue drop-off in {metrics.declineAlert.segment}
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Attestor Sentinel identified an 18.4% velocity drop driven by repeat customer churn and ₹3,18,000 locked in stagnant ANC Earbuds &amp; GaN Charger inventory.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={onOpenEvidence}
                className="px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap"
              >
                Inspect Evidence Chain
              </button>
              <button
                onClick={onOpenDecisionTwin}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                Launch Decision Twin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Financial Core KPI Cards (Distinct Revenue, Gross Profit, Expenses, Net Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Revenue */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Total Gross Revenue</span>
            <span className="text-rose-400 flex items-center gap-0.5 font-mono text-[11px]">
              <TrendingDown className="w-3.5 h-3.5" /> -18.4%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            ₹{metrics.revenue.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
            <span>Orders: {metrics.ordersCount.toLocaleString('en-IN')}</span>
            <span>AOV: ₹{metrics.averageOrderValue.toFixed(2)}</span>
          </div>
        </div>

        {/* 2. Gross Profit */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Gross Profit (after COGS)</span>
            <span className="text-emerald-400 font-mono text-[11px]">{metrics.grossMarginPercent}% margin</span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
            ₹{metrics.grossProfit.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
            Cost of Goods Sold: ₹{(metrics.revenue - metrics.grossProfit).toLocaleString('en-IN')}
          </div>
        </div>

        {/* 3. Operating Expenses */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Operating Expenses (OPEX)</span>
            <span className="text-slate-400 font-mono text-[11px]">Fixed + Logistics</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-300 font-mono tabular-nums">
            ₹{metrics.expenses.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
            Warehousing, ad spend &amp; gateway fees
          </div>
        </div>

        {/* 4. Net Profit */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>Net Operating Profit</span>
            <span className="text-indigo-400 font-mono text-[11px]">{metrics.netMarginPercent}% net margin</span>
          </div>
          <div className="text-2xl font-extrabold text-indigo-300 font-mono tabular-nums">
            ₹{metrics.netProfit.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
            Net = Gross Profit (₹4.29L) - OPEX (₹2.10L)
          </div>
        </div>
      </div>

      {/* 30-Day Sales Decline Timeline Breakdown */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide uppercase">
              30-Day Revenue &amp; Profit Trajectory
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Highlighting the drop in Days 21–30 where repeat purchase frequency plummeted.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-indigo-500" /> Revenue
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-emerald-500" /> Gross Profit
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded bg-slate-600" /> Expenses
            </span>
          </div>
        </div>

        {/* CSS Bar Chart with clear visual representation */}
        <div className="space-y-3 pt-2">
          {timeline.map((item, idx) => {
            const isDeclineWindow = idx >= 4;
            const revWidth = (item.revenue / 300000) * 100;
            const gpWidth = (item.grossProfit / 300000) * 100;

            return (
              <div key={item.day} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className={`font-medium ${isDeclineWindow ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                    {item.day} {isDeclineWindow && '(Decline Window)'}
                  </span>
                  <div className="flex items-center gap-3 text-slate-400">
                    <span>Rev: <strong className="text-white">₹{(item.revenue / 1000).toFixed(0)}k</strong></span>
                    <span>GP: <strong className="text-emerald-400">₹{(item.grossProfit / 1000).toFixed(1)}k</strong></span>
                    <span>Net: <strong className="text-indigo-300">₹{(item.netProfit / 1000).toFixed(1)}k</strong></span>
                  </div>
                </div>

                <div className="h-4 bg-slate-950 rounded overflow-hidden flex relative border border-slate-800">
                  <div
                    style={{ width: `${revWidth}%` }}
                    className={`h-full transition-all duration-500 ${
                      isDeclineWindow ? 'bg-gradient-to-r from-red-600 to-amber-600' : 'bg-indigo-600'
                    }`}
                  />
                  <div
                    style={{ width: `${gpWidth}%` }}
                    className="h-full bg-emerald-500/80 -ml-full opacity-60 pointer-events-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Campaign Status or Campaign History Trigger */}
      {hasActiveCampaign && onOpenRealityCheck && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <strong className="text-white text-sm block">Live Simulated Campaign Active</strong>
              <span>VIP Winback Bundle dispatched to 1,240 merchants. Reality Check evaluation ready.</span>
            </div>
          </div>
          <button
            onClick={onOpenRealityCheck}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
          >
            Open Reality Check
          </button>
        </div>
      )}
    </div>
  );
}
