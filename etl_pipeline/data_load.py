from sqlalchemy import create_engine


def data_loader(df, database_url, table_name):

    if not database_url:
        raise ValueError(
            "DATABASE_URL environment variable not set."
        )

    engine = create_engine(database_url)

    df.to_sql(
        table_name,
        engine,
        if_exists="replace",
        index=False
    )
    
    return True
