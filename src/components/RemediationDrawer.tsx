/**
 * RemediationDrawer.tsx
 * Demonstrates Milestone M6: Automated Remediation PR and Criterion Flip.
 * Shows unified Git diff and live re-verification trigger.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { GitPullRequest, Check, RefreshCw, X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyRemediation: () => void;
  isApplying: boolean;
  isRemediated: boolean;
}

export function RemediationDrawer({
  isOpen,
  onClose,
  onApplyRemediation,
  isApplying,
  isRemediated,
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pr-modal-title"
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
    >
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <GitPullRequest className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 id="pr-modal-title" className="text-base font-bold text-white">
                Pull Request #482: fix(a11y) checkout accessible name
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                branch: <code className="text-indigo-300">fix/checkout-accessible-name</code> &middot; target: <code className="text-slate-300">main</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close remediation modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Diff Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-4">
          <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
            <strong>Agent Analysis:</strong> Sighted users identify this button via its credit card icon. However, the DOM rendered <code className="text-rose-400">&lt;button className=&quot;btn-primary&quot;&gt;&lt;CreditCardIcon /&gt;&lt;/button&gt;</code> without inner text or an accessible name. Screen readers announce only <strong className="text-rose-400">&quot;button&quot;</strong>. This patch injects an accessible label specifying the exact payment total.
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-400 mb-2 font-mono flex items-center justify-between">
              <span>UNIFIED GIT PATCH</span>
              <span className="text-[11px] text-emerald-400 font-normal">+5 lines / -1 line</span>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed custom-scrollbar">
              <span className="text-slate-500">diff --git a/src/components/CheckoutPayment.tsx b/src/components/CheckoutPayment.tsx</span>{'\n'}
              <span className="text-slate-500">index 8e4b11f..b7194e8 100644</span>{'\n'}
              <span className="text-indigo-400">--- a/src/components/CheckoutPayment.tsx</span>{'\n'}
              <span className="text-indigo-400">+++ b/src/components/CheckoutPayment.tsx</span>{'\n'}
              <span className="text-cyan-400">@@ -42,7 +42,11 @@ export function CheckoutPayment() &#123;</span>{'\n'}
              <span className="text-slate-400">   return (</span>{'\n'}
              <span className="text-slate-400">     &lt;div className=&quot;payment-action-group&quot;&gt;</span>{'\n'}
              <span className="bg-red-950/80 text-red-300 block">-      &lt;button onClick=&#123;onConfirm&#125; className=&quot;btn-primary&quot;&gt;</span>
              <span className="bg-emerald-950/80 text-emerald-300 block">+      &lt;button</span>
              <span className="bg-emerald-950/80 text-emerald-300 block">+        onClick=&#123;onConfirm&#125;</span>
              <span className="bg-emerald-950/80 text-emerald-300 block">+        aria-label=&#123;`Pay now $&#36;&#123;amount.toFixed(2)&#125;`&#125;</span>
              <span className="bg-emerald-950/80 text-emerald-300 block">+        className=&quot;btn-primary&quot;</span>
              <span className="bg-emerald-950/80 text-emerald-300 block">+      &gt;</span>
              <span className="text-slate-400">         &lt;CreditCardIcon className=&quot;w-5 h-5&quot; /&gt;</span>{'\n'}
              <span className="text-slate-400">       &lt;/button&gt;</span>
            </pre>
          </div>

          {isRemediated && (
            <div className="flex items-center gap-3 p-4 bg-emerald-950/50 border border-emerald-800 rounded-lg text-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <strong className="font-semibold">Re-Attestation Succeeded:</strong>
                <p className="mt-0.5 text-emerald-300/90">
                  Criterion 4.1.2 flipped from <strong>Does Not Support</strong> to{' '}
                  <strong>Supports (100% confidence)</strong> on commit <code className="font-mono text-emerald-200">b7194e8</code>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>

          {!isRemediated ? (
            <button
              onClick={onApplyRemediation}
              disabled={isApplying}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-lg transition-all"
            >
              {isApplying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Applying Patch &amp; Re-verifying...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Merge PR &amp; Trigger Re-Run
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              View Conformance Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
