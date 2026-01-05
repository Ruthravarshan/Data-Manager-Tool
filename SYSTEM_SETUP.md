# Complete System Setup - Ready to Test

## ✅ Database Status
- ✓ Migration applied: `folder_path` column added to integrations table
- ✓ DataFile table created for storing classified files
- ✓ All models verified and working
- ✓ Sample data seeded

## 🚀 How to Test the Complete System

### Step 1: Create Sample Excel Files (Optional)
Create a folder `data_source` with sample Excel files following the naming convention:
- `dm_raw_20251223_100000.xlsx` → Will classify as DM (Demographics)
- `ae_raw_20251223_100100.xlsx` → Will classify as AE (Adverse Events)
- `sv_raw_20251223_100200.xlsx` → Will classify as SV (Subject Visits)

File naming format: `<prefix>_raw_<YYYYMMDD_HHMMSS>.<ext>`

### Step 2: Start Backend & Frontend
```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd clinical-cosmos-app
npm run dev
```

### Step 3: Access Application
Open browser: http://localhost:5173

### Step 4: Configure Data Integration
1. Go to **Data Integration** tab
2. Click **"Add Integration"** button
3. Fill in the form:
   - **Integration Name:** My Data Source
   - **Integration Type:** API or S3
   - **Vendor:** Select a vendor
   - **Update Frequency:** Daily at 2:00 AM
   - **Data Source Folder Path:** Path to your data_source folder
   
   Example paths:
   - Windows: `C:\Users\2000171848\data_source`
   - Linux/Mac: `/home/user/data_source`
   - Relative: `./data_source`

4. Click **"Add Integration"**

### Step 5: Scan Folder for Files
1. In the integration list table, find your new integration
2. Click the **green refresh button** (Scan button) in the Actions column
3. Button will show spinner while scanning
4. After completion, you'll see "✓ Scanned" message

### Step 6: View Classified Files
1. Go to **Trial Data Management** tab
2. Go to **EDC Data** tab (first main tab)
3. Files will be organized by section tabs:
   - **DM** - Demographics
   - **AE** - Adverse Events
   - **SV** - Subject Visits
   - **DS** - Disposition
   - **SAE** - Serious Adverse Events
   - **MH** - Medical History
   - **CM** - Concomitant Medications
   - **PD** - Protocol Deviations
   - **VS** - Vitals
   - **LB** - Laboratory
   - **EX** - Exposure

4. Click on a section tab to view files classified to that section
5. Each file shows:
   - Filename with status badge (Imported/Duplicate/Unclassified)
   - Timestamp
   - File size
   - Prefix identifier
   - Created date

### Step 7: File Operations
For each imported file:
- **👁️ Preview** - View file details and sample data
- **⬇️ Download** - Download the file
- **🗑️ Delete** - Remove file record from database

## 📋 Classification Mapping Reference

| Prefix | Section | Description |
|--------|---------|-------------|
| dm | DM | Demographics |
| sv | SV | Subject Visits |
| ds | DS | Disposition |
| ae | AE | Adverse Events |
| sae | SAE | Serious Adverse Events |
| mh | MH | Medical History |
| cm | CM | Concomitant Medications |
| pd | PD | Protocol Deviations |
| vs | VS | Vitals |
| lb | LB | Laboratory |
| ex | EX | Exposure |

## 🔍 Backend API Endpoints

### Data Integration
- `GET /api/integrations/` - Get all integrations
- `POST /api/integrations/` - Create new integration
- `PUT /api/integrations/{id}` - Update integration
- `DELETE /api/integrations/{id}` - Delete integration
- `GET /api/integrations/filters/types` - Get available types
- `GET /api/integrations/filters/statuses` - Get available statuses

### File Scanning & Classification
- `POST /api/data-files/scan/{integration_id}` - Scan folder and classify files
- `GET /api/data-files/` - Get data files (filters: section, status, integration_id)
- `GET /api/data-files/sections` - Get list of all sections
- `DELETE /api/data-files/{file_id}` - Delete file record

## ⚠️ Troubleshooting

### Issue: Folder path not found error
**Solution:** Ensure the folder path is correct and accessible from the backend process

### Issue: Files not classified
**Cause:** Filename doesn't match pattern `<prefix>_raw_<timestamp>.<ext>`
**Solution:** Rename files to follow the convention

### Issue: Status shows "Unclassified"
**Cause:** Prefix is not in the mapping list
**Solution:** Check file prefix against the mapping table above

### Issue: Database migration error
**Solution:** Run migration script again:
```bash
python migrate_add_folder_path.py
```

## 📝 File Structure

```
backend/
├── app/
│   ├── models.py (DataFile, IntegrationSource models)
│   ├── schemas.py (DataFile, ScanFolderResponse schemas)
│   ├── file_classifier.py (Classification logic)
│   ├── routers/
│   │   └── data_files.py (File scanning endpoints)
│   └── main.py (Updated with data_files router)
├── migrate_add_folder_path.py (Database migration)
├── verify_setup.py (System verification)
└── create_db.py (Database creation)

frontend/
├── src/
│   ├── pages/
│   │   ├── DataIntegration.tsx (Add folder path field & scan button)
│   │   └── TrialDataManagement.tsx (Display classified files)
│   └── services/
│       └── api.ts (New dataFileService)
```

## ✨ Key Features Implemented

✅ File scanning from specified folder
✅ Automatic classification by filename prefix
✅ Database storage of file metadata
✅ Dynamic UI display by section
✅ File preview, download, delete functionality
✅ Error handling & logging
✅ Duplicate detection
✅ Status tracking (Imported/Duplicate/Unclassified)
✅ Responsive design
✅ Seamless Data Integration ↔ Trial Data Management integration
