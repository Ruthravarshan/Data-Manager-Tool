from sqlalchemy.orm import Session
from app.database import engine, SessionLocal
from app.models import IntegrationSource
import os

def check_integrations():
    db = SessionLocal()
    try:
        integrations = db.query(IntegrationSource).all()
        with open('integrations_status.txt', 'w') as f:
            f.write(f"{'ID':<3} | {'Name':<20} | {'Folder Path':<60} | {'Exists'}\n")
            f.write("-" * 100 + "\n")
            for integration in integrations:
                exists = os.path.exists(integration.folder_path) if integration.folder_path else False
                f.write(f"{integration.id:<3} | {integration.name:<20} | {str(integration.folder_path):<60} | {exists}\n")
        print("Status written to integrations_status.txt")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_integrations()
