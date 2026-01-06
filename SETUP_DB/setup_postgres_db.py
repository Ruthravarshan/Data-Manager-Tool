from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# Load env from parent backend folder if available, or local
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend', '.env'))
load_dotenv(env_path)

# Connect to 'postgres' db to create new db
# Default fallback if not in .env (though .env is expected)
DEFAULT_DB_URL = "postgresql://postgres:2664@localhost:5432/postgres"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_DB_URL).rsplit('/', 1)[0] + "/postgres"
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
