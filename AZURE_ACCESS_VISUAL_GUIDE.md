# Visual Guide: Where to Find Your Deployed App

## 📺 Azure Portal Navigation

### Finding Your Frontend (Web App)

```
┌─ AZURE PORTAL ─────────────────────────────────────────┐
│  https://portal.azure.com                              │
└────────────────────────────────────────────────────────┘
                        ↓
         [Search Box at Top] ← Type "Static Web Apps"
                        ↓
    ┌──────────────────────────────────────┐
    │ SEARCH RESULTS                       │
    ├──────────────────────────────────────┤
    │ ✓ Static Web Apps                    │
    │   └─ clinical-cosmos-web             │ ← CLICK HERE
    └──────────────────────────────────────┘
                        ↓
    ┌──────────────────────────────────────┐
    │ clinical-cosmos-web Details          │
    ├──────────────────────────────────────┤
    │ Overview                             │
    │ ├─ URL: clinical-cosmos-web...       │ ← COPY THIS
    │ ├─ Status: Running ✓                 │
    │ └─ Resource Group: clinical-cosmos.. │
    │                                      │
    │ Monitoring                           │
    │ Analytics                            │
    │ Logs                                 │
    └──────────────────────────────────────┘
                        ↓
         OPEN IN BROWSER:
      https://clinical-cosmos-web.azurestaticapps.net
```

---

## 🔗 Finding Your Backend (API)

```
┌─ AZURE PORTAL ─────────────────────────────────────────┐
│  https://portal.azure.com                              │
└────────────────────────────────────────────────────────┘
                        ↓
         [Search Box at Top] ← Type "App Services"
                        ↓
    ┌──────────────────────────────────────┐
    │ SEARCH RESULTS                       │
    ├──────────────────────────────────────┤
    │ ✓ App Services                       │
    │   └─ clinical-cosmos-api             │ ← CLICK HERE
    └──────────────────────────────────────┘
                        ↓
    ┌──────────────────────────────────────┐
    │ clinical-cosmos-api Details          │
    ├──────────────────────────────────────┤
    │ Overview                             │
    │ ├─ Default domain: clinical-cosmos.. │ ← COPY THIS
    │ ├─ Status: Running ✓                 │
    │ ├─ Resource Health: Healthy ✓        │
    │ └─ Resource Group: clinical-cosmos.. │
    │                                      │
    │ Monitoring                           │
    │ Log stream ← Real-time logs          │
    │ Metrics                              │
    │ Application Insights                 │
    └──────────────────────────────────────┘
                        ↓
         TEST IN BROWSER:
      https://clinical-cosmos-api.azurewebsites.net/api
```

---

## 🏗️ Complete Architecture View

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS (World Wide)                       │
│                    Any Browser, Any Device                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    INTERNET (HTTPS)
                             │
        ┌────────────────────┴────────────────────┐
        │                                          │
        ▼                                          ▼
┌─────────────────────────────────┐    ┌──────────────────────────┐
│   STATIC WEB APPS               │    │   APP SERVICE            │
│   (Frontend - React App)         │    │   (Backend - FastAPI)    │
│                                 │    │                          │
│  URL:                           │    │  URL:                    │
│  https://clinical-cosmos-web... │    │  https://clinical-cosmos │
│  azurestaticapps.net            │    │  -api.azurewebsites.net  │
│                                 │    │                          │
│  Status: Running ✓              │    │  Status: Running ✓       │
│  CDN: Azure Global              │    │  Compute: Linux (Python) │
│                                 │    │                          │
│  Serves:                        │    │  Serves:                 │
│  - HTML                         │    │  - JSON APIs             │
│  - CSS                          │    │  - Database queries      │
│  - JavaScript                   │    │  - File handling         │
│  - Images                       │    │                          │
└─────────────────────────────────┘    └────────────┬─────────────┘
                                                     │
                ┌────────────────────────────────────┼─────────────┐
                │                                    │             │
                ▼                                    ▼             ▼
        ┌──────────────────┐           ┌──────────────────┐  ┌──────────────┐
        │  PostgreSQL      │           │  BLOB STORAGE    │  │   METRICS    │
        │  Database        │           │  (File uploads)  │  │   TABLES     │
        │                  │           │                  │  │              │
        │  Tables:         │           │  Container:      │  │  - Studies   │
        │  - studies       │           │  "trials"        │  │  - Activities│
        │  - documents     │           │                  │  │  - Documents │
        │  - activities    │           │  Stores:         │  │              │
        │  - integrations  │           │  - PDFs          │  │              │
        │  - metrics       │           │  - Word docs     │  │              │
        │                  │           │  - Other files   │  │              │
        └──────────────────┘           └──────────────────┘  └──────────────┘
