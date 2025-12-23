from sqlalchemy import Column, Integer, String, Date, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

from sqlalchemy.sql import func

class Study(Base):
    __tablename__ = "studies"

    id = Column(String, primary_key=True, index=True) # E.g., ST-001
    title = Column(String, index=True)
    protocol_id = Column(String)
    phase = Column(String)
    status = Column(String)
    sites_count = Column(Integer)
    subjects_count = Column(Integer)
    start_date = Column(Date)
    end_date = Column(Date, nullable=True)
    description = Column(String)
    therapeutic_area = Column(String, nullable=True)
    indication = Column(String, nullable=True)
    completion_percentage = Column(Integer)
    file_url = Column(String, nullable=True) # URL to PDF in Blob Storage
    
    # Relationship
    documents = relationship("Document", back_populates="study", cascade="all, delete-orphan")


# Data Quality and Reconciliation Issues for DataManagerAI
class DataQualityIssue(Base):
    __tablename__ = "data_quality_issues"

    id = Column(String, primary_key=True, index=True)  # e.g., DQ-001, DR-001
    study_id = Column(String, ForeignKey("studies.id"), nullable=False)
    type = Column(String)  # e.g., 'Missing Data', 'Inconsistent Data'
    category = Column(String)  # e.g., 'DQ', 'Reconciliation'
    title = Column(String)
    status = Column(String)  # e.g., 'Detected', 'Reviewing', 'Resolved'
    severity = Column(String)  # e.g., 'High', 'Medium', 'Low'
    domain = Column(String)  # e.g., 'DM', 'LB', 'VS'
    created = Column(DateTime, default=func.now())
    updated = Column(DateTime, default=func.now(), onupdate=func.now())

    study = relationship("Study")

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    study_id = Column(String, ForeignKey("studies.id"))
    name = Column(String)
    type = Column(String) # pdf, doc, etc
    source = Column(String) # 'Manual upload', 'eTMF Sync'
    file_url = Column(String)
    upload_date = Column(DateTime, default=datetime.utcnow)
    version = Column(String, default="1.0")

    study = relationship("Study", back_populates="documents")

class IntegrationSource(Base):
    __tablename__ = "integrations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    vendor = Column(String)
    type = Column(String)
    frequency = Column(String)
    last_sync = Column(DateTime, default=datetime.utcnow)
    status = Column(String)

class Metric(Base):
    __tablename__ = "metrics"

    key = Column(String, primary_key=True, index=True)
    value = Column(String)
    label = Column(String)
    trend = Column(String, nullable=True)

class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    status = Column(String) # active, inactive
    type = Column(String) 
    description = Column(String)
    last_active = Column(DateTime, default=datetime.utcnow)
    records_processed = Column(Integer, default=0)
    issues_found = Column(Integer, default=0)
    icon = Column(String) # e.g., 'Cpu', 'Database', etc.

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    message = Column(String)
    level = Column(String) # info, warning, error
