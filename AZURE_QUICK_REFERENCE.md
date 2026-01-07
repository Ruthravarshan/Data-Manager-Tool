# Azure Deployment Quick Reference

## 📋 Overview

The Clinical Cosmos application has been prepared for Azure deployment with:
- **Frontend**: React/TypeScript app → Azure Static Web Apps
- **Backend**: FastAPI Python app → Azure App Service  
- **Database**: PostgreSQL → Azure Database for PostgreSQL
- **Storage**: File uploads → Azure Blob Storage

## ⚡ Quick Start (5 minutes)

### Option 1: Automated Setup (Recommended)

**On Windows:**
```powershell
# Run PowerShell as Administrator
.\Deploy-to-Azure.ps1 -AppName "clinical-cosmos" -Location "eastus"
```

**On Linux/Mac:**
```bash
chmod +x deploy-to-azure.sh
./deploy-to-azure.sh
```

### Option 2: Manual Setup

1. **Create Resource Group**
```bash
az group create --name clinical-cosmos-rg --location eastus
```

2. **Create PostgreSQL**
```bash
az postgres flexible-server create \
  --name clinical-cosmos-db \
  --resource-group clinical-cosmos-rg \
  --admin-user dbadmin \
  --admin-password YourSecurePassword123! \
  --sku-name Standard_B1ms
```

3. **Create Storage Account**
```bash
az storage account create \
  --name clinicalcosmosfiles \
  --resource-group clinical-cosmos-rg \
  --sku Standard_LRS

az storage container create \
  --name trials \
  --account-name clinicalcosmosfiles
```

4. **Create App Service**
```bash
az appservice plan create \
  --name clinical-cosmos-plan \
  --resource-group clinical-cosmos-rg \
  --sku B1 --is-linux

az webapp create \
  --resource-group clinical-cosmos-rg \
  --plan clinical-cosmos-plan \
  --name clinical-cosmos-api \
  --runtime "PYTHON|3.11"
```

5. **Configure Settings**
```bash
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings \
    DATABASE_URL="postgresql://..." \
    AZURE_STORAGE_CONNECTION_STRING="..." \
    USE_AZURE_STORAGE="true" \
    WEBSITES_PORT=8000
```

## 📦 Deployment Methods

### Method 1: ZIP Deployment (Simplest)
```bash
cd backend
pip install -r requirements.txt
Compress-Archive -Path . -DestinationPath ../backend-deploy.zip
az webapp deployment source config-zip \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --src ../backend-deploy.zip
```

### Method 2: Docker Deployment (Production)
```bash
# Build Docker image
docker build -t clinical-cosmos-api:latest ./backend

# Push to Azure Container Registry
az acr build \
  --registry clinicalcosmosacr \
  --image clinical-cosmos-api:latest ./backend

# Deploy
az webapp create \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --plan clinical-cosmos-plan \
  --deployment-container-image-name clinicalcosmosacr.azurecr.io/clinical-cosmos-api:latest
```

### Method 3: CI/CD with GitHub Actions
1. Push to GitHub repo
2. Add secrets: `AZURE_CREDENTIALS`
3. GitHub Actions will auto-deploy on push to `main`
4. (See `.github/workflows/azure-deploy.yml`)

## 🔑 Required Secrets for CI/CD

If using GitHub Actions, add these secrets to your repository:

```bash
# Get credentials
az ad sp create-for-rbac \
  --name "clinical-cosmos-deploy" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/clinical-cosmos-rg \
  --sdk-auth
```

Add as `AZURE_CREDENTIALS` secret in GitHub.

## 🗄️ Database Setup

After deployment, initialize the database:

**Option 1: SSH into App Service**
```bash
az webapp ssh \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# Inside the shell:
python init_db.py
```

**Option 2: Cloud Shell**
```bash
# In Azure Portal, open Cloud Shell and run:
python backend/init_db.py \
  --database-url "postgresql://..." \
  --resource-group clinical-cosmos-rg
```

## 📊 Architecture Reference

