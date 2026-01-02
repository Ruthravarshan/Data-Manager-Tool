from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import DatabaseCredential, IntegrationSource, DataFile
from app.schemas import (
    DatabaseCredentialCreate,
    DatabaseCredential as DatabaseCredentialSchema,
    DatabaseTestConnectionRequest,
    DatabaseTestConnectionResponse,
    DatabaseTablesResponse,
    ClassifiedTable
)
from app.table_classifier import classify_tables
import logging
from cryptography.fernet import Fernet
import os
import base64

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/database-connections", tags=["database-connections"])

# Encryption key - In production, this should be in environment variables
ENCRYPTION_KEY = os.getenv("DB_ENCRYPTION_KEY", Fernet.generate_key())
if isinstance(ENCRYPTION_KEY, str):
    ENCRYPTION_KEY = ENCRYPTION_KEY.encode()
cipher_suite = Fernet(ENCRYPTION_KEY)


def encrypt_password(password: str) -> str:
    """Encrypt a password"""
    return cipher_suite.encrypt(password.encode()).decode()


def decrypt_password(encrypted_password: str) -> str:
    """Decrypt a password"""
    return cipher_suite.decrypt(encrypted_password.encode()).decode()


def get_db_connection(db_type: str, host: str, port: int, database_name: str, username: str, password: str):
    """
    Create a database connection based on the database type.
    Returns a connection object.
    """
    try:
        if db_type.lower() == 'sqlserver':
            import pyodbc
            conn_str = f"DRIVER={{ODBC Driver 17 for SQL Server}};SERVER={host},{port};DATABASE={database_name};UID={username};PWD={password}"
            return pyodbc.connect(conn_str, timeout=10)
        
        elif db_type.lower() == 'postgresql':
            import psycopg2
            return psycopg2.connect(
                host=host,
                port=port,
                database=database_name,
                user=username,
                password=password,
                connect_timeout=10
            )
        
        elif db_type.lower() == 'mysql':
            import pymysql
            return pymysql.connect(
                host=host,
                port=port,
                database=database_name,
                user=username,
                password=password,
                connect_timeout=10
            )
        
        elif db_type.lower() == 'oracle':
            import cx_Oracle
            dsn = f"{host}:{port}/{database_name}"
            return cx_Oracle.connect(username, password, dsn)
        
        else:
            raise ValueError(f"Unsupported database type: {db_type}")
    
    except ImportError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Database driver not installed for {db_type}. Error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to connect to database: {str(e)}"
        )


@router.post("/test", response_model=DatabaseTestConnectionResponse)
def test_database_connection(request: DatabaseTestConnectionRequest):
    """Test database connection with provided credentials"""
    try:
        logger.info(f"Testing connection to {request.db_type} database at {request.host}:{request.port}")
        
        conn = get_db_connection(
            request.db_type,
            request.host,
            request.port,
            request.database_name,
            request.username,
            request.password
        )
        
        # Test the connection by executing a simple query
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        
        logger.info("Database connection test successful")
        return DatabaseTestConnectionResponse(
            success=True,
            message=f"Successfully connected to {request.db_type} database"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Database connection test failed: {str(e)}")
        return DatabaseTestConnectionResponse(
            success=False,
            message="Failed to connect to database",
            error=str(e)
        )


@router.post("/fetch-tables", response_model=DatabaseTablesResponse)
def fetch_database_tables(request: DatabaseTestConnectionRequest):
    """Fetch tables from database and classify them"""
    try:
        logger.info(f"Fetching tables from {request.db_type} database at {request.host}:{request.port}")
        
        conn = get_db_connection(
            request.db_type,
            request.host,
            request.port,
            request.database_name,
            request.username,
            request.password
        )
        
        cursor = conn.cursor()
        
        # Get table names based on database type
        if request.db_type.lower() == 'sqlserver':
            cursor.execute("""
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_TYPE = 'BASE TABLE' 
                AND TABLE_SCHEMA = 'dbo'
                ORDER BY TABLE_NAME
            """)
        
        elif request.db_type.lower() == 'postgresql':
            cursor.execute("""
                SELECT tablename 
                FROM pg_tables 
                WHERE schemaname = 'public'
                ORDER BY tablename
            """)
        
        elif request.db_type.lower() == 'mysql':
            cursor.execute(f"""
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = '{request.database_name}'
                AND TABLE_TYPE = 'BASE TABLE'
                ORDER BY TABLE_NAME
            """)
        
        elif request.db_type.lower() == 'oracle':
            cursor.execute("""
                SELECT table_name 
                FROM user_tables
                ORDER BY table_name
            """)
        
        # Fetch all table names
        table_names = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        
        logger.info(f"Found {len(table_names)} tables")
        
        # Classify tables
        classification_result = classify_tables(table_names)
        
        # Convert to response format
        classified_tables = [
            ClassifiedTable(**table_data)
            for table_data in classification_result['tables']
        ]
        
        return DatabaseTablesResponse(
            success=True,
            tables=classified_tables,
            total_count=classification_result['total_count'],
            classified_count=classification_result['classified_count'],
            unclassified_count=classification_result['unclassified_count']
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch tables: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch tables: {str(e)}"
        )


@router.post("/save", response_model=DatabaseCredentialSchema)
def save_database_credentials(
    credentials: DatabaseCredentialCreate,
    db: Session = Depends(get_db)
):
    """Save database credentials (encrypted)"""
    try:
        # Check if integration exists
        integration = db.query(IntegrationSource).filter(
            IntegrationSource.id == credentials.integration_id
        ).first()
        
        if not integration:
            raise HTTPException(status_code=404, detail="Integration not found")
        
        # Check if credentials already exist for this integration
        existing = db.query(DatabaseCredential).filter(
            DatabaseCredential.integration_id == credentials.integration_id
        ).first()
        
        # Encrypt password
        encrypted_pwd = encrypt_password(credentials.password)
        
        if existing:
            # Update existing credentials
            existing.db_type = credentials.db_type
            existing.host = credentials.host
            existing.port = credentials.port
            existing.database_name = credentials.database_name
            existing.username = credentials.username
            existing.encrypted_password = encrypted_pwd
            db.commit()
            db.refresh(existing)
            logger.info(f"Updated database credentials for integration {credentials.integration_id}")
            return existing
        else:
            # Create new credentials
            db_credential = DatabaseCredential(
                integration_id=credentials.integration_id,
                db_type=credentials.db_type,
                host=credentials.host,
                port=credentials.port,
                database_name=credentials.database_name,
                username=credentials.username,
                encrypted_password=encrypted_pwd
            )
            db.add(db_credential)
            db.commit()
            db.refresh(db_credential)
            logger.info(f"Saved database credentials for integration {credentials.integration_id}")
            return db_credential
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to save credentials: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to save credentials: {str(e)}"
        )


