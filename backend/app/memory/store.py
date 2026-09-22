"""
Shared memory for the agent pipeline.

Two layers:
1. Working memory: an in-process dict passed through the LangGraph state
   for the lifetime of a single task (planner -> research -> coder -> ...).
2. Long-term memory: persisted to SQLite (MemoryRecord) so future tasks
   can recall prior findings/preferences. This is intentionally simple
   (key/value) — swap in a vector DB later for semantic recall.
"""
from sqlalchemy.orm import Session
from app.models import MemoryRecord


def save_memory(db: Session, key: str, value: str, task_id: str | None = None) -> MemoryRecord:
    record = MemoryRecord(key=key, value=value, source_task_id=task_id)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_memory_by_key(db: Session, key: str, limit: int = 5) -> list[MemoryRecord]:
    return (
        db.query(MemoryRecord)
        .filter(MemoryRecord.key == key)
        .order_by(MemoryRecord.created_at.desc())
        .limit(limit)
        .all()
    )


def get_recent_memory(db: Session, limit: int = 20) -> list[MemoryRecord]:
    return db.query(MemoryRecord).order_by(MemoryRecord.created_at.desc()).limit(limit).all()
