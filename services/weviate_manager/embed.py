import ollama
from env import EMBEDDING_MODEL_NAME





def get_embedding_ollama(text: str):
    print(f"Embedding text: {text}")

    client = ollama.Client(host="http://localhost:11435")

    response = client.embed(
        model=EMBEDDING_MODEL_NAME,
        input=text,
    )

    embeddings = response.get('embeddings', [])

    if embeddings and isinstance(embeddings[0], list):
        return embeddings[0]

    return embeddings
