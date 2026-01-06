
from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Union, Dict, Any
from datetime import datetime, date

# ==========================================
# FEATURE 1: STUDY MANAGEMENT SCHEMA
# ==========================================

class DocumentBase(BaseModel):
    """
    Schema for Document within a Study.
    """
    name: str = Field(..., description="Name of the document")
    type: str = Field(..., description="Type of document (pdf, doc, etc.)")
    source: str = Field(..., description="Source of the document (Manual upload, eTMF Sync)")
    version: Optional[str] = Field("1.0", description="Version of the document")

class Document(DocumentBase):
    id: int
    study_id: str
    file_url: str
    upload_date: datetime
    
    model_config = ConfigDict(from_attributes=True)

class StudyBase(BaseModel):
    """
    core schema for Study Management.
    """
    title: str = Field(..., description="Title of the study")
    protocol_id: str = Field(..., description="Unique Protocol ID")
    phase: str = Field(..., description="Phase of the trial (Phase I, II, III)")
    status: str = Field(..., description="Current status (Planning, Active, Completed)")
    sites_count: Optional[int] = Field(0, description="Number of sites")
    subjects_count: Optional[int] = Field(0, description="Number of subjects")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    description: Optional[str] = None
    therapeutic_area: Optional[str] = None
    indication: Optional[str] = None
    completion_percentage: Optional[int] = 0

class Study(StudyBase):
    id: str
    file_url: Optional[str] = None
    documents: List[Document] = []
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# FEATURE 2: DATA INTEGRATION SCHEMA
# ==========================================

class IntegrationBase(BaseModel):
    """
    Schema for Data Integration sources and configurations.
    """
    name: str = Field(..., description="Name of the integration")
    vendor: str = Field(..., description="Vendor providing the data (e.g., Medidata)")
    type: str = Field(..., description="Type of integration (EDC, ePRO, Lab)")
    frequency: str = Field(..., description="Sync frequency (Daily, Weekly, Real-time)")
    status: str = Field(..., description="Connection status (Active, Error, Pending)")
    protocol_id: Optional[str] = Field(None, description="Linked Protocol ID")
    folder_path: Optional[str] = Field(None, description="Path to local folder for file scanning")

class Integration(IntegrationBase):
    id: int
    last_sync: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# FEATURE 3: TRIAL MANAGEMENT SCHEMA
# ==========================================

class DataFileBase(BaseModel):
    """
    Schema for Trial Data Management (File tracking).
    """
    filename: str = Field(..., description="Name of the file")
    prefix: Optional[str] = Field(None, description="Detected prefix (e.g., 'ae', 'dm')")
    section: str = Field(..., description="Clinical section (Adverse Events, Demographics)")
    status: str = Field(..., description="File processing status")
    file_path: Optional[str] = None
    file_size: Optional[Union[str, int]] = None
    timestamp: Optional[str] = Field(None, description="Timestamp extracted from filename")
    protocol_id: Optional[str] = None
    integration_id: Optional[int] = None
    record_count: Optional[int] = 0

class DataFile(DataFileBase):
    id: int
    created_at: datetime
    last_updated: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# FEATURE 4: DATA MANAGER.AI SCHEMA
# ==========================================

class FileClassificationResult(BaseModel):
    """
    Schema for the result of the AI/Heuristic classification of a file.
    Represents usage of 'Data Manager.ai' intelligence.
    """
    filename: str
    prefix: Optional[str] = None
    section: Optional[str] = None
    timestamp: Optional[str] = None
    file_size: int = 0
    status: str = Field(..., description="Classification status (Imported, Unclassified, Duplicate)")
    error: Optional[str] = None
    is_valid: bool = True
    protocol_id: Optional[str] = None
    record_count: int = 0
    confidence_score: Optional[float] = Field(None, description="AI Confidence score if applicable")

class SectionMetadata(BaseModel):
    """
    Schema for aggregated metadata about a data section (AI generated/aggregated).
    """
    domain: str
    dataset_name: str
    vendor: str
    data_source: str
    last_updated: Optional[datetime] = None
    description: Optional[str] = None
    record_count: int
    variable_count: int
    sample_data: List[Dict[str, Any]] = []

class ScanResult(BaseModel):
    """
    Schema for the result of a Folder Scan operation.
    """
    total_files: int
    imported_files: int
    unclassified_files: int
    duplicate_files: int
    files: List[DataFile] = []
    warnings: List[str] = []
