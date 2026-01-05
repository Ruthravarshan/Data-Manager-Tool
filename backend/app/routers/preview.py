import os
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import pandas as pd

router = APIRouter(prefix="/api/preview", tags=["preview"])

@router.get("")
<<<<<<< HEAD
def preview_file(file_path: str = Query(..., description="Absolute file path to preview"), nrows: int = 10):
    """Return the head of a CSV or Excel file as JSON for preview."""
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    try:
        filename = os.path.basename(file_path)
=======
def preview_file(filename: str = Query(..., description="File name to preview"), nrows: int = 10):
    """Return the head of a CSV or Excel file as JSON for preview."""
    # Use the correct absolute path to the data_source directory (sibling to backend)
    data_source_dir = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '..', 'data_source'))
    file_path = os.path.join(data_source_dir, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    try:
>>>>>>> origin/Priyesh
        if filename.lower().endswith('.csv'):
            df = pd.read_csv(file_path, nrows=nrows)
        elif filename.lower().endswith(('.xlsx', '.xls')):
            df = pd.read_excel(file_path, nrows=nrows)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        # Replace NaN/inf values with None for JSON compliance
        df = df.replace({float('inf'): None, float('-inf'): None}).where(pd.notnull(df), None)
        return {
            "columns": list(df.columns),
            "rows": df.head(nrows).to_dict(orient="records")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")
