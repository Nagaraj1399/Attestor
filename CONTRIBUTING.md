# Contributing to Attestor

Thank you for your interest in contributing to **Attestor**! Attestor is an autonomous AI multi-agent accessibility conformance and cryptographic evidence engine built for **Startup Buildathon India 2026 (Google DeepMind + Google Cloud)**.

---

## 🏛️ Guiding Architectural Principles

1. **Google-Only AI Stack:** All model calls route strictly through Google (Gemini 3 Pro, Gemini 3 Flash, and Gemini Computer Use). No third-party AI APIs (OpenAI, Anthropic, Hugging Face).
2. **Cryptographic Integrity:** Every evidence step must be chained using SHA-256 (`hash(step_n) = sha256(canonical_json + hash(step_n-1))`).
3. **Ground Truth First:** All rule evaluations must be verified against deterministic test fixtures in `tests/fixtures/zoo/`. Never assert raw, volatile LLM prose.
4. **Safety & Confidence Downgrade Gate:** Any `supports` finding with confidence `<0.85` must automatically downgrade to `requires_human_review: true`.
5. **Verbatim Normative Citations:** Findings must quote normative text from `corpus/wcag22.md` or `corpus/en301549.md`. Never hallucinate legal standards.

---

## 🛠️ Adding a New Agent Skill

To add support for an additional WCAG 2.2 / EN 301 549 criterion:

1. Create a directory: `skills/<criterion_id>-<slug>/`
2. Add `SKILL.md` with lightweight YAML frontmatter:
   ```yaml
   ---
   name: "Focus Visible Verification"
   criterion: "2.4.7"
   level: "AA"
   model: "gemini-3-flash"
   description: "Audits keyboard focus indicators, computed outline contrast, and box-shadow styles."
   ---
   # Instructions
   ...
   ```
3. Add a corresponding test page fixture in `tests/fixtures/zoo/pages/`.
4. Update `tests/fixtures/zoo/manifest.json` with ground-truth expectations.
5. Run the master verification suite:
   ```bash
   python3 run_tests.py
   ```

---

## 🧪 Running Tests Locally

```bash
# Run complete verification suite
python3 run_tests.py

# Run specific layers
python3 -m unittest discover -s tests/unit -v
python3 -m unittest discover -s tests/eval -v
python3 -m unittest discover -s tests/sec -v
```

---

## 📜 Pull Request Guidelines

* Ensure `npm run lint` and `npm run build` pass without warnings.
* All 29 verification gates must pass with 100% success.
* Include a descriptive PR summary explaining the accessibility impact and normative references.
