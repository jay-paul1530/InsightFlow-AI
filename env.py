from dotenv import load_dotenv
import os

load_dotenv() 

DATABASE_URL = os.getenv("DATABASE_URL")
DATASET_DIR = os.getenv("DATASET_DIR")
FILE_NAME = os.getenv("FILE_NAME")
VALUE_OF_INR = os.getenv("VALUE_OF_INR")
TABLE_NAME = os.getenv("TABLE_NAME")
