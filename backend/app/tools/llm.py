"""
Thin wrapper around the Gemini chat model via langchain-google-genai.
Every agent imports get_llm() rather than constructing its own client,
so the model/temperature can be tuned centrally.
"""
import time
from functools import lru_cache
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import get_settings

settings = get_settings()

# Gemini occasionally returns these when its servers are briefly overloaded —
# not a real failure, just needs a short wait and another try.
_TRANSIENT_ERROR_MARKERS = ("503", "UNAVAILABLE", "overloaded", "high demand", "429", "RESOURCE_EXHAUSTED")


@lru_cache
def get_llm(temperature: float = 0.3) -> ChatGoogleGenerativeAI:
    if not settings.google_api_key:
        raise RuntimeError(
            "GOOGLE_API_KEY is not set. Add it to your .env file "
            "(get one at https://aistudio.google.com/app/apikey)."
        )
    return ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.google_api_key,
        temperature=temperature,
    )


def _is_transient(exc: Exception) -> bool:
    text = str(exc)
    return any(marker in text for marker in _TRANSIENT_ERROR_MARKERS)


def ask(prompt: str, system: str = "", temperature: float = 0.3, max_retries: int = 3) -> str:
    """
    Send a system+user prompt, get back plain text.
    Automatically retries a couple of times, with a short backoff, if Gemini
    returns a transient "temporarily overloaded" style error (503/429) —
    those clear up within seconds and aren't worth failing the whole agent
    step over.
    """
    llm = get_llm(temperature=temperature)
    messages = []
    if system:
        messages.append(("system", system))
    messages.append(("human", prompt))

    last_error = None

    for attempt in range(max_retries):
        try:
            response = llm.invoke(messages)
            return response.content
        except Exception as exc:
            last_error = exc

            if attempt < max_retries - 1 and _is_transient(exc):
                wait_seconds = 2 ** attempt  # 1s, 2s, 4s...
                print(f"[LLM] Transient error ({exc}); retrying in {wait_seconds}s (attempt {attempt + 1}/{max_retries})")
                time.sleep(wait_seconds)
                continue

            raise

    raise last_error