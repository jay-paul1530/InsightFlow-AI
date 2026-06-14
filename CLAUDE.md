# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Text-to-SQL assistant. FastAPI backend hosts a conversational AI agent that converts natural language to SQL over an e-commerce PostgreSQL database. Uses the `openai-agents` framework with LiteLLM (OpenRouter) for the LLM, Weaviate for per-session semantic context, and an MCP sandbox for safe code/result execution. The `frontend/` directory is currently empty.

## Commands

Backend runs from `backend/`:

- Run API: `python main.py` — uvicorn on `localhost:8001`, `reload=True`. Routes prefixed `/api/v1`.
- Run ETL (CSV → PostgreSQL): `python run_etl.py`
- Test agent standalone: `python ec_agent.py`
- Install deps: `pip install -r requirement.txt` — note the filename is `requirement.txt` (no trailing `s`).

No test framework, linter, or formatter is configured. Don't assume `pytest`/`ruff` exist.

## Environment

Copy `.env.example` → `.env` and fill it. Loaded via `env.py` / python-dotenv. Required keys:
`DATABASE_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `OPENROUTER_URL`, `MCP_SANDBOX_URL` (default `http://localhost:8181/sse`), `WEAVIATE_COLLECTION_NAME`, `JINA_API_KEY`, `EMBEDDING_MODEL_NAME`. ETL keys: `DATASET_DIR`, `FILE_NAME`, `TABLE_NAME`, `VALUE_OF_INR`.

External services the agent depends on at runtime: PostgreSQL (Supabase), Weaviate (`docker-compose-weaviate.yml`), and the MCP sandbox (`python-mcp-sandbox/`, serves on `localhost:8181`).

## Layout

- `api/v1/` — FastAPI routers (`chat`, `chat_session`, `dummy`, `healthcheck`)
- `core/database.py` — SQLAlchemy engine/session; `Base.metadata.create_all` runs at import in `main.py`
- `models/` — ORM models (`chat`, `chat_session`)
- `services/ecommerce_agent/` — agent runner, `llm.py`, `tools.py` (`run_sql_query`), `prompts.py`, Weaviate + embedding + MCP helpers
- `etl_pipeline/` — `data_extract` / `data_transformation` / `data_load`, orchestrated by `run.py`
- `ec_agent.py` — session + context wrapper around the agent
- `python-mcp-sandbox/` — embedded MCP server (separate `pyproject.toml`)

## Gotchas

- `api/v1/chat.py` has a hardcoded `user_id = "Dipesh_0001"` — not real auth.
- Weaviate collections are created per session (`chat_history_{session_id}`); recent messages are windowed to ~5 in memory, older context retrieved from Weaviate.
- Agent tracing is disabled (`set_tracing_disabled(True)`).
- Query results are dumped to `temp_data/` JSON files for sandbox uploads.
- No CORS / auth / migrations (no Alembic) configured.
- `.env` in the repo may contain live credentials — never commit secrets; use `.env.example` as the template.
