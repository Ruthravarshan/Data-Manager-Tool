from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_schema():
    inspector = inspect(engine)
    columns = inspector.get_columns('integrations')
    with open('integrations_schema_output.txt', 'w') as f:
        f.write("Columns in integrations:\n")
        for column in columns:
            f.write(f"- {column['name']}: {column['type']}\n")
    print("Schema written to integrations_schema_output.txt")

if __name__ == "__main__":
    check_schema()
