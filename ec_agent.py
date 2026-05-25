import asyncio
from env import LEN_CHAT_HISTORY
from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent
import services.ecommerce_agent.weaviate_util as weaviate_util

from services.weviate_manager.weaviate_utils import (
    create_collection,
    insert_data,
    hybrid_search
)


def chatbot(user_input, chat_history=None, collection_name="user_chat_history"):

    create_collection(collection_name)

    if chat_history is None:
        chat_history = []

    # ---------------------------
    # RAG search from Weaviate
    # ---------------------------
    old_results = hybrid_search(
        collection_name,
        user_input,
        limit=LEN_CHAT_HISTORY
    )

    very_old_messages = ""

    if old_results:
        print(f"[RAG] Found {len(old_results)} relevant older messages from Weaviate")

        for item in old_results:
            very_old_messages += (
                item["properties"]["conversation"] + "\n"
            )
    else:
        print("[RAG] No relevant older messages found")

    # ---------------------------
    # Recent memory from list
    # ---------------------------
    last_n_messages = ""

    if chat_history:
        print(f"[Recent Memory] Using last {len(chat_history)} messages from in-memory list")

        for msg in chat_history:
            last_n_messages += msg + "\n"
    else:
        print("[Recent Memory] No recent messages in memory")

    # ---------------------------
    # Final prompt
    # ---------------------------
    inp = f"""
VERY OLD MESSAGE:
{very_old_messages}

Past {LEN_CHAT_HISTORY} messages:
{last_n_messages}

Current Input:
{user_input}
"""

    print("[Agent] Sending prompt with recent + RAG context")

    # run agent
    response = asyncio.run(
        run_ecommerce_agent(user_input=inp)
    )


    # ---------------------------
    # Store current exchange
    # ---------------------------
    current_chat = f"""
USER:
{user_input}

AI:
{response}
"""

    # append to recent memory
    chat_history.append(current_chat)

    # keep only last n
    if len(chat_history) > LEN_CHAT_HISTORY:
        removed = chat_history.pop(0)
        print(f"[Recent Memory] Removed oldest message to keep only last {LEN_CHAT_HISTORY}")

    # store in Weaviate
    insert_data(
        collection_name,
        {
            "conversation": current_chat
        }
    )

    return response, chat_history

    return response, messages       

if __name__ == "__main__":
    
    # last n
    chat_history = []
    
    while True:
        user_input = input("User: ")
        response, chat_history = chatbot(user_input, chat_history=chat_history, collection_name="user_chat_history")
        print("AI Response:", response)
