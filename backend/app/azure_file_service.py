"""
Azure Blob Storage file service for handling file uploads and deletions.
Provides a compatible interface with local file_service.py
"""
import os
from azure.storage.blob import BlobServiceClient
from azure.identity import DefaultAzureCredential
from fastapi import UploadFile
from typing import Optional


class AzureFileService:
    def __init__(self):
        """Initialize Azure Blob Storage client"""
        connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
        
        try:
            if connection_string:
                self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
            else:
                # Use DefaultAzureCredential (Managed Identity in Azure)
                account_url = os.getenv("AZURE_STORAGE_ACCOUNT_URL")
                credential = DefaultAzureCredential()
                self.blob_service_client = BlobServiceClient(account_url, credential=credential)
            
            self.container_name = os.getenv("AZURE_STORAGE_CONTAINER", "trials")
            self.account_url = self.blob_service_client.account_url
        except Exception as e:
            print(f"Error initializing Azure Blob Storage: {e}")
            raise

    def save_upload_file(self, upload_file: UploadFile, study_id: Optional[str] = None) -> str:
        """
        Save file to Azure Blob Storage
        
        Args:
            upload_file: FastAPI UploadFile
            study_id: Optional study ID to organize files in folders
            
        Returns:
            URL/path to the saved file
        """
        try:
            # Construct blob name
            if study_id:
                blob_name = f"{study_id}/{upload_file.filename}"
            else:
                blob_name = upload_file.filename
            
            # Get container client
            container_client = self.blob_service_client.get_container_client(self.container_name)
            
            # Upload blob
            container_client.upload_blob(blob_name, upload_file.file, overwrite=True)
            
            # Return the blob URL
            blob_url = f"{self.blob_service_client.account_name}.blob.core.windows.net/{self.container_name}/{blob_name}"
            return f"https://{blob_url}"
            
        except Exception as e:
            print(f"Error saving file to Azure Blob Storage: {e}")
            raise

    def delete_study_files(self, study_id: str) -> None:
        """
        Delete all files for a study from Azure Blob Storage
        
        Args:
            study_id: Study ID to identify files to delete
        """
        try:
            container_client = self.blob_service_client.get_container_client(self.container_name)
            
            # List and delete all blobs for this study
            blobs = container_client.list_blobs(name_starts_with=f"{study_id}/")
            for blob in blobs:
                container_client.delete_blob(blob.name)
                print(f"Deleted blob: {blob.name}")
                
        except Exception as e:
            print(f"Error deleting study files from Azure Blob Storage: {e}")
            raise

    def get_blob_url(self, study_id: str, filename: str) -> str:
        """
        Generate a direct URL to a blob
        
        Args:
            study_id: Study ID
            filename: File name
            
        Returns:
            Full URL to the blob
        """
        blob_name = f"{study_id}/{filename}"
        return f"https://{self.blob_service_client.account_name}.blob.core.windows.net/{self.container_name}/{blob_name}"


# Initialize service
try:
    azure_file_service = AzureFileService()
except Exception as e:
    print(f"Warning: Azure Blob Storage not available: {e}")
    azure_file_service = None
