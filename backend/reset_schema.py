from app.database import engine, Base
from app import models

def reset_schema():
    print("Dropping tables defined in models.py...")
    # This only drops tables associated with the models metadata
    # (studies, documents, integrations, data_files, metrics, activities)
    Base.metadata.drop_all(bind=engine)
    print("Tables dropped.")
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

if __name__ == "__main__":
    reset_schema()
