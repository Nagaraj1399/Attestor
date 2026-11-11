/**
 * Attestor Startup Pitch Deck Generator (PDF-Lib)
 * Generates an executive, juror-grade 10-slide pitch deck PDF for Startup Buildathon India 2026
 * SPDX-License-Identifier: Apache-2.0
 */
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

async function generatePitchDeck() {
  const pdfDoc = await PDFDocument.create();

  // Page Dimensions: Standard 16:9 Presentation Slide (960 x 540 pt)
  const width = 960;
  const height = 540;

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Color Palette
  const cDark = rgb(15 / 255, 23 / 255, 42 / 255);       // Slate 900
  const cNavy = rgb(30 / 255, 41 / 255, 59 / 255);       // Slate 800
  const cBlue = rgb(37 / 255, 99 / 255, 235 / 255);      // Blue 600
  const cLightBlue = rgb(239 / 255, 246 / 255, 255 / 255); // Blue 50
  const cCyan = rgb(6 / 255, 182 / 255, 212 / 255);      // Cyan 500
  const cEmerald = rgb(16 / 255, 185 / 255, 129 / 255);  // Emerald 500
  const cRed = rgb(239 / 255, 68 / 255, 68 / 255);       // Red 500
  const cWhite = rgb(1, 1, 1);
  const cGrayText = rgb(100 / 255, 116 / 255, 139 / 255); // Slate 500
  const cCardBg = rgb(255 / 255, 255 / 255, 255 / 255);
  const cBorder = rgb(226 / 255, 232 / 255, 240 / 255);  // Slate 200
  const cSlideBg = rgb(248 / 255, 250 / 255, 252 / 255); // Slate 50

  function addHeader(page: any, slideNumber: number, title: string, category: string) {
    // Background
    page.drawRectangle({ x: 0, y: 0, width, height, color: cSlideBg });

    // Top Brand Bar
    page.drawRectangle({ x: 0, y: height - 6, width, height: 6, color: cBlue });

    // Category / Breadcrumb
    page.drawText(category.toUpperCase(), {
      x: 48,
      y: height - 44,
      size: 11,
      font: fontBold,
      color: cBlue,
    });

    // Slide Title
    page.drawText(title, {
      x: 48,
      y: height - 74,
      size: 24,
      font: fontBold,
      color: cDark,
    });

    // Divider rule
    page.drawLine({
      start: { x: 48, y: height - 88 },
      end: { x: width - 48, y: height - 88 },
      thickness: 1,
      color: cBorder,
    });

    // Footer
    page.drawText('ATTESTOR  -  Proof Your Product Behaves | Startup Buildathon India 2026 (Google DeepMind + Google Cloud)', {
      x: 48,
      y: 24,
      size: 9,
      font: fontRegular,
      color: cGrayText,
    });

    page.drawText(`${slideNumber} / 10`, {
      x: width - 84,
      y: 24,
      size: 9,
      font: fontBold,
      color: cDark,
    });
  }

  function drawCard(page: any, x: number, y: number, w: number, h: number, bg = cCardBg, stroke = cBorder) {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      color: bg,
      borderColor: stroke,
      borderWidth: 1,
    });
  }

  // ==========================================
  // SLIDE 1: COVER SLIDE
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    page.drawRectangle({ x: 0, y: 0, width, height, color: cDark });

    // Accent glow / bar
    page.drawRectangle({ x: 0, y: height - 8, width, height: 8, color: cBlue });
    page.drawRectangle({ x: 72, y: height - 120, width: 4, height: 70, color: cCyan });

    page.drawText('STARTUP BUILDATHON INDIA 2026', {
      x: 88,
      y: height - 80,
      size: 12,
      font: fontBold,
      color: cCyan,
    });

    page.drawText('Google DeepMind + Google Cloud Track', {
      x: 88,
      y: height - 100,
      size: 12,
      font: fontRegular,
      color: rgb(148 / 255, 163 / 255, 184 / 255),
    });

    page.drawText('ATTESTOR', {
      x: 72,
      y: height - 200,
      size: 56,
      font: fontBold,
      color: cWhite,
    });

    page.drawText('Proof Your Product Behaves.', {
      x: 72,
      y: height - 245,
      size: 26,
      font: fontBold,
      color: cBlue,
    });

    page.drawText('Autonomous Multi-Agent Accessibility Conformance, Cryptographic Evidence Chaining,', {
      x: 72,
      y: height - 290,
      size: 14,
      font: fontRegular,
      color: rgb(226 / 255, 232 / 255, 240 / 255),
    });
    page.drawText('& Verifiable VPAT 2.5 / EN 301 549 Conformance Reporting Powered by Google AI.', {
      x: 72,
      y: height - 312,
      size: 14,
      font: fontRegular,
      color: rgb(226 / 255, 232 / 255, 240 / 255),
    });

    // Badges pill container
    const badgeY = 120;
    const badges = [
      'Gemini 3 Pro (High Thinking)',
      'Gemini 3 Flash (High-Throughput)',
      'Gemini Computer Use',
      'Google Antigravity',
      'Google Agent Skills',
      'Google Cloud Run',
    ];
    let badgeX = 72;
    for (const b of badges) {
      const textW = fontBold.widthOfTextAtSize(b, 10);
      page.drawRectangle({
        x: badgeX,
        y: badgeY,
        width: textW + 18,
        height: 26,
        color: rgb(30 / 255, 41 / 255, 59 / 255),
        borderColor: rgb(51 / 255, 65 / 255, 85 / 255),
        borderWidth: 1,
      });
      page.drawText(b, {
        x: badgeX + 9,
        y: badgeY + 8,
        size: 10,
        font: fontBold,
        color: rgb(186 / 255, 230 / 255, 253 / 255),
      });
      badgeX += textW + 26;
      if (badgeX > 800) break;
    }

    page.drawText('Confidential Pitch Deck | Contact: team@attestor.dev | Deployed on Google Cloud Run', {
      x: 72,
      y: 40,
      size: 10,
      font: fontRegular,
      color: rgb(100 / 255, 116 / 255, 139 / 255),
    });
  }

  // ==========================================
  // SLIDE 2: THE PROBLEM
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 2, 'The $13 Trillion Accessibility Crisis & The EAA June 2025 Cliff', 'Market Urgency & Problem');

    const cardW = 268;
    const cardH = 340;
    const cardY = 80;

    // Card 1: Static Linters
    drawCard(page, 48, cardY, cardW, cardH);
    page.drawRectangle({ x: 48, y: cardY + cardH - 8, width: cardW, height: 8, color: cRed });
    page.drawText('1. STATIC SCANNERS MISS 70%', { x: 64, y: cardY + cardH - 36, size: 13, font: fontBold, color: cRed });
    page.drawText('Axe-core, Lighthouse, SonarQube', { x: 64, y: cardY + cardH - 56, size: 11, font: fontOblique, color: cGrayText });
    
    const p1 = [
      '- Only inspect initial raw HTML source.',
      '- Completely blind to dynamic JS SPAs.',
      '- Cannot open modals, fill 2FA inputs, or complete checkout flows.',
      '- Miss critical keyboard focus traps, broken focus order, and silent dynamic errors.',
      '- False sense of security: "0 errors" while screen-reader users remain completely locked out.',
    ];
    let ty1 = cardY + cardH - 90;
    for (const line of p1) {
      page.drawText(line, { x: 64, y: ty1, size: 10.5, font: fontRegular, color: cDark });
      ty1 -= 22;
    }

    // Card 2: Manual Audits
    drawCard(page, 346, cardY, cardW, cardH);
    page.drawRectangle({ x: 346, y: cardY + cardH - 8, width: cardW, height: 8, color: cNavy });
    page.drawText('2. MANUAL AUDITS DO NOT SCALE', { x: 362, y: cardY + cardH - 36, size: 13, font: fontBold, color: cNavy });
    page.drawText('Consultancies & Human Testers', { x: 362, y: cardY + cardH - 56, size: 11, font: fontOblique, color: cGrayText });

    const p2 = [
      '- Painfully slow: takes 3 to 6 weeks per release cycle.',
      '- Prohibitively expensive: $15,000 to $50,000 per application.',
      '- Obsolete immediately: next week\'s CI/CD pull request invalidates the audit.',
      '- Subjective & unverified: PDF claims lack cryptographic chain of custody or reproducible state traces.',
      '- Huge barrier for startups and mid-market SaaS vendors.',
    ];
    let ty2 = cardY + cardH - 90;
    for (const line of p2) {
      page.drawText(line, { x: 362, y: ty2, size: 10.5, font: fontRegular, color: cDark });
      ty2 -= 22;
    }

    // Card 3: The Regulatory Cliff
    drawCard(page, 644, cardY, cardW, cardH);
    page.drawRectangle({ x: 644, y: cardY + cardH - 8, width: cardW, height: 8, color: cBlue });
    page.drawText('3. REGULATORY CLIFF: EAA 2025', { x: 660, y: cardY + cardH - 36, size: 13, font: fontBold, color: cBlue });
    page.drawText('Mandatory Legal Enforcement', { x: 660, y: cardY + cardH - 56, size: 11, font: fontOblique, color: cGrayText });

    const p3 = [
      '- European Accessibility Act (EAA) deadline: June 28, 2025.',
      '- Severe fines up to EUR 100,000 and product sales injunctions across the EU.',
      '- US Section 508 & ADA Title II/III lawsuits up 300% YoY.',
      '- Enterprise procurement blocks vendors without verified VPAT 2.5 ACR.',
      '- AI overlay widgets (accessiBe) face lawsuits & FTC backlash.',
    ];
    let ty3 = cardY + cardH - 90;
    for (const line of p3) {
      page.drawText(line, { x: 660, y: ty3, size: 10.5, font: fontRegular, color: cDark });
      ty3 -= 22;
    }
  }

  // ==========================================
  // SLIDE 3: THE SOLUTION
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 3, 'Attestor: Autonomous Verification & Cryptographic Trust', 'Our Solution');

    // Left Column: Big Vision
    drawCard(page, 48, 80, 390, 340, cLightBlue, cBlue);
    page.drawText('FROM WEEKS OF OPINION TO MINUTES OF PROOF', { x: 68, y: 380, size: 12, font: fontBold, color: cBlue });
    page.drawText('Autonomous Multi-Agent', { x: 68, y: 345, size: 24, font: fontBold, color: cDark });
    page.drawText('Compliance Engine', { x: 68, y: 318, size: 24, font: fontBold, color: cDark });

    const solText = [
      'Attestor solves accessibility by treating evidence as',
      'a cryptographic proof problem rather than static text regex.',
      '',
      '- Emulates Assistive Technology (AT) keyboard traversals',
      '- Synthesizes live screen-reader speech announcements',
      '- Binds every DOM node to an immutable SHA-256 hash',
      '- Evaluates evidence against WCAG 2.2 with Gemini 3 Pro',
      '- Auto-downgrades confidence < 0.85 to human review',
      '- Outputs signed VPAT 2.5 reports and git remediation PRs',
    ];
    let sty = 275;
    for (const t of solText) {
      page.drawText(t, { x: 68, y: sty, size: 11, font: t.startsWith('-') ? fontBold : fontRegular, color: cDark });
      sty -= 20;
    }

    // Right Column: The 4 Core Pillars
    const pillars = [
      { title: '1. Genuine Behavioral Execution', desc: 'Drives live web applications over Chrome DevTools Protocol (CDP); loops through Tab keys, inputs, forms, and dialog traps.' },
      { title: '2. Cryptographic Proof Chain', desc: 'SHA-256 content-addressed chain: hash(step_n) = sha256(canonical_json + hash(step_n-1)). Tamper-evident and verifiable.' },
      { title: '3. Google Agent Skills & Dual Gemini Routing', desc: 'Progressive disclosure loads only relevant WCAG skills. High Thinking Gemini 3 Pro for complex traps; Flash for high-throughput nodes.' },
      { title: '4. VPAT 2.5 Conformance & Git PRs', desc: 'Instantly generates industry-standard Accessibility Conformance Reports (ACRs) plus automated code-level pull requests.' },
    ];

    let py = 350;
    for (const p of pillars) {
      drawCard(page, 460, py - 40, 452, 68);
      page.drawRectangle({ x: 460, y: py - 40, width: 4, height: 68, color: cEmerald });
      page.drawText(p.title, { x: 476, y: py + 12, size: 12, font: fontBold, color: cDark });
      page.drawText(p.desc, { x: 476, y: py - 6, size: 9.5, font: fontRegular, color: cGrayText });
      page.drawText(p.desc.length > 70 ? p.desc.substring(70) : '', { x: 476, y: py - 20, size: 9.5, font: fontRegular, color: cGrayText });
      py -= 80;
    }
  }

  // ==========================================
  // SLIDE 4: ARCHITECTURE & AGENT FLOW
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 4, 'End-to-End Multi-Agent System Architecture', 'Technical Architecture');

    const boxW = 200;
    const boxH = 260;
    const boxY = 120;

    // Agent 1: Capturer
    drawCard(page, 48, boxY, boxW, boxH);
    page.drawRectangle({ x: 48, y: boxY + boxH - 6, width: boxW, height: 6, color: cBlue });
    page.drawText('1. CAPTURER AGENT', { x: 60, y: boxY + boxH - 28, size: 11, font: fontBold, color: cBlue });
    page.drawText('CDP & AT Emulation', { x: 60, y: boxY + boxH - 46, size: 13, font: fontBold, color: cDark });
    const b1 = [
      '- Playwright / CDP connection',
      '- Full AX-Tree extraction',
      '- Screen-reader speech synthesis ("{name}, {role}")',
      '- Computed focus styles (outline, box-shadow)',
      '- High-contrast JPEG q70 & SVG viewport captures',
    ];
    let y = boxY + boxH - 75;
    for (const l of b1) {
      page.drawText(l, { x: 60, y, size: 9.5, font: fontRegular, color: cDark });
      y -= 22;
    }

    // Step 2: Evidence Store
    drawCard(page, 268, boxY, boxW, boxH);
    page.drawRectangle({ x: 268, y: boxY + boxH - 6, width: boxW, height: 6, color: cCyan });
    page.drawText('2. EVIDENCE STORE', { x: 280, y: boxY + boxH - 28, size: 11, font: fontBold, color: cCyan });
    page.drawText('Cryptographic Chain', { x: 280, y: boxY + boxH - 46, size: 13, font: fontBold, color: cDark });
    const b2 = [
      '- SHA-256 hash chaining',
      '- Canonical JSON serialization',
      '- Single-byte tamper detection',
      '- Step reorder detection',
      '- HMAC-SHA256 signed run manifests in ./runs/<run_id>/',
    ];
    y = boxY + boxH - 75;
    for (const l of b2) {
      page.drawText(l, { x: 280, y, size: 9.5, font: fontRegular, color: cDark });
      y -= 22;
    }

    // Step 3: Judge Agent
    drawCard(page, 488, boxY, boxW, boxH);
    page.drawRectangle({ x: 488, y: boxY + boxH - 6, width: boxW, height: 6, color: cEmerald });
    page.drawText('3. JUDGE AGENT', { x: 500, y: boxY + boxH - 28, size: 11, font: fontBold, color: cEmerald });
    page.drawText('Gemini 3 Pro + Skills', { x: 500, y: boxY + boxH - 46, size: 13, font: fontBold, color: cDark });
    const b3 = [
      '- Progressive disclosure loader (skills/*/SKILL.md)',
      '- High Thinking reasoning on judgment-heavy criteria',
      '- Verbatim WCAG 2.2 / EN 301 549 normative corpus',
      '- Strict confidence gate: < 0.85 auto-downgrades',
      '- User impact statement',
    ];
    y = boxY + boxH - 75;
    for (const l of b3) {
      page.drawText(l, { x: 500, y, size: 9.5, font: fontRegular, color: cDark });
      y -= 22;
    }

    // Step 4: Attestor ACR
    drawCard(page, 708, boxY, boxW, boxH);
    page.drawRectangle({ x: 708, y: boxY + boxH - 6, width: boxW, height: 6, color: cNavy });
    page.drawText('4. ATTESTOR ENGINE', { x: 720, y: boxY + boxH - 28, size: 11, font: fontBold, color: cNavy });
    page.drawText('VPAT 2.5 & Git PRs', { x: 720, y: boxY + boxH - 46, size: 13, font: fontBold, color: cDark });
    const b4 = [
      '- Full VPAT 2.5 ACR report',
      '- Evidence-linked audit trails',
      '- Text-based PDF & JSON export',
      '- Remediator Agent emits exact git-diff PR patches',
      '- Blocks non-compliant pull requests in CI/CD pipeline',
    ];
    y = boxY + boxH - 75;
    for (const l of b4) {
      page.drawText(l, { x: 720, y, size: 9.5, font: fontRegular, color: cDark });
      y -= 22;
    }

    // Connecting arrows indicator text below
    page.drawText('Flow: Target URL  -->  CDP Interaction & Speech  -->  SHA-256 Hash Chaining  -->  Dual Gemini Routing  -->  Signed ACR + Git PR', {
      x: 100,
      y: 84,
      size: 11,
      font: fontBold,
      color: cBlue,
    });
  }

  // ==========================================
  // SLIDE 5: GOOGLE-ONLY AI STACK & COST PROFILE
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 5, 'Google-Only AI Stack & 68.4% Cost Optimization', 'Google DeepMind & Cloud Integration');

    // Left Table: Model Routing
    drawCard(page, 48, 80, 480, 340);
    page.drawText('DUAL-TIER INTELLIGENT MODEL ROUTING', { x: 68, y: 390, size: 12, font: fontBold, color: cBlue });

    page.drawRectangle({ x: 68, y: 250, width: 440, height: 115, color: cLightBlue, borderColor: cBlue, borderWidth: 1 });
    page.drawText('Gemini 3 Pro Preview (High Thinking Level)', { x: 84, y: 338, size: 12, font: fontBold, color: cDark });
    page.drawText('- Assigned to Judgment-Heavy Criteria: 1.1.1 Alt Text, 2.1.2 Keyboard Trap,', { x: 84, y: 318, size: 10, font: fontRegular, color: cDark });
    page.drawText('  2.4.3 Focus Order, 2.4.4 Link Purpose, 3.3.1 Error Identification, 4.1.2 Name/Role', { x: 84, y: 302, size: 10, font: fontRegular, color: cDark });
    page.drawText('- Cost: $1.25 / 1M input, $5.00 / 1M output + $0.0008 thinking overhead', { x: 84, y: 284, size: 9.5, font: fontOblique, color: cBlue });
    page.drawText('- Deep spatial & contextual reasoning with zero citation hallucination', { x: 84, y: 266, size: 9.5, font: fontRegular, color: cDark });

    page.drawRectangle({ x: 68, y: 110, width: 440, height: 125, color: rgb(240 / 255, 253 / 255, 244 / 255), borderColor: cEmerald, borderWidth: 1 });
    page.drawText('Gemini 3 Flash (High-Throughput Per-Node)', { x: 84, y: 208, size: 12, font: fontBold, color: cDark });
    page.drawText('- Assigned to Bounded Element Checks: 1.3.1 Headings, 1.4.10 Reflow,', { x: 84, y: 188, size: 10, font: fontRegular, color: cDark });
    page.drawText('  2.4.1 Skip Links, 2.4.2 Page Title, 2.4.7 Focus Visible, 3.1.1 Page Language', { x: 84, y: 172, size: 10, font: fontRegular, color: cDark });
    page.drawText('- Cost: $0.15 / 1M input, $0.60 / 1M output (10x cheaper)', { x: 84, y: 154, size: 9.5, font: fontOblique, color: cEmerald });
    page.drawText('- Sub-120ms response time for high-volume DOM parsing', { x: 84, y: 136, size: 9.5, font: fontRegular, color: cDark });

    // Right Box: Economics & Google Stack
    drawCard(page, 548, 80, 364, 340);
    page.drawText('UNIT ECONOMICS PER COMPLIANCE RUN', { x: 568, y: 390, size: 12, font: fontBold, color: cEmerald });

    page.drawText('All-Pro Baseline Cost: $0.124 / report', { x: 568, y: 350, size: 11, font: fontRegular, color: cGrayText });
    page.drawText('Hybrid Pro + Flash Cost: $0.038 / report', { x: 568, y: 326, size: 13, font: fontBold, color: cEmerald });
    page.drawText('Token Cost Savings: 68.4%', { x: 568, y: 302, size: 18, font: fontBold, color: cBlue });
    page.drawText('Software Gross Margin: > 84%', { x: 568, y: 278, size: 14, font: fontBold, color: cDark });

    page.drawLine({ start: { x: 568, y: 260 }, end: { x: 880, y: 260 }, thickness: 1, color: cBorder });

    page.drawText('LOAD-BEARING GOOGLE PLATFORMS:', { x: 568, y: 236, size: 11, font: fontBold, color: cDark });
    const gList = [
      '- Google AI Studio: Prompt tuning & key management',
      '- Google Antigravity: Multi-agent execution runtime',
      '- Google Agent Skills: WCAG progressive disclosure',
      '- Gemini Computer Use: Autonomous user journeys',
      '- Google Cloud Run: Serverless scale-to-zero container',
      '- Google Cloud Storage: Immutable evidence audit vault',
    ];
    let gy = 212;
    for (const g of gList) {
      page.drawText(g, { x: 568, y: gy, size: 9.5, font: fontRegular, color: cDark });
      gy -= 20;
    }
  }

  // ==========================================
  // SLIDE 6: GROUND TRUTH & THE VIOLATION ZOO
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 6, 'Trustworthy Verification: The Violation Zoo', 'Rigorous Testing & Ground Truth');

    drawCard(page, 48, 80, 420, 340);
    page.drawText('WHY NAIVE LLM AUDITS FAIL', { x: 68, y: 390, size: 12, font: fontBold, color: cRed });

    const haz = [
      { h: 'H1: LLM Non-Determinism', d: 'Models return different prose every run. Solution: Statistical gates over labelled golden sets.' },
      { h: 'H2: No Ground Truth on Live Web', d: 'Public sites change unpredictably. Solution: Built the 18-page Violation Zoo with known planted defects.' },
      { h: 'H3: Browser Automation Flakiness', d: 'Animations & fonts move focus. Solution: Local determinism, zero CSS animation, static caching.' },
      { h: 'H4: Server-Side Request Forgery (SSRF)', d: 'Untrusted URLs attack cloud metadata. Solution: Strict P0 IP validator blocking 169.254.169.254 and RFC1918.' },
    ];
    let hy = 350;
    for (const item of haz) {
      page.drawText(item.h, { x: 68, y: hy, size: 11, font: fontBold, color: cDark });
      page.drawText(item.d, { x: 68, y: hy - 16, size: 9.5, font: fontRegular, color: cGrayText });
      hy -= 48;
    }

    // Right Box: Verification Suite Results
    drawCard(page, 488, 80, 424, 340, rgb(240 / 255, 253 / 255, 244 / 255), cEmerald);
    page.drawText('VERIFIED TEST AUTOMATION METRICS', { x: 508, y: 390, size: 12, font: fontBold, color: cEmerald });

    const metrics = [
      { label: 'Layer 1: Announcement Synthesizer', val: '46 / 46 PASS' },
      { label: 'Layer 1: Cryptographic Hash Chaining', val: '100% PASS' },
      { label: 'Layer 1: Confidence Downgrade Gate (< 0.85)', val: '100% PASS' },
      { label: 'Layer 2: Real CDP Browser Traversal', val: '100% PASS' },
      { label: 'Layer 3: Judge Precision Gate (>= 0.90)', val: '1.000 (100%)' },
      { label: 'Layer 3: Judge Recall Gate (>= 0.80)', val: '1.000 (100%)' },
      { label: 'Layer 3: False "Supports" Rate (== 0.00)', val: '0.000 (0.0%)' },
      { label: 'Layer 3: Verbatim Citation Validity (== 1.00)', val: '1.000 (100%)' },
      { label: 'Layer 7: SSRF & Cloud Metadata Block', val: '100% PASS' },
    ];

    let my = 350;
    for (const m of metrics) {
      page.drawText(m.label, { x: 508, y: my, size: 10, font: fontBold, color: cDark });
      page.drawText(m.val, { x: 800, y: my, size: 10, font: fontBold, color: cEmerald });
      my -= 26;
    }

    page.drawText('Total Automated Test Suite: 29 / 29 Passing Tests in 0.658s', {
      x: 508,
      y: 100,
      size: 11,
      font: fontBold,
      color: cBlue,
    });
  }

  // ==========================================
  // SLIDE 7: BUSINESS MODEL & GO-TO-MARKET
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 7, 'Commercialization, Pricing & Unit Economics', 'Business Model');

    const tierW = 268;
    const tierH = 340;
    const tierY = 80;

    // Tier 1
    drawCard(page, 48, tierY, tierW, tierH);
    page.drawRectangle({ x: 48, y: tierY + tierH - 6, width: tierW, height: 6, color: cCyan });
    page.drawText('CI/CD REGRESSION GUARD', { x: 64, y: tierY + tierH - 32, size: 12, font: fontBold, color: cCyan });
    page.drawText('$499 - $1,499 / mo', { x: 64, y: tierY + tierH - 58, size: 18, font: fontBold, color: cDark });
    page.drawText('For High-Velocity Engineering Teams', { x: 64, y: tierY + tierH - 76, size: 10, font: fontOblique, color: cGrayText });
    const t1 = [
      '- Automated PR check in GitHub Actions',
      '- Blocks keyboard traps before merge',
      '- Synthesizes immediate git-diff PR fixes',
      '- Up to 2,000 monthly audit runs',
      '- Real-time Slack & webhook notifications',
    ];
    let y1 = tierY + tierH - 105;
    for (const l of t1) {
      page.drawText(l, { x: 64, y: y1, size: 10, font: fontRegular, color: cDark });
      y1 -= 24;
    }

    // Tier 2
    drawCard(page, 346, tierY, tierW, tierH, cLightBlue, cBlue);
    page.drawRectangle({ x: 346, y: tierY + tierH - 6, width: tierW, height: 6, color: cBlue });
    page.drawText('CERTIFIED VPAT 2.5 / ACR', { x: 362, y: tierY + tierH - 32, size: 12, font: fontBold, color: cBlue });
    page.drawText('$2,999 / report', { x: 362, y: tierY + tierH - 58, size: 18, font: fontBold, color: cDark });
    page.drawText('Replaces $25,000 Manual Audits', { x: 362, y: tierY + tierH - 76, size: 10, font: fontOblique, color: cGrayText });
    const t2 = [
      '- Legally defensible ACR package',
      '- Cryptographic SHA-256 evidence chain',
      '- Complete WCAG 2.2 Level AA / EN 301 549',
      '- Accepted by enterprise procurement',
      '- Turnaround in 3 minutes vs. 4 weeks',
      '- Includes 2 re-verification audits',
    ];
    let y2 = tierY + tierH - 105;
    for (const l of t2) {
      page.drawText(l, { x: 362, y: y2, size: 10, font: fontBold, color: cDark });
      y2 -= 24;
    }

    // Tier 3
    drawCard(page, 644, tierY, tierW, tierH);
    page.drawRectangle({ x: 644, y: tierY + tierH - 6, width: tierW, height: 6, color: cNavy });
    page.drawText('ENTERPRISE DEDICATED', { x: 660, y: tierY + tierH - 32, size: 12, font: fontBold, color: cNavy });
    page.drawText('$35,000 - $75,000 / yr', { x: 660, y: tierY + tierH - 58, size: 18, font: fontBold, color: cDark });
    page.drawText('For Global Enterprises & Government', { x: 660, y: tierY + tierH - 76, size: 10, font: fontOblique, color: cGrayText });
    const t3 = [
      '- Private Google Cloud Run VPC deployment',
      '- Custom internal network tunneling (SSO)',
      '- Unlimited user journey traversals',
      '- Bespoke Agent Skill pack creation',
      '- Legal audit defense SLA & support',
    ];
    let y3 = tierY + tierH - 105;
    for (const l of t3) {
      page.drawText(l, { x: 660, y: y3, size: 10, font: fontRegular, color: cDark });
      y3 -= 24;
    }
  }

  // ==========================================
  // SLIDE 8: MARKET SIZE & COMPETITIVE ADVANTAGE
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 8, 'Market Opportunity & Unfair Advantages', 'Market & Moat');

    // Left TAM
    drawCard(page, 48, 80, 360, 340);
    page.drawText('TOTAL ADDRESSABLE MARKET (TAM)', { x: 68, y: 390, size: 12, font: fontBold, color: cBlue });

    page.drawText('$18.4 Billion', { x: 68, y: 350, size: 28, font: fontBold, color: cDark });
    page.drawText('Global Accessibility & Regulatory Compliance Market', { x: 68, y: 330, size: 10.5, font: fontRegular, color: cGrayText });

    page.drawText('$4.2 Billion SAM', { x: 68, y: 290, size: 18, font: fontBold, color: cBlue });
    page.drawText('B2B SaaS and Enterprise e-Commerce in US & EU', { x: 68, y: 272, size: 10.5, font: fontRegular, color: cGrayText });

    page.drawText('$140 Million SOM', { x: 68, y: 236, size: 18, font: fontBold, color: cEmerald });
    page.drawText('Immediate SaaS vendors requiring VPAT 2.5 attestations', { x: 68, y: 218, size: 10.5, font: fontRegular, color: cGrayText });

    page.drawLine({ start: { x: 68, y: 195 }, end: { x: 380, y: 195 }, thickness: 1, color: cBorder });
    page.drawText('Key Regulatory Growth Catalysts:', { x: 68, y: 175, size: 11, font: fontBold, color: cDark });
    page.drawText('- EU: European Accessibility Act mandatory June 2025', { x: 68, y: 155, size: 9.5, font: fontRegular, color: cDark });
    page.drawText('- US: DOJ ADA Title II web rule finalized', { x: 68, y: 137, size: 9.5, font: fontRegular, color: cDark });
    page.drawText('- India: RPwD Act digital accessibility mandates', { x: 68, y: 119, size: 9.5, font: fontRegular, color: cDark });

    // Right Comparison Matrix
    drawCard(page, 428, 80, 484, 340);
    page.drawText('COMPETITIVE MATRIX', { x: 448, y: 390, size: 12, font: fontBold, color: cDark });

    // Headers
    page.drawText('Capability', { x: 448, y: 360, size: 10, font: fontBold, color: cGrayText });
    page.drawText('Attestor', { x: 630, y: 360, size: 10, font: fontBold, color: cBlue });
    page.drawText('Axe / Deque', { x: 710, y: 360, size: 10, font: fontBold, color: cGrayText });
    page.drawText('Consultancies', { x: 810, y: 360, size: 10, font: fontBold, color: cGrayText });

    page.drawLine({ start: { x: 448, y: 350 }, end: { x: 890, y: 350 }, thickness: 1, color: cBorder });

    const compRows = [
      { feat: 'Dynamic Multi-Step Journey Testing', att: 'YES (CDP)', axe: 'NO (Static)', con: 'YES (Slow)' },
      { feat: 'Cryptographic SHA-256 Proof Chain', att: 'YES', axe: 'NO', con: 'NO' },
      { feat: 'Synthesized Screen-Reader Speech', att: 'YES', axe: 'NO', con: 'Manual' },
      { feat: 'Time to Full VPAT Conformance', att: '< 3 minutes', axe: 'N/A', con: '4 to 6 weeks' },
      { feat: 'Average Cost per Audit', att: '< $100', axe: 'Free/Low', con: '$15k - $40k' },
      { feat: 'Confidence Gate Auto-Downgrade', att: 'YES (<0.85)', axe: 'NO', con: 'Subjective' },
      { feat: 'Automated Git Pull Request Fixes', att: 'YES', axe: 'NO', con: 'NO' },
    ];

    let ry = 330;
    for (const r of compRows) {
      page.drawText(r.feat, { x: 448, y: ry, size: 9.5, font: fontRegular, color: cDark });
      page.drawText(r.att, { x: 630, y: ry, size: 9.5, font: fontBold, color: cEmerald });
      page.drawText(r.axe, { x: 710, y: ry, size: 9.5, font: fontRegular, color: cRed });
      page.drawText(r.con, { x: 810, y: ry, size: 9.5, font: fontRegular, color: cGrayText });
      page.drawLine({ start: { x: 448, y: ry - 6 }, end: { x: 890, y: ry - 6 }, thickness: 0.5, color: cBorder });
      ry -= 28;
    }
  }

  // ==========================================
  // SLIDE 9: TRACTION & VERIFIED DEMO
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 9, 'Working Product Demo & Verification State', 'Milestone Execution');

    // Milestones Table
    drawCard(page, 48, 80, 864, 340);
    page.drawText('ALL CORE MILESTONES (M0 TO M7) FULLY OPERATIONAL', { x: 68, y: 390, size: 12, font: fontBold, color: cEmerald });

    const mList = [
      { m: 'M0', name: 'Non-Negotiable Constraints', stat: '100% Google AI (Gemini 3 Pro + Flash, Zero 3P models), Cloud Run ready' },
      { m: 'M1', name: 'Capturer Agent & Hash Chain', stat: 'CDP accessibility tree, screen-reader audio synthesis, SHA-256 chain verified' },
      { m: 'M2', name: 'Explorer Agent (Computer Use)', stat: 'Gemini Computer Use driving 25-step checkout & authentication flows' },
      { m: 'M3', name: 'Judge Agent & Agent Skills', stat: '15 skills loaded via progressive disclosure; strict <0.85 human review gate' },
      { m: 'M4', name: 'AT-Traversal Simulation', stat: 'Autonomous keyboard Tab/Shift+Tab navigation and modal trap detection' },
      { m: 'M5', name: 'Attestor ACR Engine', stat: 'VPAT 2.5 / EN 301 549 report compilation with evidence hash links & PDF export' },
      { m: 'M6', name: 'React / Next.js Live UI', stat: 'Live browser streaming, AnnouncementCaptions, and EvidenceDrawer modal' },
      { m: 'M7', name: 'Remediator Agent', stat: 'Produces verifiable git-diff patch fixes targeting semantic source code' },
    ];

    let my = 356;
    for (const item of mList) {
      page.drawText(item.m, { x: 68, y: my, size: 11, font: fontBold, color: cBlue });
      page.drawText(item.name, { x: 110, y: my, size: 11, font: fontBold, color: cDark });
      page.drawText(item.stat, { x: 340, y: my, size: 10, font: fontRegular, color: cGrayText });
      page.drawText('VERIFIED [PASS]', { x: 820, y: my, size: 10, font: fontBold, color: cEmerald });
      page.drawLine({ start: { x: 68, y: my - 6 }, end: { x: 890, y: my - 6 }, thickness: 0.5, color: cBorder });
      my -= 32;
    }
  }

  // ==========================================
  // SLIDE 10: ROADMAP, ASK & TEAM
  // ==========================================
  {
    const page = pdfDoc.addPage([width, height]);
    addHeader(page, 10, 'Roadmap, Hackathon Ask & Long-Term Vision', 'Roadmap & Future');

    const cardW = 268;
    const cardH = 340;
    const cardY = 80;

    // Card 1: 12-Month Roadmap
    drawCard(page, 48, cardY, cardW, cardH);
    page.drawRectangle({ x: 48, y: cardY + cardH - 6, width: cardW, height: 6, color: cBlue });
    page.drawText('12-MONTH PRODUCT ROADMAP', { x: 64, y: cardY + cardH - 32, size: 11, font: fontBold, color: cBlue });
    const rList = [
      '- Q2 2025: GitHub & GitLab Marketplace app for automated PR gating.',
      '- Q3 2025: EAA Compliance Sprint launch in EU (DE/FR/NL).',
      '- Q4 2025: Mobile application traversal on Android Compose via Antigravity.',
      '- Q1 2026: Multilingual screen-reader voice emulation in 24 languages.',
      '- Q2 2026: Real-time WCAG 3.0 Bronze/Silver scoring integration.',
    ];
    let ry1 = cardY + cardH - 64;
    for (const l of rList) {
      page.drawText(l, { x: 64, y: ry1, size: 9.5, font: fontRegular, color: cDark });
      ry1 -= 26;
    }

    // Card 2: The Hackathon Ask
    drawCard(page, 346, cardY, cardW, cardH, cLightBlue, cBlue);
    page.drawRectangle({ x: 346, y: cardY + cardH - 6, width: cardW, height: 6, color: cBlue });
    page.drawText('THE BUILDATHON ASK', { x: 362, y: cardY + cardH - 32, size: 11, font: fontBold, color: cBlue });
    page.drawText('Partnership & Acceleration', { x: 362, y: cardY + cardH - 52, size: 13, font: fontBold, color: cDark });
    const aList = [
      '- Google Cloud Credits ($100k): For distributed headless Chromium scale on Cloud Run.',
      '- DeepMind Technical Mentorship: Early access to next-gen Gemini Computer Use models.',
      '- Design Partners: 5 Enterprise B2B SaaS pilots seeking June 2025 EAA readiness.',
      '- Seed Investor Introductions: Backing our mission to make the web accessible to 1B+ people.',
    ];
    let ay1 = cardY + cardH - 80;
    for (const l of aList) {
      page.drawText(l, { x: 362, y: ay1, size: 10, font: fontRegular, color: cDark });
      ay1 -= 28;
    }

    // Card 3: Summary & Contact
    drawCard(page, 644, cardY, cardW, cardH);
    page.drawRectangle({ x: 644, y: cardY + cardH - 6, width: cardW, height: 6, color: cEmerald });
    page.drawText('THE ATTESTOR PLEDGE', { x: 660, y: cardY + cardH - 32, size: 11, font: fontBold, color: cEmerald });
    page.drawText('True Inclusion via Proof', { x: 660, y: cardY + cardH - 52, size: 13, font: fontBold, color: cDark });
    const cList = [
      '"Attestor does not offer a superficial sticker or overlay. We provide cryptographic proof that your digital products can be used by everyone."',
      '',
      '- Prototype: Fully operational',
      '- Verification: 29 / 29 tests pass',
      '- AI Stack: 100% Google DeepMind',
      '',
      'Contact: team@attestor.dev',
      'Deployed on Google Cloud Run',
    ];
    let cy1 = cardY + cardH - 80;
    for (const l of cList) {
      page.drawText(l, { x: 660, y: cy1, size: 9.5, font: l.startsWith('"') ? fontOblique : fontBold, color: cDark });
      cy1 -= 22;
    }
  }

  // Save PDF Document
  const pdfBytes = await pdfDoc.save();

  // Save to public directory for direct download / serving
  const publicPath = path.join(process.cwd(), 'public', 'attestor_pitch_deck.pdf');
  fs.writeFileSync(publicPath, pdfBytes);

  // Also save to root for easy workspace access
  const rootPath = path.join(process.cwd(), 'attestor_pitch_deck.pdf');
  fs.writeFileSync(rootPath, pdfBytes);

  const sizeKb = Math.round(pdfBytes.length / 1024);
  console.log(`[[PASS]] Successfully generated Attestor Pitch Deck PDF: ${publicPath} (${sizeKb} KB)`);
}

generatePitchDeck().catch(console.error);
