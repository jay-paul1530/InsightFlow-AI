import uuid
import asyncio
from services.ecommerce_agent.run_ecommerce_agent import run_ecommerce_agent
import services.ecommerce_agent.weaviate_util as weaviate_util
from env import WEAVIATE_COLLECTION_NAME
from rich.console import Console
from rich.panel import Panel

console = Console()


async def chatbot(user_input, messages, session_id, user_id, collection_name=WEAVIATE_COLLECTION_NAME):

    context_str = ""
    
    # Retrieve older relevant messages from Weaviate
    old_context = weaviate_util.search_data(collection_name, user_input, session_id=session_id, limit=5)

    console.print(f"[dim]Retrieved {len(old_context)} relevant older messages[/dim]")

    if old_context:
        context_str += "Relevant Older Context:\n"
        for item in old_context:
            user_msg = item.get("user", "")
            ai_msg = item.get("ai", "")
            context_str += f"User: {user_msg}\nAI: {ai_msg}\n"
        context_str += "\n"
        
    if messages:
        context_str += "Recent Conversation History:\n"
        for msg in messages:
            context_str += f"User: {msg['User']}\nAI: {msg['AI']}\n"
        context_str += "\nCurrent User Input-\nUser: "
        
    full_input = context_str + user_input

    console.print(Panel(full_input, title="Full Input to Agent", border_style="cyan", expand=False))
    
    response = await run_ecommerce_agent(user_input=full_input)
    
    # Save to recent memory array
    messages.append({"User": user_input, "AI": response})
    
    # Save immediately to long-term memory (Weaviate)
    normalized_msg = {"user": user_input, "ai": response, "session_id": session_id, "user_id": user_id}
    weaviate_util.insert_data(collection_name, [normalized_msg])

    # Limit the recent memory array so it doesn't grow forever
    if len(messages) >= 5:
        messages.pop(0)

    return response, messages       


async def run_chatbot():
    weaviate_util.create_collection(WEAVIATE_COLLECTION_NAME)
    messages = []
    session_id = str(uuid.uuid4())
    user_id = str(uuid.uuid4())

    console.print(Panel(f"Your Session ID is: {session_id}\nYour User ID is: {user_id}", title="Session Info", border_style="green", expand=False))

    while True:
        user_input = console.input("[bold blue]User:[/bold blue] ")
        if not user_input.strip():
            continue
        result, messages = await chatbot(user_input, messages, session_id, user_id, collection_name=WEAVIATE_COLLECTION_NAME)
        console.print(f"\n[bold green]AI:[/bold green] {result}\n")


if __name__ == "__main__":
    asyncio.run(run_chatbot())
