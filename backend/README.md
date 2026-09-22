# Multi-Agent AI Dev Platform — Backend

FastAPI backend orchestrating a 5-agent pipeline (Planner → Researcher → Coder → Reviewer → Reporter)
via **LangGraph**, powered by **Gemini** (LLM, through **LangChain**) and **Tavily** (web research),
persisted to **SQLite**. Communication with the frontend is plain **REST**.

## Tech Stack

| Layer               | Technology              |
| ------------------- | ------------------------ |
| Frontend            | React + Vite + Tailwind (built separately) |
| Backend             | Python + FastAPI         |
| Agent orchestration | LangGraph                |
| LLM                 | Gemini API                |
| LLM framework       | LangChain                 |
| Web research        | Tavily API                 |
| Database            | SQLite                    |
| API communication   | REST                       |
| Environment         | `.env`                     |
| Version control     | Git + GitHub                |

## Project Structure

```
multi-agent-backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, startup
│   ├── config.py            # .env-based settings (plain os.environ + python-dotenv)
│   ├── database.py          # SQLite engine/session (SQLAlchemy)
│   ├── models.py            # Task, AgentStep, MemoryRecord
│   ├── schemas.py           # Pydantic request/response models
│   ├── task_runner.py       # runs the graph node-by-node, persists each agent's step
│   ├── agents/
│   │   ├── planner.py
│   │   ├── researcher.py
│   │   ├── coder.py
│   │   ├── reviewer.py
│   │   └── reporter.py
│   ├── tools/
│   │   ├── llm.py           # Gemini wrapper (langchain-google-genai)
│   │   └── web_search.py    # Tavily wrapper
│   ├── workflows/
│   │   ├── state.py         # shared LangGraph state (TypedDict)
│   │   └── graph.py         # builds/compiles the LangGraph pipeline
│   ├── memory/
│   │   └── store.py         # long-term key/value memory (SQLite-backed)
│   └── routers/
│       ├── tasks.py         # POST /api/tasks, GET /api/tasks, GET /api/tasks/{id}
│       └── memory.py        # GET /api/memory
├── requirements.txt
├── .env.example
└── README.md
```

## Setup

```bash
cd multi-agent-backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# then edit .env and add your real keys:
#   GOOGLE_API_KEY=...   (https://aistudio.google.com/app/apikey)
#   TAVILY_API_KEY=...   (https://tavily.com)
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

The API is now at `http://localhost:8000`, interactive docs at `http://localhost:8000/docs`.
On first run, `multi_agent.db` (SQLite) is created automatically with all tables.

## API Reference

| Method | Path                   | Description                                                   |
|--------|------------------------|-----------------------------------------------------------------|
| GET    | `/api/health`          | Health check                                                     |
| POST   | `/api/tasks`           | Create a task; body `{ "user_request": "..." }`. Runs the agent pipeline in the background and returns immediately with the task record. |
| GET    | `/api/tasks`           | List all tasks (newest first)                                    |
| GET    | `/api/tasks/{task_id}` | Get one task, all its agent steps, and the final report          |
| GET    | `/api/memory`          | List recent long-term memory records                             |

## Connecting your React (Vite) frontend

```js
// Create a task
const res = await fetch("http://localhost:8000/api/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ user_request: "Build a spam email detector" }),
});
const task = await res.json();

// Poll for progress / final result (REST — no WebSocket)
async function pollTask(taskId) {
  const res = await fetch(`http://localhost:8000/api/tasks/${taskId}`);
  const data = await res.json();
  if (data.status === "completed" || data.status === "failed") {
    return data;
  }
  await new Promise((r) => setTimeout(r, 2000));
  return pollTask(taskId);
}

const finished = await pollTask(task.id);
console.log(finished.final_report);
```

Set `FRONTEND_ORIGIN` in `.env` to match your Vite dev server (default `http://localhost:5173`) —
CORS is already configured in `app/main.py`.

## How the pipeline works

1. `POST /api/tasks` creates a `Task` row and schedules `run_task_pipeline` as a FastAPI `BackgroundTask`.
2. `task_runner.py` walks the 5 agents in order, writing an `AgentStep` row per agent
   (status, input/output, timestamps).
3. Each agent (`app/agents/*.py`) is a plain function `(state) -> state` — LangGraph
   just wires them together in `workflows/graph.py`. If an agent sets `state["error"]`,
   every agent downstream short-circuits and the task is marked `failed`.
4. The Reporter agent's output becomes `Task.final_report`. Poll `GET /api/tasks/{id}`
   from the frontend until `status` is `"completed"` or `"failed"`.

## Notes

- All agent calls are synchronous LLM calls; for high throughput, consider running the
  pipeline via a task queue (Celery/RQ) instead of `BackgroundTasks`.
- `get_llm()` and `get_client()` (in `app/tools/`) raise a clear error if API keys are missing —
  check your `.env` first if you see a `RuntimeError` on task creation.
- Swap SQLite for another database later by changing `DATABASE_URL` in `.env`; SQLAlchemy handles the rest.