```

---

## 📍 All Resources in One Table

After deployment, you'll have these resources visible in **Azure Portal**:

```
RESOURCE GROUP: clinical-cosmos-rg
Location: eastus
────────────────────────────────────────────────────────────────

TYPE                    NAME                      URL
────────────────────────────────────────────────────────────────
Static Web App          clinical-cosmos-web       https://clinical-cosmos-web.azurestaticapps.net
App Service             clinical-cosmos-api       https://clinical-cosmos-api.azurewebsites.net
App Service Plan        clinical-cosmos-plan      (internal)
Database                clinical-cosmos-db        clinical-cosmos-db.postgres.database.azure.com:5432
Storage Account         clinicalcosmosfiles       (blob storage)
────────────────────────────────────────────────────────────────
```

---

## 🎯 Three Ways to Access Your App

### Way 1: Through Azure Portal (Easiest)
```
1. Open https://portal.azure.com
2. Search "Static Web Apps"
3. Click clinical-cosmos-web
4. Copy URL
5. Open in browser
```

### Way 2: Using Azure CLI
```bash
# Get the exact URL:
az staticwebapp show \
  --name clinical-cosmos-web \
  --resource-group clinical-cosmos-rg \
  --query defaultHostname --output tsv

# Result: clinical-cosmos-web.azurestaticapps.net
# Access: https://clinical-cosmos-web.azurestaticapps.net
```

### Way 3: Direct (if you know the name)
```
https://<app-name>-web.azurestaticapps.net
Example: https://clinical-cosmos-web.azurestaticapps.net
```

---

## 📊 Monitoring Dashboard Locations

### Real-Time Logs (Best for Debugging)
```
Portal → App Services → clinical-cosmos-api
                     → [Left Menu] Log stream
                     
Shows live output as users interact with app
```

### Performance Metrics
```
Portal → App Services → clinical-cosmos-api
                     → [Left Menu] Metrics
                     
Shows: CPU, Memory, Requests, Response time
```

### Deployment History
```
Portal → App Services → clinical-cosmos-api
                     → [Left Menu] Deployments
                     
Shows: When deployed, by whom, success/failure
```

### Application Health
```
Portal → App Services → clinical-cosmos-api
                     → Overview (right side)
                     
Shows: Status (Running/Stopped), Resource Health, etc.
```

---

## ✅ Checklist: After Deployment

```
□ Found Frontend URL
  └─ Format: https://clinical-cosmos-web.azurestaticapps.net

□ Found Backend URL
  └─ Format: https://clinical-cosmos-api.azurewebsites.net

□ Frontend loads in browser
  └─ Should see dashboard with graphs

□ Backend API responds
  └─ Test: https://clinical-cosmos-api.azurewebsites.net/api
  └─ Should see: {"message": "Welcome to Clinical Cosmos API"}

□ Can create a study
  └─ Go to Study Management → Create Study

□ Can upload a file
  └─ Upload a document to a study

□ Can see recent activities
  └─ Dashboard → Recent Activities section

□ No console errors
  └─ Press F12 → Console tab (should be empty)

□ Monitoring shows no errors
  └─ Portal → App Services → clinical-cosmos-api → Log stream
```

---

## 🚀 Next Steps

1. **Open the Frontend**
   - Get the URL from Portal
   - Open in browser
   - Login/Use the app

2. **Monitor Performance**
   - Go to Portal
   - App Services → Metrics
   - Check CPU, Memory, Requests

3. **View Logs If Issues**
   - Portal → App Services → Log stream
   - Or: `az webapp log tail ...`

4. **Share with Others**
   - Copy the Frontend URL
   - Send to team members
   - They can access from anywhere

---

## 🔗 Quick Links to Save

```
Azure Portal Home:
https://portal.azure.com

Your Resource Group:
https://portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/YOUR-SUBSCRIPTION-ID/resourceGroups/clinical-cosmos-rg

Your Frontend (Your App):
https://clinical-cosmos-web.azurestaticapps.net

Your Backend API:
https://clinical-cosmos-api.azurewebsites.net/api
```

---

**That's it!** Your app is now live on the internet. 🎉

For detailed information, refer to:
- `ACCESS_DEPLOYED_APP.md` - Detailed guide
- `AZURE_QUICK_REFERENCE.md` - Commands reference
- `AZURE_DEPLOYMENT.md` - Full documentation

**Last Updated**: December 23, 2025
