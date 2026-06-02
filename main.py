from fastapi import FastAPI
from api.v1.healthcheck import router as healthcheck_router
from api.v1.dummy import router as dummy_router
from api.v1.chat import router as chat_router
from core.database import Base, engine
import models.chat
import models.chat_session

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(healthcheck_router, prefix="/api/v1", tags=["Healthcheck"])
app.include_router(dummy_router, prefix="/api/v1", tags=["Dummy"])
app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=8001, reload=True)
