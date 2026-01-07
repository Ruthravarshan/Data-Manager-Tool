# Clinical Cosmos Database Setup

This folder contains scripts to initialize the database for the Clinical Cosmos application.

## 🚀 Quick Start (Recommended)

Run the **`setup_project.bat`** in the **ROOT directory** of this project. It handles everything:
- Virtual Environment setup
- Dependency installation
- Database configuration & Seeding

---

## Manual / Advanced Setup

If you prefer to run the setup script manually (e.g. for debugging):

1.  Ensure you are in the `SETUP_DB` folder.
2.  Ensure your `backend/.venv` is active or you have dependencies installed.
3.  Run:

```bash
python interactive_setup.py
```

This single script will:
1.  **Configure Credentials**: Ask for DB host/user/pass and write `backend/.env`.
2.  **Create Database**: Create `clinical_cosmos` DB if missing.
3.  **Schema & Data**: Create all tables and seed initial data.

## Files
- `interactive_setup.py`: The main setup logic.
- `seed_db.py`: Valid seed data module (imported by the setup script).
- `init_db_fresh.bat`: Windows batch wrapper for the python script.
