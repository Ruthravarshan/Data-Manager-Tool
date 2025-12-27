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
    protocol_id = Column(String, nullable=True) # E.g., PRO001
    folder_path = Column(String, nullable=True)  # Path to data source folder

class DataFile(Base):
    __tablename__ = "data_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    prefix = Column(String, index=True)  # e.g., ae, dm, sv
    section = Column(String, index=True)  # e.g., AE, DM, SV
    file_path = Column(String)
    file_size = Column(Integer)  # in bytes
    timestamp = Column(String, nullable=True)  # extracted from filename
    status = Column(String, default="Imported")  # Imported, Duplicate, Unclassified
    integration_id = Column(Integer, ForeignKey("integrations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Metric(Base):
    __tablename__ = "metrics"

    key = Column(String, primary_key=True, index=True)
    value = Column(String)
    label = Column(String)
    trend = Column(String, nullable=True)
