# PowerShell Azure Deployment Script for Clinical Cosmos
# This script automates the setup of all Azure resources on Windows

param(
    [string]$ResourceGroup = "clinical-cosmos-rg",
    [string]$Location = "eastus",
    [string]$AppName = "clinical-cosmos",
    [string]$DBPassword = ""
)

# Color functions
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

Write-Host "=== Clinical Cosmos Azure Deployment ===" -ForegroundColor Green
Write-Host ""

# Check prerequisites
Write-Warning "Checking prerequisites..."
try {
    $azVersion = az version 2>&1 | ConvertFrom-Json
    Write-Success "Azure CLI installed"
} catch {
    Write-Error "Azure CLI is required. Install from: https://aka.ms/installazurecliwindows"
    exit 1
}

# Get password if not provided
if ([string]::IsNullOrEmpty($DBPassword)) {
    $DBPassword = Read-Host "Enter PostgreSQL admin password" -AsSecureString
    $DBPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToCoTaskMemUnicode($DBPassword))
}

# Login to Azure
Write-Warning "Logging into Azure..."
az login

# Create resource group
Write-Warning "Creating resource group '$ResourceGroup'..."
az group create --name $ResourceGroup --location $Location
Write-Success "Resource group created"

# Create PostgreSQL Database
Write-Warning "Creating PostgreSQL database..."
az postgres flexible-server create `
    --name "$($AppName)-db" `
    --resource-group $ResourceGroup `
    --location $Location `
    --admin-user dbadmin `
    --admin-password $DBPassword `
    --sku-name Standard_B1ms `
    --tier Burstable `
    --storage-size 32 `
    --public-access 0.0.0.0/0 `
    --yes

az postgres flexible-server db create `
    --resource-group $ResourceGroup `
    --server-name "$($AppName)-db" `
    --database-name clinical_cosmos

Write-Success "PostgreSQL database created"

# Get PostgreSQL connection string
$DBHost = "$($AppName)-db.postgres.database.azure.com"
$DBConnStr = "postgresql://dbadmin:$($DBPassword)@$($DBHost):5432/clinical_cosmos"
Write-Success "Database ready at: $DBHost"

# Create Storage Account
Write-Warning "Creating Azure Storage Account..."
$StorageName = "$($AppName)files$((Get-Random -Maximum 10000))"

az storage account create `
    --name $StorageName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku Standard_LRS

az storage container create `
    --name trials `
    --account-name $StorageName `
    --public-access off

$StorageConnStr = az storage account show-connection-string `
    --name $StorageName `
    --resource-group $ResourceGroup `
    --query connectionString -o tsv

Write-Success "Storage account '$StorageName' created"

# Create App Service Plan
Write-Warning "Creating App Service Plan..."
az appservice plan create `
    --name "$($AppName)-plan" `
    --resource-group $ResourceGroup `
    --sku B1 `
    --is-linux

Write-Success "App Service Plan created"

# Create Web App
Write-Warning "Creating App Service (Backend)..."
az webapp create `
    --resource-group $ResourceGroup `
    --plan "$($AppName)-plan" `
    --name "$($AppName)-api" `
    --runtime "PYTHON|3.11"

# Configure environment variables
Write-Warning "Configuring environment variables..."
az webapp config appsettings set `
    --resource-group $ResourceGroup `
    --name "$($AppName)-api" `
    --settings `
        "DATABASE_URL=$DBConnStr" `
        "AZURE_STORAGE_CONNECTION_STRING=$StorageConnStr" `
        "USE_AZURE_STORAGE=true" `
        "WEBSITES_PORT=8000" `
        "PYTHONPATH=/app"

Write-Success "Environment variables configured"

# Print summary
Write-Host ""
Write-Host "=== Deployment Summary ===" -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Yellow
Write-Host "Location: $Location" -ForegroundColor Yellow
Write-Host "App Name: $AppName" -ForegroundColor Yellow
Write-Host "Database Server: $DBHost" -ForegroundColor Yellow
Write-Host "Storage Account: $StorageName" -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend API URL: https://$($AppName)-api.azurewebsites.net" -ForegroundColor Yellow
Write-Host ""

Write-Warning "Next steps:"
Write-Host "1. Build and deploy backend:"
Write-Host "   cd backend"
Write-Host "   Compress-Archive -Path . -DestinationPath ../backend-deploy.zip"
Write-Host "   az webapp deployment source config-zip -g $ResourceGroup -n $($AppName)-api --src ../backend-deploy.zip"
Write-Host ""
Write-Host "2. Create Static Web App for frontend (in Azure Portal)"
Write-Host ""
Write-Host "3. Initialize database tables:"
Write-Host "   az webapp remote create -g $ResourceGroup -n $($AppName)-api"
Write-Host "   python init_db.py"
Write-Host ""

Write-Success "Deployment setup complete!"
Write-Host ""
Write-Host "To view resources:"
Write-Host "az resource list -g $ResourceGroup -o table" -ForegroundColor Cyan
