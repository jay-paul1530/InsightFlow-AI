from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.settings import DatabaseSettings
from pydantic import BaseModel
from typing import Optional
import psycopg2

router = APIRouter()

class SettingsSchema(BaseModel):
    is_manual: Optional[bool] = False
    connection_string: Optional[str] = None
    database_url: Optional[str] = None  # Frontend sends this
    host: Optional[str] = None
    port: Optional[int] = None
    database_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    ssl_mode: Optional[str] = "prefer"

@router.get("/settings")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(DatabaseSettings).first()
    if not settings:
        return {
            "is_manual": False,
            "connection_string": "",
            "database_url": "",
            "host": "",
            "port": 5432,
            "database_name": "",
            "username": "",
            "password": "",
            "ssl_mode": "prefer"
        }
    return {
        "is_manual": settings.is_manual,
        "connection_string": settings.connection_string or "",
        "database_url": settings.connection_string or "",
        "host": settings.host or "",
        "port": settings.port or 5432,
        "database_name": settings.database_name or "",
        "username": settings.username or "",
        "password": settings.password or "",
        "ssl_mode": settings.ssl_mode or "prefer"
    }

@router.post("/settings")
def save_settings(data: SettingsSchema, db: Session = Depends(get_db)):
    settings = db.query(DatabaseSettings).first()
    if not settings:
        settings = DatabaseSettings()
        db.add(settings)
    
    settings.is_manual = data.is_manual
    # Use database_url if connection_string is not provided
    settings.connection_string = data.connection_string or data.database_url
    settings.host = data.host
    settings.port = data.port
    settings.database_name = data.database_name
    settings.username = data.username
    settings.password = data.password
    settings.ssl_mode = data.ssl_mode
    
    db.commit()
    return {"status": "success", "message": "Database settings updated successfully."}

@router.post("/settings/test")
def test_settings_connection(data: SettingsSchema):
    if data.is_manual:
        if not data.host or not data.port or not data.database_name or not data.username or not data.password:
            raise HTTPException(status_code=400, detail="Missing required manual connection parameters.")
        ssl_str = f"?sslmode={data.ssl_mode}" if data.ssl_mode else ""
        db_url = f"postgresql://{data.username}:{data.password}@{data.host}:{data.port}/{data.database_name}{ssl_str}"
    else:
        db_url = data.connection_string or data.database_url
        if not db_url:
            raise HTTPException(status_code=400, detail="Connection string/database URL is empty.")
        
    try:
        conn = psycopg2.connect(db_url, connect_timeout=5)
        conn.close()
        return {"status": "success", "message": "Connection tested successfully. Credentials are valid."}
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Connection test failed: {str(e)}"
        )
