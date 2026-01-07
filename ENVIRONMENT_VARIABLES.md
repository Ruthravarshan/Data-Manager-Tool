# Environment Variables Configuration

## Backend Environment Variables

### Required for Azure Deployment

```env
# Database Configuration
DATABASE_URL=postgresql://dbadmin:password@server.postgres.database.azure.com:5432/clinical_cosmos

# Azure Storage (if using Blob Storage for file uploads)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=xxx;AccountKey=xxx;EndpointSuffix=core.windows.net
USE_AZURE_STORAGE=true
AZURE_STORAGE_CONTAINER=trials

# CORS Configuration (for frontend)
CORS_ORIGINS=https://clinical-cosmos-web.azurestaticapps.net,https://yourdomain.com

# Application Settings
WEBSITES_PORT=8000
PYTHONPATH=/app
```

### Optional Settings

```env
# Logging
LOG_LEVEL=INFO

# Security
SECRET_KEY=your-secret-key-for-jwt

# API Settings
API_TITLE=Clinical Cosmos API
API_VERSION=1.0.0
```

## Frontend Environment Variables

### Development (.env.development)

```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

### Production (.env.production)

```env
REACT_APP_API_URL=https://clinical-cosmos-api.azurewebsites.net/api
REACT_APP_ENV=production
```

### Static Web App Configuration

In Azure Portal → Settings → Configuration:

```
REACT_APP_API_URL=https://clinical-cosmos-api.azurewebsites.net/api
REACT_APP_ENV=production
NODE_ENV=production
```

## Local Development Setup

### Copy template files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend  
cp clinical-cosmos-app/.env.example clinical-cosmos-app/.env.local
```

### Edit local .env files

**backend/.env**:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/clinical_cosmos
USE_AZURE_STORAGE=false
CORS_ORIGINS=http://localhost:5173
WEBSITES_PORT=8000
```

**clinical-cosmos-app/.env.local**:
```env
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_ENV=development
```

## Azure App Service Configuration

### Via Azure CLI

```bash
# Set single variable
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings DATABASE_URL="postgresql://..."

# Set multiple variables
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings \
    DATABASE_URL="postgresql://..." \
    AZURE_STORAGE_CONNECTION_STRING="..." \
    USE_AZURE_STORAGE="true" \
    CORS_ORIGINS="https://..." \
    WEBSITES_PORT=8000
```

### Via Azure Portal

1. Go to App Service → Settings → Configuration
2. Click "New application setting"
3. Enter Name and Value
4. Click OK
5. Click Save at the top

## Docker Environment

When running with Docker, pass variables via:

```bash
docker run \
  -e DATABASE_URL="postgresql://..." \
  -e AZURE_STORAGE_CONNECTION_STRING="..." \
  -e USE_AZURE_STORAGE=true \
  -p 8000:8000 \
  clinical-cosmos-api:latest
```

Or via docker-compose (.env file):

```env
DATABASE_URL=postgresql://user:password@postgres:5432/clinical_cosmos
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
USE_AZURE_STORAGE=true
API_PORT=8000
```

## Azure Key Vault Integration

For production, store secrets in Azure Key Vault:

### Create secrets
```bash
az keyvault create \
  --name clinical-cosmos-kv \
  --resource-group clinical-cosmos-rg

az keyvault secret set \
  --vault-name clinical-cosmos-kv \
  --name DATABASE-PASSWORD \
  --value "your-password"

az keyvault secret set \
  --vault-name clinical-cosmos-kv \
  --name STORAGE-CONNECTION-STRING \
  --value "your-connection-string"
```

### Reference in App Service
```bash
# Update to reference Key Vault secrets
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings \
    DATABASE_PASSWORD="@Microsoft.KeyVault(VaultName=clinical-cosmos-kv;SecretName=DATABASE-PASSWORD)" \
    AZURE_STORAGE_CONNECTION_STRING="@Microsoft.KeyVault(VaultName=clinical-cosmos-kv;SecretName=STORAGE-CONNECTION-STRING)"
```

## Environment-Specific Configurations

### Development
```env
DEBUG=True
LOG_LEVEL=DEBUG
DATABASE_URL=postgresql://localhost:5432/clinical_cosmos
USE_AZURE_STORAGE=false
```

### Staging
```env
DEBUG=False
LOG_LEVEL=INFO
DATABASE_URL=postgresql://staging-db.postgres.database.azure.com:5432/clinical_cosmos
USE_AZURE_STORAGE=true
CORS_ORIGINS=https://staging.azurestaticapps.net
```

### Production
```env
DEBUG=False
LOG_LEVEL=WARNING
DATABASE_URL=postgresql://prod-db.postgres.database.azure.com:5432/clinical_cosmos
USE_AZURE_STORAGE=true
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Checking Configuration

### Verify App Service settings
```bash
az webapp config appsettings list \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

### Test database connection
```bash
# From your machine
psql -h server.postgres.database.azure.com \
     -U dbadmin \
     -d clinical_cosmos

# From App Service (via SSH)
az webapp ssh --resource-group clinical-cosmos-rg --name clinical-cosmos-api
python -c "from app.database import engine; engine.connect()"
```

### View live logs with variables
```bash
az webapp log tail \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

## Troubleshooting

### Variable not taking effect
1. Check spelling of variable name
2. Restart App Service: `az webapp restart ...`
3. Wait 30 seconds for changes to apply
4. Check logs: `az webapp log tail ...`

### Connection errors after setting DATABASE_URL
1. Verify format: `postgresql://user:pass@host:5432/db`
2. Test connection locally first
3. Check PostgreSQL firewall allows App Service IP
4. Verify database exists and user has permissions

### API returning 500 errors
1. Check all required variables are set
2. Review logs for specific error
3. Verify no typos in connection strings
4. Ensure all services (DB, Storage) are accessible

## Security Best Practices

1. **Never commit .env files to git**
   - Add to .gitignore
   - Use only for local development

2. **Use different secrets for each environment**
   - Don't reuse production password in staging
   - Rotate passwords regularly

3. **Store production secrets in Azure Key Vault**
   - Never in App Service application settings directly
   - Use Managed Identity for authentication

4. **Limit variable visibility**
   - Only grant necessary permissions
   - Use least privilege principle

5. **Audit variable access**
   - Enable logging for secret access
   - Monitor changes via Azure Activity Log

---

**Last Updated**: December 23, 2025
