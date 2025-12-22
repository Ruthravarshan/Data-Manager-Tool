# Setup Guide

## Git set-up

python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
npm install

## Backend

```bash
cd backend
python setup_postgres_db.py
python create_db.py
python seed_db.py
uvicorn app.main:app --reload
```

## Frontend

```bash
cd clinical-cosmos-app
npm run dev
```
