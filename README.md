# Attestor — Proof your product behaves

> **Positioning:** *Vanta proves your company has controls. Attestor proves your product behaves.*

Attestor takes a live URL, sends AI agents to operate the application the way a keyboard-only and screen-reader user must, captures trace-level evidence at every step, judges that evidence against **WCAG 2.2 AA** and **EN 301 549** using **Google Gemini**, and emits a signed **Accessibility Conformance Report (VPAT 2.5)** in which every claim hyperlinks to the screenshot, accessibility-tree node, and reproduction steps that prove it — stamped with the Git commit SHA, regenerable on every build.

---

## Architecture

```
Target URL ──▶ ADK-style Orchestrator (FastAPI / Express, Cloud Run)
                    │
┌─────────┬─────────┴────────┬─────────────┬──────────────┬─────────────┐
▼         ▼                  ▼             ▼              ▼             ▼
EXPLORER  AT-TRAVERSAL       CAPTURER      JUDGE          REMEDIATOR    ATTESTOR
Gemini    keyboard-only      CDP:          Gemini 3       Gemini 3      Compiles
Computer  + screen-reader    AX tree,      Pro +          Pro ➔         ACR/VPAT
Use tool  emulation          DOM, focus,   Flash          patch ➔       PDF + JSON
drives    via CDP            ARIA live,    + Agent        PR ➔          + hash chain
Chrome                       screenshot    Skills rules   re-verify     + Git SHA
```

### Google Stack Implementation
1. **Google AI Studio**: Prompt engineering, structured schema calibration, thinking level optimization.
2. **Google Antigravity**: Build environment and execution runtime.
3. **Google Agent Skills**: 15 modular rule packs (`skills/*/SKILL.md`) loaded via progressive disclosure.
4. **Google Gemini 3 Pro & Gemini 3 Flash**: Hybrid model routing — Pro with high thinking for judgement-heavy criteria (alt text, keyboard traps, focus order), Flash for bounded high-throughput per-node evaluations.

---

## Quickstart

```bash
# 1. Run full-stack dev server
npm run dev

# 2. Test M1 Evidence Capturer via Python CLI
python3 backend/agents/capturer.py https://example.com

# 3. Open Web UI
open http://localhost:3000
```
