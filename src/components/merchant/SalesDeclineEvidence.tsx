/**
 * SalesDeclineEvidence.tsx
 * Deep-dive business evidence panel:
 * Breaks down Customer Churn, Inventory Stagnation (locked capital & days on hand),
 * and Competitor Price Parity pressure.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { X, Users, Package, AlertCircle, TrendingDown, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  evidence: any;
  onProceedToDecisionTwin: () => void;
}

export function SalesDeclineEvidence({
  isOpen,
  onClose,
  evidence,
  onProceedToDecisionTwin,
}: Props) {
  if (!isOpen || !evidence) return null;

  const { customerChurn, inventoryStagnation, marketDynamics } = evidence;
  const totalLockedCapital = inventoryStagnation.reduce(
    (acc: number, curr: any) => acc + curr.lockedCapital,
    0
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
    >
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <div>
              <h2 id="evidence-modal-title" className="text-base font-bold text-white">
                Supporting Business Evidence: -18.4% Sales Decline Root Causes
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Attestor Evidence Chain &middot; Multi-Variant Diagnostic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close evidence modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evidence Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          {/* Executive Summary */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            <strong>Diagnostic Synthesis:</strong> The sales decline is not caused by generic market contraction. Rather, it is concentrated in two causal vectors: <span className="text-rose-400 font-semibold">a 24.2% drop in repeat customer purchasing</span> and <span className="text-amber-400 font-semibold">₹3,18,000 in working capital trapped in stagnant ANC audio &amp; charging inventory</span>.
          </div>

          {/* Three Evidence Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Customer Churn Vector */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wide mb-2">
                  <Users className="w-4 h-4" />
                  01. Customer Retention Dip
                </div>
                <div className="text-2xl font-bold text-white font-mono">
                  1,240 <span className="text-xs text-slate-400 font-normal">Inactive VIPs</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Repeat customer rate slipped from 24.5% down to 18.6%. Customers who bought in the last 90 days have gone dormant for over 38 days.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Segment: High-LTV Tech Buyers
              </div>
            </div>

            {/* 2. Dead-Stock Inventory Lockup */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wide mb-2">
                  <Package className="w-4 h-4" />
                  02. Working Capital Trapped
                </div>
                <div className="text-2xl font-bold text-amber-400 font-mono">
                  ₹{(totalLockedCapital / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-normal">in dead-stock</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Inventory days on hand reached 68 days (target &lt; 30). Accumulating monthly storage and interest holding penalties of ~₹18,500/month.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                610 units stagnant across 3 SKUs
              </div>
            </div>

            {/* 3. Conversion & Price Parity */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-2">
                  <TrendingDown className="w-4 h-4" />
                  03. Conversion Compression
                </div>
                <div className="text-2xl font-bold text-white font-mono">
                  2.38% <span className="text-xs text-rose-400 font-normal">from 3.75%</span>
                </div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Direct store traffic conversion fell by 137 bps as third-party marketplace competitors undercut standalone pricing by 11.8%.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                Price Parity Delta: -11.8%
              </div>
            </div>
          </div>

          {/* Stagnant SKU Inventory Table */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Detailed Stagnant SKU Inventory Audit
            </h3>
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono">
                    <th className="p-3">SKU</th>
                    <th className="p-3">Product Name</th>
                    <th className="p-3 text-right">Units in Stock</th>
                    <th className="p-3 text-right">Days on Hand</th>
                    <th className="p-3 text-right">Locked Capital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {inventoryStagnation.map((item: any) => (
                    <tr key={item.sku} className="hover:bg-slate-900/50">
                      <td className="p-3 font-semibold text-indigo-300">{item.sku}</td>
                      <td className="p-3 text-white font-sans">{item.name}</td>
                      <td className="p-3 text-right">{item.units}</td>
                      <td className="p-3 text-right text-amber-400">{item.daysOnHand}d</td>
                      <td className="p-3 text-right font-bold text-white">
                        ₹{item.lockedCapital.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={() => {
              onClose();
              onProceedToDecisionTwin();
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg transition-colors flex items-center gap-2"
          >
            <span>Proceed to Decision Twin Simulation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
