from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()


def data_loader(df):

    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError(
            "DATABASE_URL environment variable not set."
        )

    engine = create_engine(DATABASE_URL)

    df.to_sql(
        "customers",
        engine,
        if_exists="replace",
        index=False
    )

    print("Uploaded Successfully")