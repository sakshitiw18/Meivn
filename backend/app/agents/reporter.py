"""
Report Agent
Responsibilities: combine all agent outputs into one final, readable report
for the end user.
"""
from app.tools.llm import ask
from app.workflows.state import AgentState

SYSTEM_PROMPT = """You are the Report Agent in a multi-agent AI development platform.
Combine the plan, research findings, generated code, and review feedback into
one clear, well-structured final report for the user. Use markdown headings,
in this exact order:

## Summary
## Plan
## Research Findings
## Generated Code
## Review Notes
## Final Code (Updated)

Keep the summary to 2-3 sentences.

For "## Final Code (Updated)": take the original Generated Code and apply
every fix, correction, and suggestion listed in the Review Notes to it,
producing one complete, corrected, ready-to-use version of the code in
fenced code blocks with language tags. This is the final, authoritative
version of the code the user should actually use — apply the fixes
directly rather than just describing them again. If the Review Notes found
no real issues (only minor nitpicks or nothing to fix), this section can
be the same as Generated Code, optionally with the minor nitpicks applied."""


def run_reporter(state: AgentState) -> AgentState:
    if state.get("error"):
        return state
    try:
        prompt = (
            f"User request: {state.get('user_request', '')}\n\n"
            f"Plan:\n{state.get('plan', '')}\n\n"
            f"Research findings:\n{state.get('research_findings', '')}\n\n"
            f"Generated code:\n{state.get('generated_code', '')}\n\n"
            f"Review feedback:\n{state.get('review_feedback', '')}"
        )
        report = ask(prompt=prompt, system=SYSTEM_PROMPT, temperature=0.2)
        return {**state, "final_report": report}
    except Exception as exc:
        return {**state, "error": f"Report agent failed: {exc}"}