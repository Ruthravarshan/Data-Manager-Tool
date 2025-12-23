"""
File classification utility for Data Integration
Scans folders for Excel files and classifies them based on filename prefixes
"""

import os
import re
from pathlib import Path
from typing import List, Tuple, Optional

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
}

VALID_EXTENSIONS = {'.xlsx', '.xls'}
FILE_PATTERN = r'^([a-z]+)_raw_(\d{8}_\d{6})\.(xlsx|xls)$'


class FileClassificationResult:
    """Result of classifying a single file"""
    def __init__(self, filename: str, prefix: Optional[str] = None, section: Optional[str] = None, 
                 timestamp: Optional[str] = None, file_size: int = 0, status: str = 'Imported', 
                 error: Optional[str] = None):
        self.filename = filename
        self.prefix = prefix
        self.section = section
        self.timestamp = timestamp
        self.file_size = file_size
        self.status = status
        self.error = error
        self.is_valid = error is None


def parse_filename(filename: str) -> Tuple[Optional[str], Optional[str], Optional[str], Optional[str]]:
    """
    Parse filename to extract prefix and timestamp
    Returns: (prefix, section, timestamp, error_message)
    
    Expected format: <prefix>_raw_<timestamp>.<ext>
    Example: ae_raw_20251126_074704.xlsx
    """
    match = re.match(FILE_PATTERN, filename.lower())
    
    if not match:
        return None, None, None, f"Invalid filename format: {filename}"
    
    prefix = match.group(1)
    timestamp = match.group(2)
    
    # Check if prefix is known
    if prefix not in PREFIX_TO_SECTION:
        return prefix, None, timestamp, f"Unknown prefix: {prefix}"
    
    section = PREFIX_TO_SECTION[prefix]
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
                error=f"Invalid file type: {ext}. Only .xlsx and .xls files are supported"
            )
        
        # Parse filename
        prefix, section, timestamp, error = parse_filename(filename)
        
        if error:
            status = 'Unclassified'
        else:
            status = 'Imported'
        
        return FileClassificationResult(
            filename=filename,
            prefix=prefix,
            section=section,
            timestamp=timestamp,
            file_size=file_size,
            status=status,
            error=error
        )
    
    except Exception as e:
        return FileClassificationResult(
            filename=os.path.basename(file_path),
            status='Unclassified',
            error=f"Error processing file: {str(e)}"
        )


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
        
        # Scan for Excel files
        excel_files = []
        try:
            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)
                if os.path.isfile(file_path):
                    _, ext = os.path.splitext(filename)
                    if ext.lower() in VALID_EXTENSIONS:
                        excel_files.append(file_path)
        except Exception as e:
            warnings.append(f"Error scanning folder: {str(e)}")
            return results, warnings
        
        if not excel_files:
            warnings.append(f"No Excel files found in folder: {folder_path}")
            return results, warnings
        
        # Classify each file
        seen_filenames = {}
        for file_path in sorted(excel_files):
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
