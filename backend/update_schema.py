from app.database import engine, Base
from app import models

def update_schema():
    print("Creating tables based on models.py...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")
    
    # List tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Current tables in DB: {tables}")

if __name__ == "__main__":
    update_schema()
