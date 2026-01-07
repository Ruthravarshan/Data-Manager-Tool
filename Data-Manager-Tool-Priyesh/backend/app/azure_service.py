from azure.storage.blob import BlobServiceClient
import os
from dotenv import load_dotenv

load_dotenv()

CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
CONTAINER_NAME = "protocol-documents"

def get_blob_service_client():
    if not CONNECTION_STRING:
        print("Warning: AZURE_STORAGE_CONNECTION_STRING not found in environment variables.")
        return None
    return BlobServiceClient.from_connection_string(CONNECTION_STRING)

def upload_file_to_blob(file_content: bytes, filename: str) -> str:
    """
    Uploads a file to Azure Blob Storage and returns the URL.
    """
    blob_service_client = get_blob_service_client()
    if not blob_service_client:
        return f"https://mockstorage.blob.core.windows.net/{CONTAINER_NAME}/{filename}"

    container_client = blob_service_client.get_container_client(CONTAINER_NAME)
    
    # Create container if not exists
    if not container_client.exists():
        container_client.create_container()

    blob_client = container_client.get_blob_client(filename)
    blob_client.upload_blob(file_content, overwrite=True)
    
    return blob_client.url
