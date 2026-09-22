"""
SQLAlchemy ORM models.

Task        -> one user request, runs through the full agent pipeline
AgentStep   -> one agent's output within a task (planner/research/coder/reviewer/reporter)
Memory      -> long-term key/value store shared across tasks (user prefs, past findings)
"""
import uuid
from datetime import datetime

from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Integer, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


def gen_id() -> str:
    return str(uuid.uuid4())


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=gen_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    user_request = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending | running | completed | failed
    final_report = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    steps = relationship("AgentStep", back_populates="task", cascade="all, delete-orphan")


class AgentStep(Base):
    __tablename__ = "agent_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, ForeignKey("tasks.id"), nullable=False)
    agent_name = Column(String, nullable=False)  # planner | researcher | coder | reviewer | reporter
    status = Column(String, default="pending")  # pending | running | completed | failed
    input_data = Column(Text, nullable=True)
    output_data = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    started_at = Column(DateTime, nullable=True)
    finished_at = Column(DateTime, nullable=True)

    task = relationship("Task", back_populates="steps")


class MemoryRecord(Base):
    """Long-term shared memory: durable facts/preferences agents can read across tasks."""
    __tablename__ = "memory_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String, nullable=False, index=True)
    value = Column(Text, nullable=False)
    source_task_id = Column(String, ForeignKey("tasks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class User(Base):
    """
    A real account, created via /api/auth/signup, /api/auth/login, or
    /api/auth/google. This row IS the Settings -> Account/Appearance/Memory/
    Privacy/Security/Accessibility record for that person — signing up fills
    in name/username/email automatically, and every Settings save just
    updates this same row.
    """
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_id)

    # --- Auth ---
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=True)   # null for Google-only accounts
    password_salt = Column(String, nullable=True)
    auth_provider = Column(String, default="local")  # "local" | "google"
    google_id = Column(String, nullable=True, unique=True)

    # --- Account ---
    name = Column(String, default="")
    username = Column(String, unique=True, nullable=True)
    account_type = Column(String, default="Free Plan")
    email_product_updates = Column(Boolean, default=True)
    email_security_alerts = Column(Boolean, default=True)
    email_marketing = Column(Boolean, default=False)

    # --- Appearance ---
    theme = Column(String, default="dark")
    accent_color = Column(String, default="indigo")
    font_size = Column(String, default="medium")
    animations_enabled = Column(Boolean, default=True)

    # --- Privacy & Data ---
    save_chat_history = Column(Boolean, default=True)
    improve_ai_with_conversations = Column(Boolean, default=True)

    # --- Security ---
    twofa_enabled = Column(Boolean, default=False)
    passkeys_enabled = Column(Boolean, default=False)
    security_alerts_enabled = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SessionLog(Base):
    """
    A real login session, created each time a user signs in (local or
    Google). Backs both "Active sessions" (revoked=false) and "Login
    history" (every row) in Settings -> Security, scoped per-user.
    """
    __tablename__ = "session_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    device = Column(String, nullable=False)
    is_current = Column(Boolean, default=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)