# Setup Guide

## Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python setup_postgres_db.py
python create_db.py
python seed_db.py
uvicorn app.main:app --reload
```

## Frontend

```bash
cd clinical-cosmos-app
npm install
npm run dev
```
