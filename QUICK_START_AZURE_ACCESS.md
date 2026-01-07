# Azure Deployed App - Quick Access Guide

## 🚀 After Deployment: Where to Find Everything

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR DEPLOYED APP                            │
└─────────────────────────────────────────────────────────────────┘

Your Web App (Open in Browser)
    ↓
https://clinical-cosmos-web.azurestaticapps.net
    ↑
Open this URL in your browser to use the application

┌─────────────────────────────────────────────────────────────────┐
│                    AZURE PORTAL NAVIGATION                      │
└─────────────────────────────────────────────────────────────────┘

Portal: https://portal.azure.com

Step 1: Search "Static Web Apps"
        ↓
        Click: clinical-cosmos-web
        ↓
        Copy URL from "Overview" section
        ↓
        Open in browser: https://clinical-cosmos-web.azurestaticapps.net

Step 2: Search "App Services"  (Optional - for backend testing)
        ↓
        Click: clinical-cosmos-api
        ↓
        Copy Default domain
        ↓
        Test API: https://clinical-cosmos-api.azurewebsites.net/api
```

---

## 📍 The 4 Key URLs You Need

| Component | URL | Purpose |
|-----------|-----|---------|
| **Frontend** | `https://clinical-cosmos-web.azurestaticapps.net` | 🌐 Main app - Open in browser |
| **Backend API** | `https://clinical-cosmos-api.azurewebsites.net/api` | 🔗 API for frontend |
| **Portal** | https://portal.azure.com | 📊 Monitor and manage |
| **Local Dev** | `http://localhost:3000` + `http://localhost:8000` | 💻 Development only |

---

## ⚡ Quickest Way to Get URLs (Copy-Paste)

### Option 1: Using Azure CLI (Recommended)

```bash
# Run this command to get BOTH URLs:
echo "FRONTEND: https://$(az staticwebapp show --name clinical-cosmos-web --resource-group clinical-cosmos-rg --query defaultHostname --output tsv)"

echo "BACKEND: https://$(az webapp show --name clinical-cosmos-api --resource-group clinical-cosmos-rg --query defaultHostName --output tsv)/api"
```

### Option 2: Manual Steps

1. **Frontend URL:**
   - Go to Azure Portal → Static Web Apps
   - Click "clinical-cosmos-web"
   - Copy the "URL" shown

2. **Backend URL:**
   - Go to Azure Portal → App Services
   - Click "clinical-cosmos-api"
   - Copy the "Default domain" shown
   - Add `/api` at the end

---

## 🖱️ One-Click Access

After you have the URLs, just:

1. **Copy the Frontend URL**
2. **Paste in browser address bar**
3. **Press Enter**

That's it! You should see your Clinical Cosmos application loaded.

---

## ✅ What You Should See

### When Frontend Loads Successfully ✓

```
You should see:
- Dashboard with graphs and metrics
- Clinical Studies section
- Recent Activities
- Navigation menu (Study Management, Analytics, etc.)
- No console errors (check F12 if unsure)
```

### When Backend is Working ✓

Test this URL in browser or curl:
```
https://clinical-cosmos-api.azurewebsites.net/api
```

You should see:
```json
{"message": "Welcome to Clinical Cosmos API"}
```

---

## 📊 Monitoring Dashboard in Azure Portal

Once you access the Portal, you can monitor:

```
Azure Portal (https://portal.azure.com)
│
├── Static Web Apps → clinical-cosmos-web
│   ├── Overview (URL, Status)
│   ├── Analytics (Traffic, Errors)
│   └── Logs (Deployment logs)
│
└── App Services → clinical-cosmos-api
    ├── Overview (URL, Status, Resource Health)
    ├── Metrics (CPU, Memory, Requests)
    ├── Log Stream (Real-time logs)
    └── Application Insights (Advanced monitoring)
```

---

## 🔍 Checking If Everything Works

### Test 1: Frontend Loads
```
Open: https://clinical-cosmos-web.azurestaticapps.net
Expected: See dashboard page
```

### Test 2: Backend Responds
```
Open: https://clinical-cosmos-api.azurewebsites.net/api
Expected: See JSON message
```

### Test 3: API Calls Work
```bash
curl https://clinical-cosmos-api.azurewebsites.net/api/studies/
# Should see studies list (even if empty)
```

### Test 4: Database Connected
```bash
curl https://clinical-cosmos-api.azurewebsites.net/api/activities/recent
# Should see activities (or empty list)
```

---

## 🐛 Something Not Working?

### Frontend Blank/Error?
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for red errors
4. Check Backend URL is correct

### Backend Returns Error?
1. Go to Azure Portal
2. Find App Service → clinical-cosmos-api
3. Click **Log stream** (on the left)
4. Look for error messages
5. Common fix: Restart the app (button at top)

### Can't Find the URLs?
1. Go to Azure Portal
2. Click **"Resource groups"** (left menu)
3. Find **clinical-cosmos-rg**
4. Click it
5. You'll see all your resources listed

---

## 🎯 Step-by-Step: First Access

```
1. Open Azure Portal
   → https://portal.azure.com

2. Search "Static Web Apps"
   → Type in search box at top

3. Click "clinical-cosmos-web"
   → You'll see your app details

4. Copy the URL
   → Look for "URL" in Overview section
   → Copy it (usually highlights in blue)

5. Open new browser tab
   → Paste the URL
   → Press Enter

6. Your app loads! 🎉
   → You should see the Clinical Cosmos dashboard
```

---

## 📱 On Mobile/Other Device?

Your deployed app is **publicly accessible** from anywhere:

1. Get the Frontend URL (from Azure Portal)
2. Open on phone/tablet browser
3. Paste the URL
4. Done! Works anywhere with internet

Example:
```
Phone browser → https://clinical-cosmos-web.azurestaticapps.net
```

---

## 🔐 Sharing Access

To let others use your app:

1. Get Frontend URL from Azure Portal
2. Send them this: `https://clinical-cosmos-web.azurestaticapps.net`
3. They can open it in any browser
4. That's it!

---

## 📋 Useful Links to Save

```
Azure Portal:
https://portal.azure.com

Your Frontend App:
https://clinical-cosmos-web.azurestaticapps.net

Your Backend API:
https://clinical-cosmos-api.azurewebsites.net/api

Resource Group (see all resources):
https://portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/{id}/resourceGroups/clinical-cosmos-rg
```

---

## 🆘 Need Help Fast?

### Check 3 Things (in order):

1. **Is Frontend URL loading?**
   ```bash
   curl https://clinical-cosmos-web.azurestaticapps.net -I
   # Should see: HTTP/1.1 200
   ```

2. **Is Backend API responding?**
   ```bash
   curl https://clinical-cosmos-api.azurewebsites.net/api
   # Should see JSON message
   ```

3. **Check logs:**
   ```bash
   az webapp log tail \
     --resource-group clinical-cosmos-rg \
     --name clinical-cosmos-api
   ```

---

## 🎓 Learn More

For detailed information, see:
- **AZURE_DEPLOYMENT.md** - Full deployment guide
- **AZURE_QUICK_REFERENCE.md** - Commands reference
- **ENVIRONMENT_VARIABLES.md** - Configuration guide
- **ACCESS_DEPLOYED_APP.md** - This detailed guide

---

**Quick Summary:**
1. Get Frontend URL from Azure Portal
2. Open in browser
3. Use your app!
4. Monitor via Portal if needed

**Last Updated**: December 23, 2025
