# meivn — Multi-Agent AI Development Platform

meivn turns a plain-English software requirement into a structured development
workflow. Submit a project idea, and five AI agents work through it in
sequence — planning, researching, coding, reviewing, and reporting — with
live progress shown on screen and a final, polished report at the end.

## Features

- **5-agent pipeline** (Planner → Researcher → Coder → Reviewer → Reporter),
  orchestrated with LangGraph and powered by Google Gemini
- **Live web research** during the pipeline via the Tavily Search API
- **Real-time progress UI** — each agent visibly moves from Waiting → Running
  → Completed as the pipeline executes
- **Final report** with a clean, rendered summary, plan, research findings,
  generated code, review notes, and a corrected final code block
- **Authentication** — email/password sign-up & sign-in, plus Google Sign-In,
  with hashed passwords and signed session tokens
- **Guest access** — the platform is fully usable without signing in; signing
  in is optional, not required
- **Projects dashboard** — every submitted project is saved, listed, and
  deletable, with live-updating "time ago" timestamps
- **Settings** — Account, Appearance (live theme/accent/font-size), Privacy &
  Data (including a data export), and Security (sessions, login history)

## Tech Stack

**Frontend:** React 18, React Router, Vite, Tailwind CSS, Font Awesome,
Google Identity Services

**Backend:** FastAPI, Uvicorn, SQLAlchemy, Pydantic, Python 3.10, SQLite,
LangGraph, LangChain, Google Gemini, Tavily Search API, PBKDF2-HMAC-SHA256 +
HMAC-signed session tokens, python-dotenv

## Project Structure

```
meivn/
├── backend/
│   ├── app/
│   │   ├── agents/          # Planner, Researcher, Coder, Reviewer, Reporter
│   │   ├── routers/         # tasks, auth, settings, memory
│   │   ├── workflows/       # LangGraph state & graph definition
│   │   ├── tools/           # LLM wrapper, web search
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── security.py      # password hashing, session tokens
│   │   ├── task_runner.py   # background pipeline execution
│   │   ├── database.py
│   │   ├── config.py
│   │   └── main.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/      # pages, auth, common UI
    │   ├── context/         # AppContext, AuthContext
    │   ├── hooks/           # useAuth, useWorkflow
    │   ├── services/        # api.js
    │   └── utils/           # appearance, googleAuth
    ├── package.json
    └── .env.example
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)
- A [Tavily API key](https://tavily.com)
- (Optional) A Google OAuth Client ID for "Continue with Google" —
  create one at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
cp .env.example .env         # then fill in your API keys

uvicorn app.main:app --reload --port 8000
```

The API will be running at `http://localhost:8000`. Interactive docs are
available at `http://localhost:8000/docs`.

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env         # set VITE_API_URL and (optionally) VITE_GOOGLE_CLIENT_ID

npm run dev
```

The app will be running at `http://localhost:3000` (or whichever port Vite
prints).

### Environment Variables

**`backend/.env`**

| Variable | Description |
|---|---|
| `GOOGLE_API_KEY` | Gemini API key |
| `TAVILY_API_KEY` | Tavily Search API key |
| `GEMINI_MODEL` | Gemini model name |
| `DATABASE_URL` | SQLite connection string |
| `FRONTEND_ORIGIN` | Frontend URL, for CORS |
| `SECRET_KEY` | Random secret used to sign session tokens |
| `TOKEN_TTL_DAYS` | Session token lifetime |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (for Google Sign-In) |

**`frontend/.env`**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend base URL |
| `VITE_GOOGLE_CLIENT_ID` | Same Google OAuth Client ID as the backend |

> Neither `.env` file is committed to this repo — copy the matching
> `.env.example` and fill in your own values.

## How It Works

1. Submit a project requirement from **New Project**.
2. The backend creates a task and runs the 5-agent pipeline in a background
   thread.
3. The frontend polls the task's status and shows each agent's progress live.
4. Once complete, the **Generated Solution** shows the plan, research,
   generated code, review notes, and a final corrected code block.
5. Every project is saved and viewable later from **Projects**.

## Screenshots

*(Add screenshots or a short demo GIF here.)*

## License
This project was developed as an academic project. Feel free to fork, modify, and build upon it for learning and development purposes.
