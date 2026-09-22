"""
Shared state that flows through the LangGraph pipeline.
Every node (agent) reads from and writes to this TypedDict.
"""
from typing import TypedDict, Optional


class AgentState(TypedDict, total=False):
    task_id: str
    user_request: str

    plan: Optional[str]                 # Planner output
    research_findings: Optional[str]    # Research Agent output
    generated_code: Optional[str]       # Coding Agent output
    review_feedback: Optional[str]      # Reviewer Agent output
    final_report: Optional[str]         # Report Agent output

    error: Optional[str]
