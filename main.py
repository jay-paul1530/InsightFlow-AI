from fastapi import FastAPI
from api.v1.healthcheck import router as healthcheck_router
from api.v1.dummy import router as dummy_router
from api.v1.chat import router as chat_router
from api.v1.chat_session import router as chat_session_router
from api.v1.settings import router as settings_router
from core.database import Base, engine
import models.chat
import models.chat_session
import models.settings

from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(docs_url=None, redoc_url=None, openapi_url=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(healthcheck_router, prefix="/api/v1", tags=["Healthcheck"])
app.include_router(dummy_router, prefix="/api/v1", tags=["Dummy"])
app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])
app.include_router(
    chat_session_router,
    prefix="/api/v1",
    tags=["Chat Sessions"]
)
app.include_router(
    settings_router,
    prefix="/api/v1",
    tags=["Settings"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
