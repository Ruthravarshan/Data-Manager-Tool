from app.database import engine, Base
from app.models import Site, StudyContact, Vendor

print("Creating tables...")
Base.metadata.create_all(bind=engine)
print("Tables created.")
