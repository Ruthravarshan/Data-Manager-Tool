"""
File classification utility for Data Integration
Scans folders for Excel files and classifies them based on filename prefixes
"""

import os
import re
from pathlib import Path
from typing import List, Tuple, Optional
import pandas as pd

# Mapping of file prefixes to section names
PREFIX_TO_SECTION = {
    'dm': 'DM (Demographics)',
    'sv': 'SV (Subject Visits)',
    'ds': 'DS (Disposition)',
    'ae': 'AE (Adverse Events)',
    'sae': 'SAE (Serious Adverse Events)',
    'mh': 'MH (Medical History)',
    'cm': 'CM (Concomitant Medications)',
    'pd': 'PD (Protocol Deviations)',
    'vs': 'VS (Vitals)',
    'lb': 'LB (Laboratory)',
    'ex': 'EX (Exposure)',
    'pk': 'PK (Pharmacokinetics)',
    'tu': 'TU (Tumor Identification)',
    'rs': 'RS (Response)',
}

VALID_EXTENSIONS = {'.xlsx', '.xls', '.csv'}
FILE_PATTERN = r'^([a-z0-9]+)_raw_(\d{8}(?:_\d{6})?)(?:_.*)?\.(xlsx|xls|csv)$'


class FileClassificationResult:
    """Result of classifying a single file"""
    def __init__(self, filename: str, prefix: Optional[str] = None, section: Optional[str] = None, 
                 timestamp: Optional[str] = None, file_size: int = 0, status: str = 'Imported', 
                 error: Optional[str] = None, protocol_id: Optional[str] = None, file_path: Optional[str] = None,
                 record_count: int = 0):
        self.filename = filename
        self.prefix = prefix
        self.section = section
        self.timestamp = timestamp
        self.file_size = file_size
        self.status = status
        self.error = error
        self.is_valid = error is None
        self.protocol_id = protocol_id
        self.file_path = file_path
        self.record_count = record_count


def parse_filename(filename: str) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str]]:
    """
    Parse filename to extract prefix and timestamp
    Returns: (prefix, section, timestamp, error_message)
    
    Expected format: <prefix>_raw_<timestamp>.<ext>
    Example: ae_raw_20251126_074704.xlsx
    """
    match = re.search(FILE_PATTERN, filename.lower())
    
    if not match:
        return None, None, None, f"Invalid filename format: {filename}"
    
    prefix = match.group(1)
    timestamp = match.group(2)
    
    # Clean up prefix: remove 'raw' matches, remove digits
    clean_prefix = prefix
    if clean_prefix.startswith("raw"):
        clean_prefix = clean_prefix[3:]
    clean_prefix = re.sub(r'\d+$', '', clean_prefix)
    
    # Check if prefix is known
    if clean_prefix not in PREFIX_TO_SECTION:
        # Dynamic section creation: Use uppercase prefix
        # This allows new sections like TU, PK, RS to be created automatically
        section_name = clean_prefix.upper()
        return prefix, section_name, timestamp, None
    
    section = PREFIX_TO_SECTION[clean_prefix]
    return prefix, section, timestamp, None


def classify_file(file_path: str) -> FileClassificationResult:
    """
    Classify a single file
    Returns FileClassificationResult object with classification details
    """
    try:
        filename = os.path.basename(file_path)
        
        # Check if file exists and is readable
        if not os.path.exists(file_path):
            return FileClassificationResult(
                filename=filename,
                status='Unclassified',
                error=f"File not found: {file_path}"
            )
        
        # Get file size
        try:
            file_size = os.path.getsize(file_path)
        except:
            file_size = 0
        
        # Check file extension
        _, ext = os.path.splitext(filename)
        if ext.lower() not in VALID_EXTENSIONS:
            return FileClassificationResult(
                filename=filename,
                file_size=file_size,
                status='Unclassified',
                error=f"Invalid file type: {ext}. Only .xlsx, .xls, and .csv files are supported"
            )
        
        # Parse filename
        prefix, section, timestamp, error = parse_filename(filename)
        
        if error:
            status = 'Unclassified'
            record_count = 0
        else:
            status = 'Imported'
            # Count records
            record_count = 0
            try:
                if ext.lower() in ['.xlsx', '.xls']:
                    df = pd.read_excel(file_path, nrows=None) # Read all to count
                    record_count = len(df)
                elif ext.lower() == '.csv':
                    df = pd.read_csv(file_path, nrows=None)
                    record_count = len(df)
            except Exception as e:
                # If cannot read, just log/ignore count, don't fail classification purely on reading data
                # But maybe we should warn?
                print(f"Failed to count records in {filename}: {e}")
                pass
        
        return FileClassificationResult(
            filename=filename,
            prefix=prefix,
            section=section,
            timestamp=timestamp,
            file_size=file_size,
            status=status,
            error=error,
            record_count=record_count
        )
    
    except Exception as e:
        return FileClassificationResult(
            filename=os.path.basename(file_path),
            status='Unclassified',
            error=f"Error processing file: {str(e)}"
        )
