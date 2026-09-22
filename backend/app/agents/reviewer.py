"""
Reviewer Agent
Responsibilities: check quality of the generated code, detect errors,
suggest improvements.
"""
from app.tools.llm import ask
from app.workflows.state import AgentState

SYSTEM_PROMPT = """You are the Reviewer Agent in a multi-agent AI development platform.
Review the generated code for correctness, security issues, style, and
efficiency. List concrete issues found and concrete suggested fixes.
If the code looks solid, say so briefly and note only minor nitpicks."""


def run_reviewer(state: AgentState) -> AgentState:
    if state.get("error"):
        return state
    generated_code = state.get("generated_code", "")

    try:
        feedback = ask(prompt=generated_code, system=SYSTEM_PROMPT, temperature=0.2)
        return {**state, "review_feedback": feedback}
    except Exception as exc:
        return {**state, "error": f"Reviewer agent failed: {exc}"}
