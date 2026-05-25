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

DATABASE_URL = os.getenv("DATABASE_URL")

JINA_API_KEY = os.getenv("JINA_API_KEY")
EMBEDDING_MODEL_NAME = os.getenv("EMBEDDING_MODEL_NAME")

LEN_CHAT_HISTORY = int(os.getenv("LEN_CHAT_HISTORY"))
