from agents.extensions.models.litellm_model import LitellmModel
from env import (
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    OPENROUTER_URL
)


def get_openai_model():

    model_kwargs = {
        "api_key": OPENROUTER_API_KEY,
        "base_url": OPENROUTER_URL,
        "model": OPENROUTER_MODEL
    }

    return LitellmModel(**model_kwargs)
