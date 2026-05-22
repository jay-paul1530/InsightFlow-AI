from dotenv import load_dotenv
import os

load_dotenv() 

DATASET_DIR = os.getenv("DATASET_DIR")
FILE_NAME = os.getenv("FILE_NAME")
VALUE_OF_INR = float(os.getenv("INR_RATE", 1.0))
TABLE_NAME = os.getenv("TABLE_NAME")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL")
OPENROUTER_URL = os.getenv("OPENROUTER_URL")

MCP_SANDBOX_URL = os.getenv("MCP_SANDBOX_URL")

DB_HOSTNAME = os.getenv("Hostname")
DB_PORT = os.getenv("DB_Port")
DB_NAME = os.getenv("DB_Name")
DB_USER = os.getenv("DB_User")
DB_PASSWORD = os.getenv("DB_Password")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOSTNAME}:{DB_PORT}/{DB_NAME}" if (os.getenv("DATABASE_URL") == "" or os.getenv("DATABASE_URL") is None) else os.getenv("DATABASE_URL")

