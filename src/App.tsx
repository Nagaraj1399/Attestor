/**
 * Attestor — Proof your product behaves
 * VPAT 2.5 / EN 301 549 Signed Accessibility Conformance Reporter
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Play,
  RotateCcw,
  Download,
  GitCompare,
  GitPullRequest,
  Cpu,
  Award,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Info,
} from 'lucide-react';
import { AnnouncementCaptions, CaptionItem } from './components/AnnouncementCaptions';
import { LiveBrowser } from './components/LiveBrowser';
import { CriterionCard, CriterionFinding } from './components/CriterionCard';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { RemediationDrawer } from './components/RemediationDrawer';
import { ArchitectureCostModal } from './components/ArchitectureCostModal';
import { SelfAttestationModal } from './components/SelfAttestationModal';

type AppScreen = 'landing' | 'liverun' | 'report';

interface RunReport {
  title: string;
  product_name: string;
  target_url: string;
  evaluation_date: string;
  commit_sha: string;
  attestor_version: string;
  evidence_manifest_hash: string;
  cryptographic_signature: string;
  summary: {
    total_criteria: number;
    supports: number;
    partially_supports: number;
    does_not_support: number;
    requires_human_review: number;
    overall_status: string;
  };
  criteria_table: CriterionFinding[];
  steps: any[];
}

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [targetUrl, setTargetUrl] = useState<string>('https://checkout.acme-cloud.internal');
  const [activeRunId, setActiveRunId] = useState<string>('');
  const [isLive, setIsLive] = useState<boolean>(false);

  // Live run state
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [captions, setCaptions] = useState<CaptionItem[]>([]);
  const [liveFindings, setLiveFindings] = useState<CriterionFinding[]>([]);

  // Report state
  const [report, setReport] = useState<RunReport | null>(null);
  const [isDiffMode, setIsDiffMode] = useState<boolean>(false);
  const [isRemediated, setIsRemediated] = useState<boolean>(false);

  // Modals & Drawers
  const [selectedFinding, setSelectedFinding] = useState<CriterionFinding | null>(null);
  const [isRemediationOpen, setIsRemediationOpen] = useState<boolean>(false);
  const [isArchModalOpen, setIsArchModalOpen] = useState<boolean>(false);
  const [isSelfAttestOpen, setIsSelfAttestOpen] = useState<boolean>(false);
  const [isApplyingRemediation, setIsApplyingRemediation] = useState<boolean>(false);

  // Keyboard navigation & accessibility announcements
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('');

  const sseRef = useRef<EventSource | null>(null);

  // Clean up SSE on unmount
  useEffect(() => {
    return () => {
      if (sseRef.current) {
        sseRef.current.close();
      }
    };
  }, []);

  const startAttestation = async (urlToTest: string, remediated = false) => {
    try {
      setStatusAnnouncement(`Starting attestation pipeline for ${urlToTest}`);
      setIsRemediated(remediated);
      setSteps([]);
      setCaptions([]);
      setLiveFindings([]);
      setCurrentStepIndex(0);
      setScreen('liverun');
      setIsLive(true);

      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToTest, isRemediated: remediated }),
      });
      const data = await res.json();
      const runId = data.run_id;
      setActiveRunId(runId);

      // Connect to Server-Sent Events stream
      if (sseRef.current) sseRef.current.close();
      const es = new EventSource(`/api/run/${runId}/stream`);
      sseRef.current = es;

      es.addEventListener('step', (event: MessageEvent) => {
        const step = JSON.parse(event.data);
        setSteps((prev) => [...prev, step]);
        setCurrentStepIndex(step.step_index);
      });

      es.addEventListener('caption', (event: MessageEvent) => {
        const cap = JSON.parse(event.data);
        setCaptions((prev) => [
          ...prev,
          {
            id: `cap_${Date.now()}_${Math.random()}`,
            step_index: cap.step_index,
            text: cap.announcement,
            is_bare_button: cap.is_bare_button,
            is_keyboard_trap: cap.is_keyboard_trap,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      });

      es.addEventListener('verdict', (event: MessageEvent) => {
        const finding: CriterionFinding = JSON.parse(event.data);
        setLiveFindings((prev) => {
          if (prev.some((p) => p.criterion === finding.criterion)) return prev;
          return [...prev, finding];
        });
      });

      es.addEventListener('complete', async (event: MessageEvent) => {
        setIsLive(false);
        es.close();
        setStatusAnnouncement('Audit completed. Loading conformance report.');
        // Fetch full report
        const repRes = await fetch(`/api/run/${runId}/report`);
        const repData: RunReport = await repRes.json();
        setReport(repData);
        setScreen('report');
      });

      es.onerror = () => {
        setIsLive(false);
        es.close();
      };
    } catch (err) {
      console.error('Failed to start run:', err);
      setIsLive(false);
    }
  };

  const handleApplyRemediation = async () => {
    setIsApplyingRemediation(true);
    setStatusAnnouncement('Applying Pull Request #482 and triggering re-run verification.');
    try {
      const res = await fetch(`/api/remediate/${activeRunId || 'current'}`, {
        method: 'POST',
      });
      const data = await res.json();
      setTimeout(() => {
        setIsApplyingRemediation(false);
        setIsRemediationOpen(false);
        // Start re-attestation on the remediated branch
        startAttestation(targetUrl, true);
      }, 1200);
    } catch (err) {
      console.error('Remediation error:', err);
      setIsApplyingRemediation(false);
    }
  };

  const currentStep = steps[currentStepIndex] || null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. First Tab Stop: Skip to Main Content Landmark Link (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-semibold focus:shadow-xl"
      >
        Skip to main content
      </a>

      {/* ARIA Live Region for Screen Reader Announcements (WCAG 4.1.3) */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {statusAnnouncement}
      </div>

      {/* 2. Top Bar Contract: [Brand title] — [4-5 nav links] — [1 primary action] */}
      <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setScreen('landing')}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group focus:outline-hidden"
          >
            <ShieldCheck className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
            <span>Attestor</span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <button
              onClick={() => setScreen('landing')}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                screen === 'landing' ? 'text-white font-semibold' : ''
              }`}
            >
              Auditor Launch
            </button>
            <button
              onClick={() => {
                if (report) setScreen('report');
                else startAttestation(targetUrl);
              }}
              className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
                screen === 'report' ? 'text-white font-semibold' : ''
              }`}
            >
              Conformance Report
            </button>
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Architecture &amp; Costs
            </button>
            <button
              onClick={() => setIsSelfAttestOpen(true)}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300"
            >
              <Award className="w-3.5 h-3.5" />
              Attestor on Attestor
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/attestor_audit_report.pdf"
              download="attestor_audit_report.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Audit PDF</span>
            </a>

            {screen === 'report' && (
              <button
                onClick={() => setIsRemediationOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors whitespace-nowrap shrink-0"
              >
                <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" />
                Remediation PR
              </button>
            )}

            <button
              onClick={() => {
                if (screen === 'liverun') {
                  setScreen('report');
                } else {
                  startAttestation(targetUrl);
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {screen === 'liverun' ? 'View Findings' : 'Attest this product'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-6">
        {/* ========================================================================= */}
        {/* SCREEN 1: LANDING — Single URL input. One button: Attest this product.     */}
        {/* ========================================================================= */}
        {screen === 'landing' && (
          <div className="flex-1 flex flex-col justify-center items-center py-12 max-w-3xl mx-auto w-full text-center">
            {/* Tagline & Positioning */}
            <div className="mb-4 text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Accessibility Conformance Engineering &middot; VPAT 2.5 / EN 301 549
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl text-balance">
              Proof your product behaves.
            </h1>
            <p className="mt-4 text-base text-slate-400 max-w-xl leading-relaxed">
              <strong className="text-slate-200">Vanta proves your company has controls.</strong>{' '}
              Attestor sends AI agents to operate your product the way keyboard-only and screen-reader users must, emitting signed proof on every build.
            </p>

            {/* Core Single URL Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                startAttestation(targetUrl);
              }}
              className="mt-8 w-full flex flex-col sm:flex-row items-center gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-xl shadow-2xl focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all"
            >
              <label htmlFor="target-url-input" className="sr-only">
                Target URL to attest
              </label>
              <input
                id="target-url-input"
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://app.yourproduct.com/checkout"
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-2"
              >
                <span>Attest this product</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Presets for Jurors */}
            <div className="mt-8 w-full text-left">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Juror Demo Targets &middot; 7-Minute Pitch Rehearsal
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const url = 'https://checkout.acme-cloud.internal';
                    setTargetUrl(url);
                    startAttestation(url);
                  }}
                  className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/80 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                      Acme Cloud Checkout
                    </span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">
                      Demo Defects
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-snug">
                    Bare &quot;button&quot; failure &amp; modal keyboard trap. The exact hackathon sequence.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const url = 'https://example.com';
                    setTargetUrl(url);
                    startAttestation(url);
                  }}
                  className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-indigo-500/80 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                      https://example.com
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                      M1 Milestone
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-snug">
                    Standard IANA verification target with 100% hash chain fidelity.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSelfAttestOpen(true)}
                  className="p-3.5 rounded-lg bg-slate-900/90 border border-emerald-900/50 hover:border-emerald-500/80 text-left transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                      Attestor on Attestor
                    </span>
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                      Self-Audit
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 leading-snug">
                    Eat our own cooking. 15/15 WCAG 2.2 AA success criteria verified.
                  </p>
                </button>
              </div>
            </div>

            {/* Zero-Pill Subtext Metadata */}
            <div className="mt-12 text-xs text-slate-500 flex items-center justify-center gap-3">
              <span>Google Gemini 3 Pro</span>
              <span aria-hidden="true">&middot;</span>
              <span>15 Agent Skills</span>
              <span aria-hidden="true">&middot;</span>
              <span>SHA-256 Chained Evidence</span>
              <span aria-hidden="true">&middot;</span>
              <span>Zero Overlays</span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: LIVE RUN — Split View (The middle one that wins the hackathon)   */}
        {/* ========================================================================= */}
        {screen === 'liverun' && (
          <div className="flex-1 flex flex-col gap-6">
            {/* Split View Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h1 className="text-lg font-bold text-white tracking-tight">
                    Active AT Exploration: {targetUrl}
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono">
                  <span>Run ID: <strong className="text-slate-200">{activeRunId}</strong></span>
                  <span aria-hidden="true">&middot;</span>
                  <span>Commit: <strong className="text-slate-200">{isRemediated ? 'b7194e8' : 'a3f91c2'}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => startAttestation(targetUrl, isRemediated)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Re-Run Crawl
                </button>
                <button
                  onClick={() => setScreen('report')}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <span>Skip to Full ACR Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Split View 50/50 Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[500px]">
              {/* Left: Streaming Screenshots with Focus Ring */}
              <div className="h-[520px]">
                <LiveBrowser
                  currentStep={currentStep}
                  totalStepsCount={steps.length}
                  targetUrl={targetUrl}
                  isLive={isLive}
                />
              </div>

              {/* Right: AnnouncementCaptions.tsx (The emotional core) */}
              <div className="h-[520px]">
                <AnnouncementCaptions
                  captions={captions}
                  currentStepIndex={currentStepIndex}
                  isLive={isLive}
                />
              </div>
            </div>

            {/* Bottom: Live Criterion Verdicts Appearing as They Resolve */}
            <div className="mt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white tracking-wide uppercase">
                    Live Agent Skill Verdicts (Gemini 3 Pro + Flash)
                  </h2>
                  <span className="text-xs font-mono text-slate-400">
                    ({liveFindings.length} resolved)
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono">
                  Confidence Threshold: 0.85
                </span>
              </div>

              {liveFindings.length === 0 ? (
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                  Synthesizing evidence against normative criteria... Verdicts will appear as they resolve.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {liveFindings.map((finding) => (
                    <CriterionCard
                      key={finding.criterion}
                      finding={finding}
                      onOpenEvidence={(f) => setSelectedFinding(f)}
                      isCompact
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: REPORT — The Accessibility Conformance Report (VPAT 2.5)         */}
        {/* ========================================================================= */}
        {screen === 'report' && report && (
          <div className="flex-1 flex flex-col gap-6">
            {/* Header: Target URL, Timestamp, Commit SHA, Evidence Manifest Hash, Signature */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase tracking-wider">
                      VPAT 2.5 / EN 301 549 Edition
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Attestor v{report.attestor_version}</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white mt-1.5 tracking-tight">
                    Accessibility Conformance Report: {report.product_name}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 font-mono">
                    Target: <span className="text-slate-200">{report.target_url}</span> &middot; Evaluated:{' '}
                    <span className="text-slate-200">{new Date(report.evaluation_date).toLocaleString()}</span>
                  </p>
                </div>

                {/* Diff Toggle & Export Actions */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* The Diff Toggle: Compare against commit a3f91c */}
                  <button
                    onClick={() => setIsDiffMode(!isDiffMode)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                      isDiffMode
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Compare vs Commit a3f91c</span>
                  </button>

                  <a
                    href="/attestor_audit_report.pdf"
                    download="attestor_audit_report.pdf"
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download Audit Report PDF</span>
                  </a>

                  <button
                    onClick={() => setIsRemediationOpen(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
                  >
                    <GitPullRequest className="w-3.5 h-3.5" />
                    <span>Remediation PR</span>
                  </button>
                </div>
              </div>

              {/* Cryptographic Manifest Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[11px]">Git Commit SHA</span>
                  <span className="text-slate-200 font-semibold">{report.commit_sha}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Evidence Manifest SHA-256</span>
                  <span className="text-indigo-300 truncate block font-semibold">
                    {report.evidence_manifest_hash}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">HMAC Signature</span>
                  <span className="text-emerald-400 truncate block font-semibold">
                    {report.cryptographic_signature}
                  </span>
                </div>
              </div>
            </div>

            {/* Regression Diff Banner (when Diff Toggle is active) */}
            {isDiffMode && (
              <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/80 flex items-start justify-between gap-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <GitCompare className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-white text-sm block">
                      Build-to-Build Conformance Diff (vs Commit a3f91c)
                    </strong>
                    <p className="text-slate-300 mt-1 leading-relaxed">
                      Criterion <strong className="text-rose-400">4.1.2 Name, Role, Value</strong> regressed in commit <code className="font-mono text-slate-200">a3f91c</code> (&quot;refactor: convert payment CTA to icon-only button&quot;). Last night&apos;s build passed with 100% conformance.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsRemediationOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold whitespace-nowrap"
                >
                  View Fix PR
                </button>
              </div>
            )}

            {/* Summary Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                  {report.summary.supports}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Supports</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <div className="text-3xl font-extrabold text-rose-400 font-mono tabular-nums">
                  {report.summary.does_not_support}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Does Not Support</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                  {report.summary.partially_supports}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Partially Supports</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                <div className="text-3xl font-extrabold text-indigo-400 font-mono tabular-nums">
                  {report.summary.requires_human_review}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-medium">Human Review Tier</div>
              </div>
            </div>

            {/* Conformance Table Rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Success Criteria Evaluation (WCAG 2.2 Level A / AA &middot; EN 301 549)
                </h2>
                <span className="text-xs text-slate-500 font-mono">
                  Click any row to inspect trace-level screenshot &amp; AX node
                </span>
              </div>

              {report.criteria_table.map((finding) => (
                <CriterionCard
                  key={finding.criterion}
                  finding={finding}
                  onOpenEvidence={(f) => setSelectedFinding(f)}
                />
              ))}
            </div>

            {/* Footer Methodology Statement (Honest AI disclosure as demanded in Section 5.5) */}
            <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <Info className="w-4 h-4 text-indigo-400" />
                Honest Methodology &amp; Procurement Disclosure Statement
              </div>
              <p className="leading-relaxed">
                Judgements were machine-produced by Google Gemini 3 Pro (with thinking_level: &quot;high&quot;) and Gemini 3 Flash running modular Google Agent Skills over trace-level CDP evidence. Under strict Attestor policy, any finding with confidence &lt; 0.85 is automatically downgraded to <strong className="text-slate-200">requires_human_review: true</strong>. A false &quot;Supports&quot; in a procurement document is a legal misrepresentation.
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Auditor: Attestor Automated Conformance Pipeline (Verified Execution)</span>
                <span>Confidence Threshold: 0.85</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Evidence Drawer */}
      <EvidenceDrawer
        finding={selectedFinding}
        stepData={
          selectedFinding && report?.steps
            ? report.steps.find((s) => selectedFinding.evidence_step_ids.includes(s.step_index)) || null
            : null
        }
        onClose={() => setSelectedFinding(null)}
        onOpenRemediation={() => {
          setSelectedFinding(null);
          setIsRemediationOpen(true);
        }}
      />

      {/* Remediation PR Modal (Milestone M6) */}
      <RemediationDrawer
        isOpen={isRemediationOpen}
        onClose={() => setIsRemediationOpen(false)}
        onApplyRemediation={handleApplyRemediation}
        isApplying={isApplyingRemediation}
        isRemediated={isRemediated}
      />

      {/* Architecture & Cost Modal (Slide 7) */}
      <ArchitectureCostModal
        isOpen={isArchModalOpen}
        onClose={() => setIsArchModalOpen(false)}
      />

      {/* Self-Attestation Modal (Slide 8 Closing line) */}
      <SelfAttestationModal
        isOpen={isSelfAttestOpen}
        onClose={() => setIsSelfAttestOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-4 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 Attestor Inc. Proof your product behaves.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsArchModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Cost-per-report table
            </button>
            <span aria-hidden="true">&middot;</span>
            <button
              onClick={() => setIsSelfAttestOpen(true)}
              className="hover:text-white transition-colors"
            >
              Attestor on Attestor
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
