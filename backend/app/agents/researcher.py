"""
Research Agent
Responsibilities: collect information via web search, summarize findings
relevant to the plan produced by the Planner Agent.
"""
from app.tools.llm import ask
from app.tools.web_search import search_web
from app.workflows.state import AgentState

SYSTEM_PROMPT = """You are the Research Agent in a multi-agent AI development platform.
You are given the user's request, the plan from the Planner Agent, and a set of
web search results. Summarize the most relevant, accurate findings needed to
complete the plan. Cite sources by URL where useful. Be concise."""


def run_researcher(state: AgentState) -> AgentState:
    if state.get("error"):
        return state
    user_request = state["user_request"]
    plan = state.get("plan", "")

    try:
        search_results = search_web(user_request, max_results=5)
        formatted_results = "\n\n".join(
            f"Title: {r['title']}\nURL: {r['url']}\nContent: {r['content'][:800]}"
            for r in search_results
        )
        prompt = (
            f"User request: {user_request}\n\n"
            f"Plan:\n{plan}\n\n"
            f"Search results:\n{formatted_results}"
        )
        findings = ask(prompt=prompt, system=SYSTEM_PROMPT, temperature=0.2)
        return {**state, "research_findings": findings}
    except Exception as exc:
        return {**state, "error": f"Research agent failed: {exc}"}
