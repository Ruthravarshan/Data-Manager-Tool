import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")

def check_db():
    try:
        url = urlparse(DATABASE_URL)
        dbname = url.path[1:]
        user = url.username
        password = url.password
        host = url.hostname
        port = url.port
        
        # Connect to default 'postgres' database to check if 'clinical_cosmos' exists
        print(f"Connecting to postgres server at {host}:{port} as {user}...")
        con = psycopg2.connect(dbname='postgres', user=user, host=host, password=password, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        cur.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{dbname}'")
        exists = cur.fetchone()
        
        if not exists:
            print(f"Database '{dbname}' does not exist. Creating it...")
            cur.execute(f"CREATE DATABASE {dbname}")
            print(f"Database '{dbname}' created successfully.")
        else:
            print(f"Database '{dbname}' already exists.")
            
        cur.close()
        con.close()
        return True
    
    except Exception as e:
        print(f"Error checking/creating database: {e}")
        return False

if __name__ == "__main__":
    check_db()
