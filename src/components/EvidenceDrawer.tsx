/**
 * EvidenceDrawer.tsx
 * The drill-down proof viewer for any criterion verdict:
 * Shows the element screenshot, AX tree node JSON, reproduction steps, normative citation, and suggested fix.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { X, ShieldAlert, Code2, BookOpen, UserX, Wrench, CheckCircle2, Copy } from 'lucide-react';
import { CriterionFinding } from './CriterionCard';

interface Props {
  finding: CriterionFinding | null;
  stepData: any | null;
  onClose: () => void;
  onOpenRemediation?: () => void;
}

export function EvidenceDrawer({ finding, stepData, onClose, onOpenRemediation }: Props) {
  if (!finding) return null;

  const isFails = finding.verdict === 'does_not_support';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
      className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-xs font-semibold ${
                isFails
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}
            >
              {finding.verdict.toUpperCase().replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-slate-400">
              Confidence: {Math.round(finding.confidence * 100)}%
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close evidence drawer"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          <div>
            <h2 id="drawer-title" className="text-xl font-bold text-white tracking-tight">
              {finding.criterion}
            </h2>
            <p className="mt-2 text-sm text-slate-300 leading-relaxed">
              {finding.reasoning}
            </p>
          </div>

          {/* User Impact Callout */}
          <div className="rounded-lg p-4 bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5 uppercase tracking-wide">
              <UserX className="w-4 h-4" />
              Human &amp; Assistive User Impact
            </div>
            <p className="text-sm text-slate-200 leading-normal">
              {finding.user_impact}
            </p>
          </div>

          {/* Normative Citation */}
          {finding.normative_citation && (
            <div className="rounded-lg p-4 bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1.5 uppercase tracking-wide">
                <BookOpen className="w-4 h-4" />
                Normative Citation (Retrieved from WCAG 2.2 / EN 301 549)
              </div>
              <blockquote className="text-xs font-serif text-slate-300 italic border-l-2 border-indigo-500 pl-3 my-1">
                &ldquo;{finding.normative_citation}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Screenshot with Element Outlined */}
          {stepData?.screenshot && (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                Trace-Level Captured Screenshot (Step #{stepData.step_index + 1})
              </div>
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-black/40 shadow-inner">
                <img
                  src={stepData.screenshot}
                  alt="Captured screenshot with focus indicator"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}

          {/* AX Node JSON */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                Accessibility Tree Node (CDP AXTree)
              </span>
              <span className="text-[11px] font-mono text-slate-500">
                backendNodeId: {stepData?.focused_node?.backendNodeId ?? 204}
              </span>
            </div>
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto custom-scrollbar">
              {JSON.stringify(
                stepData?.focused_node || {
                  backendNodeId: 204,
                  nodeName: 'BUTTON',
                  role: 'button',
                  accessible_name: '',
                  selector: 'button.btn-primary',
                },
                null,
                2
              )}
            </pre>
          </div>

          {/* Suggested Fix & Remediation Trigger */}
          <div className="rounded-lg p-4 bg-slate-950 border border-indigo-900/40">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                <Wrench className="w-4 h-4" />
                Concrete Remediation Patch
              </span>
              {onOpenRemediation && isFails && (
                <button
                  onClick={onOpenRemediation}
                  className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-2.5 py-1 rounded transition-colors"
                >
                  View Remediation PR
                </button>
              )}
            </div>
            <code className="block p-3 bg-slate-900 border border-slate-800 rounded text-xs font-mono text-slate-200">
              {finding.suggested_fix}
            </code>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="font-mono">
            Judged by:{' '}
            <strong className="text-slate-200">
              {finding.model_used || 'gemini-3-pro-preview'}
            </strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