def scan_folder_recursive(folder_path: str) -> Tuple[List[FileClassificationResult], List[str]]:
    """
    Recursively scan a folder for Excel/CSV files and classify them.
    Subfolders are treated as protocol IDs.
    Returns: (list of FileClassificationResult, list of warnings)
    """
    results = []
    warnings = []
    
    try:
        # Validate folder exists
        if not os.path.isdir(folder_path):
            warnings.append(f"Folder does not exist: {folder_path}")
            return results, warnings
        
        seen_filenames = {}
        
        # Walk through directory
        for root, dirs, files in os.walk(folder_path):
            # Determine protocol_id from relative path
            rel_path = os.path.relpath(root, folder_path)
            protocol_id = None
            
            if rel_path != '.':
                # Use the first path component as protocol_id (e.g., PRO-001/raw_files -> PRO-001)
                protocol_id = rel_path.split(os.sep)[0]
            
            for filename in files:
                # Check extension
                _, ext = os.path.splitext(filename)
                if ext.lower() in VALID_EXTENSIONS:
                    file_path = os.path.join(root, filename)
                    
                    try:
                        result = classify_file(file_path)
                        result.protocol_id = protocol_id
                        result.file_path = file_path
                        
                        # Check for duplicates (globally in this scan or per protocol? Assuming global for now)
                        # Actually if same filename exists in different protocols, they are different files logically.
                        # But typically filenames should be unique or we check if we've seen it.
                        # For now, let's treat (protocol_id, filename) as unique key if protocol exists, else filename.
                        unique_key = (protocol_id, result.filename) if protocol_id else result.filename
                        
                        if unique_key in seen_filenames:
                            result.status = 'Duplicate'
                            warnings.append(f"Duplicate file found: {result.filename} (Protocol: {protocol_id})")
                        else:
                            seen_filenames[unique_key] = True
                            
                        results.append(result)
                        
                        if result.error:
                            warnings.append(f"{result.filename}: {result.error}")
                            
                    except Exception as e:
                        warnings.append(f"Error classifying {filename}: {str(e)}")

        if not results:
            warnings.append(f"No Excel or CSV files found in folder: {folder_path}")

        return results, warnings
    
    except Exception as e:
        warnings.append(f"Fatal error scanning folder: {str(e)}")
        return results, warnings

def scan_folder(folder_path: str) -> Tuple[List[FileClassificationResult], List[str]]:
    """
    Scan a folder for Excel files and classify them
    Returns: (list of FileClassificationResult, list of warnings)
    """
    results = []
    warnings = []
    
    try:
        # Validate folder exists
        if not os.path.isdir(folder_path):
            warnings.append(f"Folder does not exist: {folder_path}")
            return results, warnings
        
        # Scan for data files (Excel and CSV)
        data_files = []
        try:
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)
                if os.path.isfile(file_path):
                    _, ext = os.path.splitext(filename)
                    if ext.lower() in VALID_EXTENSIONS:
                        data_files.append(file_path)
        except Exception as e:
            warnings.append(f"Error scanning folder: {str(e)}")
            return results, warnings

        if not data_files:
            warnings.append(f"No Excel or CSV files found in folder: {folder_path}")
            return results, warnings

        # Classify each file
        seen_filenames = {}
        for file_path in sorted(data_files):
            result = classify_file(file_path)

            # Check for duplicates
            if result.filename in seen_filenames:
                result.status = 'Duplicate'
                warnings.append(f"Duplicate file found: {result.filename}")
            else:
                seen_filenames[result.filename] = True

            results.append(result)

            # Log warnings for unclassified files
            if result.error:
                warnings.append(f"{result.filename}: {result.error}")

        return results, warnings
    
    except Exception as e:
        warnings.append(f"Fatal error scanning folder: {str(e)}")
        return results, warnings


def get_section_name(prefix: str) -> Optional[str]:
    """Get section name from prefix"""
    return PREFIX_TO_SECTION.get(prefix.lower())
