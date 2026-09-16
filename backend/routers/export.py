import io
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from services.csv_processor import get_dataset, classify_columns
from services.stats_engine import compute_overview, compute_quality
from services.correlation_engine import compute_correlation_matrix
from services.insight_generator import generate_insights

router = APIRouter()

@router.get("/export/{dataset_id}/csv")
def export_csv(dataset_id: str, filtered: bool = Query(False)):
    try:
        df = get_dataset(dataset_id)
        
        stream = io.StringIO()
        df.to_csv(stream, index=False)
        response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
        response.headers["Content-Disposition"] = f"attachment; filename=export_{dataset_id}.csv"
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/export/{dataset_id}/summary")
def export_summary(dataset_id: str):
    try:
        df = get_dataset(dataset_id)
        col_types = classify_columns(df)
        matrix = compute_correlation_matrix(df)
        
        summary = {
            "overview": compute_overview(df),
            "quality": compute_quality(df),
            "insights": generate_insights(df, col_types, matrix)
        }
        return summary
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
