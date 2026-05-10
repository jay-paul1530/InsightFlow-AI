from data_extract import extractor
from data_transformation import data_transformer
from data_load import data_loader


def main():

    # Extract
    df_data = extractor()

    # Transform
    df_transformed = data_transformer(df_data)

    # Load
    data_loader(df_transformed)


if __name__ == "__main__":
    main()