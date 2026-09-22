"""
Coding Agent
Responsibilities: generate production-ready code based on the plan and
research findings.
"""
from app.tools.llm import ask
from app.workflows.state import AgentState

SYSTEM_PROMPT = """You are the Coding Agent in a multi-agent AI development platform.
Using the plan and research findings provided, write clean, production-ready,
well-commented code that fulfills the user's request. Include brief setup
instructions if relevant. Output code in fenced code blocks with language tags."""


def run_coder(state: AgentState) -> AgentState:
    if state.get("error"):
        return state
    user_request = state["user_request"]
    plan = state.get("plan", "")
    findings = state.get("research_findings", "")

    try:
        prompt = (
            f"User request: {user_request}\n\n"
            f"Plan:\n{plan}\n\n"
            f"Research findings:\n{findings}"
        )
        code = ask(prompt=prompt, system=SYSTEM_PROMPT, temperature=0.3)
        return {**state, "generated_code": code}
    except Exception as exc:
        return {**state, "error": f"Coding agent failed: {exc}"}
