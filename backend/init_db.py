#!/usr/bin/env python
"""
Initialize or recreate the database with all required tables.
Run this after making model changes to ensure tables are created.
"""
import sys
from sqlalchemy import text
from app.database import engine, Base
from app.models import Study, IntegrationSource, Metric, Activity, Document

def init_db():
    """Create all tables in the database"""
    try:
        print("Initializing database tables...")
        
        # Create all tables based on models
        Base.metadata.create_all(bind=engine)
        
        print("✓ Database tables initialized successfully!")
        print("\nTables created:")
        print("  - studies")
        print("  - documents")
        print("  - integrations")
        print("  - metrics")
        print("  - activities")
        
        return True
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        return False

if __name__ == "__main__":
    success = init_db()
    sys.exit(0 if success else 1)
