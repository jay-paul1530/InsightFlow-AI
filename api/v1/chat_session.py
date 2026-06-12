from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from models.chat_session import ChatSession
from models.chat import Chat

router = APIRouter()


# List all chat sessions
@router.get("/sessions")
def get_all_sessions(db: Session = Depends(get_db)):
    sessions = (
        db.query(ChatSession)
        .order_by(ChatSession.created_at.desc())
        .all()
    )

    return [
        {
            "session_id": session.session_id,
            "title": session.title,
            "created_at": session.created_at,
            "updated_at": session.updated_at,
        }
        for session in sessions
    ]


# List all messages in a session
@router.get("/sessions/{session_id}/messages")
def get_session_messages(
    session_id: str,
    db: Session = Depends(get_db)
):
    session = (
        db.query(ChatSession)
        .filter(ChatSession.session_id == session_id)
        .first()
    )

    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    chats = (
        db.query(Chat)
        .filter(Chat.session_id == session_id)
        .order_by(Chat.created_at.asc())
        .all()
    )

    return {
        "session_id": session_id,
        "title": session.title,
        "messages": [
            {
                "role": chat.role,
                "message": chat.message,
                "created_at": chat.created_at,
            }
            for chat in chats
        ]
    }


# Delete a chat session
@router.delete("/sessions/{session_id}")
def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
    if not session:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )
    
    # Delete related chat messages
    db.query(Chat).filter(Chat.session_id == session_id).delete()
    # Delete session
    db.delete(session)
    db.commit()

    # Try deleting weaviate collection
    try:
        import services.ecommerce_agent.weaviate_util as weaviate_util
        collection_name_chat_history = f"chat_history_{session_id.replace('-', '')}"
        weaviate_util.delete_object(collection_name_chat_history)
    except Exception as e:
        print(f"Failed to delete Weaviate collection for session {session_id}: {e}")

    return {"status": "success", "message": f"Session {session_id} deleted successfully."}