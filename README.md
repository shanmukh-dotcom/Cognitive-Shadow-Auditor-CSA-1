# 🏛️ Cognitive Shadow Auditor (CSA)

> **"A decision is only trustworthy if it survives opposition."**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](https://cognitive-shadow-auditor.onrender.com/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Powered by Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![FastAPI](https://img.shields.io/badge/backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/frontend-React%2019-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Docker](https://img.shields.io/badge/deploy-Docker%20on%20Render-2496ED?style=flat-square&logo=docker)](https://render.com)
[![Firebase](https://img.shields.io/badge/database-Firebase%20Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)

---

## 📖 Project Description

Every day, AI systems make millions of high-stakes decisions — approving or rejecting loans, screening job candidates, triaging medical cases — with a single, unchallenged voice. When that voice carries a bias, nobody catches it. The harm is silent, systematic, and invisible.

**Cognitive Shadow Auditor (CSA)** is an AI decision-integrity platform that changes this by design. Instead of trusting a single model's output, CSA orchestrates a structured adversarial debate — a **Courtroom of Logic** — before any decision is finalized.

A **Primary Counsel** AI makes the initial decision with full confidence. A **Shadow Counsel** AI — independently prompted, structurally adversarial — immediately challenges it, hunting for hidden bias, overlooked evidence, and logical flaws. A rule-based **Arbiter** then measures the conflict between them as a quantified **Tension Score**. Decisions that survive the opposition are output with a full audit trail. Decisions that don't are escalated to a **Human-in-the-Loop** review queue.

CSA is not a chatbot. It is not a dashboard. It is a living judicial system for AI — built on the principle that **bias has nowhere to hide when the opposition never sleeps.**

> Built for the **Google Solution Challenge** — Unbiased AI track — by **shanmukh.ch**
> 🌐 Live Demo: [cognitive-shadow-auditor.onrender.com](https://cognitive-shadow-auditor.onrender.com/)

---

## 🛠️ Tech Stack

### AI & Intelligence Layer

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Primary Counsel** | Google Gemini 1.5 Flash | Makes the initial structured decision with confidence scoring |
| **Shadow Counsel** | Google Gemini 1.5 Flash | Adversarially prompted to expose bias and argue the opposition |
| **Arbiter** | Pure Python Logic | Rule-based tension scoring — no learned weights, no bias |

> Both AI agents use the **same underlying model** but with structurally different system prompts — one trained toward strict data-driven decisions, the other toward exposing what those decisions miss. This is intentional: the opposition comes from **prompt architecture**, not model difference.

### Backend

| Technology | Purpose |
| :--- | :--- |
| **FastAPI** (Python 3.11+) | REST API, orchestration layer, Arbiter logic |
| **Pydantic** | Request/response validation and schema enforcement |
| **asyncio** | Parallel execution of Primary and Shadow AI calls simultaneously |
| **Python-dotenv** | Environment variable management |

### Frontend

| Technology | Purpose |
| :--- | :--- |
| **React 19** + **TypeScript** | Core UI framework |
| **Framer Motion** | All animations — panel entrances, typewriter effects, tension bar spring physics |
| **Tailwind CSS** | Utility-first styling with custom CSS variables |
| **tsParticles** | Hero page particle field (dust-mote courtroom atmosphere) |
| **TanStack Query** | API state management, caching, and background refetching |
| **React Router v6** | Client-side routing across all pages |
| **Cinzel** (Google Font) | Authoritative serif font for all courtroom headings |
| **JetBrains Mono** | Monospace font for all AI-generated reasoning output |

### Database & Storage

| Technology | Purpose |
| :--- | :--- |
| **Firebase Firestore** | Persistent storage for all decisions, audit trails, and escalation records |

### Infrastructure & Deployment

| Technology | Purpose |
| :--- | :--- |
| **Docker** | Single unified container serving both FastAPI backend and compiled React frontend |
| **Render.com** | Cloud hosting for the Docker container |
| **GitHub** | Version control and CI/CD trigger for Render auto-deploys |

---

## ✨ Key Features

- **Adversarial Dual-AI Debate** — Primary and Shadow Counsel run in parallel (`asyncio`), each generating a structured verdict, confidence score, and reasoning independently before comparison.

- **Tension Score Engine** — A rule-based Arbiter calculates a conflict score (0–100) from verdict disagreement, confidence levels, and bias flag count. No learned weights — pure, auditable logic.

- **Three-Zone Verdict System** — Tension 0–40: Resolved and output. Tension 40–70: Contested and flagged. Tension 70–100: Escalated to Human-in-the-Loop review queue.

- **Human-in-the-Loop Escalation** — High-tension cases are routed to a structured human review queue where reviewers see both AI arguments side-by-side before making a final ruling.

- **Permanent Audit Trail** — Every decision stores both AI arguments, bias flags, missed factors, tension score, final verdict, and reviewer notes in Firebase Firestore — permanently and immutably.

- **Domain-Specific Case Submission** — Structured intake forms for Finance (loan approval), Hiring (candidate screening), and Medical (triage) domains — each with contextually relevant fields.

- **Cinematic Courtroom UI** — Framer Motion-powered split-panel arena with breathing AI agent avatars, typewriter reasoning output, spring-physics tension bar with color transitions, and sequential panel entrance animations.

- **Case Archive** — Full searchable and filterable history of all past decisions with inline expandable argument views.

- **Bias Flag Detection** — Shadow Counsel explicitly surfaces bias flags (e.g., "credit score historically disadvantages stable-income workers") as structured, tagged output — not buried in prose.

- **< 2 Second Response Time** — Primary and Shadow AI calls execute simultaneously via `asyncio.gather()`, keeping total latency under 2 seconds regardless of domain.

---

## 🏗️ System Architecture & Workflow
User Submits Case
│
▼
FastAPI Backend
/decide endpoint
│
├─────────────────────────────────┐
│                                 │
▼                                 ▼
PRIMARY COUNSEL                  SHADOW COUNSEL
Gemini 1.5 Flash                 Gemini 1.5 Flash
(strict, data-driven)            (adversarial, bias-hunting)
→ verdict                        → counter_verdict
→ confidence (0-100)             → challenge_strength (0-100)
→ reasoning                      → counter_reasoning
→ key_factors[]                  → bias_flags[]
→ missed_factors[]
│                                 │
└──────────────┬──────────────────┘
│
▼
THE ARBITER
(Pure Python Logic)
Tension Score = f(
confidence,
challenge_strength,
verdict_clash,
bias_flags
)
│
┌───────────┼───────────┐
│           │           │
▼           ▼           ▼
0 – 40      40 – 70     70 – 100
RESOLVED    CONTESTED    ESCALATED
Output +    Output +     → Human
Audit Trail  Warnings    Review Queue
│                        │
▼                        ▼
Firebase Firestore        Firebase Firestore
(decisions table)         (escalations table)
│
▼
React Frontend
Decision Arena
(Framer Motion UI)

**Key architectural decisions:**

- **Parallel AI calls** — `asyncio.gather()` runs both models simultaneously. Neither model sees the other's output before responding, ensuring structural independence.
- **Unified Docker container** — The React build is compiled and served as static files by FastAPI, resulting in a single deployable artifact with one port exposed.
- **Rule-based Arbiter** — Deliberately avoids a third AI model for arbitration. A learned model could itself carry bias. The Arbiter uses deterministic mathematical rules that are fully transparent and auditable.
- **Firebase for persistence** — Chosen for real-time capabilities and schema flexibility, allowing bias flags and missed factors to be stored as structured arrays without migration overhead.

---

## ⚙️ Installation & Setup

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A [Google AI Studio](https://aistudio.google.com/) account for a free **Gemini API key**
- A [Firebase](https://console.firebase.google.com/) project with **Firestore** enabled

### 1. Clone the Repository

```bash
git clone https://github.com/shanmukh-ch/cognitive-shadow-auditor.git
cd cognitive-shadow-auditor
```

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
# Google Gemini API Key (get free key at aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Service Account (paste the entire JSON as a single-line string)
FIREBASE_CONFIG_JSON={"type":"service_account","project_id":"your-project-id",...}
```

> **Getting your Firebase config:**
> Firebase Console → Project Settings → Service Accounts → Generate New Private Key → copy the entire JSON content into `FIREBASE_CONFIG_JSON` as a single line.

### 3. Build the Docker Image

```bash
docker build -t csa .
```

This step compiles the React frontend and installs all Python dependencies inside the container. Expected build time: 2–4 minutes on first run.

### 4. Run the Application

```bash
docker run -p 8000:8000 --env-file .env csa
```

The application will be available at:
http://localhost:8000

### 5. Verify the Backend is Running

```bash
curl http://localhost:8000/health
# Expected: {"status": "ok", "version": "1.0.0"}
```

---

### Running Without Docker (Development Mode)

If you prefer to run the frontend and backend separately during development:

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend (in a separate terminal):**
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

> Set `VITE_API_URL=http://localhost:8000` in `frontend/.env` for local API connection.

---

## 🎮 Usage

Once the application is running, navigate to `http://localhost:8000` in your browser.

### Filing a Case

1. Click **"Enter the Courtroom"** on the hero page or navigate to `/submit`.
2. Select your **domain** — Loan Approval, Hiring Decision, or Medical Triage.
3. Fill in the structured case fields. For example, for a loan case:
   - Applicant name, credit score (slider: 300–850), monthly income, employment years, loan amount.
4. Click **"Convene the Court"** to submit.
5. Watch the sequential loading overlay as Primary Counsel, Shadow Counsel, and the Arbiter engage in sequence.

### Reading the Decision Arena

The arena opens with three panels slamming into position simultaneously:

| Panel | What to look for |
| :--- | :--- |
| **Left — Primary Counsel** | Verdict badge, confidence arc gauge, reasoning (typewriter), key evidence tags |
| **Center — The Arbiter** | Tension thermometer filling with spring physics, color-coded zone, conflict status |
| **Right — Shadow Counsel** | Counter-verdict, challenge strength, counter-reasoning, ⚠ bias flags, missed factors |

- **Tension 0–40 (Emerald):** Decision resolved and output. Full audit trail recorded.
- **Tension 40–70 (Gold):** Contested. Decision flagged with warnings. Review recommended.
- **Tension 70–100 (Crimson):** Escalated. Human review required. See the escalation queue.

### Reviewing Escalated Cases

Navigate to `/escalations` to see all cases the Arbiter could not resolve. Each card shows both AI arguments. Click **Approve**, **Reject**, or **Request More Info** to submit your ruling with notes.

### Browsing the Case Archive

Navigate to `/archive` to view all past decisions. Filter by domain, verdict, tension level, or date. Click any row to expand and read the full Primary vs Shadow arguments inline.

---

## 🔮 Future Scope / Roadmap

### Phase 2 — Smarter Shadow (3–9 months)
Fine-tune a dedicated Shadow model on counterfactual datasets with inverted demographic weights. The current Shadow relies on adversarial prompting; a trained Shadow would have a genuinely different worldview baked into its weights — catching biases that prompt engineering alone cannot surface. Target: Llama 3.1 70B fine-tuned on 12 orthogonal demographic inversions.

### Phase 3 — CSA as a Compliance API (6–12 months)
Expose CSA as a REST API that any organization can plug into their existing decision pipeline. Companies send their AI's decision + reasoning to a single `/audit` endpoint and receive back a Tension Score, bias flags, and an escalation recommendation — without needing to rebuild their stack. Target markets: fintech, HR platforms, and healthcare AI providers facing emerging EU AI Act compliance requirements.

### Phase 4 — Divergence Monitoring & Self-Healing (12–24 months)
Implement automated Shadow drift detection. If the Shadow model begins agreeing with Primary too frequently (agreement rate > 70% over a 30-day window), the system triggers an automatic re-injection of counterfactual training data and alerts the admin. This prevents "Shadow collapse" — the single biggest long-term failure mode of adversarial AI systems — and keeps the opposition structurally healthy over time.

---

## 📚 Research & Evidence Base

The problem CSA solves is documented across major peer-reviewed publications and investigative reports:

| Source | Finding |
| :--- | :--- |
| ProPublica (2016) | Black defendants 2× more likely to be incorrectly flagged as high-risk by COMPAS |
| MIT Gender Shades (2018) | 34.7% error rate for dark-skinned women vs 0.8% for light-skinned men in facial recognition |
| Nature / Humanities & Social Sciences (2023) | AI hiring bias documented across gender, race, and personality traits in peer-reviewed study |
| DataRobot Survey (2024) | 62% of companies lost revenue from biased AI decisions (350+ companies surveyed) |
| NIH / PubMed Central (2025) | AI health-risk scores systematically underestimate needs of Black patients vs White patients with identical disease burden |
| IBM Research (2024) | Apple credit card AI offered lower limits to women even when they had higher credit scores than their male spouses |

> Full interactive evidence vault with clickable links to all original sources available at:
> **[cognitive-shadow-auditor.onrender.com/evidence](https://cognitive-shadow-auditor.onrender.com/evidence)**

---

## 🎨 Design Philosophy

The CSA interface is built around a single guiding metaphor: **you are a witness to something important happening.**

The **Midnight-Parchment** theme — deep near-black backgrounds (`#07080F`), aged gold accents (`#C9A84C`), and warm parchment text (`#EDE8D8`) — evokes the gravity of a grand courtroom without feeling cold or corporate. Framer Motion spring physics (stiffness: 80, damping: 18) give every element the weight of a deliberate physical action. The tension bar doesn't just fill — it overshoots and settles, like a scale coming to rest.

The Cinzel typeface (carved-marble authority) on all courtroom titles, combined with JetBrains Mono (raw machine intelligence) on all AI output, creates a deliberate typographic tension that mirrors the conceptual one: human justice vocabulary wrapped around machine reasoning.

Nothing appears instantly. Nothing is static. The court is always in session.

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you'd like to change, then submit a pull request against the `dev` branch.

```bash
# Fork the repository, then:
git checkout -b feature/your-feature-name
git commit -m "feat: description of change"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with conviction for the **Google Solution Challenge** — Unbiased AI track

**shanmukh.ch**

[🌐 Live Demo](https://cognitive-shadow-auditor.onrender.com/) · [📁 GitHub](https://github.com/shanmukh-ch/cognitive-shadow-auditor) · [📧 Contact](mailto:your@email.com)

*"Bias is not the absence of data. It is the absence of opposition."*

</div>
