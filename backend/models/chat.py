from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from core.database import Base
from sqlalchemy.orm import relationship

class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    role = Column(String, nullable=False)
    message = Column(String, nullable=False)
    session_id = Column(String, ForeignKey("sessions.session_id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    session = relationship("ChatSession", back_populates="chats")
