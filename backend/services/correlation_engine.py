import pandas as pd
import numpy as np

def compute_correlation_matrix(df: pd.DataFrame) -> dict:
    """Compute Pearson correlation matrix for numerical columns."""
    num_df = df.select_dtypes(include=['number'])
    if num_df.empty:
        return {}
    corr = num_df.corr(method='pearson').replace({np.nan: None})
    return corr.to_dict()

def get_strongest_correlations(matrix: dict, column: str, n: int = 5) -> list:
    """Get the top n strongest correlations for a given column."""
    if column not in matrix:
        return []
    col_corr = matrix[column]
    # Filter out self-correlation and nulls
    corrs = [(k, v) for k, v in col_corr.items() if k != column and v is not None]
    # Sort by absolute correlation value descending
    corrs.sort(key=lambda x: abs(x[1]), reverse=True)
    top_n = corrs[:n]
    return [{"column": k, "value": float(v)} for k, v in top_n]
