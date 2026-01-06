# Project Setup & Database Duplication Guide

This guide ensures a complete setup of the Data Manager Tool, including the **Critical Database Duplication** step for new environments.

## ⚠️ CRITICAL: Database Duplication

To ensure the new environment has the exact same data as the master environment:

1.  **On the Source Machine (Yours):**
    *   Navigate to `{project_root}/SETUP_DB`
    *   Run `export_db.bat`. This creates a file named `clinical_cosmos_backup.sql`.
    *   **Keep this file safe** inside the project folder or share it securely.

2.  **On the Target Machine (Colleague's):**
    *   Place the `clinical_cosmos_backup.sql` file into their `{project_root}/SETUP_DB` folder.
    *   Navigate to `{project_root}/SETUP_DB`.
    *   Run setup script: `python setup_postgres_db.py` (Creates empty DB).
    *   **Run import script**: `import_db.bat` (Restores all data).

---

## 🚀 How to Run the System

### 1. Prerequisites
*   Python 3.10+
*   Node.js (LTS)
*   PostgreSQL (Ensure `bin` is in PATH)

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
# If incorrectly configured, update .env with your DB credentials
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd clinical-cosmos-app
npm install
npm run dev
```

### 4. Access Application
Open [http://localhost:5173](http://localhost:5173)

---

## 📋 System verification
After setup, verify:
1.  **Data Integration > Data Sources**: You should see existing integration records.
2.  **Trial Data Management**: Ensure files are listed under EDC Data tabs (DM, AE, etc.).
3.  **Real-Time Monitoring**: Check if dashboard stats are loading.

---

## 🐍 Alternative: Python Database Clone

You can also duplicate the database using Python, which works on any system with Python and PostgreSQL:

1. On both source and target machines, open a terminal and run:
   ```bash
   cd SETUP_DB
   pip install sqlalchemy psycopg2-binary
   ```

2. Make sure you have a target database created (e.g., clinical_cosmos) and know both connection strings.

3. Run the clone script:
   ```bash
   python clone_db.py --source postgresql://<source_user>:<source_pass>@<source_host>:5432/<source_db> --target postgresql://<target_user>:<target_pass>@<target_host>:5432/<target_db>
   ```

Replace the connection strings with your actual credentials and database names.

This will copy all tables and data from the source to the target database.

## 🐍 If Target Database Exists But Tables Are Missing

If your colleague already has a PostgreSQL database created, but it does not have the required tables:

1. Make sure you have Python and the required packages installed:
   ```bash
   cd SETUP_DB
   pip install sqlalchemy psycopg2-binary
   ```

2. Run the clone script to copy all tables and data from your source database to their existing target database:
   ```bash
   python clone_db.py --source postgresql://<source_user>:<source_pass>@<source_host>:5432/<source_db> --target postgresql://<target_user>:<target_pass>@<target_host>:5432/<target_db>
   ```

This will create all missing tables and copy the data. No need to drop or recreate the database—just run the script.

---

