from sqlalchemy import Column, String, Integer, Boolean
from core.database import Base

class DatabaseSettings(Base):
    __tablename__ = "database_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    is_manual = Column(Boolean, default=False)
    
    # Connection String Option
    connection_string = Column(String, nullable=True)
    
    # Manual Configuration Options
    host = Column(String, nullable=True)
    port = Column(Integer, nullable=True)
    database_name = Column(String, nullable=True)
    username = Column(String, nullable=True)
    password = Column(String, nullable=True)
    ssl_mode = Column(String, nullable=True, default="prefer")
