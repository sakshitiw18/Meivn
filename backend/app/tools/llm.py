"""
Thin wrapper around the Gemini chat model via langchain-google-genai.
Every agent imports get_llm() rather than constructing its own client,
so the model/temperature can be tuned centrally.
"""
from functools import lru_cache
from langchain_google_genai import ChatGoogleGenerativeAI

from app.config import get_settings

settings = get_settings()


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


def ask(prompt: str, system: str = "", temperature: float = 0.3) -> str:
    """Simple helper: send a system+user prompt, get back plain text."""
    llm = get_llm(temperature=temperature)
    messages = []
    if system:
        messages.append(("system", system))
    messages.append(("human", prompt))
    response = llm.invoke(messages)
    return response.content
