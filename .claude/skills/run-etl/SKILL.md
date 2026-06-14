---
name: run-etl
description: Run the ETL pipeline that loads the e-commerce CSV into PostgreSQL. Use when asked to load data, seed the database, or run ETL.
---

# Run ETL

Loads CSV → transform → PostgreSQL. Run from `backend/`.

## Preconditions
- `.env` set, especially: `DATABASE_URL`, `DATASET_DIR`, `FILE_NAME`, `TABLE_NAME`, `VALUE_OF_INR`.
- Source CSV present at `{DATASET_DIR}/{FILE_NAME}` (default `datasets/E-Commerce Orders.csv`).
- Deps installed: `pip install -r requirement.txt`.

## Run
```
python run_etl.py
```
Calls `etl_pipeline.run.etl_run()` → `data_extract` (pandas read) → `data_transformation` (clean, INR conversion via `VALUE_OF_INR`) → `data_load` (insert into `TABLE_NAME`).

## Verify
Confirm row count in the target table via the configured PostgreSQL `DATABASE_URL`. Re-running reloads into the same `TABLE_NAME` — check `data_load.py` for replace vs. append behavior before re-running on populated data.
