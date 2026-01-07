#!/bin/bash
# Quick Azure Deployment Script for Clinical Cosmos
# This script automates the setup of all Azure resources

set -e

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== Clinical Cosmos Azure Deployment ===${NC}\n"

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"
command -v az >/dev/null 2>&1 || { echo -e "${RED}Azure CLI is required. Install from: https://aka.ms/installazurecliwindows${NC}"; exit 1; }
echo -e "${GREEN}✓ Azure CLI installed${NC}"

# Variables
read -p "Enter resource group name (default: clinical-cosmos-rg): " RG_NAME
RG_NAME=${RG_NAME:-clinical-cosmos-rg}

read -p "Enter location (default: eastus): " LOCATION
LOCATION=${LOCATION:-eastus}

read -p "Enter app name (default: clinical-cosmos): " APP_NAME
APP_NAME=${APP_NAME:-clinical-cosmos}

read -sp "Enter PostgreSQL admin password: " DB_PASSWORD
echo

# Login to Azure
echo -e "\n${YELLOW}Logging into Azure...${NC}"
az login

# Create resource group
echo -e "\n${YELLOW}Creating resource group...${NC}"
az group create --name $RG_NAME --location $LOCATION
echo -e "${GREEN}✓ Resource group created${NC}"

# Create PostgreSQL Database
echo -e "\n${YELLOW}Creating PostgreSQL database...${NC}"
az postgres flexible-server create \
  --name ${APP_NAME}-db \
  --resource-group $RG_NAME \
  --location $LOCATION \
  --admin-user dbadmin \
  --admin-password $DB_PASSWORD \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --storage-size 32 \
  --public-access 0.0.0.0/0 \
  --yes

az postgres flexible-server db create \
  --resource-group $RG_NAME \
  --server-name ${APP_NAME}-db \
  --database-name clinical_cosmos

echo -e "${GREEN}✓ PostgreSQL database created${NC}"

# Get PostgreSQL connection string
DB_HOST="${APP_NAME}-db.postgres.database.azure.com"
DB_CONN_STR="postgresql://dbadmin:${DB_PASSWORD}@${DB_HOST}:5432/clinical_cosmos"
echo -e "${GREEN}✓ Database connection string: $DB_CONN_STR${NC}"

# Create Storage Account
echo -e "\n${YELLOW}Creating Azure Storage Account...${NC}"
STORAGE_NAME="${APP_NAME}files${RANDOM}"
az storage account create \
  --name $STORAGE_NAME \
  --resource-group $RG_NAME \
  --location $LOCATION \
  --sku Standard_LRS

az storage container create \
  --name trials \
  --account-name $STORAGE_NAME \
  --public-access off

STORAGE_CONN_STR=$(az storage account show-connection-string \
  --name $STORAGE_NAME \
  --resource-group $RG_NAME \
  --query connectionString -o tsv)

echo -e "${GREEN}✓ Storage account created${NC}"

# Create App Service Plan
echo -e "\n${YELLOW}Creating App Service Plan...${NC}"
az appservice plan create \
  --name ${APP_NAME}-plan \
  --resource-group $RG_NAME \
  --sku B1 \
  --is-linux

echo -e "${GREEN}✓ App Service Plan created${NC}"

# Create Web App
echo -e "\n${YELLOW}Creating App Service (Backend)...${NC}"
az webapp create \
  --resource-group $RG_NAME \
  --plan ${APP_NAME}-plan \
  --name ${APP_NAME}-api \
  --runtime "PYTHON|3.11"

# Configure environment variables
echo -e "\n${YELLOW}Configuring environment variables...${NC}"
az webapp config appsettings set \
  --resource-group $RG_NAME \
  --name ${APP_NAME}-api \
  --settings \
    DATABASE_URL="$DB_CONN_STR" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONN_STR" \
    USE_AZURE_STORAGE="true" \
    WEBSITES_PORT=8000 \
    PYTHONPATH=/app

echo -e "${GREEN}✓ Environment variables configured${NC}"

# Create Static Web App
echo -e "\n${YELLOW}Creating Static Web App (Frontend)...${NC}"
az staticwebapp create \
  --name ${APP_NAME}-web \
  --resource-group $RG_NAME \
  --location westus2 \
  --sku Free \
  --source https://github.com/YOUR_GITHUB_USERNAME/clinical-cosmos-app.git \
  --branch main \
  --app-location "clinical-cosmos-app" \
  --output-location "dist" || echo -e "${YELLOW}Note: Static Web App requires GitHub repo. Configure manually in Azure Portal.${NC}"

echo -e "${GREEN}✓ Static Web App created${NC}"

# Summary
echo -e "\n${GREEN}=== Deployment Summary ===${NC}"
echo -e "Resource Group: ${YELLOW}$RG_NAME${NC}"
echo -e "Location: ${YELLOW}$LOCATION${NC}"
echo -e "Database: ${YELLOW}${APP_NAME}-db.postgres.database.azure.com${NC}"
echo -e "Backend URL: ${YELLOW}https://${APP_NAME}-api.azurewebsites.net${NC}"
echo -e "Frontend URL: ${YELLOW}https://${APP_NAME}-web.azurestaticapps.net${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Deploy backend: az webapp deployment source config-zip --resource-group $RG_NAME --name ${APP_NAME}-api --src backend-deploy.zip"
echo "2. Deploy frontend: Check Azure Portal for Static Web App deployment"
echo "3. Initialize database: Connect to App Service and run 'python init_db.py'"
echo "4. Update CORS in backend configuration"

echo -e "\n${GREEN}✓ Deployment setup complete!${NC}"
