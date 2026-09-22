"""
REST endpoints for creating and checking on multi-agent tasks.
The agent pipeline runs in a separate background thread; the frontend polls
GET /api/tasks/{task_id} to see per-agent progress and the final report.
"""

from fastapi import APIRouter, Depends, HTTPException
import threading
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models import Task
from app.schemas import TaskCreate, TaskOut, TaskListItem
from app.task_runner import run_task_pipeline

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.post("", response_model=TaskOut)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)):
    if not payload.user_request.strip():
        raise HTTPException(status_code=400, detail="user_request cannot be empty")

    task = Task(user_request=payload.user_request, status="pending")
    db.add(task)
    db.commit()
    db.refresh(task)

    print(f"[TASK] Created task: {task.id}")

    threading.Thread(
        target=_run_in_background,
        args=(task.id,),
        daemon=True
    ).start()

    print(f"[TASK] Background thread started: {task.id}")

    return task


def _run_in_background(task_id: str):
    print(f"[THREAD] Started for task: {task_id}")

    db = SessionLocal()

    try:
        task = db.query(Task).filter(Task.id == task_id).first()

        if task:
            print(f"[THREAD] Running pipeline: {task_id}")
            run_task_pipeline(db, task)
            print(f"[THREAD] Pipeline finished: {task_id}")
        else:
            print(f"[THREAD] Task not found: {task_id}")

    except Exception as exc:
        print(f"[THREAD ERROR] {type(exc).__name__}: {exc}")

    finally:
        db.close()
        print(f"[THREAD] Database session closed: {task_id}")


@router.get("", response_model=list[TaskListItem])
def list_tasks(db: Session = Depends(get_db)):
    tasks = db.query(Task).order_by(Task.created_at.desc()).all()

    result = []
    for task in tasks:
        completed_steps = sum(1 for step in task.steps if step.status == "completed")
        result.append(TaskListItem(
            id=task.id,
            user_request=task.user_request,
            status=task.status,
            created_at=task.created_at,
            completed_steps=completed_steps,
            total_steps=len(task.steps),
        ))

    return result


@router.get("/{task_id}", response_model=TaskOut)
def get_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)  # cascade="all, delete-orphan" on Task.steps removes its AgentSteps too
    db.commit()

    print(f"[TASK] Deleted task: {task_id}")

    return None