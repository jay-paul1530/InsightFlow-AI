import asyncio

from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent

from services.weviate_manager.weaviate_utils import (
    create_collection,
    insert_data,
    read_all_objects,
    hybrid_search,
    delete_collection
)


        # write logic to fetch old messages from weaviate, hybrid search
        # very_old_messages = ""

        # last 5 msg appened in list
        # last_5_messages = ""
        
        # inp = f"""
        # VERY OLD MESSAGE:
        # {very_old_messages}

        # Past 5 messages:
        # {last_5_messages}
        
        # Current Input: {user_input}
        # """
def chatbot():

    create_collection("chat_history")

    while True:

        # user_input = "Give me top 5 orders for unit price above 250"

        user_input = input("User: ")

        response = asyncio.run(
            run_ecommerce_agent(user_input=user_input)
        )

        print("AI Response:", response)

        # Store conversation in Weaviate
        weaviate_input = f"""
        
        USER:
        {user_input}

        AI:
        {response}
        """

        insert_data(
            "chat_history",
            {
                "conversation": weaviate_input
            }
        )


if __name__ == "__main__":
   chatbot()

#print(read_all_objects("chat_history"))

#print(hybrid_search("chat_history", "What are the top 5 orders for unit price above 250?", limit=5))

#delete_collection("chat_memory")
