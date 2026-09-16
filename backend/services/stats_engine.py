import pandas as pd
import numpy as np

def compute_overview(df: pd.DataFrame) -> dict:
    """Compute overall dataset statistics."""
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    cat_cols = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
    date_cols = df.select_dtypes(include=['datetime']).columns.tolist()

    missing_by_col = df.isnull().sum().to_dict()
    total_missing = int(df.isnull().sum().sum())
    duplicate_rows = int(df.duplicated().sum())
    memory_usage = int(df.memory_usage(deep=True).sum())

    column_dtypes = {col: str(dtype) for col, dtype in df.dtypes.items()}

    return {
        "rows": len(df),
        "columns": len(df.columns),
        "numerical_columns": num_cols,
        "categorical_columns": cat_cols,
        "datetime_columns": date_cols,
        "missing_values": total_missing,
        "missing_by_column": missing_by_col,
        "duplicate_rows": duplicate_rows,
        "memory_usage": memory_usage,
        "column_dtypes": column_dtypes
    }

def compute_quality(df: pd.DataFrame) -> dict:
    """Compute column-level data quality metrics."""
    columns_quality = []
    for col in df.columns:
        col_data = df[col]
        missing_count = int(col_data.isnull().sum())
        missing_percentage = (missing_count / len(df)) * 100 if len(df) > 0 else 0
        unique_count = int(col_data.nunique(dropna=True))

        top_values_series = col_data.value_counts(dropna=True).head(5)
        top_values = [{"value": str(k), "count": int(v)} for k, v in top_values_series.items()]

        is_numeric = pd.api.types.is_numeric_dtype(col_data)
        outlier_count = 0
        min_val, max_val, mean_val, std_val = None, None, None, None

        if is_numeric and len(col_data.dropna()) > 0:
            valid_data = col_data.dropna()
            q1 = valid_data.quantile(0.25)
            q3 = valid_data.quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            outlier_count = int(((valid_data < lower_bound) | (valid_data > upper_bound)).sum())

            min_val = float(valid_data.min())
            max_val = float(valid_data.max())
            mean_val = float(valid_data.mean())
            std_val = float(valid_data.std())

        columns_quality.append({
            "name": col,
            "dtype": str(col_data.dtype),
            "missing_count": missing_count,
            "missing_percentage": missing_percentage,
            "unique_count": unique_count,
            "top_values": top_values,
            "outlier_count": outlier_count,
            "min_val": min_val,
            "max_val": max_val,
            "mean_val": mean_val,
            "std_val": std_val
        })

    return {
        "columns": columns_quality,
        "total_missing": int(df.isnull().sum().sum()),
        "total_duplicates": int(df.duplicated().sum())
    }

def compute_explore_charts(df: pd.DataFrame, column_types: dict) -> list:
    """Generate default charts for exploration."""
    charts = []
    num_cols = column_types.get("numerical", [])[:4]
    cat_cols = column_types.get("categorical", [])[:3]
    date_cols = column_types.get("datetime", [])[:1]

    # Numerical Histograms
    for col in num_cols:
        valid_data = df[col].dropna()
        if len(valid_data) == 0: continue
        counts, bins = np.histogram(valid_data, bins=min(20, len(valid_data.unique())))
        data = [{"bin": f"{bins[i]:.2f}-{bins[i+1]:.2f}", "count": int(counts[i])} for i in range(len(counts))]
        charts.append({
            "chart_id": f"hist_{col}", "title": f"{col} Distribution",
            "chart_type": "histogram", "data": data, "x_key": "bin", "y_key": "count", "column": col
        })

    # Categorical Value Frequencies
    for col in cat_cols:
        valid_data = df[col].dropna()
        if len(valid_data) == 0: continue
        top = valid_data.value_counts().head(10)
        data = [{col: str(k), "count": int(v)} for k, v in top.items()]
        charts.append({
            "chart_id": f"bar_{col}", "title": f"Top {col} Values",
            "chart_type": "bar", "data": data, "x_key": col, "y_key": "count", "column": col
        })

    # Time-series Aggregation
    for col in date_cols:
        valid_data = df[[col]].dropna().copy()
        if len(valid_data) == 0: continue
        valid_data['month'] = valid_data[col].dt.to_period('M').astype(str)
        if num_cols:
            y_col = num_cols[0]
            valid_data[y_col] = df[y_col]
            agg_df = valid_data.groupby('month')[y_col].sum().reset_index()
            y_key = f"sum_{y_col}"
        else:
            agg_df = valid_data.groupby('month').size().reset_index(name='count')
            y_col = 'count'
            y_key = 'count'

        data = agg_df.rename(columns={y_col: y_key}).to_dict(orient='records')
        charts.append({
            "chart_id": f"time_{col}", "title": f"Time Series by {col}",
            "chart_type": "line", "data": data, "x_key": "month", "y_key": y_key, "column": col
        })

    return charts

def compute_custom_chart(df: pd.DataFrame, x_column: str, y_column: str, chart_type: str, aggregation: str = None) -> dict:
    """Generate data for a custom chart based on user parameters."""
    cols_to_drop = [x_column]
    if y_column: cols_to_drop.append(y_column)
    df_clean = df.dropna(subset=cols_to_drop)
    
    if len(df_clean) == 0:
        return {"data": [], "x_key": x_column, "y_key": y_column or "", "chart_type": chart_type}

    data = []
    if chart_type == "bar":
        if y_column and aggregation:
            grouped = df_clean.groupby(x_column)[y_column]
            if aggregation == 'count': agg_df = grouped.count()
            elif aggregation == 'sum': agg_df = grouped.sum()
            elif aggregation == 'mean': agg_df = grouped.mean()
            elif aggregation == 'median': agg_df = grouped.median()
            else: agg_df = grouped.sum()
            data = agg_df.reset_index().to_dict(orient='records')
        else:
            agg_df = df_clean[x_column].value_counts().reset_index()
            agg_df.columns = [x_column, 'count']
            y_column = 'count'
            data = agg_df.to_dict(orient='records')

    elif chart_type == "line":
        df_sorted = df_clean.sort_values(by=x_column)
        data = df_sorted[[x_column, y_column]].to_dict(orient='records')

    elif chart_type == "scatter":
        data = df_clean[[x_column, y_column]].to_dict(orient='records')

    elif chart_type == "histogram":
        counts, bins = np.histogram(df_clean[x_column], bins=15)
        data = [{"bin": f"{bins[i]:.2f}-{bins[i+1]:.2f}", "count": int(counts[i])} for i in range(len(counts))]
        x_column = "bin"
        y_column = "count"

    elif chart_type == "pie":
        agg_df = df_clean[x_column].value_counts().reset_index()
        agg_df.columns = [x_column, 'count']
        y_column = 'count'
        data = agg_df.to_dict(orient='records')

    elif chart_type == "box":
        if y_column:
            data = df_clean[[x_column, y_column]].to_dict(orient='records')

    return {
        "data": data,
        "x_key": x_column,
        "y_key": y_column or "",
        "chart_type": chart_type
    }
