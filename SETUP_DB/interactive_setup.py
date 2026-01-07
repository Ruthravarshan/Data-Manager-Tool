import os
import sys
import subprocess
import getpass
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Ensure backend modules can be imported
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, '..', 'backend'))
sys.path.append(backend_dir)

def get_input(prompt, default=None, is_password=False):
    if default:
        prompt_text = f"{prompt} [{default}]: "
    else:
        prompt_text = f"{prompt}: "
    
    if is_password:
        value = getpass.getpass(prompt_text)
    else:
        value = input(prompt_text)
    
    return value.strip() or default

def setup_env_file(backend_dir):
    env_path = os.path.join(backend_dir, '.env')
    print(f"\nChecking configuration in {env_path}...")

    if os.path.exists(env_path):
        print("Found existing .env file.")
        overwrite = get_input("Do you want to re-configure database credentials? (y/n)", "n")
        if overwrite.lower() != 'y':
            return True

    print("\n--- Database Configuration ---")
    print("Please enter your PostgreSQL credentials.")
    
    host = get_input("Host", "localhost")
    port = get_input("Port", "5432")
    user = get_input("Username", "postgres")
    password = get_input("Password", is_password=True)
    dbname = get_input("Database Name", "clinical_cosmos")
    
    # Validation connection
    print("\nValidating connection...")
    try:
        # Connect to 'postgres' default db to verify credentials
        temp_url = f"postgresql://{user}:{password}@{host}:{port}/postgres"
        engine = create_engine(temp_url)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Connection successful!")
    except Exception as e:
        print(f"Error connecting to database: {e}")
        retry = get_input("Connection failed. Try again? (y/n)", "y")
        if retry.lower() == 'y':
            return setup_env_file(backend_dir)
        return False

    # Write .env
    db_url = f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
    
    env_content = f"""DATABASE_URL={db_url}
AZURE_STORAGE_CONNECTION_STRING=True
"""
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print(f"Successfully wrote {env_path}")
        return True
    except Exception as e:
        print(f"Error writing .env file: {e}")
        return False

def create_database(env_path):
    print("\n--- Creating Database ---")
    # Reload env to ensure we get the latest DATABASE_URL
    load_dotenv(env_path, override=True)
    
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("Error: DATABASE_URL not found in environment.")
        return False
        
    # Parse URL to get base postgres connection
    # Assuming url format: postgresql://user:pass@host:port/dbname
    try:
        base_url = db_url.rsplit('/', 1)[0] + "/postgres"
        target_db_name = db_url.split('/')[-1]
    except Exception:
        print("Error interpreting DATABASE_URL")
        return False

    engine = create_engine(base_url, isolation_level="AUTOCOMMIT")
    try:
        with engine.connect() as conn:
            # Check if database exists
            result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname='{target_db_name}'"))
            if not result.fetchone():
                print(f"Creating database {target_db_name}...")
                conn.execute(text(f"CREATE DATABASE {target_db_name}"))
                print("Database created.")
            else:
                print(f"Database {target_db_name} already exists.")
        return True
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

def create_tables():
    print("\n--- Creating Tables ---")
    try:
        # Import here to avoid early loading issues
        from app.database import engine, Base
        from app.models import Study, IntegrationSource, Metric, DataFile, Document, Activity, DatabaseCredential
        
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")
        return True
    except Exception as e:
        print(f"Error creating tables: {e}")
        return False

def seed_data_step():
    print("\n--- Seeding Data ---")
    try:
        import seed_db
        seed_db.seed_data()
        return True
    except Exception as e:
        print(f"Error seeding data: {e}")
        return False

def main():
    print("==========================================")
    print("   CLINICAL COSMOS - INTERACTIVE SETUP")
    print("==========================================")
    
    if not setup_env_file(backend_dir):
        print("Setup aborted.")
        return

    env_path = os.path.join(backend_dir, '.env')

    # 1. Create DB
    if not create_database(env_path):
        return

    # 2. Create Tables
    if not create_tables():
        return

    # 3. Seed Data
    if not seed_data_step():
        return

    print("\n==========================================")
    print("         SETUP COMPLETED SUCCESSFULLY")
    print("==========================================")
    print("You can now run the backend:")
    print(f"cd {backend_dir}")
    print("uvicorn app.main:app --reload")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nSetup cancelled by user.")
    except Exception as e:
        print(f"\nUnexpected error: {e}")
