import os
import shutil
from fastapi import UploadFile
import uuid

# Define upload directory relative to backend root
UPLOAD_DIR = "static/trials"

def save_upload_file(upload_file: UploadFile, study_id: str = None) -> str:
    """
    Saves an uploaded file to the local filesystem and returns the URL.
    if study_id is provided, saves to static/trials/{study_id}/filename.
    """
    
    # Determine directory path
    if study_id:
        target_dir = os.path.join(UPLOAD_DIR, study_id)
    else:
        target_dir = UPLOAD_DIR
        
    # Ensure directory exists
    os.makedirs(target_dir, exist_ok=True)
    
    # Generate unique filename to prevent overwrites
    file_extension = os.path.splitext(upload_file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(target_dir, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
        
    # Return URL path
    # Base URL construction needs to match the structure
    if study_id:
        return f"http://localhost:8000/static/trials/{study_id}/{unique_filename}"
    else:
        return f"http://localhost:8000/static/trials/{unique_filename}"

def delete_study_files(study_id: str):
    """
    Deletes the directory and all files associated with a study_id.
    """
    if not study_id:
        return
        
    target_dir = os.path.join(UPLOAD_DIR, study_id)
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)
