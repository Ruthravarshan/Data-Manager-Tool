# How to Access Your Azure-Deployed Application

## 🌐 Application URLs After Deployment

After deployment, you'll have two main endpoints:

### Frontend (User Interface)
```
https://<app-name>-web.azurestaticapps.net
```

### Backend (API)
```
https://<app-name>-api.azurewebsites.net
```

**Example:**
- Frontend: `https://clinical-cosmos-web.azurestaticapps.net`
- Backend API: `https://clinical-cosmos-api.azurewebsites.net/api`

---

## 📍 Finding Your URLs in Azure Portal

### Method 1: Azure Portal (Easiest)

#### For Frontend (Static Web App)
1. Go to **Azure Portal** → https://portal.azure.com
2. Search for **"Static Web Apps"**
3. Click on your app (e.g., `clinical-cosmos-web`)
4. Look for **"URL"** in the Overview section
5. **Click the link or copy the URL**

**Screenshot Guide:**
```
Portal → Static Web Apps → clinical-cosmos-web
                          └── Overview
                              └── [URL] ← Click here
```

#### For Backend (App Service)
1. Go to **Azure Portal** → https://portal.azure.com
2. Search for **"App Services"**
3. Click on your app (e.g., `clinical-cosmos-api`)
4. Look for **"Default domain"** in the Overview section
5. **Click the link or copy the URL**

**Screenshot Guide:**
```
Portal → App Services → clinical-cosmos-api
                        └── Overview
                            └── [Default domain] ← Click here
```

---

## 🖥️ Method 2: Using Azure CLI Commands

### Get Frontend URL
```bash
az staticwebapp show \
  --name clinical-cosmos-web \
  --resource-group clinical-cosmos-rg \
  --query defaultHostname \
  --output tsv
```

**Output:**
```
clinical-cosmos-web.azurestaticapps.net
```

### Get Backend URL
```bash
az webapp show \
  --name clinical-cosmos-api \
  --resource-group clinical-cosmos-rg \
  --query defaultHostName \
  --output tsv
```

**Output:**
```
clinical-cosmos-api.azurewebsites.net
```

### Open in Browser Directly
```bash
# Windows
start https://clinical-cosmos-web.azurestaticapps.net

# Linux/Mac
open https://clinical-cosmos-web.azurestaticapps.net
```

---

## 🔍 Step-by-Step Guide to Access the Application

### Step 1: Get Frontend URL
```bash
FRONTEND_URL=$(az staticwebapp show \
  --name clinical-cosmos-web \
  --resource-group clinical-cosmos-rg \
  --query defaultHostname \
  --output tsv)

echo "Frontend: https://$FRONTEND_URL"
```

### Step 2: Open in Browser
```bash
# Windows
start "https://$FRONTEND_URL"

# Linux/Mac
open "https://$FRONTEND_URL"

# Or manually copy/paste the URL
echo "Open this URL in your browser:"
echo "https://$FRONTEND_URL"
```

### Step 3: Verify Backend is Working
```bash
BACKEND_URL=$(az webapp show \
  --name clinical-cosmos-api \
  --resource-group clinical-cosmos-rg \
  --query defaultHostName \
  --output tsv)

curl "https://$BACKEND_URL/api"
```

**Expected Response:**
```json
{"message": "Welcome to Clinical Cosmos API"}
```

---

## 📊 Dashboard Locations in Azure Portal

### Monitor Your Application Health

#### Frontend Metrics
```
Portal → Static Web Apps → clinical-cosmos-web
    ├── Overview (URL, Status)
    ├── Monitoring (Performance, Errors)
    ├── Logs (Application Logs)
    └── Deployments (Deployment History)
```

#### Backend Metrics
```
Portal → App Services → clinical-cosmos-api
    ├── Overview (URL, Status, Resource Health)
    ├── Monitoring (CPU, Memory, Requests)
    ├── Log Stream (Real-time Logs)
    ├── Application Insights (Advanced Monitoring)
    └── Deployments (Deployment History)
```

---

