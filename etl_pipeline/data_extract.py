import pandas as pd


def extractor(file_path: str):
    df = pd.read_csv(file_path, encoding="utf-8")
    return df
