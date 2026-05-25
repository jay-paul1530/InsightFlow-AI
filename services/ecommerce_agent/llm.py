from agents.extensions.models.litellm_model import LitellmModel
from env import (
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    OPENROUTER_URL
)


def get_openai_model():

    if not OPENROUTER_MODEL:
        raise ValueError("OPENROUTER_MODEL is missing. Please set OPENROUTER_MODEL in your .env file.")
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY is missing. Please set OPENROUTER_API_KEY in your .env file.")

    model_kwargs = {
        "api_key": OPENROUTER_API_KEY,
        "base_url": OPENROUTER_URL,
        "model": OPENROUTER_MODEL
    }

    return LitellmModel(**model_kwargs)
