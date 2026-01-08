from app.database import engine
from sqlalchemy import inspect, text

def cleanup():
    inspector = inspect(engine)
    all_tables = inspector.get_table_names()
    
    # Identify dt_ tables
    dt_tables = [t for t in all_tables if t.startswith("dt_")]
    
    print(f"Found {len(dt_tables)} tables starting with 'dt_'.")
    
    if not dt_tables:
        print("No tables to clean.")
        return

    with engine.connect() as conn:
        for table in dt_tables:
            # print(f"Dropping {table}...") # Commented out to reduce noise, will print summary
            conn.execute(text(f"DROP TABLE IF EXISTS \"{table}\" CASCADE"))
        conn.commit()
    
    print(f"Cleanup complete. Dropped {len(dt_tables)} tables.")

if __name__ == "__main__":
    cleanup()
