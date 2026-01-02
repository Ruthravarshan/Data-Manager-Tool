"""
Database migration script to add database_credentials table
Run this script to update the database schema
"""

from sqlalchemy import create_engine, Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/clinical_cosmos")

# Create engine
engine = create_engine(DATABASE_URL)
Base = declarative_base()

# Define the new table
class DatabaseCredential(Base):
    __tablename__ = "database_credentials"

    id = Column(Integer, primary_key=True, index=True)
    integration_id = Column(Integer, ForeignKey("integrations.id"), unique=True)
    db_type = Column(String)
    host = Column(String)
    port = Column(Integer)
    database_name = Column(String)
    username = Column(String)
    encrypted_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

def migrate():
    """Create the database_credentials table"""
    try:
        # Create the table
        Base.metadata.create_all(bind=engine, tables=[DatabaseCredential.__table__])
        print("✓ Successfully created database_credentials table")
    except Exception as e:
        print(f"✗ Error creating table: {e}")

if __name__ == "__main__":
    print("Running database migration...")
    migrate()
    print("Migration complete!")
