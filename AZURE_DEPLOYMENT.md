# Azure Deployment Guide for Clinical Cosmos

## Architecture Overview

```
┌─────────────────┐
│ Azure Static    │
│ Web Apps        │ (Frontend - React/Vite)
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Azure App Service   │ (Backend - FastAPI/Python)
│ (Python 3.11)       │
└────────┬────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌─────────┐  ┌──────────────────┐
│ Azure   │  │ Azure Blob       │
│ PostgreSQL │ Storage          │
└─────────┘  └──────────────────┘
    (Database)     (File uploads)
```

## Prerequisites

- Azure subscription (free tier available)
- Azure CLI installed: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
- Git
- Node.js and Python installed locally

## Step 1: Set Up Azure Resources

### 1.1 Create Resource Group
```bash
# Login to Azure
az login

# Create resource group
az group create --name clinical-cosmos-rg --location eastus
```

### 1.2 Create PostgreSQL Database
```bash
# Create Azure Database for PostgreSQL (Flexible Server)
az postgres flexible-server create \
  --name clinical-cosmos-db \
  --resource-group clinical-cosmos-rg \
  --location eastus \
  --admin-user dbadmin \
  --admin-password <your-secure-password> \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --public-access 0.0.0.0/0

# Create database
az postgres flexible-server db create \
  --resource-group clinical-cosmos-rg \
  --server-name clinical-cosmos-db \
  --database-name clinical_cosmos
```

### 1.3 Create Azure Blob Storage (for file uploads)
```bash
# Create storage account
az storage account create \
  --name clinicalcosmosfiles \
  --resource-group clinical-cosmos-rg \
  --location eastus \
  --sku Standard_LRS

# Create blob container
az storage container create \
  --name trials \
  --account-name clinicalcosmosfiles \
  --public-access off
```

### 1.4 Create Azure App Service (Backend)
```bash
# Create App Service Plan
az appservice plan create \
  --name clinical-cosmos-plan \
  --resource-group clinical-cosmos-rg \
  --sku B1 \
  --is-linux

# Create App Service for backend
az webapp create \
  --resource-group clinical-cosmos-rg \
  --plan clinical-cosmos-plan \
  --name clinical-cosmos-api \
  --runtime "PYTHON|3.11"
```

## Step 2: Prepare Backend for Azure

### 2.1 Update Configuration Files

**Create `backend/requirements.txt`** (ensure all dependencies are listed):
```
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0
python-multipart==0.0.6
azure-storage-blob==12.19.0
azure-identity==1.14.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
```

### 2.2 Update Backend for Azure Blob Storage

**Create `backend/app/azure_file_service.py`**:
```python
import os
from azure.storage.blob import BlobServiceClient
from azure.identity import DefaultAzureCredential
from fastapi import UploadFile

class AzureFileService:
    def __init__(self):
        # Use connection string or DefaultAzureCredential
        connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
        if connection_string:
            self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
        else:
            account_url = os.getenv("AZURE_STORAGE_ACCOUNT_URL")
            credential = DefaultAzureCredential()
            self.blob_service_client = BlobServiceClient(account_url, credential=credential)
        
        self.container_name = "trials"

    def save_upload_file(self, upload_file: UploadFile, study_id: str = None) -> str:
        """Save file to Azure Blob Storage"""
        if study_id:
            blob_name = f"{study_id}/{upload_file.filename}"
        else:
            blob_name = upload_file.filename
        
        container_client = self.blob_service_client.get_container_client(self.container_name)
        container_client.upload_blob(blob_name, upload_file.file, overwrite=True)
        
        # Return the blob URL
        return f"{self.blob_service_client.account_name}.blob.core.windows.net/{self.container_name}/{blob_name}"

    def delete_study_files(self, study_id: str):
        """Delete all files for a study from Azure Blob Storage"""
        container_client = self.blob_service_client.get_container_client(self.container_name)
        blobs = container_client.list_blobs(name_starts_with=f"{study_id}/")
        for blob in blobs:
            container_client.delete_blob(blob.name)

# Initialize service
azure_file_service = AzureFileService()
```

### 2.3 Update `backend/app/file_service.py` to use Azure conditionally

