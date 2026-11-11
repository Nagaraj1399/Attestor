/**
 * CriterionCard.tsx
 * Bottom section of Live Run & Rows in Report View:
 * Displays single criterion verdict with confidence score, model badge, and evidence drawer trigger.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';

export interface CriterionFinding {
  criterion: string;
  verdict: 'supports' | 'partially_supports' | 'does_not_support' | 'not_applicable';
  confidence: number;
  reasoning: string;
  normative_citation: string;
  evidence_step_ids: number[];
  user_impact: string;
  suggested_fix: string;
  requires_human_review: boolean;
  model_used?: string;
  latency_ms?: number;
}

interface Props {
  finding: CriterionFinding;
  onOpenEvidence: (finding: CriterionFinding) => void;
  isCompact?: boolean;
}

export function CriterionCard({ finding, onOpenEvidence, isCompact = false }: Props) {
  const isSupports = finding.verdict === 'supports';
  const isFails = finding.verdict === 'does_not_support';
  const isPartial = finding.verdict === 'partially_supports';

  const verdictLabel = isSupports
    ? 'Supports'
    : isFails
    ? 'Does Not Support'
    : isPartial
    ? 'Partially Supports'
    : 'Not Applicable';

  const statusBg = isSupports
    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
    : isFails
    ? 'bg-red-950/60 text-red-300 border-red-800/80'
    : isPartial
    ? 'bg-amber-950/50 text-amber-300 border-amber-800/70'
    : 'bg-slate-800 text-slate-300 border-slate-700';

  const StatusIcon = isSupports ? CheckCircle2 : isFails ? XCircle : isPartial ? AlertCircle : HelpCircle;

  return (
    <div
      onClick={() => onOpenEvidence(finding)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenEvidence(finding);
        }
      }}
      className={`group relative text-left transition-all duration-200 border rounded-xl p-4 bg-slate-900/80 hover:bg-slate-800/90 cursor-pointer shadow-sm ${
        isFails
          ? 'border-red-900/70 hover:border-red-700'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Criterion Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold border ${statusBg}`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {verdictLabel}
            </span>

            {finding.requires_human_review && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-950 text-indigo-300 border border-indigo-800">
                Needs Human Review
              </span>
            )}

            <span className="text-[11px] text-slate-400 font-mono">
              {Math.round(finding.confidence * 100)}% Confidence
            </span>

            {finding.model_used && (
              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                {finding.model_used.includes('pro') ? 'Gemini 3 Pro' : 'Gemini 3 Flash'}
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-white tracking-tight truncate">
            {finding.criterion}
          </h3>

          {!isCompact && (
            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {finding.reasoning}
            </p>
          )}
        </div>

        {/* Evidence Link Trigger */}
        <div className="flex items-center gap-1 text-xs text-indigo-400 group-hover:text-indigo-300 transition-colors shrink-0">
          <span className="hidden sm:inline font-mono">Step #{finding.evidence_step_ids[0] ?? 0}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
