from app.database import engine
from sqlalchemy import inspect
from app.models import DatabaseCredential, IntegrationSource
from app.database import SessionLocal

inspector = inspect(engine)
print("Tables in database:")
for table_name in inspector.get_table_names():
    print(f"- {table_name}")

print("\nColumns in 'database_credentials':")
columns = inspector.get_columns('database_credentials')
for column in columns:
    print(f"- {column['name']} ({column['type']})")

db = SessionLocal()
creds = db.query(DatabaseCredential).all()
print(f"\nTotal Credentials in DB: {len(creds)}")
db.close()
