from dotenv import load_dotenv
import os

load_dotenv() 

DATABASE_URL = os.getenv("DATABASE_URL")
DATASET_DIR = os.getenv("DATASET_DIR")
FILE_NAME = os.getenv("FILE_NAME")
VALUE_OF_INR = float(os.getenv("VALUE_OF_INR"))
TABLE_NAME = os.getenv("TABLE_NAME")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL")
OPENROUTER_URL = os.getenv("OPENROUTER_URL")

MCP_SANDBOX_URL = os.getenv("MCP_SANDBOX_URL")
