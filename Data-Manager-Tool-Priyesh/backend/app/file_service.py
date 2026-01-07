import os
import shutil
from fastapi import UploadFile
import uuid

# Define upload directory relative to backend root
UPLOAD_DIR = "static/uploads"

def save_upload_file(upload_file: UploadFile) -> str:
    """
    Saves an uploaded file to the local filesystem and returns the URL.
    """
    # Ensure directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Generate unique filename to prevent overwrites
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    # Return URL path (client will prepend base URL if needed, or browser handles relative to server)
    # Since frontend is on port 5173 and backend on 8000, we need to be careful.
    # We will return the full backend URL or a path that the frontend can handle.
    # For now, let's return the relative path from the backend root servable under /static
    return f"http://localhost:8000/static/uploads/{unique_filename}"
