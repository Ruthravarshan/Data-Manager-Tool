from app.database import SessionLocal
from app.models import Study, Document, IntegrationSource, Metric

def check_stats():
    db = SessionLocal()
    try:
        study_count = db.query(Study).count()
        doc_count = db.query(Document).count()
        integration_count = db.query(IntegrationSource).count()
        metric_count = db.query(Metric).count()

        print(f"Studies: {study_count}")
        print(f"Documents: {doc_count}")
        print(f"Integrations: {integration_count}")
        print(f"Metrics: {metric_count}")
        
        if study_count > 0 and doc_count > 0 and integration_count > 0 and metric_count > 0:
            print("Status: ALL TABLES POPULATED")
        else:
            print("Status: PARTIAL DATA")
            
    except Exception as e:
        print(f"Error checking stats: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_stats()
