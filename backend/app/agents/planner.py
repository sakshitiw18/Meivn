"""
Planner Agent
Responsibilities: understand the user's goal, break it into subtasks,
and decide what research/coding work is needed.
"""
from app.tools.llm import ask
from app.workflows.state import AgentState


SYSTEM_PROMPT = """You are the Planner Agent in a multi-agent AI development platform.

Given a user's request, break it down into a short, numbered, actionable plan
covering:

1. What needs to be researched
2. What needs to be built or coded
3. What should be checked during review

Be concise and concrete.
"""


def run_planner(state: AgentState) -> AgentState:

    user_request = state["user_request"]

    try:
        plan = ask(
            prompt=user_request,
            system=SYSTEM_PROMPT,
            temperature=0.2,
        )

        return {
            **state,
            "plan": plan,
            "error": None,
        }

    except Exception as exc:

        return {
            **state,
            "error": f"Planner failed: {exc}",
        }