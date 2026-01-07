from sqlalchemy import create_engine, text
import os

# Connect to 'postgres' db to create new db
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres"
NEW_DB = "clinical_cosmos"

def create_database():
    engine = create_engine(DATABASE_URL, isolation_level="AUTOCOMMIT")
    with engine.connect() as conn:
        # Check if database exists
        result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname='{NEW_DB}'"))
        if not result.fetchone():
            print(f"Creating database {NEW_DB}...")
            conn.execute(text(f"CREATE DATABASE {NEW_DB}"))
            print("Database created.")
        else:
            print(f"Database {NEW_DB} already exists.")

if __name__ == "__main__":
    try:
        create_database()
    except Exception as e:
        print(f"Error creating database: {e}")
