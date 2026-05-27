from fastapi import FastAPI
from api.v1.healthcheck import router as healthcheck_router
from api.v1.dummy import router as dummy_router


app = FastAPI()
app.include_router(healthcheck_router, prefix="/api/v1", tags=["Healthcheck"])
app.include_router(dummy_router, prefix="/api/v1", tags=["Dummy"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="localhost", port=8001, reload=True)
