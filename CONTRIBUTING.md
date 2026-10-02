# Contributing to Navika AI

Thank you for your interest in contributing to **Navika AI** (ISRO Smart India Hackathon 2026 - Problem Statement 26176). We welcome contributions from researchers, oceanographers, software engineers, and domain specialists.

---

## Code of Conduct

We expect all contributors to maintain a respectful, constructive, and inclusive environment. Please communicate professionally in all issues, pull requests, and discussions.

---

## Getting Started

1. **Fork the Repository**: Create your personal fork on GitHub.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/<your-username>/navika_ai.git
   cd navika_ai
   ```
3. **Create a Topic Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

---

## Local Development Workflow

### Backend (Python 3.11+)
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

pip install -r backend/requirements.txt
pip install pytest pytest-asyncio
```

Run tests to verify the baseline:
```bash
python -m pytest backend/tests/ -v
```

### Frontend (Node.js 18+ / React 19 / TypeScript)
```bash
cd frontend
npm install
npm run build
cd ..
```

### Start the Platform Concurrently
```bash
npm run dev
```

---

## Development Standards

### 1. Zero LLM Hallucination for Safety
* Hydro-meteorological safety scores and danger verdicts (`SAFE TO VENTURE`, `CAUTION ADVISED`, `UNSAFE / AVOID`) **must remain 100% deterministic**.
* Never delegate raw mathematical scoring or boundary verification to probabilistic language model prompts.
* All physics evaluations belong in the deterministic agent modules (`backend/app/agents/risk.py`, `backend/app/geo/trajectory.py`).

### 2. Python Backend Standards
* Adhere to PEP 8 style standards.
* Use strict Pydantic v2 schemas for all API payloads and route responses.
* Keep asynchronous handlers non-blocking (`async def`).
* Add automated unit tests in `backend/tests/` for new agent features or endpoints.

### 3. Frontend Standards
* Write clean, strictly-typed TypeScript components.
* Use Tailwind CSS utility classes and preserve responsive design across mobile (<430px), tablet, and desktop viewports.
* Avoid large un-optimized raster assets; use SVG icons from `lucide-react`.

---

## Submitting Pull Requests

1. **Test Your Changes**:
   * Run the Pytest suite: `python -m pytest backend/tests/ -v`
   * Run the frontend build check: `cd frontend && npm run build`
2. **Commit with Clear Messages**:
   Use conventional commit prefixes:
   * `feat:` A new feature or agent capability
   * `fix:` A bug fix or UI correction
   * `docs:` Documentation changes
   * `test:` Adding or updating test cases
   * `refactor:` Code improvements without behavioral changes
3. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
4. **Open a Pull Request**:
   * Provide a clear summary of what your PR introduces.
   * Reference any relevant GitHub issues or SIH problem requirements.
   * Ensure GitHub Actions CI tests pass.

---

## Questions and Support

For questions, discussions, or bug reports, please open a GitHub Issue in the repository. Thank you for contributing to maritime safety for coastal communities!
