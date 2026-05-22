import weaviate
from weaviate.classes.config import Configure
from weaviate.classes.query import MetadataQuery
from weaviate.classes.query import HybridFusion


def create_collection(collection_name):
    # Step 1.1: Connect to your local Weaviate instance
    with weaviate.connect_to_local() as client:
        print(f"Checking if collection {collection_name} exists")
        exists = client.collections.exists(collection_name)
        print(f"Collection {collection_name} exists: {exists}")
        if not exists:
            print(f"Creating collection {collection_name}")
            # Step 1.2: Create a collection
            client.collections.create(
                name=collection_name,
                vector_config=Configure.Vectors.text2vec_ollama(  # Configure the Ollama embedding integration
                api_endpoint="http://ollama:11434", # If using Docker you might need: http://host.docker.internal:11434
                model="nomic-embed-text",  # The model to use
            ))
            print("Collection created successfully")
        else:
            print(f"Collection {collection_name} already exists")


def delete_collection(collection_name):
    with weaviate.connect_to_local() as client:
        client.collections.delete(collection_name)
        print(f"Collection {collection_name} deleted")


def insert_data(collection_name, data_objects: dict):
    with weaviate.connect_to_local() as client:
        exists = client.collections.exists(collection_name)

    if exists:
        with weaviate.connect_to_local() as client:
            coll = client.collections.use(collection_name)
            uuid = coll.data.insert(properties=data_objects)
            print(f"Inserted object with UUID: {uuid}")
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
    
# def insert_batch_data(collection_name, data_objects: list, batch_size=5):
#     with weaviate.connect_to_local() as client:
#         exists = client.collections.exists(collection_name)

#     if exists:
#         with weaviate.connect_to_local() as client:
#             coll = client.collections.use(collection_name)
#             with coll.batch.fixed_size(batch_size=batch_size) as batch:
#                 for obj in data_objects:
#                     batch.add_object(properties=obj)
#                 print(f"Imported & vectorized {len(coll)} objects into the {collection_name} collection")
#     else:
#         print(f"Collection {collection_name} does not exist")


def hybrid_search(collection_name, query, limit =5):
    with weaviate.connect_to_local() as client:
        exists = client.collections.exists(collection_name)

    if exists:
        with weaviate.connect_to_local() as client:
            coll = client.collections.use(collection_name)
            response = coll.query.hybrid(
                query=query,
                limit=limit,
                alpha=0.3,
                fusion_type=HybridFusion.RELATIVE_SCORE,
                return_metadata=MetadataQuery(score=True, explain_score=True),
            )
            data = []
            for obj in response.objects:
                data.append({"properties": obj.properties, 
                            "uuid": obj.uuid,
                            "vector": obj.vector.get("default") if isinstance(obj.vector, dict) else obj.vector,
                            }
                            )
            return data
    else:
        print(f"Collection {collection_name} does not exist")
        return None