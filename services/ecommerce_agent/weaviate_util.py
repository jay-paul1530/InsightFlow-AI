import json
import weaviate
from weaviate.classes.init import Auth
from weaviate.classes.data import DataObject
from weaviate.classes.config import Configure
from weaviate.classes.query import Filter
from services.ecommerce_agent.embed import get_embedding_jina
from rich.console import Console
from env import WEAVIATE_URL, WEAVIATE_API_KEY

console = Console()


def create_collection(collection_name: str):
    with weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    ) as client:
        exists = client.collections.exists(collection_name)
        if not exists:
            console.print(f"[dim]Collection named {collection_name} does not exist. Creating...[/dim]")

            # create collection
            client.collections.create(
                name=collection_name,
                vector_index_config=Configure.VectorIndex.hfresh()
            )
            console.print(f"[bold green]Collection named {collection_name} created successfully[/bold green]")
        else:
            console.print(f"[dim]Collection named {collection_name} already exists[/dim]") 


def insert_data(collection_name, data_objects):
    with weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    ) as client:
        exists = client.collections.exists(collection_name)

        if exists:
            collection = client.collections.use(collection_name)
            items = []
            for obj in data_objects:
                # get embedding for each object individually
                embedding_resp = get_embedding_jina([json.dumps(obj)])
                vec = embedding_resp['data'][0]['embedding']
                items.append(DataObject(properties=obj, vector=vec))
            
            response = collection.data.insert_many(items)
            console.print(f"[dim]Inserted data in {collection_name} with uuids: {response.uuids}[/dim]")
        
        else:
            console.print(f"[yellow]Collection {collection_name} does not exist[/yellow]")


def read_all_objects(collection_name):
    with weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    ) as client:
        exists = client.collections.exists(collection_name)

    if exists:
        with weaviate.connect_to_weaviate_cloud(
            cluster_url=WEAVIATE_URL,
            auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
        ) as client:
            coll = client.collections.use(collection_name)  
            data = []
            for item in coll.iterator(include_vector=False):
                data.append({"uuid": item.uuid, "properties": item.properties, "vector": item.vector})
            return data
    else:
        console.print(f"[yellow]Collection {collection_name} does not exist[/yellow]")
        return None

def delete_object(collection_name):
    with weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    ) as client:
        exists = client.collections.exists(collection_name)

    if exists:
        with weaviate.connect_to_weaviate_cloud(
            cluster_url=WEAVIATE_URL,
            auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
        ) as client:
            client.collections.delete(collection_name)
            console.print(f"[dim]Collection {collection_name} deleted[/dim]")
    else:
        console.print(f"[yellow]Collection {collection_name} does not exist[/yellow]")


def search_data(collection_name, query_text, session_id=None, limit=3):
    with weaviate.connect_to_weaviate_cloud(
        cluster_url=WEAVIATE_URL,
        auth_credentials=Auth.api_key(WEAVIATE_API_KEY),
    ) as client:
        if client.collections.exists(collection_name):
            collection = client.collections.use(collection_name)
            try:
                filters = Filter.by_property("session_id").equal(session_id) if session_id else None
                response = collection.query.bm25(
                    query=query_text,
                    filters=filters,
                    limit=limit
                )
                data = []
                for item in response.objects:
                    data.append(item.properties)
                return data
            except weaviate.exceptions.WeaviateQueryError as e:
                console.print(f"[yellow]Weaviate search skipped (collection is likely empty or unindexed).[/yellow]")
                return []
        else:
            console.print(f"[yellow]Collection {collection_name} does not exist[/yellow]")
            return []