## 🧪 Testing the Deployed Application

### 1. Test Frontend Loading
Open in browser:
```
https://clinical-cosmos-web.azurestaticapps.net
```

You should see the login/dashboard page.

### 2. Test Backend API
```bash
# Basic connectivity
curl https://clinical-cosmos-api.azurewebsites.net/api

# Get studies
curl https://clinical-cosmos-api.azurewebsites.net/api/studies/

# Get recent activities
curl https://clinical-cosmos-api.azurewebsites.net/api/activities/recent

# Get active studies count
curl https://clinical-cosmos-api.azurewebsites.net/api/studies/count/active
```

### 3. Test Database Connection
```bash
# Via Azure Portal → App Service → SSH
az webapp ssh \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# Inside the SSH shell:
python -c "from app.database import SessionLocal; db = SessionLocal(); print('✓ Database connected')"
```

### 4. Test File Upload
1. Log into the web app
2. Go to "Study Management"
3. Try to upload a test document
4. Check Azure Blob Storage in portal

---

## 🔧 Viewing Logs and Debugging

### Method 1: Live Log Stream (App Service)

#### In Azure Portal
```
Portal → App Services → clinical-cosmos-api
    → Log stream
```

#### Via CLI
```bash
az webapp log tail \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

This shows real-time logs like:
```
2025-12-23 10:15:22 INFO Starting application...
2025-12-23 10:15:23 INFO Database tables initialized
2025-12-23 10:15:24 INFO Uvicorn running on 0.0.0.0:8000
```

### Method 2: Download Full Logs
```bash
az webapp log download \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --log-file logs.zip
```

Then extract and view `logs.zip`

### Method 3: Application Insights

For advanced monitoring:
```
Portal → App Services → clinical-cosmos-api
    → Application Insights (if enabled)
        ├── Live Metrics
        ├── Performance
        ├── Failures
        └── Traces
```

---

## 🚨 Troubleshooting Access Issues

### Issue 1: Frontend Page Loads But Shows Blank/Error

**Check:**
1. Open Browser DevTools (F12)
2. Go to **Console** tab
3. Look for errors about API connection

**Fix:**
```bash
# Check if backend API is running
curl https://clinical-cosmos-api.azurewebsites.net/api

# If fails, restart backend
az webapp restart \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# Wait 30 seconds and try again
```

### Issue 2: "Cannot Connect to API" Error

**Common causes:**
1. Backend not started yet
2. CORS not configured
3. Wrong API URL in frontend

**Fix:**
```bash
# 1. Check backend status
az webapp show \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --query state

# Output should be "Running"

# 2. Check logs for errors
az webapp log tail \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# 3. Verify CORS settings
az webapp config appsettings list \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --query "[?name=='CORS_ORIGINS'].value"

# 4. If wrong, update it
az webapp config appsettings set \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --settings CORS_ORIGINS="https://clinical-cosmos-web.azurestaticapps.net"
```

### Issue 3: 500 Internal Server Error

**Check logs immediately:**
```bash
az webapp log tail \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

**Common fixes:**
```bash
# 1. Restart the app
az webapp restart \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api

# 2. Check database connection
az webapp config appsettings list \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --query "[?name=='DATABASE_URL'].value"

# 3. Verify environment variables
az webapp config appsettings list \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

### Issue 4: "Page Not Found" (404)

**This means:**
- Frontend deployed successfully ✓
- But looking for wrong page

**Fix:**
```bash
# Make sure you're going to the root URL
https://clinical-cosmos-web.azurestaticapps.net   ✓ (correct)
https://clinical-cosmos-web.azurestaticapps.net/index.html   (usually works)
```

---

## 📈 Monitoring Performance

### Check Request Metrics
```bash
# Get App Service statistics
az appservice plan show \
  --name clinical-cosmos-plan \
  --resource-group clinical-cosmos-rg
```

### Monitor Database
```bash
# Connect to PostgreSQL and check status
az postgres flexible-server connect \
  --name clinical-cosmos-db \
  --admin-user dbadmin