@router.get("/{integration_id}", response_model=DatabaseCredentialSchema)
def get_database_credentials(integration_id: int, db: Session = Depends(get_db)):
    """Get database credentials for an integration (password not included)"""
    credential = db.query(DatabaseCredential).filter(
        DatabaseCredential.integration_id == integration_id
    ).first()
    
    if not credential:
        raise HTTPException(status_code=404, detail="Database credentials not found")
    
    return credential


@router.delete("/{integration_id}")
def delete_database_credentials(integration_id: int, db: Session = Depends(get_db)):
    """Delete database credentials"""
    credential = db.query(DatabaseCredential).filter(
        DatabaseCredential.integration_id == integration_id
    ).first()
    
    if not credential:
        raise HTTPException(status_code=404, detail="Database credentials not found")
    
    db.delete(credential)
    db.commit()
    
    return {"message": "Database credentials deleted successfully"}


@router.post("/import-data/{integration_id}")
def import_database_tables(
    integration_id: int,
    table_names: List[str],
    db: Session = Depends(get_db)
):
    """
    Import data from specified database tables into the system.
    Creates CSV files and DataFile records for each table.
    """
    try:
        # Get integration
        integration = db.query(IntegrationSource).filter(
            IntegrationSource.id == integration_id
        ).first()
        
        if not integration:
            raise HTTPException(status_code=404, detail="Integration not found")
        
        # Get database credentials
        credentials = db.query(DatabaseCredential).filter(
            DatabaseCredential.integration_id == integration_id
        ).first()
        
        if not credentials:
            raise HTTPException(status_code=404, detail="Database credentials not found")
        
        # Decrypt password
        password = decrypt_password(credentials.encrypted_password)
        
        # Connect to database
        conn = get_db_connection(
            credentials.db_type,
            credentials.host,
            credentials.port,
            credentials.database_name,
            credentials.username,
            password
        )
        
        # Import pandas for data handling
        import pandas as pd
        import os
        from datetime import datetime
        from app.table_classifier import classify_table
        
        # Create data_source directory if it doesn't exist
        # Path: project_root/data_source
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        data_source_dir = os.path.join(os.path.dirname(backend_dir), "data_source")
        os.makedirs(data_source_dir, exist_ok=True)
        
        imported_files = []
        errors = []
        
        for table_name in table_names:
            try:
                # Read table data
                query = f"SELECT * FROM {table_name}"
                df = pd.read_sql(query, conn)
                
                # Classify the table
                prefix, domain, category, description = classify_table(table_name)
                
                # Generate filename with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{prefix or table_name}_{timestamp}.csv"
                file_path = os.path.join(data_source_dir, filename)
                
                # Save as CSV
                df.to_csv(file_path, index=False)
                
                # Get file size
                file_size = os.path.getsize(file_path)
                
                # Determine section name (e.g., "AE (Adverse Events)")
                section = f"{prefix.upper()} ({domain})" if prefix and domain else table_name
                
                # Create DataFile record
                data_file = db.query(DataFile).filter(
                    DataFile.filename == filename,
                    DataFile.integration_id == integration_id
                ).first()
                
                if data_file:
                    # Update existing
                    data_file.file_size = file_size
                    data_file.timestamp = timestamp
                    data_file.last_updated = datetime.utcnow()
                else:
                    # Create new
                    data_file = DataFile(
                        filename=filename,
                        prefix=prefix or table_name[:2],
                        section=section,
                        file_path=file_path,
                        file_size=file_size,
                        timestamp=timestamp,
                        status="Imported",
                        integration_id=integration_id
                    )
                    db.add(data_file)
                
                db.commit()
                db.refresh(data_file)
                
                imported_files.append({
                    "table_name": table_name,
                    "filename": filename,
                    "section": section,
                    "records": len(df),
                    "file_id": data_file.id
                })
                
                logger.info(f"Imported {len(df)} records from {table_name} to {filename}")
                
            except Exception as e:
                logger.error(f"Error importing table {table_name}: {str(e)}")
                errors.append({
                    "table_name": table_name,
                    "error": str(e)
                })
        
        conn.close()
        
        # Update integration's last_sync
        integration.last_sync = datetime.utcnow()
        db.commit()
        
        return {
            "success": True,
            "imported_count": len(imported_files),
            "error_count": len(errors),
            "imported_files": imported_files,
            "errors": errors
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error importing database tables: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to import database tables: {str(e)}"
        )
