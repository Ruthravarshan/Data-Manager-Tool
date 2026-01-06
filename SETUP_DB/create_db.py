import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))

from app.database import engine, Base
from app.models import Study, IntegrationSource, Metric, DataFile, Document

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
