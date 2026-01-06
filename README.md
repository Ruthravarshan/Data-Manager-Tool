# Data Manager Tool

## Project Setup
For detailed setup instructions (including backend and database duplication), please refer to **[SETUP.md](SETUP.md)**.

## Quick Start
1. **Backend**:
   ```bash
   cd backend
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend**:
   ```bash
   cd clinical-cosmos-app
   npm run dev
   ```
