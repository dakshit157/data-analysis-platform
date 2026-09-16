from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional, Any

class UploadResponse(BaseModel):
    dataset_id: str
    filename: str
    rows: int
    columns: int
    file_size: int
    preview: List[Dict[str, Any]]
    column_types: Dict[str, List[str]]
    model_config = ConfigDict(from_attributes=True)

class OverviewResponse(BaseModel):
    rows: int
    columns: int
    numerical_columns: List[str]
    categorical_columns: List[str]
    datetime_columns: List[str]
    missing_values: int
    missing_by_column: Dict[str, int]
    duplicate_rows: int
    memory_usage: int
    column_dtypes: Dict[str, str]
    model_config = ConfigDict(from_attributes=True)

class QualityColumn(BaseModel):
    name: str
    dtype: str
    missing_count: int
    missing_percentage: float
    unique_count: int
    top_values: List[Dict[str, Any]]
    outlier_count: int
    min_val: Optional[float]
    max_val: Optional[float]
    mean_val: Optional[float]
    std_val: Optional[float]
    model_config = ConfigDict(from_attributes=True)

class QualityResponse(BaseModel):
    columns: List[QualityColumn]
    total_missing: int
    total_duplicates: int
    model_config = ConfigDict(from_attributes=True)

class CorrelationResponse(BaseModel):
    matrix: Dict[str, Dict[str, Optional[float]]]
    columns: List[str]
    model_config = ConfigDict(from_attributes=True)

class CorrelationDetail(BaseModel):
    column: str
    correlations: List[Dict[str, Any]]
    model_config = ConfigDict(from_attributes=True)

class Insight(BaseModel):
    category: str
    title: str
    description: str
    value: Any
    severity: str
    model_config = ConfigDict(from_attributes=True)

class InsightsResponse(BaseModel):
    insights: List[Insight]
    model_config = ConfigDict(from_attributes=True)

class FilterSpec(BaseModel):
    column: str
    operator: str
    value: Any
    model_config = ConfigDict(from_attributes=True)

class FilterRequest(BaseModel):
    filters: List[FilterSpec]
    model_config = ConfigDict(from_attributes=True)

class FilterResponse(BaseModel):
    rows: int
    preview: List[Dict[str, Any]]
    overview: Dict[str, Any]
    model_config = ConfigDict(from_attributes=True)

class ExploreChart(BaseModel):
    chart_id: str
    title: str
    chart_type: str
    data: List[Dict[str, Any]]
    x_key: str
    y_key: str
    column: str
    model_config = ConfigDict(from_attributes=True)

class ExploreResponse(BaseModel):
    charts: List[ExploreChart]
    model_config = ConfigDict(from_attributes=True)

class CustomChartRequest(BaseModel):
    x_column: str
    y_column: Optional[str] = None
    chart_type: str
    aggregation: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class CustomChartResponse(BaseModel):
    data: List[Dict[str, Any]]
    x_key: str
    y_key: str
    chart_type: str
    model_config = ConfigDict(from_attributes=True)
