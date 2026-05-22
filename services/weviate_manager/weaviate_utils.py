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
                # vector_config=Configure.Vectors.text2vec_ollama(  # Configure the Ollama embedding integration
                #     api_endpoint="http://localhost:11435",  # If using Docker you might need: http://host.docker.internal:11434
                #     model="nomic-embed-text",  # The model to use
                # ),
            )
            print("Collection created successfully")
        else:
            print(f"Collection {collection_name} already exists")
