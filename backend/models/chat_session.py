from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func
from core.database import Base
from sqlalchemy.orm import relationship


class ChatSession(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    chats = relationship("Chat", back_populates="session")
