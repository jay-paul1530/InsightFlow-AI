from data_extract import extractor
from data_load import data_loader
from data_transformation import data_transformer


def main():
    df_data = extractor()
    df_data_transformed = data_transformer(df_data)
    data_loader(df_data_transformed)


if __name__ == "__main__":
    main()

