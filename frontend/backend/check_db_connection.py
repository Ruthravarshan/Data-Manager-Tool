import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
print(f"Testing connection to: {DATABASE_URL}")

try:
    print(f"Attempt 1: Connecting to {DATABASE_URL}...")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Connection successful with configured URL!")
except Exception as e:
    print(f"Attempt 1 failed: {e}")
    
    # Try fallback
    FALLBACK_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
    print(f"Attempt 2: Connecting to fallback {FALLBACK_URL}...")
    try:
        engine = create_engine(FALLBACK_URL)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("Connection successful with fallback URL (postgres:postgres)!")
    except Exception as e2:
         print(f"Attempt 2 failed: {e2}")
