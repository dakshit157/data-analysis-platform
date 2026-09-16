from fastapi import APIRouter, HTTPException
from models.schemas import InsightsResponse
from services.csv_processor import get_dataset, classify_columns
from services.correlation_engine import compute_correlation_matrix
from services.insight_generator import generate_insights

router = APIRouter()

@router.get("/insights/{dataset_id}", response_model=InsightsResponse)
def get_insights(dataset_id: str):
    try:
        df = get_dataset(dataset_id)
        col_types = classify_columns(df)
        matrix = compute_correlation_matrix(df)
        insights = generate_insights(df, col_types, matrix)
        return InsightsResponse(insights=insights)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
