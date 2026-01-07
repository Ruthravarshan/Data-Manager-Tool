from app.database import engine, Base
from app.models import Study, IntegrationSource, Metric, Activity, Document

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Tables created successfully!")
