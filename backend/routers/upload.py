import uuid
import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import UploadResponse
from services.csv_processor import read_csv, validate_csv, classify_columns, get_preview, store_dataset

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        df = read_csv(contents)
        validate_csv(df)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    col_types = classify_columns(df)
    dataset_id = str(uuid.uuid4())
    store_dataset(dataset_id, df)
    
    return UploadResponse(
        dataset_id=dataset_id,
        filename=file.filename,
        rows=len(df),
        columns=len(df.columns),
        file_size=len(contents),
        preview=get_preview(df),
        column_types=col_types
    )

@router.post("/upload/sample", response_model=UploadResponse)
async def upload_sample():
    sample_path = os.path.join(os.path.dirname(__file__), "..", "data", "sample.csv")
    if not os.path.exists(sample_path):
        raise HTTPException(status_code=404, detail="Sample dataset not found.")
    
    with open(sample_path, "rb") as f:
        contents = f.read()
        
    try:
        df = read_csv(contents)
        validate_csv(df)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    col_types = classify_columns(df)
    dataset_id = str(uuid.uuid4())
    store_dataset(dataset_id, df)
    
    return UploadResponse(
        dataset_id=dataset_id,
        filename="sample.csv",
        rows=len(df),
        columns=len(df.columns),
        file_size=len(contents),
        preview=get_preview(df),
        column_types=col_types
    )
