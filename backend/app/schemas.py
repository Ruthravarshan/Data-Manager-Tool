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
        orm_mode = True

class Study(StudyBase):
    id: str
    file_url: Optional[str] = None
    documents: List[Document] = []
    
    class Config:
        orm_mode = True

class MetricBase(BaseModel):
    key: str
    value: str
    label: str
    trend: Optional[str] = None

class Metric(MetricBase):
    class Config:
        orm_mode = True

class IntegrationBase(BaseModel):
    name: str
    vendor: str
    type: str
    frequency: str
    status: str

class Integration(IntegrationBase):
    id: int
    last_sync: datetime
    
    class Config:
        orm_mode = True
