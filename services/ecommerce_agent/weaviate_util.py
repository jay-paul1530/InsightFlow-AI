import weaviate
from weaviate.classes.config import Configure
import os
import json
import sys
from pathlib import Path
from weaviate.classes.data import DataObject
sys.path.append(str(Path(__file__).resolve().parent.parent.parent))

from services.ecommerce_agent.embed import get_embedding_jina

def create_collection(collection_name: str):
    
    with weaviate.connect_to_local() as client:
        exists = client.collections.exists(collection_name)
        # print(exists)
        if not exists:
            print(f"Collection named {collection_name} does not exists")
            
            # create collection
            client.collections.create(
                name=collection_name,
            )
            print(f"Collection named {collection_name} created successfully")
        else:
            print(f"Collection named {collection_name} already exists") 


def insert_data(collection_name, data_objects):
    with weaviate.connect_to_local() as client:
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
            print(f"inserted data in {collection_name} with uuids: {response.uuids}")
        
        else:
            print(f"Collection {collection_name} does not exist")


def read_all_objects(collection_name):
    with weaviate.connect_to_local() as client:
        exists = client.collections.exists(collection_name)

    if exists:
        with weaviate.connect_to_local() as client:
            coll = client.collections.use(collection_name)  
            data = []
            for item in coll.iterator(include_vector=False):
                data.append({"uuid": item.uuid, "properties": item.properties, "vector": item.vector})
            return data
    else:
        print(f"Collection {collection_name} does not exist")
        return None

def delete_object(collection_name):
    with weaviate.connect_to_local() as client:
        exists = client.collections.exists(collection_name)

    if exists:
        with weaviate.connect_to_local() as client:
            client.collections.delete(collection_name)
            print(f"Collection {collection_name} deleted")
    else:
        print(f"Collection {collection_name} does not exist")

def search_data(collection_name, query_text, limit=3):
    with weaviate.connect_to_local() as client:
        if client.collections.exists(collection_name):
            collection = client.collections.use(collection_name)
            try:
                response = collection.query.bm25(
                    query=query_text,
                    limit=limit
                )
                data = []
                for item in response.objects:
                    data.append(item.properties)
                return data
            except weaviate.exceptions.WeaviateQueryError as e:
                print(f"Search skipped (collection is likely empty or unindexed): {e}")
                return []
        else:
            print(f"Collection {collection_name} does not exist")
            return []




# collection_name = "Ecommerce_ChatHistory"

# create_collection(collection_name)   
# print(read_collection_schema(collection_name))


# insert_data(collection_name, data_objects)

# print(read_all_objects(collection_name))

# delete_object(collection_name)
