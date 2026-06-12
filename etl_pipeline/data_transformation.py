def data_transformer(df, value_of_inr):

    # Clean column names "OrderID " -> "orderid"
    df.columns = df.columns.str.strip().str.lower()

    # Remove null rows
    df = df.fillna({"unitprice": 0, "totalprice": 0, "quantity": 0})

    # Create new INR columns
    df["unitprice_inr"] = df["unitprice"] * value_of_inr

    df["totalprice_inr"] = df["totalprice"] * value_of_inr

    return df
