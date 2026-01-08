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
    created_at = Column(DateTime, default=datetime.utcnow)
    
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

    # Relationships
    database_credentials = relationship("DatabaseCredential", back_populates="integration", cascade="all, delete-orphan", uselist=False)
    data_files = relationship("DataFile", back_populates="integration", cascade="all, delete-orphan")

class DatabaseCredential(Base):
    __tablename__ = "database_credentials"

    id = Column(Integer, primary_key=True, index=True)
    integration_id = Column(Integer, ForeignKey("integrations.id"), unique=True)
    db_type = Column(String)  # sqlserver, postgresql, mysql, oracle
    host = Column(String)
    port = Column(Integer)
    database_name = Column(String)
    username = Column(String)
    encrypted_password = Column(String)  # Encrypted password
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    integration = relationship("IntegrationSource", back_populates="database_credentials")

class DataFile(Base):
    __tablename__ = "data_files"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    prefix = Column(String, index=True, nullable=True)  # e.g., ae, dm, sv
    section = Column(String, index=True)  # e.g., AE, DM, SV
    status = Column(String, default="Imported")
    file_path = Column(String)
    table_name = Column(String, nullable=True)
    file_size = Column(Integer, nullable=True)  # in bytes
    timestamp = Column(String, nullable=True)  # extracted from filename
    
    protocol_id = Column(String, nullable=True)
    integration_id = Column(Integer, ForeignKey("integrations.id"), nullable=True)
    record_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    integration = relationship("IntegrationSource", back_populates="data_files")

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