# Commands inside psql:
\l                          # List databases
\dt                         # List tables
SELECT COUNT(*) FROM studies;  # Check studies
SELECT COUNT(*) FROM activities;  # Check activities
\q                          # Quit
```

### Check Storage Usage
```bash
az storage account show-usage \
  --name clinicalcosmosfiles \
  --resource-group clinical-cosmos-rg
```

---

## 🔄 Common Operations

### Restart Backend
```bash
az webapp restart \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api
```

### Restart Static Web App (Frontend)
Usually not needed, but if required:
```bash
# Redeploy frontend
az staticwebapp linked-backend unlink \
  --name clinical-cosmos-web \
  --resource-group clinical-cosmos-rg
```

### View All Resources
```bash
az resource list \
  --resource-group clinical-cosmos-rg \
  --output table
```

### Check Resource Status
```bash
# Overall health
az group show \
  --name clinical-cosmos-rg \
  --query "properties.provisioningState"

# Detailed status of each
az resource list \
  --resource-group clinical-cosmos-rg \
  --query "[].{name:name, type:type, state:properties.provisioningState}" \
  --output table
```

---

## 📱 Accessing from Mobile

Your deployed app is accessible from anywhere:

1. **Get the Frontend URL:**
```bash
az staticwebapp show \
  --name clinical-cosmos-web \
  --resource-group clinical-cosmos-rg \
  --query defaultHostname --output tsv
```

2. **Open on Mobile:**
   - Open browser on phone
   - Enter the URL: `https://clinical-cosmos-web.azurestaticapps.net`
   - Should work on any device with internet

---

## 🔐 Securing Access

### Add Custom Domain
```bash
az staticwebapp custom-domain create \
  --name clinical-cosmos-web \
  --resource-group clinical-cosmos-rg \
  --domain-name yourdomain.com
```

### Enable Authentication
```
Portal → Static Web Apps → clinical-cosmos-web
    → Settings → Authentication
        → Add provider (GitHub, Google, Microsoft, etc.)
```

### Restrict IP Access (Backend)
```bash
az webapp config access-restriction add \
  --resource-group clinical-cosmos-rg \
  --name clinical-cosmos-api \
  --rule-name AllowOffice \
  --action Allow \
  --ip-address 203.0.113.0/24 \
  --priority 100
```

---

## 🆘 Quick Troubleshooting Checklist

| Issue | Check | Command |
|-------|-------|---------|
| App not loading | Frontend status | `az staticwebapp show --name clinical-cosmos-web --resource-group clinical-cosmos-rg` |
| API errors | Backend logs | `az webapp log tail --resource-group clinical-cosmos-rg --name clinical-cosmos-api` |
| Database issues | DB connection | `psql -h server.postgres.database.azure.com -U dbadmin -d clinical_cosmos` |
| File upload fails | Storage status | `az storage account show --name clinicalcosmosfiles --resource-group clinical-cosmos-rg` |
| Slow performance | CPU/Memory | Portal → App Service → Metrics |

---

## 📞 Getting Help

### If Nothing Works:

1. **Check Azure Portal Status:**
   - Go to Portal → All services → Resource groups
   - Click your resource group
   - Look for any red X or warning icons

2. **View Detailed Logs:**
   ```bash
   az webapp log tail \
     --resource-group clinical-cosmos-rg \
     --name clinical-cosmos-api \
     --follow
   ```

3. **Check Service Health:**
   ```bash
   Portal → Help + support → Service Health
   ```

4. **Review Deployment History:**
   ```bash
   Portal → App Services → clinical-cosmos-api → Deployments
   ```

---

## ✅ Verification Checklist

After deployment, verify:

- [ ] Frontend URL accessible and loads
- [ ] Backend API returns "Welcome" message
- [ ] Database tables created (check logs)
- [ ] Can create a new study
- [ ] Can upload a document
- [ ] Can see activities logged
- [ ] No console errors in browser (F12)
- [ ] API responds to requests

---

**Last Updated**: December 23, 2025
