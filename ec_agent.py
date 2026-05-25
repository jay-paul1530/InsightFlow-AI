import asyncio
from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent
import services.ecommerce_agent.weaviate_util as weaviate_util


def chatbot(user_input, messages, collection_name="Ecommerce_ChatHistory"):

    if len(messages) >= 5:
        popped_msg = messages.pop(0)
        weaviate_util.insert_data(collection_name, [popped_msg])
        
    context_str = ""
    
    # Retrieve older relevant messages from Weaviate
    old_context = weaviate_util.search_data(collection_name, user_input, limit=2)
    if old_context:
        context_str += "Relevant Older Context:\n"
        for item in old_context:
            user_msg = item.get("user", item.get("User", ""))
            ai_msg = item.get("aI", item.get("AI", item.get("ai", "")))
            context_str += f"User: {user_msg}\nAI: {ai_msg}\n"
        context_str += "\n"
        
    if messages:
        context_str += "Recent Conversation History:\n"
        for msg in messages:
            context_str += f"User: {msg['User']}\nAI: {msg['AI']}\n"
        context_str += "\nCurrent Request: "
        
    full_input = context_str + user_input
    
    response = asyncio.run(run_ecommerce_agent(user_input=full_input))
    messages.append({"User": user_input, "AI": response})

    return response, messages       

if __name__ == "__main__":
    weaviate_util.create_collection("Ecommerce_ChatHistory")
    messages = []
    while True:
        user_input = input("User: ")
        if not user_input.strip():
            continue
        result, messages = chatbot(user_input, messages, collection_name="Ecommerce_ChatHistory")
        print(f"AI: {result}")

