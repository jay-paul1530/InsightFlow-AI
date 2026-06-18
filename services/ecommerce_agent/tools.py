from datetime import datetime
import os
import psycopg2
import json
from agents import function_tool
from core.database import SessionLocal
from models.settings import DatabaseSettings
import env
from rich.console import Console
from rich.panel import Panel

console = Console()



@function_tool
def run_sql_query(sql: str) -> dict:
    """
    Execute SQL query on the database 'ecommerce_orders' and fetch the required values. Always return the data in the proper table format that created in database. 
    
    Args:
        sql (str): The SQL query string to execute.
    """
    console.print("\n[bold magenta]Executing `run_sql_query` tool...[/bold magenta]")
    console.print(Panel(sql, title="SQL Query", border_style="magenta", expand=False))
    try:
        # Resolve connection string dynamically
        db = SessionLocal()
        try:
            settings = db.query(DatabaseSettings).first()
            if settings:
                if settings.is_manual:
                    ssl_str = f"?sslmode={settings.ssl_mode}" if settings.ssl_mode else ""
                    db_url = f"postgresql://{settings.username}:{settings.password}@{settings.host}:{settings.port}/{settings.database_name}{ssl_str}"
                else:
                    db_url = settings.connection_string
            else: 
                return "No valid database connected please configure from settings"
        except Exception as db_err:
            console.print(f"[yellow]Failed to fetch settings from DB, using fallback: {db_err}[/yellow]")
            return "No valid database connected please configure from settings"
        finally:
            db.close()
        # connect to database
        connection = psycopg2.connect(db_url)

        cursor = connection.cursor()

        cursor.execute(sql)

        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]

        data = [dict(zip(column_names, row)) for row in result]

        # Convert non-serializable objects (like Decimal, date, datetime) to string
        data = json.loads(json.dumps(data, default=str))

        # # Save to a local file for the agent to upload to sandbox if needed
        # if not os.path.exists("temp_data"):
        #     os.mkdir("temp_data")
        
        # file_name = f"query_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        # file_path = os.path.join("temp_data", file_name)

        # with open(file_path, 'w') as f:
        #     json.dump(data, f)

        connection.commit()
        cursor.close()
        connection.close()

        console.print(f"[bold green]Data fetched successfully[/bold green]")
        return {
                "status": "success",
                "message": f"Query returned {len(data)} rows. Data has been saved to the file path below. Please use the upload_file_to_sandbox tool to upload this file to the sandbox for further processing.",
                "row_count": len(data),
                "sample_data": data[:100],
                # "saved_file_path": file_path
            }
    except Exception as e:
        console.print("\n[bold red]ERROR OCCURRED IN SQL QUERY EXECUTION[/bold red]")
        console.print(f"[red]Error: {e}[/red]\n")
        return {
                "status": "failed",
                "message": f"\n ERROR OCCURED IN SQL QUERY EXECUTION \n Error: {e}\n",
                "row_count": 0,
                "sample_data": [],
                # "saved_file_path": ""
            }


def get_database_schema() -> str:
    """
    Dynamically discover all user tables and columns from the active database connection.
    """
    try:
        db = SessionLocal()
        try:
            settings = db.query(DatabaseSettings).first()
            if settings:
                if settings.is_manual:
                    ssl_str = f"?sslmode={settings.ssl_mode}" if settings.ssl_mode else ""
                    db_url = f"postgresql://{settings.username}:{settings.password}@{settings.host}:{settings.port}/{settings.database_name}{ssl_str}"
                else:
                    db_url = settings.connection_string
            else:
                db_url = env.DATABASE_URL
        except Exception:
            db_url = env.DATABASE_URL
        finally:
            db.close()

        if not db_url:
            return "No database is currently connected."

        # Connect to database
        connection = psycopg2.connect(db_url)
        cursor = connection.cursor()

        # Query all user tables and columns in the public schema
        cursor.execute("""
            SELECT table_name, column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        """)
        rows = cursor.fetchall()
        cursor.close()
        connection.close()

        if not rows:
            return "The database is empty (no tables found in public schema)."

        # Group by table name
        schema_dict = {}
        for table_name, column_name, data_type in rows:
            # Skip framework/settings tables that are not part of user data analysis
            if table_name in ("database_settings", "settings", "chat", "chat_session", "chats", "sessions"):
                continue
            if table_name not in schema_dict:
                schema_dict[table_name] = []
            schema_dict[table_name].append(f"- {column_name} ({data_type})")

        if not schema_dict:
            return "No analytical data tables found in the database."

        # Format schema description
        schema_desc = []
        for table, cols in schema_dict.items():
            schema_desc.append(f"TABLE: {table}\nCOLUMNS:\n" + "\n".join(cols))
        
        return "\n\n".join(schema_desc)
    except Exception as e:
        return f"Error retrieving database schema: {e}"

