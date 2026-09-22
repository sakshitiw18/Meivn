"""
LangGraph orchestration for the multi-agent pipeline:

    Planner -> Researcher -> Coder -> Reviewer -> Reporter

If an agent fails, the graph skips the remaining agents and
returns the error in the final AgentState.
"""

from langgraph.graph import StateGraph, END

from app.workflows.state import AgentState
from app.agents.planner import run_planner
from app.agents.researcher import run_researcher
from app.agents.coder import run_coder
from app.agents.reviewer import run_reviewer
from app.agents.reporter import run_reporter


def should_continue(state: AgentState) -> str:
    """
    Decide whether the pipeline should continue.

    If an agent has stored an error in the shared state,
    stop the workflow immediately.
    """

    if state.get("error"):
        return "stop"

    return "continue"


def build_graph():
    graph = StateGraph(AgentState)

    # Register agents
    graph.add_node("planner", run_planner)
    graph.add_node("researcher", run_researcher)
    graph.add_node("coder", run_coder)
    graph.add_node("reviewer", run_reviewer)
    graph.add_node("reporter", run_reporter)

    # Starting point
    graph.set_entry_point("planner")

    # Planner
    graph.add_conditional_edges(
        "planner",
        should_continue,
        {
            "continue": "researcher",
            "stop": END,
        },
    )

    # Researcher
    graph.add_conditional_edges(
        "researcher",
        should_continue,
        {
            "continue": "coder",
            "stop": END,
        },
    )

    # Coder
    graph.add_conditional_edges(
        "coder",
        should_continue,
        {
            "continue": "reviewer",
            "stop": END,
        },
    )

    # Reviewer
    graph.add_conditional_edges(
        "reviewer",
        should_continue,
        {
            "continue": "reporter",
            "stop": END,
        },
    )

    # Reporter
    graph.add_edge("reporter", END)

    return graph.compile()


# Compile once and reuse across requests.
agent_graph = build_graph()


def run_pipeline(task_id: str, user_request: str) -> AgentState:
    """
    Run the complete multi-agent pipeline.
    """

    initial_state: AgentState = {
        "task_id": task_id,
        "user_request": user_request,
    }

    result = agent_graph.invoke(initial_state)

    return result