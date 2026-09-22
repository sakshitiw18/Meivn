"""
Endpoints for viewing and managing long-term shared memory (facts/preferences
agents have stored across tasks). Also backs the "Manage memories" list in
Settings -> Memory & Personalization.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.memory.store import get_recent_memory, save_memory
from app.models import MemoryRecord
from app.schemas import MemoryOut, MemoryCreate

router = APIRouter(prefix="/api/memory", tags=["memory"])


@router.get("", response_model=list[MemoryOut])
def list_memory(db: Session = Depends(get_db)):
    return get_recent_memory(db)


@router.post("", response_model=MemoryOut)
def create_memory(payload: MemoryCreate, db: Session = Depends(get_db)):
    if not payload.value.strip():
        raise HTTPException(status_code=400, detail="value cannot be empty")

    return save_memory(db, key=payload.key, value=payload.value)


@router.delete("/{memory_id}")
def delete_memory(memory_id: int, db: Session = Depends(get_db)):
    record = db.query(MemoryRecord).filter(MemoryRecord.id == memory_id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Memory not found")

    db.delete(record)
    db.commit()
    return {"status": "deleted"}


@router.delete("")
def delete_all_memory(db: Session = Depends(get_db)):
    db.query(MemoryRecord).delete()
    db.commit()
    return {"status": "cleared"}