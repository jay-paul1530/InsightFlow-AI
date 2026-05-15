from sqlalchemy import create_engine, text
from agents import function_tool
from env import DATABASE_URL


@function_tool
def run_sql_query(query: str):
    """
    Executes SQL queries and returns results.
    """
    print("RUN SQL QUERY TOOL HIT")
    print("Query : ", query)
    try:
        engine = create_engine(DATABASE_URL, echo=False)
       
        with engine.begin() as conn:
            result = conn.execute(text(query))
            if result.returns_rows:
                rows = [
                    dict(row._mapping)
                    for row in result.fetchall()
                ]

                # print("rows: ", rows)
                
                return {
                    "status": "success",
                    "rows": rows
                }
            return {
                "status": "success",
                "message": "Query executed successfully."
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
