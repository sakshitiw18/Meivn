"""
Runs the LangGraph pipeline for a single Task, one node (agent) at a time,
persisting an AgentStep row per agent so the frontend can poll
GET /api/tasks/{task_id} to see per-agent progress and the final report.
"""
import json
from datetime import datetime

from sqlalchemy.orm import Session

from app.models import Task, AgentStep
from app.workflows.state import AgentState
from app.agents.planner import run_planner
from app.agents.researcher import run_researcher
from app.agents.coder import run_coder
from app.agents.reviewer import run_reviewer
from app.agents.reporter import run_reporter

# Ordered pipeline: (agent_name, function, output_field)
PIPELINE = [
    ("planner", run_planner, "plan"),
    ("researcher", run_researcher, "research_findings"),
    ("coder", run_coder, "generated_code"),
    ("reviewer", run_reviewer, "review_feedback"),
    ("reporter", run_reporter, "final_report"),
]


def run_task_pipeline(db: Session, task: Task):
    task.status = "running"
    db.commit()

    state: AgentState = {
        "task_id": task.id,
        "user_request": task.user_request
    }

    for agent_name, agent_fn, output_field in PIPELINE:
        step = AgentStep(
            task_id=task.id,
            agent_name=agent_name,
            status="running",
            input_data=json.dumps(
                {k: v for k, v in state.items() if k != "task_id"}
            )[:4000],
            started_at=datetime.utcnow(),
        )

        db.add(step)
        db.commit()
        db.refresh(step)

        state = agent_fn(state)

        step.finished_at = datetime.utcnow()

        if state.get("error"):
            step.status = "failed"
            step.error = state["error"]
            db.commit()
            break

        else:
            step.status = "completed"
            step.output_data = str(
                state.get(output_field, "")
            )[:8000]

            db.commit()

    if state.get("error"):
        task.status = "failed"

    else:
        task.status = "completed"

        # Convert the reporter output to a string before saving it
        # into the SQLite Text column.
        final_report = state.get("final_report", "")

        if isinstance(final_report, list):
            text_parts = []

            for item in final_report:
                if isinstance(item, dict):
                    text = item.get("text")

                    if text:
                        text_parts.append(str(text))
                else:
                    text_parts.append(str(item))

            task.final_report = "\n".join(text_parts)

        elif isinstance(final_report, dict):
            task.final_report = str(
                final_report.get("text", final_report)
            )

        else:
            task.final_report = str(final_report)

    task.updated_at = datetime.utcnow()
    db.commit()