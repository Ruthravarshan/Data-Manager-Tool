"""
Migration script to add folder_path column to integrations table
"""
from sqlalchemy import text
from app.database import engine

def migrate():
    """Add folder_path column to integrations table if it doesn't exist"""
    try:
        with engine.connect() as connection:
            # Check if column exists
            result = connection.execute(
                text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name='integrations' AND column_name='folder_path'
                """)
            )
            
            if result.fetchone():
                print("✓ folder_path column already exists in integrations table")
                return
            
            # Add the column if it doesn't exist
            print("Adding folder_path column to integrations table...")
            connection.execute(text("""
                ALTER TABLE integrations 
                ADD COLUMN folder_path VARCHAR NULL
            """))
            connection.commit()
            print("✓ Successfully added folder_path column to integrations table")
            
    except Exception as e:
        print(f"Error during migration: {e}")
        raise

if __name__ == "__main__":
    print("Starting migration...")
    migrate()
    print("Migration completed!")
