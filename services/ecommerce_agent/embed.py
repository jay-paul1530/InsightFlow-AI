import json
import requests
from env import EMBEDDING_MODEL_NAME

def get_embedding_jina(text):
    url = "https://api.jina.ai/v1/embeddings"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer jina_497d84a9951e4e1b98face46d31958f0_xA-9OusloFgH0v-rUxugCoSfELe"
    }
    data = {
        "model": "jina-embeddings-v2-base-en",
        "input": text
    }


    response = requests.post(url, headers=headers, data=json.dumps(data))

    return response.json() 