from etl_pipeline.data_extract import extractor
from etl_pipeline.data_transformation import data_transformer
from etl_pipeline.data_load import data_loader
from env import DATABASE_URL, DATASET_DIR, FILE_NAME, VALUE_OF_INR, TABLE_NAME


def etl_run():

    # Extract
    df_data = extractor(file_path=f"{DATASET_DIR}/{FILE_NAME}")

    # Transform
    df_transformed = data_transformer(df_data, value_of_inr=VALUE_OF_INR)

    # Load
    status = data_loader(df_transformed, database_url=DATABASE_URL, table_name=TABLE_NAME)
    print("Data loaded successfully:", status)
    