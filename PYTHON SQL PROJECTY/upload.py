import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv

load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set.")

engine = create_engine(DATABASE_URL)

df = pd.read_csv("E-Commerce Orders.csv", encoding="utf-8SSSSS")

df.to_sql(
    "customers",
    engine,
    if_exists="replace",
    index=False
)

print("Uploaded Successfully")