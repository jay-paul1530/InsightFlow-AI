import json
import requests
from env import EMBEDDING_MODEL_NAME, JINA_API_KEY
from rich.console import Console

console = Console()


def get_embedding_jina(text):
    """
    Generates embeddings for the input text using Jina AI's embeddings API.
    Args:
        text: The text to generate embeddings for (list of strings).
    Returns:
        dict: Dictionary containing embeddings.
    """

    console.print(f"[dim]Generating embeddings for {len(text)} texts...[/dim]")
    url = "https://api.jina.ai/v1/embeddings"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {JINA_API_KEY}"
    }
    data = {
        "model": EMBEDDING_MODEL_NAME,
        "input": text
    }

    response = requests.post(url, headers=headers, data=json.dumps(data))
    console.print(f"[dim]Generated embeddings for {len(text)} texts[/dim]")
    return response.json()
