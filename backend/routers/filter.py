from fastapi import APIRouter, HTTPException
from models.schemas import FilterRequest, FilterResponse
from services.csv_processor import get_dataset, get_preview
from services.filter_engine import apply_filters
from services.stats_engine import compute_overview

router = APIRouter()

@router.post("/filter/{dataset_id}", response_model=FilterResponse)
def apply_data_filters(dataset_id: str, request: FilterRequest):
    try:
        df = get_dataset(dataset_id)
        filters_dict = [f.model_dump() for f in request.filters]
        filtered_df = apply_filters(df, filters_dict)
        
        overview = compute_overview(filtered_df)
        preview = get_preview(filtered_df)
        
        return FilterResponse(
            rows=len(filtered_df),
            preview=preview,
            overview=overview
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
