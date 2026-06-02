from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db

import services.ecommerce_agent.weaviate_util as weaviate_util
import uuid
from rich.console import Console
from rich.panel import Panel
from ec_agent import chatbot


from models.chat_session import ChatSession
from models.chat import Chat


console = Console()
router = APIRouter()


@router.get("/chat")
async def chat_conversation(user_input: str, session_id: str = None, db: Session = Depends(get_db)):

    if session_id is None:
        session_id = str(uuid.uuid4())
        new_session = ChatSession(session_id=session_id, title=user_input[:15])
        db.add(new_session)
        db.commit()
    else:
        existing_session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
        if not existing_session:
            new_session = ChatSession(session_id=session_id, title=user_input[:15])
            db.add(new_session)
            db.commit()
   
    collection_name_chat_history = f"chat_history_{session_id.replace('-', '')}"
    weaviate_util.create_collection(collection_name=collection_name_chat_history)

    # Fetch last 5 chat history pairs
    chat_records = db.query(Chat).filter(Chat.session_id == session_id).order_by(Chat.id.desc()).limit(10).all()
    chat_records.reverse()

    messages = []
    temp_user_msg = None
    for chat in chat_records:
        if chat.role == "user":
            temp_user_msg = chat.message
        elif chat.role == "ai" and temp_user_msg is not None:
            messages.append({"User": temp_user_msg, "AI": chat.message})
            temp_user_msg = None

    messages = messages[-5:]
    console.print("[bold cyan]Recent Messages:[/bold cyan]", messages)

    user_id = "Dipesh_0001"

    console.print(Panel(f"Your Session ID is: {session_id}\nYour User ID is: {user_id}", title="Session Info", border_style="green", expand=False))

    user_input = user_input.strip()

    result, messages = await chatbot(user_input, messages, session_id, user_id, collection_name=collection_name_chat_history)

    # Save to db
    new_user_chat = Chat(session_id=session_id, role="user", message=user_input)
    new_ai_chat = Chat(session_id=session_id, role="ai", message=result)
    db.add(new_user_chat)
    db.add(new_ai_chat)
    db.commit()

    console.print(f"\n[bold green]AI:[/bold green] {result}\n")

    return {"result": result, "session_id": session_id}




# Chat Delete API (Optional)