```
User Browser
     ↓
┌─────────────────────────────────────┐
│ Azure Static Web Apps               │
│ (Frontend - React/Vite)             │
│ https://clinical-cosmos-web...      │
└──────────────────┬──────────────────┘
                   ↓ HTTPS
         ┌─────────────────────┐
         │ Azure App Service   │
         │ (Backend - FastAPI) │
         │ clinical-cosmos-api │
         │ azurewebsites.net   │
         └──────────┬──────────┘
                    ↓
        ┌─────────────────────────┐
        │                         │
        ↓                         ↓
   ┌──────────────┐      ┌──────────────┐
   │ Azure        │      │ Azure Blob   │
   │ PostgreSQL   │      │ Storage      │
   │ Database     │      │ (File uploads│
   └──────────────┘      └──────────────┘
```

## 💰 Cost Estimation

| Service | SKU | Cost/Month |
|---------|-----|-----------|
| PostgreSQL | Standard_B1ms | ~₹1,850 |
| App Service | B1 Linux | ~₹706 |
| Storage Account | Standard_LRS | ~₹585 + data |
| Static Web Apps | Free | Free (up to 1GB) |
| **Total** | | **~₹3,141** |

*Prices in INR. Free tier available if eligible.*

## 🔧 Common Configuration

### Update CORS for Your Domain
```bash
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings \
    CORS_ORIGINS="https://clinical-cosmos-web.azurestaticapps.net,https://yourdomain.com"
```

### Enable Auto-Scaling
```bash
az monitor autoscale create \
  --resource-group clinical-cosmos-rg \
  --resource-name-type Microsoft.Web/serverfarms \
  --resource-name clinical-cosmos-plan \
  --min-count 1 \
  --max-count 3 \
  --count 1
```

### View Logs
```bash
# Real-time logs
az webapp log tail \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# Download logs
az webapp log download \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --log-file logs.zip
```

## 🆘 Troubleshooting

### Backend not responding
1. Check logs: `az webapp log tail ...`
2. Verify settings: `az webapp config appsettings list ...`
3. Restart: `az webapp restart ...`

### Database connection errors
- Verify firewall allows your IP
- Check connection string format
- Test: `psql -h server.postgres.database.azure.com -U dbadmin -d clinical_cosmos`

### File upload failures
- Check storage account exists
- Verify container "trials" exists
- Check connection string is valid
- Review Azure Storage Explorer

### CORS errors in browser
- Add frontend URL to CORS_ORIGINS
- Restart backend App Service
- Clear browser cache

## 📚 Useful Links

- [Azure CLI Reference](https://learn.microsoft.com/en-us/cli/azure/reference-index)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Azure App Service Python](https://learn.microsoft.com/en-us/azure/app-service/quickstart-python)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure PostgreSQL](https://learn.microsoft.com/en-us/azure/postgresql/)
- [Azure Storage Blob](https://learn.microsoft.com/en-us/azure/storage/blobs/)

## 🔐 Security Best Practices

1. **Use Azure Key Vault for secrets**
```bash
az keyvault create \
  --name clinical-cosmos-kv \
  --resource-group clinical-cosmos-rg

az keyvault secret set \
  --vault-name clinical-cosmos-kv \
  --name DATABASE-PASSWORD \
  --value $DBPassword
```

2. **Enable HTTPS/TLS** (automatic with App Service)

3. **Configure Firewall Rules**
```bash
az postgres flexible-server firewall-rule create \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-db \
  --rule-name AllowAppService \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

4. **Enable Managed Identity**
```bash
az webapp identity assign \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

## 📝 Cleanup

To delete all resources and stop incurring charges:

```bash
az group delete --name clinical-cosmos-rg --yes
```

## 🚀 Next Steps

1. ✅ Run deployment script
2. ✅ Deploy backend code
3. ✅ Deploy frontend code
4. ✅ Initialize database
5. ✅ Test API endpoints
6. ✅ Configure custom domain
7. ✅ Set up monitoring/alerts
8. ✅ Configure backups
9. ✅ Set up CI/CD pipeline
10. ✅ Scale for production

## 📞 Support

For issues or questions:
- Check Azure Portal for detailed logs
- Review error messages in browser console
- Check backend logs: `az webapp log tail ...`
- Consult Azure documentation

---

**Last Updated**: December 23, 2025
**Application**: Clinical Cosmos
**Version**: 1.0
