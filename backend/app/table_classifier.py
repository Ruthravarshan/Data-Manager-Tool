"""
Table classification logic for database tables.
Classifies tables based on naming patterns (e.g., Study_ae -> Adverse Events)
"""

from typing import Dict, Optional, Tuple
import re


# Domain mapping for clinical trial data
DOMAIN_MAPPING = {
    'ae': {'name': 'Adverse Events', 'category': 'Trial Data Management'},
    'sae': {'name': 'Serious Adverse Events', 'category': 'Trial Data Management'},
    'dm': {'name': 'Demographics', 'category': 'Trial Data Management'},
    'sv': {'name': 'Subject Visits', 'category': 'Trial Data Management'},
    'ds': {'name': 'Disposition', 'category': 'Trial Data Management'},
    'mh': {'name': 'Medical History', 'category': 'Trial Data Management'},
    'cm': {'name': 'Concomitant Medications', 'category': 'Trial Data Management'},
    'pd': {'name': 'Protocol Deviations', 'category': 'Trial Data Management'},
    'vs': {'name': 'Vital Signs', 'category': 'Trial Data Management'},
    'lb': {'name': 'Laboratory', 'category': 'Trial Data Management'},
    'ex': {'name': 'Exposure', 'category': 'Trial Data Management'},
    'eg': {'name': 'ECG', 'category': 'Trial Data Management'},
    'pe': {'name': 'Physical Examination', 'category': 'Trial Data Management'},
    'ie': {'name': 'Inclusion/Exclusion', 'category': 'Trial Data Management'},
    'su': {'name': 'Substance Use', 'category': 'Trial Data Management'},
    'qs': {'name': 'Questionnaires', 'category': 'Trial Data Management'},
    'sc': {'name': 'Subject Characteristics', 'category': 'Trial Data Management'},
    'da': {'name': 'Drug Accountability', 'category': 'Trial Data Management'},
    'dd': {'name': 'Death Details', 'category': 'Trial Data Management'},
    'dv': {'name': 'Protocol Deviation', 'category': 'Trial Data Management'},
    'fa': {'name': 'Findings About', 'category': 'Trial Data Management'},
    'ho': {'name': 'Healthcare Encounters', 'category': 'Trial Data Management'},
    'is': {'name': 'Immunogenicity Specimen', 'category': 'Trial Data Management'},
    'mb': {'name': 'Microbiology', 'category': 'Trial Data Management'},
    'mi': {'name': 'Microscopic Findings', 'category': 'Trial Data Management'},
    'mo': {'name': 'Morphology', 'category': 'Trial Data Management'},
    'ms': {'name': 'Microbiology Susceptibility', 'category': 'Trial Data Management'},
    'pc': {'name': 'Pharmacokinetics Concentrations', 'category': 'Trial Data Management'},
    'pp': {'name': 'Pharmacokinetics Parameters', 'category': 'Trial Data Management'},
    'pr': {'name': 'Procedures', 'category': 'Trial Data Management'},
    'qs': {'name': 'Questionnaires', 'category': 'Trial Data Management'},
    're': {'name': 'Respiratory', 'category': 'Trial Data Management'},
    'rp': {'name': 'Reproductive System Findings', 'category': 'Trial Data Management'},
    'ss': {'name': 'Subject Status', 'category': 'Trial Data Management'},
    'su': {'name': 'Substance Use', 'category': 'Trial Data Management'},
    'ta': {'name': 'Trial Arms', 'category': 'Trial Data Management'},
    'td': {'name': 'Trial Disease Milestones', 'category': 'Trial Data Management'},
    'te': {'name': 'Trial Elements', 'category': 'Trial Data Management'},
    'ti': {'name': 'Trial Inclusion/Exclusion', 'category': 'Trial Data Management'},
    'tm': {'name': 'Tumor Milestones', 'category': 'Trial Data Management'},
    'tr': {'name': 'Tumor Results', 'category': 'Trial Data Management'},
    'ts': {'name': 'Trial Summary', 'category': 'Trial Data Management'},
    'tu': {'name': 'Tumor Identification', 'category': 'Trial Data Management'},
    'tv': {'name': 'Trial Visits', 'category': 'Trial Data Management'},
}


def classify_table(table_name: str) -> Tuple[Optional[str], Optional[str], str, Optional[str]]:
    """
    Classify a table based on its name.
    
    Args:
        table_name: Name of the table (e.g., "Study_ae", "Trial_dm", "Protocol_sv")
    
    Returns:
        Tuple of (prefix, domain_name, category, description)
        - prefix: The extracted prefix (e.g., "ae", "dm")
        - domain_name: The full domain name (e.g., "Adverse Events")
        - category: The category (e.g., "Trial Data Management")
        - description: Optional description
    """
    # Convert to lowercase for matching
    table_lower = table_name.lower()
    
    # Try to extract prefix after underscore
    # Patterns: Study_ae, Trial_dm, Protocol_sv, etc.
    if '_' in table_lower:
        parts = table_lower.split('_')
        # Take the last part as the potential domain code
        potential_prefix = parts[-1]
        
        # Check if it matches a known domain
        if potential_prefix in DOMAIN_MAPPING:
            domain_info = DOMAIN_MAPPING[potential_prefix]
            return (
                potential_prefix,
                domain_info['name'],
                domain_info['category'],
                f"{domain_info['name']} data from clinical trial"
            )
    
    # Check if the table name itself is a domain code
    if table_lower in DOMAIN_MAPPING:
        domain_info = DOMAIN_MAPPING[table_lower]
        return (
            table_lower,
            domain_info['name'],
            domain_info['category'],
            f"{domain_info['name']} data from clinical trial"
        )
        
    # Regex Matching for complex patterns (e.g., study_rawlb1, ae1, rawdm)
    # Pattern looks for:
    # 1. Preceded by start of string (^), underscore (_), or 'raw'
    # 2. One of the domain keys
    # 3. Optional digits
    # 4. End of string ($) or underscore (_)
    
    # Construct regex pattern from keys
    domain_keys = sorted(DOMAIN_MAPPING.keys(), key=len, reverse=True)
    pattern = r'(?:^|_|raw)(' + '|'.join(domain_keys) + r')\d*(?:$|_)'
    
    match = re.search(pattern, table_lower)
    if match:
        domain_code = match.group(1)
        if domain_code in DOMAIN_MAPPING:
            domain_info = DOMAIN_MAPPING[domain_code]
            return (
                domain_code,
                domain_info['name'],
                domain_info['category'],
                f"{domain_info['name']} data from clinical trial"
            )
    
    # Unclassified
    return (None, None, "Unclassified", None)


def classify_tables(table_names: list) -> dict:
    """
    Classify multiple tables and return structured data.
    
    Args:
        table_names: List of table names
    
    Returns:
        Dictionary with classified tables and statistics
    """
    classified_tables = []
    classified_count = 0
    unclassified_count = 0
    
    for table_name in table_names:
        prefix, domain, category, description = classify_table(table_name)
        
        classified_tables.append({
            'table_name': table_name,
            'prefix': prefix,
            'domain': domain,
            'category': category,
            'description': description
        })
        
        if category != "Unclassified":
            classified_count += 1
        else:
            unclassified_count += 1
    
    return {
        'tables': classified_tables,
        'total_count': len(table_names),
        'classified_count': classified_count,
        'unclassified_count': unclassified_count
    }
