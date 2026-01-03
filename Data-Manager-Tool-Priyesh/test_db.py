
# test_db.py
import os
from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT version(), current_database();")).fetchone()
        print("✅ Connected.")
        print("Postgres version:", result[0])
        print("Database:", result[1])
except Exception as e:
    print("❌ Connection failed:", e)