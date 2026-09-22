"""
Web research tool backed by Tavily's search API.
Used by the Research Agent to pull in live information.
"""
from functools import lru_cache
from tavily import TavilyClient

from app.config import get_settings

settings = get_settings()


@lru_cache
def get_client() -> TavilyClient:
    if not settings.tavily_api_key:
        raise RuntimeError(
            "TAVILY_API_KEY is not set. Add it to your .env file "
            "(get one at https://tavily.com)."
        )
    return TavilyClient(api_key=settings.tavily_api_key)


def search_web(query: str, max_results: int = 5) -> list[dict]:
    """
    Returns a list of {title, url, content} dicts.
    Falls back to an empty list (rather than raising) so a research
    agent can still produce a degraded-but-useful answer if search fails.
    """
    try:
        client = get_client()
        response = client.search(query=query, max_results=max_results, search_depth="advanced")
        results = []
        for item in response.get("results", []):
            results.append({
                "title": item.get("title", ""),
                "url": item.get("url", ""),
                "content": item.get("content", ""),
            })
        return results
    except Exception as exc:
        return [{"title": "search_error", "url": "", "content": str(exc)}]
