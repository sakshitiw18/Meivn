"""
FastAPI application entrypoint.

Run with:
    uvicorn app.main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.routers import tasks, memory, settings as settings_router, auth

settings = get_settings()

app = FastAPI(
    title="Multi-Agent AI Dev Platform API",
    description="Backend orchestrating Planner, Research, Coding, Reviewer, "
                 "and Report agents via LangGraph + Gemini.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_origin,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health_check():
    return {"status": "ok", "env": settings.app_env}


app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(memory.router)
app.include_router(settings_router.router)