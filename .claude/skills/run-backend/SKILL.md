---
name: run-backend
description: Start the text2sql backend and its runtime dependencies (Weaviate, MCP sandbox, FastAPI app) in the correct order. Use when asked to run, start, or boot the backend locally.
---

# Run backend

Run from `backend/`. Bring up dependencies first, then the API.

## 1. Preconditions
- `.env` exists and is filled (copy from `.env.example` if missing). Required: `DATABASE_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_URL`, `MCP_SANDBOX_URL`, `WEAVIATE_COLLECTION_NAME`, `JINA_API_KEY`, `EMBEDDING_MODEL_NAME`.
- Deps installed: `pip install -r requirement.txt` (filename has no trailing `s`).

## 2. Weaviate (vector context)
```
docker compose -f docker-compose-weaviate.yml up -d
```

## 3. MCP sandbox (safe execution, serves localhost:8181)
Start the embedded server in `python-mcp-sandbox/` per its README. Confirm `MCP_SANDBOX_URL` (default `http://localhost:8181/sse`) is reachable.

## 4. API
```
python main.py
```
Uvicorn on `localhost:8001`, routes under `/api/v1`. Health: `GET http://localhost:8001/api/v1/health` (check `api/v1/healthcheck.py` for exact path).

If only checking that the app boots and DB tables create (`Base.metadata.create_all` runs at import), step 4 alone is enough; the agent endpoints need steps 2–3.
