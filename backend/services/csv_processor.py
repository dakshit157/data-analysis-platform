import pandas as pd
import io
from typing import Dict, List, Any

# In-memory store for datasets
datasets: Dict[str, pd.DataFrame] = {}

def store_dataset(dataset_id: str, df: pd.DataFrame):
    """Store dataset in memory."""
    datasets[dataset_id] = df

def get_dataset(dataset_id: str) -> pd.DataFrame:
    """Retrieve dataset from memory."""
    if dataset_id not in datasets:
        raise ValueError(f"Dataset {dataset_id} not found")
    return datasets[dataset_id]

def read_csv(file_bytes: bytes) -> pd.DataFrame:
    """Read CSV from bytes and attempt to parse dates."""
    try:
        df = pd.read_csv(io.BytesIO(file_bytes), parse_dates=True)
        # Attempt date parsing for object columns
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_datetime(df[col])
                except (ValueError, TypeError):
                    pass
        return df
    except Exception as e:
        raise ValueError(f"Failed to read CSV: {str(e)}")

def validate_csv(df: pd.DataFrame):
    """Validate dataframe constraints."""
    if df.empty:
        raise ValueError("CSV file is empty.")
    if len(df) > 1000000:
        raise ValueError("CSV file has too many rows (limit is 1,000,000).")

def classify_columns(df: pd.DataFrame) -> dict:
    """Classify columns by data type."""
    numerical = df.select_dtypes(include=['number']).columns.tolist()
    categorical = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
    datetime = df.select_dtypes(include=['datetime']).columns.tolist()
    return {
        "numerical": numerical,
        "categorical": categorical,
        "datetime": datetime
    }

def get_preview(df: pd.DataFrame, n: int = 20) -> List[Dict[str, Any]]:
    """Get a preview of the dataframe with NaNs handled."""
    preview_df = df.head(n).replace({pd.NA: None, float('nan'): None})
    preview_df = preview_df.where(pd.notnull(preview_df), None)
    return preview_df.to_dict(orient='records')
