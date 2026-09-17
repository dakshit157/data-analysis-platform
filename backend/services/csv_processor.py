import pandas as pd
import io
from typing import Dict, List, Any

# In-memory store for datasets
datasets: Dict[str, pd.DataFrame] = {}

SUPPORTED_FORMATS = {
    '.csv': 'text/csv',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.json': 'application/json',
}

MAX_FILE_SIZE = 20 * 1024 * 1024  # 20 MB
MAX_ROWS = 1_000_000

def store_dataset(dataset_id: str, df: pd.DataFrame):
    """Store dataset in memory."""
    datasets[dataset_id] = df

def get_dataset(dataset_id: str) -> pd.DataFrame:
    """Retrieve dataset from memory."""
    if dataset_id not in datasets:
        raise ValueError(f"Dataset {dataset_id} not found")
    return datasets[dataset_id]

def read_file(file_bytes: bytes, filename: str) -> pd.DataFrame:
    """Read file based on extension and attempt to parse dates."""
    ext = filename.lower().split('.')[-1]
    ext = '.' + ext if ext else ''
    
    try:
        if ext in ('.csv',):
            df = pd.read_csv(io.BytesIO(file_bytes), parse_dates=True)
        elif ext in ('.xlsx', '.xls'):
            df = pd.read_excel(io.BytesIO(file_bytes), parse_dates=True)
        elif ext in ('.json',):
            df = pd.read_json(io.BytesIO(file_bytes))
        else:
            raise ValueError(f"Unsupported file format: {ext}. Supported: CSV, Excel (.xlsx, .xls), JSON")
        
        # Attempt date parsing for object columns
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_datetime(df[col])
                except (ValueError, TypeError):
                    pass
        return df
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Failed to read file: {str(e)}")

def validate_file(df: pd.DataFrame, filename: str):
    """Validate dataframe constraints."""
    if df.empty:
        raise ValueError("File is empty.")
    if len(df) > MAX_ROWS:
        raise ValueError(f"File has too many rows (limit is {MAX_ROWS:,}).")

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
