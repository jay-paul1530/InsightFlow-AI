import pandas as pd


def extractor():
    df = pd.read_csv("../E-Commerce Orders.csv", encoding="utf-8")
    return df

