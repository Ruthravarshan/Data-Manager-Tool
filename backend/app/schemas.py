from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class StudyBase(BaseModel):
    title: str
    protocol_id: str
    phase: str
    status: str
    sites_count: Optional[int] = 0
    subjects_count: Optional[int] = 0
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    therapeutic_area: Optional[str] = None
    indication: Optional[str] = None
    completion_percentage: Optional[int] = 0

class StudyCreate(StudyBase):
    pass

class DocumentBase(BaseModel):
    name: str
    type: str
    source: str
    version: Optional[str] = "1.0"

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    study_id: str
    file_url: str
    upload_date: datetime

    class Config:
        from_attributes = True

class Study(StudyBase):
    id: str
    file_url: Optional[str] = None
    documents: List[Document] = []
    
    class Config:
        from_attributes = True

class MetricBase(BaseModel):
    key: str
    value: str
    label: str
    trend: Optional[str] = None

class Metric(MetricBase):
    class Config:
        from_attributes = True

class IntegrationBase(BaseModel):
    name: str
    vendor: str
    type: str
    frequency: str
    status: str
    protocol_id: Optional[str] = None
    folder_path: Optional[str] = None

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationUpdate(BaseModel):
    name: Optional[str] = None
    vendor: Optional[str] = None
    type: Optional[str] = None
    frequency: Optional[str] = None
    status: Optional[str] = None
    protocol_id: Optional[str] = None
    last_sync: Optional[datetime] = None
    folder_path: Optional[str] = None

class Integration(IntegrationBase):
    id: int
    last_sync: datetime
    folder_path: Optional[str] = None
    
    class Config:
        from_attributes = True

class DataFileBase(BaseModel):
    filename: str
    prefix: Optional[str] = None
    section: Optional[str] = None
    file_path: str
    file_size: int
    timestamp: Optional[str] = None
    status: str = "Imported"

class DataFileCreate(DataFileBase):
    pass

class DataFile(DataFileBase):
    id: int
    integration_id: Optional[int] = None
    created_at: datetime
    last_updated: datetime

    class Config:
        from_attributes = True

class ScanFolderRequest(BaseModel):
    folder_path: str

class ScanFolderResponse(BaseModel):
    total_files: int
    imported_files: int
    unclassified_files: int
    duplicate_files: int
    files: List[DataFile]
    warnings: List[str]
