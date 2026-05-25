import requests
from env import EMBEDDING_MODEL_NAME, JINA_API_KEY


def get_embedding_jina(text: str):
    url = "https://api.jina.ai/v1/embeddings"

    headers = {
        "Authorization": f"Bearer {JINA_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": EMBEDDING_MODEL_NAME,
        "input": [text],
    }

    response = requests.post(
        url,
        headers=headers,
        json=payload
    )

    # helpful debugging if Jina rejects request
    if response.status_code != 200:
        print("Jina error:", response.status_code)
        print(response.text)
        response.raise_for_status()

    result = response.json()

    return result["data"][0]["embedding"]