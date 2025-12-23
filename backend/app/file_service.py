import os
import shutil
from fastapi import UploadFile
import uuid

# Check if Azure storage should be used
USE_AZURE = os.getenv("USE_AZURE_STORAGE", "false").lower() == "true"

if USE_AZURE:
    try:
        from app.azure_file_service import azure_file_service
        HAS_AZURE = azure_file_service is not None
    except Exception as e:
        print(f"Warning: Azure storage not available: {e}")
        HAS_AZURE = False
else:
    HAS_AZURE = False

# Define upload directory relative to backend root (for local storage)
UPLOAD_DIR = "static/trials"

def save_upload_file(upload_file: UploadFile, study_id: str = None) -> str:
    """
    Saves an uploaded file to either Azure Blob Storage or local filesystem.
    
    Uses Azure if:
    - USE_AZURE_STORAGE=true environment variable is set
    - Azure credentials are configured
    
    Falls back to local storage otherwise.
    """
    
    if USE_AZURE and HAS_AZURE:
        try:
            return azure_file_service.save_upload_file(upload_file, study_id)
        except Exception as e:
            print(f"Azure upload failed: {e}. Falling back to local storage.")
            # Fall through to local storage
    
    # Local filesystem storage
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
    if study_id:
        return f"http://localhost:8000/static/trials/{study_id}/{unique_filename}"
    else:
        return f"http://localhost:8000/static/trials/{unique_filename}"

def delete_study_files(study_id: str):
    """
    Deletes the directory and all files associated with a study_id.
    Uses Azure Blob Storage if configured, otherwise uses local filesystem.
    """
    if not study_id:
        return
    
    if USE_AZURE and HAS_AZURE:
        try:
            azure_file_service.delete_study_files(study_id)
            return
        except Exception as e:
            print(f"Azure deletion failed: {e}. Falling back to local storage.")
            # Fall through to local storage
    
    # Local filesystem deletion
    target_dir = os.path.join(UPLOAD_DIR, study_id)
    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)

