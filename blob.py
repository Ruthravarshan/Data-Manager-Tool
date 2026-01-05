
# upload_pdf_sas_container.py
import os
from azure.storage.blob import BlobClient

# ---- Configure these ----
STORAGE_ACCOUNT_NAME = "projectsamp"
CONTAINER_NAME = "sales"
BLOB_NAME = "uploads/report.pdf"      # target blob path/name
LOCAL_PDF_PATH = "Protocol_Sample2_Psoriasis Disease.pdf"    # local pdf path
CONTAINER_SAS_TOKEN = "?sv=2024-11-04&ss=bfqt&srt=sco&sp=rwdlacupyx&se=2025-12-24T16:03:57Z&st=2025-12-18T07:48:57Z&spr=https&sig=FKKavJAhmR5ZHu2M%2F2gsf9cF8iwKWS3nHwoyIQCqMN0%3D"  # e.g. "?sv=...&sp=rw&se=...&sig=..."

def main():
    # Build the full blob URL (note: SAS token should start with '?')
    blob_url = (
        f"https://{STORAGE_ACCOUNT_NAME}.blob.core.windows.net/"
        f"{CONTAINER_NAME}/{BLOB_NAME}{CONTAINER_SAS_TOKEN}"
    )

    # Create BlobClient directly from the URL+SAS
    blob_client = BlobClient.from_blob_url(blob_url)

    # Upload the PDF (overwrite if present)
    with open(LOCAL_PDF_PATH, "rb") as data:
        blob_client.upload_blob(data, overwrite=True)

    print(f"Uploaded '{LOCAL_PDF_PATH}' to '{blob_client.url}'")

if __name__ == "__main__":
    main()
