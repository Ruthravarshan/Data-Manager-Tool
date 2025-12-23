#!/usr/bin/env python
"""
Database migration helper - adds the Activity table if it doesn't exist.
This is a workaround for databases that already have tables from previous versions.
"""
from sqlalchemy import text, inspect
from app.database import engine
from app.models import Activity, Base

def add_activity_table():
    """Add Activity table to existing database"""
    try:
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if 'activities' not in existing_tables:
            print("Creating 'activities' table...")
            # Create just the Activity table
            Activity.__table__.create(engine, checkfirst=True)
            print("✓ 'activities' table created successfully!")
        else:
            print("✓ 'activities' table already exists.")
            
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    add_activity_table()
