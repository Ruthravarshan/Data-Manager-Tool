from fastapi import APIRouter
from typing import List
from app.schemas import Metric

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/metrics", response_model=List[Metric])
def get_metrics():
    # Mock data for initial prototype phase
    return [
        {"key": "data_quality", "value": "86%", "label": "Overall data quality score", "trend": "up"},
        {"key": "operational", "value": "72%", "label": "Site operational efficiency", "trend": "stable"},
        {"key": "safety", "value": "91%", "label": "Protocol safety adherence", "trend": "up"},
        {"key": "compliance", "value": "83%", "label": "Regulatory compliance score", "trend": "down"},
    ]
