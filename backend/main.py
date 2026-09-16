from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import upload, analysis, correlation, insights, filter, export

app = FastAPI(title="DataLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(analysis.router, prefix="/api", tags=["Analysis"])
app.include_router(correlation.router, prefix="/api", tags=["Correlation"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(filter.router, prefix="/api", tags=["Filter"])
app.include_router(export.router, prefix="/api", tags=["Export"])

@app.get("/")
def root():
    return {"message": "DataLens API is running"}
