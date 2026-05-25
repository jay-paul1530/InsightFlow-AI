from datetime import datetime
import os
import psycopg2
import json
from agents import function_tool
from env import DATABASE_URL
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
        # connect to database
        connection = psycopg2.connect(DATABASE_URL)

        cursor = connection.cursor()

        cursor.execute(sql)

        result = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]

        data = [dict(zip(column_names, row)) for row in result]

        # Convert non-serializable objects (like Decimal, date, datetime) to string
        data = json.loads(json.dumps(data, default=str))

        # Save to a local file for the agent to upload to sandbox if needed
        if not os.path.exists("temp_data"):
            os.mkdir("temp_data")
        
        file_name = f"query_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        file_path = os.path.join("temp_data", file_name)

        with open(file_path, 'w') as f:
            json.dump(data, f)

        connection.commit()
        cursor.close()
        connection.close()

        console.print(f"[bold green]Data fetched successfully. Saved to {file_path}[/bold green]")
        return {
                "status": "success",
                "message": f"Query returned {len(data)} rows. Data has been saved to the file path below. Please use the upload_file_to_sandbox tool to upload this file to the sandbox for further processing.",
                "row_count": len(data),
                "sample_data": data[:5],
                "saved_file_path": file_path
            }
    except Exception as e:
        console.print("\n[bold red]ERROR OCCURRED IN SQL QUERY EXECUTION[/bold red]")
        console.print(f"[red]Error: {e}[/red]\n")
        return {
                "status": "failed",
                "message": f"\n ERROR OCCURED IN SQL QUERY EXECUTION \n Error: {e}\n",
                "row_count": 0,
                "sample_data": [],
                "saved_file_path": ""
            }
