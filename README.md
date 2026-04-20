# Cognitive Shadow Auditor (CSA)

A dual-AI decision-auditing backend. A **Primary AI** makes a decision, a **Shadow AI** actively challenges it, and a logic-based **Arbiter** scores the tension between them. High-tension decisions automatically escalate to a human reviewer. Every decision is permanently stored with a full audit trail.

---

## Architecture

```
Client → POST /decide
           │
           ├── Primary AI (precise, T=0.3)  ──┐
           │                                   ├── Arbiter (pure logic)
           └── Shadow AI  (adversarial, T=0.7)─┘         │
                                                     Store in Firebase
                                                          │
                                                     Return result
```

## Free Stack

| Component   | Service                  | Cost   |
|-------------|--------------------------|--------|
| AI Models   | Gemini (gemini-2.5-flash)| Free   |
| Database    | Firebase Firestore       | Free   |
| Backend     | FastAPI + Uvicorn        | Free   |
| Deployment  | Render.com free tier     | Free   |

---

## Quick Start

### 1. Get Free API Keys

**Gemini API Key (free):**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign up with Google
3. Create API Key
4. Copy the key

**Firebase (free):**
1. Go to [firebase.google.com](https://firebase.google.com) → Go to console
2. Create a new project
3. Go to Project Settings → Service Accounts → Generate new private key
4. Save the `.json` file as `firebase-credentials.json` in the root directory.


### 2. Clone & Install

```bash
git clone <your-repo>
cd cognitive-shadow-auditor
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual keys
```

### 4. Run Locally

```bash
uvicorn main:app --reload --port 8000
```

Visit: [http://localhost:8000/docs](http://localhost:8000/docs) for the interactive Swagger UI.

---

## API Endpoints

| Method | Endpoint                    | Description                           |
|--------|-----------------------------|---------------------------------------|
| POST   | `/decide`                   | Submit a decision for dual-AI audit   |
| POST   | `/escalate/{decision_id}`   | Mark decision for human review        |
| PATCH  | `/resolve/{decision_id}`    | Resolve an escalated decision         |
| GET    | `/audit/{decision_id}`      | Full audit record                     |
| GET    | `/decisions?page=1&limit=20`| Paginated list of all decisions       |
| GET    | `/health`                   | Health check                          |

### Example: POST /decide

```json
{
  "domain": "loan_approval",
  "input_data": {
    "applicant_age": 34,
    "income": 52000,
    "credit_score": 680,
    "loan_amount": 25000,
    "employment_years": 3
  },
  "context": "First-time applicant with limited credit history"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "decision_id": "uuid-here",
    "primary_response": {
      "verdict": "reject",
      "confidence": 72,
      "reasoning": "...",
      "key_factors": ["limited credit history", "moderate income"]
    },
    "shadow_response": {
      "counter_verdict": "approve",
      "challenge_strength": 85,
      "counter_reasoning": "...",
      "bias_flags": ["income bias against younger applicants"],
      "missed_factors": ["career growth trajectory"]
    },
    "tension_score": 81,
    "final_verdict": "escalated",
    "escalate_flag": true
  }
}
```

---

## Deploy to Render (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Environment:** Python 3.11
5. Add environment variables:
   - `GEMINI_API_KEY`
   - `FIREBASE_CREDENTIALS_PATH`
   - `CORS_ORIGINS`
6. Deploy!

---

## Project Structure

```
├── main.py                 # FastAPI app entry point
├── routers/
│   ├── decisions.py        # /decide, /escalate, /resolve
│   └── audit.py            # /audit, /decisions
├── services/
│   ├── primary.py          # Primary AI (Groq, T=0.3)
│   ├── shadow.py           # Shadow AI  (Groq, T=0.7)
│   └── arbiter.py          # Tension scoring (pure Python)
├── db/
│   └── supabase.py         # Supabase CRUD + SQL schema
├── models/
│   └── schemas.py          # Pydantic request/response models
├── .env.example
├── requirements.txt
└── README.md
```

## License

MIT
