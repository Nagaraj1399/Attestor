/**
 * LiveBrowser.tsx
 * Left panel of the Live Run split-view:
 * Renders the streamed browser screenshots with the active focus ring outlined in real-time.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Globe, Lock, ShieldCheck, Eye, Compass } from 'lucide-react';

interface StepData {
  step_index: number;
  url: string;
  action: { type: string; key?: string; target?: string };
  focused_node: {
    backendNodeId: number;
    nodeId: number;
    nodeName: string;
    role: string;
    accessible_name: string;
    selector: string;
    boundingBox?: { x: number; y: number; width: number; height: number };
  };
  computed_styles: {
    outline?: string;
    outlineColor?: string;
    outlineWidth?: string;
    outlineStyle?: string;
    boxShadow?: string;
  };
  screenshot?: string;
  is_bare_button?: boolean;
  is_trap_candidate?: boolean;
}

interface Props {
  currentStep: StepData | null;
  totalStepsCount: number;
  targetUrl: string;
  isLive: boolean;
}

export function LiveBrowser({ currentStep, totalStepsCount, targetUrl, isLive }: Props) {
  const node = currentStep?.focused_node;
  const bbox = node?.boundingBox;
  const isBare = currentStep?.is_bare_button;
  const isTrap = currentStep?.is_trap_candidate;

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Browser Chrome Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300">
          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate font-mono">{targetUrl || 'https://checkout.acme-cloud.internal'}</span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>CDP: Port 9222</span>
        </div>
      </div>

      {/* Viewport Canvas Container */}
      <div className="relative flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-hidden">
        {currentStep ? (
          <div className="relative max-w-full max-h-full border border-slate-800 rounded-lg shadow-2xl overflow-hidden bg-slate-900">
            {/* Viewport Screenshot or SVG canvas */}
            {currentStep.screenshot ? (
              <img
                src={currentStep.screenshot}
                alt={`Screenshot for step ${currentStep.step_index + 1}`}
                className="max-h-[520px] w-auto object-contain block"
              />
            ) : (
              /* Fallback interactive mockup rendering */
              <div className="w-[640px] h-[400px] bg-slate-900 p-8 flex flex-col justify-between">
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <h3 className="font-semibold text-white text-lg">Acme Cloud Checkout</h3>
                  <span className="text-xs text-slate-400">Total: $49.00 / month</span>
                </div>

                <div className="space-y-4 my-auto">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Billing Email
                    </label>
                    <input
                      readOnly
                      value="auditor@enterprise.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      className={`flex-1 py-2.5 px-4 rounded text-sm font-medium transition-all ${
                        isBare
                          ? 'bg-indigo-600 text-transparent relative ring-4 ring-rose-500'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {isBare ? ' ' : 'Pay now $49.00'}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 text-center">
                  Secured by 256-bit TLS encryption
                </div>
              </div>
            )}

            {/* Live Focus Ring Overlay */}
            {bbox && (
              <div
                style={{
                  position: 'absolute',
                  left: `${(bbox.x / 1280) * 100}%`,
                  top: `${(bbox.y / 800) * 100}%`,
                  width: `${(bbox.width / 1280) * 100}%`,
                  height: `${(bbox.height / 800) * 100}%`,
                }}
                className={`pointer-events-none transition-all duration-200 rounded ${
                  isTrap
                    ? 'ring-4 ring-red-500 bg-red-500/20 animate-pulse'
                    : isBare
                    ? 'ring-4 ring-rose-500 bg-rose-500/20'
                    : 'ring-3 ring-blue-500 bg-blue-500/15'
                }`}
              >
                <span
                  className={`absolute -top-6 left-0 text-[10px] font-mono px-1.5 py-0.5 rounded shadow ${
                    isTrap
                      ? 'bg-red-600 text-white'
                      : isBare
                      ? 'bg-rose-600 text-white'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {node?.nodeName} &middot; {node?.role}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-slate-500">
            <Globe className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">No active viewport connection</p>
          </div>
        )}
      </div>

      {/* Focus & Style Inspector Footer */}
      <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-slate-400">
            Active Selector:{' '}
            <code className="text-indigo-300 font-mono">{node?.selector || 'body'}</code>
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
          <span>Role: <strong className="text-slate-200">{node?.role || 'generic'}</strong></span>
          <span aria-hidden="true">&middot;</span>
          <span>Outline: <strong className="text-slate-200">{currentStep?.computed_styles?.outline || '2px solid'}</strong></span>
        </div>
      </div>
    </div>
  );
}
