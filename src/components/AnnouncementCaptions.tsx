/**
 * AnnouncementCaptions.tsx
 * The emotional core of the Attestor demo:
 * Synthesizes screen-reader speech into scrolling, high-visibility captions.
 * When the announcement is just "button" with no name -> bold red.
 * When focus fails to move -> ⚠ KEYBOARD TRAP held on screen.
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Volume2, ShieldAlert } from 'lucide-react';

export interface CaptionItem {
  id: string;
  step_index: number;
  text: string;
  is_bare_button?: boolean;
  is_keyboard_trap?: boolean;
  timestamp: string;
}

interface Props {
  captions: CaptionItem[];
  currentStepIndex: number;
  isLive: boolean;
}

export function AnnouncementCaptions({ captions, currentStepIndex, isLive }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest caption as screen reader speaks
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [captions]);

  const activeCaption = captions[captions.length - 1];
  const hasTrap = captions.some((c) => c.is_keyboard_trap);
  const hasBareButton = captions.some((c) => c.is_bare_button);

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/70">
        <div className="flex items-center gap-2.5">
          <Volume2 className="w-5 h-5 text-indigo-400 animate-pulse" />
          <h2 className="text-sm font-semibold tracking-wide text-slate-100 uppercase">
            Screen Reader Live Audio Synthesizer
          </h2>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            Tab Stop <strong className="font-mono text-slate-200">{currentStepIndex + 1}</strong> of{' '}
            <span className="font-mono text-slate-400">{Math.max(captions.length, 1)}</span>
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE AT STREAM
            </span>
          )}
        </div>
      </div>

      {/* Persistent Critical Alert Banners */}
      {hasTrap && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-center gap-3 px-5 py-3 bg-red-950/90 border-b border-red-800/80 text-red-200 animate-pulse"
        >
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <div className="text-xs">
            <strong className="font-bold text-red-300 uppercase tracking-wide">
              ⚠ KEYBOARD TRAP DETECTED
            </strong>
            <span className="ml-2 text-red-300/90">
              Focus is locked inside modal container. Tab cannot advance; Escape key is ignored.
            </span>
          </div>
        </div>
      )}

      {hasBareButton && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-3 px-5 py-2.5 bg-rose-950/60 border-b border-rose-900/60 text-rose-200"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <div className="text-xs text-rose-300">
            <strong>Critical Assistive Barrier:</strong> Button lacks accessible name. Sighted users see
            an icon; blind users only hear &quot;button&quot;.
          </div>
        </div>
      )}

      {/* Main Scrolling Captions Area */}
      <div
        ref={containerRef}
        role="log"
        aria-live="polite"
        aria-label="Synthesized screen reader output stream"
        className="flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar bg-slate-900/90"
      >
        {captions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 text-sm">
            <Volume2 className="w-8 h-8 mb-2 opacity-40" />
            <p>Awaiting keyboard navigation events...</p>
            <p className="text-xs text-slate-600 mt-1">Audio synthesis stream will appear line-by-line per Tab stop</p>
          </div>
        ) : (
          captions.map((item, idx) => {
            const isLatest = idx === captions.length - 1;
            const isBare = item.is_bare_button || item.text.trim().toLowerCase() === 'button';
            const isTrap = item.is_keyboard_trap || item.text.includes('KEYBOARD TRAP');

            return (
              <div
                key={item.id || idx}
                className={`transition-all duration-300 rounded-lg p-4 border ${
                  isTrap
                    ? 'bg-red-950/40 border-red-700/80 ring-1 ring-red-500'
                    : isBare
                    ? 'bg-rose-950/30 border-rose-700/80 ring-1 ring-rose-500'
                    : isLatest
                    ? 'bg-slate-800/80 border-indigo-500/50 shadow-md'
                    : 'bg-slate-900/40 border-slate-800/60 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="text-slate-500">Stop #{item.step_index + 1}</span>
                    {isBare && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-900/60 text-red-300 font-semibold uppercase">
                        Missing Accessible Name
                      </span>
                    )}
                    {isTrap && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-900/80 text-red-200 font-semibold uppercase">
                        Trap Held
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] text-slate-500">{item.timestamp}</span>
                </div>

                {/* The Announcement text rendering */}
                <div
                  className={`text-xl font-medium tracking-tight leading-snug font-mono ${
                    isTrap
                      ? 'text-red-400 font-bold tracking-wider'
                      : isBare
                      ? 'text-rose-400 font-bold underline decoration-rose-500 decoration-wavy'
                      : isLatest
                      ? 'text-white'
                      : 'text-slate-300'
                  }`}
                >
                  {isTrap ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                      <span>⚠ KEYBOARD TRAP</span>
                    </div>
                  ) : isBare ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-2xl font-bold">&quot;button&quot;</span>
                      <span className="text-xs font-sans text-rose-300/90 font-normal">
                        No accessible text or aria-label found. The user cannot know what will happen upon pressing Enter.
                      </span>
                    </div>
                  ) : (
                    <span>&quot;{item.text}&quot;</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Audio Waveform / Status Footer */}
      <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Speech Synthesis API: <strong className="text-slate-200 font-mono">WebAXSynthesizer (CDP AXTree)</strong></span>
        </div>
        <div className="text-[11px] text-slate-500 font-mono">
          WCAG 4.1.2 &middot; WCAG 2.1.2
        </div>
      </div>
    </div>
  );
}
