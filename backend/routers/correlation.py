from fastapi import APIRouter, HTTPException
from models.schemas import CorrelationResponse, CorrelationDetail
from services.csv_processor import get_dataset
from services.correlation_engine import compute_correlation_matrix, get_strongest_correlations

router = APIRouter()

@router.get("/correlations/{dataset_id}", response_model=CorrelationResponse)
def get_correlations(dataset_id: str):
    try:
        df = get_dataset(dataset_id)
        matrix = compute_correlation_matrix(df)
        cols = list(matrix.keys())
        return CorrelationResponse(matrix=matrix, columns=cols)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/correlations/{dataset_id}/{column}", response_model=CorrelationDetail)
def get_correlation_detail(dataset_id: str, column: str):
    try:
        df = get_dataset(dataset_id)
        matrix = compute_correlation_matrix(df)
        if column not in matrix:
            raise HTTPException(status_code=400, detail=f"Column {column} not found or not numerical.")
        corrs = get_strongest_correlations(matrix, column)
        return CorrelationDetail(column=column, correlations=corrs)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
