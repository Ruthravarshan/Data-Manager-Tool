from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import Base, Study, Metric, DataQualityIssue
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

    # 1b. Seed Data Quality Issues (non-hardcoded, randomized)
    import random
    from datetime import datetime, timedelta
    issue_types = ["Missing Data", "Inconsistent Data", "Outlier", "Protocol Deviation"]
    categories = ["DQ", "Reconciliation"]
    statuses = ["Detected", "Reviewing", "Resolved"]
    severities = ["High", "Medium", "Low"]
    domains = ["DM", "LB", "VS", "AE", "EX"]
    def random_date(start, end):
        return start + timedelta(days=random.randint(0, (end - start).days))

    studies = db.query(Study).all()
    if db.query(DataQualityIssue).count() == 0 and studies:
        print("Seeding Data Quality Issues...")
        issues = []
        for study in studies:
            for i in range(random.randint(2, 5)):
                issue_id = f"{random.choice(['DQ', 'DR'])}-{str(uuid.uuid4())[:4].upper()}"
                issue = DataQualityIssue(
                    id=issue_id,
                    study_id=study.id,
                    type=random.choice(issue_types),
                    category=random.choice(categories),
                    title=f"{random.choice(['Missing dates', 'Lab results inconsistent', 'Unexpected value', 'Deviation from protocol'])} in {random.choice(domains)} domain",
                    status=random.choice(statuses),
                    severity=random.choice(severities),
                    domain=random.choice(domains),
                    created=random_date(datetime(2024, 1, 1), datetime(2025, 12, 1)),
                )
                issues.append(issue)
        db.add_all(issues)
        db.commit()
        print(f"Added {len(issues)} data quality issues.")
    else:
        print("Data Quality Issues already exist or no studies found. Skipping.")

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

    # 5. Seed Agents
    from app.models import Agent, ActivityLog
    if db.query(Agent).count() == 0:
        print("Seeding Agents...")
        agents = [
            Agent(name="Data Fetch Agent", role="Data Manager.AI", status="active", type="Data Fetch Agent", description="Listening for data refresh events from all integrated sources", records_processed=0, issues_found=0, icon="Box"),
            Agent(name="DQ Processing", role="Data Manager.AI", status="active", type="DQ Processing", description="Running data quality checks across all SDTM domains", records_processed=45, issues_found=40, icon="Cpu"),
            Agent(name="Reconciliation", role="Data Manager.AI", status="active", type="Reconciliation", description="Cross-checking data consistency between sources", records_processed=0, issues_found=0, icon="Scale"),
            Agent(name="Protocol Check", role="Data Manager.AI", status="active", type="Protocol Check", description="Verifying adherence to protocol procedures", records_processed=16, issues_found=1, icon="ClipboardCheck"),
            Agent(name="Task Manager", role="Data Manager.AI", status="active", type="Task Manager", description="Creating tasks based on detected issues", records_processed=0, issues_found=1, icon="ListTodo"),
        ]
        db.add_all(agents)
        db.commit()
        print(f"Added {len(agents)} Agents.")
        
        # Add some initial logs
        logs = [
            ActivityLog(agent_name="Protocol Check", message="Monitoring protocol adherence for Diabetes Type 2 Study (PRO001)", level="info", timestamp=datetime.now() - timedelta(minutes=45)),
            ActivityLog(agent_name="Protocol Check", message="Monitoring protocol adherence for all trials", level="info", timestamp=datetime.now() - timedelta(minutes=45)),
            ActivityLog(agent_name="Data Fetch Agent", message="Fetched 1 records from integrated sources for all trials", level="info", timestamp=datetime.now() - timedelta(minutes=40)),
            ActivityLog(agent_name="DQ Processing", message="Analyzing data for all trials (1 records), found 1 issues", level="warning", timestamp=datetime.now() - timedelta(minutes=35)),
            ActivityLog(agent_name="Data Fetch Agent", message="Fetched 1 records from integrated sources for Diabetes Type 2 Study (PRO001)", level="info", timestamp=datetime.now() - timedelta(minutes=10)),
            ActivityLog(agent_name="DQ Processing", message="Analyzing data for Diabetes Type 2 Study (PRO001) (100 records), found 40 issues", level="error", timestamp=datetime.now() - timedelta(minutes=5))
        ]
        db.add_all(logs)
        db.commit()
        print(f"Added {len(logs)} Activity Logs.")

    else:
        print("Agents already exist. Skipping.")

    print("Database seeding completed!")

if __name__ == "__main__":
    try:
        seed_data()
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()
