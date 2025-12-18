from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Study, Metric
from app.database import DATABASE_URL
from datetime import date
import uuid

# Setup DB connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def seed_data():
    print("Seeding database...")
    
    # 1. Seed Studies
    if db.query(Study).count() == 0:
        print("Seeding Studies...")
        studies = [
            Study(
                id=f"ST-{uuid.uuid4().hex[:6].upper()}",
                title="Diabetes Type 2 Study",
                protocol_id="DT2-2024-PH3",
                phase="Phase III",
                status="Active",
                sites_count=28,
                subjects_count=342,
                start_date=date(2024, 1, 15),
                description="Investigating efficacy of GLP-1 receptor agonists in glycemic control for T2DM patients",
                completion_percentage=45,
                therapeutic_area="Endocrinology",
                indication="Type 2 Diabetes"
            ),
            Study(
                id=f"ST-{uuid.uuid4().hex[:6].upper()}",
                title="Oncology Immunotherapy Trial",
                protocol_id="ONC-2024-001",
                phase="Phase II",
                status="Recruiting",
                sites_count=12,
                subjects_count=85,
                start_date=date(2024, 3, 10),
                description="Safety and efficacy of novel immunotherapy in metastatic melanoma",
                completion_percentage=15,
                therapeutic_area="Oncology",
                indication="Melanoma"
            ),
            Study(
                id=f"ST-{uuid.uuid4().hex[:6].upper()}",
                title="Cardiovascular Outcomes Study",
                protocol_id="CV-2023-PH4",
                phase="Phase IV",
                status="Completed",
                sites_count=50,
                subjects_count=1200,
                start_date=date(2023, 5, 20),
                end_date=date(2024, 12, 1),
                description="Long-term cardiovascular outcomes in patients post-MI",
                completion_percentage=100,
                therapeutic_area="Cardiology",
                indication="Myocardial Infarction"
            )
        ]
        db.add_all(studies)
        db.commit()
        print(f"Added {len(studies)} studies.")
    else:
        print("Studies already exist. Skipping.")

    # 2. Seed Integrations
    from app.models import IntegrationSource
    if db.query(IntegrationSource).count() == 0:
        print("Seeding Integrations...")
        integrations = [
            IntegrationSource(name="Medidata Rave", vendor="Medidata", type="EDC", frequency="Daily", status="Active"),
            IntegrationSource(name="Parexel Informatics", vendor="Parexel", type="CTMS", frequency="Daily", status="Active"),
            IntegrationSource(name="LabCorp Central Labs", vendor="LabCorp", type="Lab", frequency="Weekly", status="Warning")
        ]
        db.add_all(integrations)
        db.commit()
        print(f"Added {len(integrations)} integrations.")
    else:
        print("Integrations already exist. Skipping.")

    # 3. Seed Documents (Link to existing studies)
    from app.models import Document
    studies = db.query(Study).all()
    if db.query(Document).count() == 0 and studies:
        print("Seeding Documents...")
        documents = []
        for study in studies:
            documents.append(Document(
                study_id=study.id,
                name=f"Protocol {study.protocol_id} v1.0.pdf",
                type="pdf",
                source="eTMF Sync",
                file_url="https://example.com/protocol.pdf", # Mock URL
                version="1.0"
            ))
            documents.append(Document(
                study_id=study.id,
                name=f"Statistical Analysis Plan.pdf",
                type="pdf",
                source="Manual upload",
                file_url="https://example.com/sap.pdf",
                version="0.5"
            ))
        db.add_all(documents)
        db.commit()
        print(f"Added {len(documents)} documents.")
    else:
         print("Documents already exist or no studies found. Skipping.")

    # 4. Seed Metrics
    if db.query(Metric).count() == 0:
        print("Seeding Metrics...")
        metrics = [
            Metric(key="total_studies", label="Total Studies", value="12", trend="up"),
            Metric(key="active_sites", label="Active Sites", value="145", trend="up"),
            Metric(key="total_subjects", label="Total Subjects", value="1,234", trend="up"),
            Metric(key="avg_completion", label="Avg. Completion", value="68%", trend="down"),
        ]
        db.add_all(metrics)
        db.commit()
        print(f"Added {len(metrics)} metrics.")
    else:
        print("Metrics already exist. Skipping.")

    print("Database seeding completed!")

if __name__ == "__main__":
    try:
        seed_data()
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()