```python
import os
from fastapi import UploadFile

USE_AZURE = os.getenv("USE_AZURE_STORAGE", "false").lower() == "true"

if USE_AZURE:
    from app.azure_file_service import azure_file_service
else:
    # Local file service (fallback)
    import shutil
    import uuid
    
    UPLOAD_DIR = "static/trials"

def save_upload_file(upload_file: UploadFile, study_id: str = None) -> str:
    """Save upload file (Azure or local)"""
    if USE_AZURE:
        return azure_file_service.save_upload_file(upload_file, study_id)
    else:
        # Original local implementation
        if study_id:
            target_dir = os.path.join(UPLOAD_DIR, study_id)
        else:
            target_dir = UPLOAD_DIR
        
        os.makedirs(target_dir, exist_ok=True)
        file_extension = os.path.splitext(upload_file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(target_dir, unique_filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
        
        if study_id:
            return f"http://localhost:8000/static/trials/{study_id}/{unique_filename}"
        else:
            return f"http://localhost:8000/static/trials/{unique_filename}"

def delete_study_files(study_id: str):
    """Delete study files (Azure or local)"""
    if USE_AZURE:
        azure_file_service.delete_study_files(study_id)
    else:
        import shutil
        target_dir = os.path.join(UPLOAD_DIR, study_id)
        if os.path.exists(target_dir):
            shutil.rmtree(target_dir)
```

### 2.4 Create `.azure/config.yaml` for deployment

```yaml
version: 1.0
containerize:
  python:
    version: "3.11"
    requirements: requirements.txt
```

### 2.5 Create `backend/.env.azure` (for local testing):
```
DATABASE_URL=postgresql://dbadmin:<password>@clinical-cosmos-db.postgres.database.azure.com:5432/clinical_cosmos
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=clinicalcosmosfiles;AccountKey=<your-key>;EndpointSuffix=core.windows.net
USE_AZURE_STORAGE=true
```

## Step 3: Deploy Backend to Azure App Service

### 3.1 Via Azure CLI with ZIP deployment

```bash
# Navigate to backend directory
cd backend

# Install dependencies locally for verification
pip install -r requirements.txt

# Create deployment package
Compress-Archive -Path . -DestinationPath ../backend-deploy.zip

# Deploy to App Service
az webapp deployment source config-zip \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --src ../backend-deploy.zip

# Configure environment variables
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings \
    DATABASE_URL="postgresql://dbadmin:<password>@clinical-cosmos-db.postgres.database.azure.com:5432/clinical_cosmos" \
    AZURE_STORAGE_CONNECTION_STRING="<your-connection-string>" \
    USE_AZURE_STORAGE="true" \
    WEBSITES_PORT=8000

# Restart the app
az webapp restart \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

### 3.2 Via Docker (Alternative - Better for production)

**Create `backend/Dockerfile`**:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create directories needed
RUN mkdir -p static/trials

EXPOSE 8000

# Run with Gunicorn for production
CMD ["gunicorn", "app.main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]
```

**Build and push to Azure Container Registry**:
```bash
# Create container registry
az acr create \
  --resource-group clinical-cosmos-rg \
  --name clinicalcosmosacr \
  --sku Basic

# Build image
az acr build \
  --registry clinicalcosmosacr \
  --image clinical-cosmos-api:latest .

# Deploy to App Service with container
az webapp create \
  --resource-group clinical-cosmos-rg \
  --plan clinical-cosmos-plan \
  --name clinical-cosmos-api \
  --deployment-container-image-name clinicalcosmosacr.azurecr.io/clinical-cosmos-api:latest
```

## Step 4: Deploy Frontend to Azure Static Web Apps

### 4.1 Build Frontend
```bash
# Navigate to frontend directory
cd clinical-cosmos-app

# Build for production
npm run build
```

### 4.2 Create Static Web App
```bash
# Create Static Web App
az staticwebapp create \
  --name clinical-cosmos-web \
  --resource-group clinical-cosmos-rg \
  --source https://github.com/your-username/your-repo.git \
  --location westus2 \
  --branch main \
  --app-location "clinical-cosmos-app" \
  --output-location "dist" \
  --api-location "api"
```

### 4.3 Manual Deployment (if not using GitHub integration)
```bash
# Install Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Deploy
swa deploy \
  --deployment-token <your-deployment-token> \
  --env production
```

