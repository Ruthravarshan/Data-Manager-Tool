from sqlalchemy import Column, Integer, String, Date, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

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
class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    action_type = Column(String, index=True)  # e.g., "study_created", "query_raised", "task_closed"
    description = Column(String)
    user_name = Column(String, default="User")  # Can be enhanced with actual user tracking
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    related_entity_id = Column(String, nullable=True)  # Study ID, Query ID, Task ID, etc.
    related_entity_type = Column(String, nullable=True)  # 'study', 'query', 'task', 'document'