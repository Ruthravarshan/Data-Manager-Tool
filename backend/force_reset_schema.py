from app.database import engine, Base
from sqlalchemy import text
from app import models

def force_reset_schema():
    print("Forcing reset of tables...")
    with engine.connect() as conn:
        conn.execute(text("DROP TABLE IF EXISTS data_quality_issues CASCADE"))
        # Also drop other legacy tables if they exist
        conn.execute(text("DROP TABLE IF EXISTS agents CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS activity_logs CASCADE"))
        
        # Drop tables from models.py with CASCADE just in case
        conn.execute(text("DROP TABLE IF EXISTS studies CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS documents CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS integrations CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS data_files CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS metrics CASCADE"))
        conn.execute(text("DROP TABLE IF EXISTS activities CASCADE"))
        conn.commit()
    print("Legacy and Core tables dropped.")
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    force_reset_schema()