## Step 5: Configure CORS and API Endpoints

### 5.1 Update frontend API endpoint

**Update `clinical-cosmos-app/src/services/api.ts`**:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
```

### 5.2 Set environment in Static Web App
```bash
az staticwebapp appsettings set \
  --name clinical-cosmos-web \
  --setting-names REACT_APP_API_URL=https://clinical-cosmos-api.azurewebsites.net/api
```

### 5.3 Configure backend CORS for Azure domain
```bash
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings CORS_ORIGINS="https://clinical-cosmos-web.azurestaticapps.net"
```

**Update `backend/app/main.py`**:
```python
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 6: Initialize Database Tables

Once backend is deployed, initialize the database:

```bash
# SSH into App Service and run initialization
az webapp ssh \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# Inside the shell:
python init_db.py
```

Or create a function that runs on app startup (already done via `@app.on_event("startup")`).

## Step 7: Monitor and Troubleshoot

### 7.1 Check logs
```bash
# View live logs
az webapp log tail \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# Download logs
az webapp log download \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --log-file logs.zip
```

### 7.2 Test endpoints
```bash
# Test backend API
curl https://clinical-cosmos-api.azurewebsites.net/api

# Test activities endpoint
curl https://clinical-cosmos-api.azurewebsites.net/api/activities/recent
```

### 7.3 Check health
```bash
# View application insights
az monitor app-insights component show \
  --resource-group clinical-cosmos-rg \
  --app clinical-cosmos-api
```

## Step 8: Cost Optimization

### Recommended SKUs for Development/Testing:
- **PostgreSQL**: Standard_B1ms (₹1,850/month)
- **App Service Plan**: B1 Linux (₹706/month)
- **Storage Account**: Standard_LRS (₹585/month + data)
- **Static Web Apps**: Free tier (up to 1 GB/month)

### Cost Reduction Tips:
1. Use Azure free tier if eligible
2. Set auto-shutdown for non-production resources
3. Use Azure Spot VMs for non-critical workloads
4. Monitor data transfer costs
5. Delete unused resources

## Step 9: Production Checklist

- [ ] Enable SSL/TLS certificates (HTTPS)
- [ ] Configure Azure Key Vault for secrets
- [ ] Set up Azure Monitor and alerts
- [ ] Enable database backups
- [ ] Configure auto-scaling
- [ ] Set up CI/CD pipeline with GitHub Actions
- [ ] Enable Web Application Firewall (WAF)
- [ ] Configure custom domain
- [ ] Set up logging and diagnostics
- [ ] Plan disaster recovery

## Useful Azure CLI Commands

```bash
# List all resources
az resource list --resource-group clinical-cosmos-rg

# Check deployment status
az deployment group show \
  --resource-group clinical-cosmos-rg \
  --name deployment-name

# Get connection strings
az postgres flexible-server show-connection-string \
  --server-name clinical-cosmos-db

# Scale up App Service
az appservice plan update \
  --name clinical-cosmos-plan \
  --resource-group clinical-cosmos-rg \
  --sku P1V2

# Delete everything when done (to save costs)
az group delete --name clinical-cosmos-rg
```

## Troubleshooting

### Backend not accessible
1. Check App Service status: `az webapp show --resource-group clinical-cosmos-rg --name clinical-cosmos-api`
2. Check application settings are set correctly
3. Review logs: `az webapp log tail --resource-group clinical-cosmos-rg --name clinical-cosmos-api`

### Database connection errors
1. Check firewall rules allow your IP
2. Verify connection string format
3. Test connection: `psql -h clinical-cosmos-db.postgres.database.azure.com -U dbadmin -d clinical_cosmos`

### Frontend not loading
1. Check Static Web App status
2. Verify build succeeded
3. Check API URL environment variable is set correctly
4. Review browser console for CORS errors

### File upload failures
1. Check Blob Storage permissions
2. Verify connection string/credentials
3. Check container exists
4. Review storage account firewall rules

## Support and Resources

- Azure Documentation: https://docs.microsoft.com/en-us/azure/
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/
- React Deployment: https://react.dev/learn/deployment
- Azure Portal: https://portal.azure.com
