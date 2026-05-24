import asyncio

from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent

from services.weviate_manager.weaviate_utils import (
    create_collection,
    insert_data,
    hybrid_search
)


def chatbot():

    create_collection("products_2")

    # last 5
    chat_history = []

    while True:

        user_input = input("User: ")

        # ---------------------------
        # RAG search from Weaviate
        # ---------------------------
        old_results = hybrid_search(
            "products_2",
            user_input,
            limit=5
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
        last_5_messages = ""

        if chat_history:
            print(f"[Recent Memory] Using last {len(chat_history)} messages from in-memory list")

            for msg in chat_history:
                last_5_messages += msg + "\n"
        else:
            print("[Recent Memory] No recent messages in memory")

        # ---------------------------
        # Final prompt
        # ---------------------------
        inp = f"""
VERY OLD MESSAGE:
{very_old_messages}

Past 5 messages:
{last_5_messages}

Current Input:
{user_input}
"""

        print("[Agent] Sending prompt with recent + RAG context")

        # run agent
        response = asyncio.run(
            run_ecommerce_agent(user_input=inp)
        )

        print("AI Response:", response)

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

        # keep only last 5
        if len(chat_history) > 5:
            removed = chat_history.pop(0)
            print("[Recent Memory] Removed oldest message to keep only last 5")

        # store in Weaviate
        insert_data(
            "products_2",
            {
                "conversation": current_chat
            }
        )

        print("[Weaviate] Stored current conversation\n")


if __name__ == "__main__":
    chatbot()