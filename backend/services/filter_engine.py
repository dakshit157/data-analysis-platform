import pandas as pd

def apply_filters(df: pd.DataFrame, filters: list) -> pd.DataFrame:
    """Apply a list of filters sequentially to the dataframe."""
    filtered = df.copy()
    for f in filters:
        col = f.get("column")
        op = f.get("operator")
        val = f.get("value")

        if col not in filtered.columns:
            continue

        try:
            if op == "eq":
                filtered = filtered[filtered[col] == val]
            elif op == "neq":
                filtered = filtered[filtered[col] != val]
            elif op == "gt":
                filtered = filtered[filtered[col] > float(val)]
            elif op == "gte":
                filtered = filtered[filtered[col] >= float(val)]
            elif op == "lt":
                filtered = filtered[filtered[col] < float(val)]
            elif op == "lte":
                filtered = filtered[filtered[col] <= float(val)]
            elif op == "between":
                filtered = filtered[filtered[col].between(float(val[0]), float(val[1]))]
            elif op == "isin":
                filtered = filtered[filtered[col].isin(val)]
        except (ValueError, TypeError):
            # Ignore filter if type conversion or logic fails
            pass

    return filtered
