<<<<<<< HEAD
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Union
=======
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
>>>>>>> origin/Priyesh
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
<<<<<<< HEAD
    
    model_config = ConfigDict(from_attributes=True)
=======

    class Config:
        from_attributes = True
>>>>>>> origin/Priyesh

class Study(StudyBase):
    id: str
    file_url: Optional[str] = None
    documents: List[Document] = []
    
<<<<<<< HEAD
    model_config = ConfigDict(from_attributes=True)
=======
    class Config:
        from_attributes = True
>>>>>>> origin/Priyesh

class MetricBase(BaseModel):
    key: str
    value: str
    label: str
    trend: Optional[str] = None

class Metric(MetricBase):
<<<<<<< HEAD
    model_config = ConfigDict(from_attributes=True)
=======
    class Config:
        from_attributes = True
>>>>>>> origin/Priyesh

class IntegrationBase(BaseModel):
    name: str
    vendor: str
    type: str
    frequency: str
    status: str
    protocol_id: Optional[str] = None
    folder_path: Optional[str] = None

class IntegrationCreate(IntegrationBase):
<<<<<<< HEAD
    pass
=======
    database_credentials: Optional["DatabaseCredentialCreate"] = None
>>>>>>> origin/Priyesh

class IntegrationUpdate(BaseModel):
    name: Optional[str] = None
    vendor: Optional[str] = None
    type: Optional[str] = None
    frequency: Optional[str] = None
    status: Optional[str] = None
    protocol_id: Optional[str] = None
<<<<<<< HEAD
=======
    last_sync: Optional[datetime] = None
>>>>>>> origin/Priyesh
    folder_path: Optional[str] = None

class Integration(IntegrationBase):
    id: int
    last_sync: datetime
    folder_path: Optional[str] = None
    
<<<<<<< HEAD
    model_config = ConfigDict(from_attributes=True)

class ActivityBase(BaseModel):
    action_type: str
    description: str
    user_name: Optional[str] = "User"
    related_entity_id: Optional[str] = None
    related_entity_type: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Data File Schemas
=======
    class Config:
        from_attributes = True

>>>>>>> origin/Priyesh
class DataFileBase(BaseModel):
    filename: str
    prefix: Optional[str] = None
    section: Optional[str] = None
<<<<<<< HEAD
    status: str
    status: str
    file_path: Optional[str] = None
    table_name: Optional[str] = None
    file_size: Optional[Union[str, int]] = None
    timestamp: Optional[str] = None
    protocol_id: Optional[str] = None
    integration_id: Optional[int] = None
    record_count: Optional[int] = 0

class DataFile(DataFileBase):
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
=======
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
    integration_type: Optional[str] = None # 'Database', 'API', 'Local', etc.

    class Config:
        from_attributes = True
>>>>>>> origin/Priyesh

class ScanFolderRequest(BaseModel):
    folder_path: str

class ScanFolderResponse(BaseModel):
    total_files: int
    imported_files: int
    unclassified_files: int
    duplicate_files: int
<<<<<<< HEAD
    files: List[DataFile] = []
    warnings: List[str] = []
=======
    files: List[DataFile]
    warnings: List[str]
>>>>>>> origin/Priyesh

class SectionMetadataResponse(BaseModel):
    domain: str
    dataset_name: str
    vendor: str
    data_source: str
<<<<<<< HEAD
    last_updated: Optional[datetime] = None
    description: Optional[str] = None
    record_count: int
    variable_count: int
    sample_data: List[dict] = []
=======
    last_updated: Optional[datetime]
    description: str
    record_count: int
    variable_count: int
    sample_data: List[Dict[str, Any]]

# Database Connection Schemas
class DatabaseCredentialCreate(BaseModel):
    integration_id: int
    db_type: str  # sqlserver, postgresql, mysql, oracle
    host: str
    port: int
    database_name: str
    username: str
    password: str  # Will be encrypted before storage

class DatabaseCredentialUpdate(BaseModel):
    db_type: Optional[str] = None
    host: Optional[str] = None
    port: Optional[int] = None
    database_name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None

class DatabaseCredential(BaseModel):
    id: int
    integration_id: int
    db_type: str
    host: str
    port: int
    database_name: str
    username: str
    created_at: datetime
    last_updated: datetime
    
    class Config:
        from_attributes = True

class DatabaseTestConnectionRequest(BaseModel):
    db_type: str
    host: str
    port: int
    database_name: str
    username: str
    password: str

class DatabaseTestConnectionResponse(BaseModel):
    success: bool
    message: str
    error: Optional[str] = None

class ClassifiedTable(BaseModel):
    table_name: str
    prefix: Optional[str] = None
    domain: Optional[str] = None
    category: str  # e.g., "Trial Data Management", "Unclassified"
    description: Optional[str] = None

class DatabaseTablesResponse(BaseModel):
    success: bool
    tables: List[ClassifiedTable]
    total_count: int
    classified_count: int
    unclassified_count: int
>>>>>>> origin/Priyesh
