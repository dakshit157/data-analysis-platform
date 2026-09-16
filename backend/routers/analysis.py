from fastapi import APIRouter, HTTPException
from models.schemas import OverviewResponse, QualityResponse, ExploreResponse, CustomChartRequest, CustomChartResponse
from services.csv_processor import get_dataset, classify_columns
from services.stats_engine import compute_overview, compute_quality, compute_explore_charts, compute_custom_chart

router = APIRouter()

@router.get("/overview/{dataset_id}", response_model=OverviewResponse)
def get_overview(dataset_id: str):
    try:
        df = get_dataset(dataset_id)
        overview = compute_overview(df)
        return OverviewResponse(**overview)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/quality/{dataset_id}", response_model=QualityResponse)
def get_quality(dataset_id: str):
    try:
        df = get_dataset(dataset_id)
        quality = compute_quality(df)
        return QualityResponse(**quality)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/explore/{dataset_id}", response_model=ExploreResponse)
def get_explore_charts(dataset_id: str):
    try:
        df = get_dataset(dataset_id)
        col_types = classify_columns(df)
        charts = compute_explore_charts(df, col_types)
        return ExploreResponse(charts=charts)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/explore/{dataset_id}/custom", response_model=CustomChartResponse)
def get_custom_chart(dataset_id: str, request: CustomChartRequest):
    try:
        df = get_dataset(dataset_id)
        chart = compute_custom_chart(
            df, request.x_column, request.y_column, request.chart_type, request.aggregation
        )
        return CustomChartResponse(**chart)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
