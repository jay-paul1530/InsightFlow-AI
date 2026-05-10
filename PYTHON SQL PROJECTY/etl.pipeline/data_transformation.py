def data_transformer(df):

    # Clean column names
    df.columns = df.columns.str.strip().str.lower()

    # Remove null rows
    df = df.dropna()

    # Dollar to INR conversion
    dollar_to_inr = 82.0

    # Create new INR columns
    df["unitprice_inr"] = df["unitprice"] * dollar_to_inr

    df["totalprice_inr"] = df["totalprice"] * dollar_to_inr

    return df