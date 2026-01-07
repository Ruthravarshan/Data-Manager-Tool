
import os
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from dotenv import load_dotenv
from urllib.parse import urlparse

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")

def migrate():
    try:
        url = urlparse(DATABASE_URL)
        dbname = url.path[1:]
        user = url.username
        password = url.password
        host = url.hostname
        port = url.port
        
        print(f"Connecting to database '{dbname}'...")
        con = psycopg2.connect(dbname=dbname, user=user, host=host, password=password, port=port)
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = con.cursor()
        
        # Check if column exists
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='integrations' AND column_name='protocol_id'")
        if cur.fetchone():
            print("Column 'protocol_id' already exists in 'integrations' table.")
        else:
            print("Adding 'protocol_id' column to 'integrations' table...")
            cur.execute("ALTER TABLE integrations ADD COLUMN protocol_id VARCHAR")
            print("Column added successfully.")
            
        cur.close()
        con.close()
        return True
    
    except Exception as e:
        print(f"Error during migration: {e}")
        return False

if __name__ == "__main__":
    migrate()
