@echo off
echo Importing Clinical Cosmos Database...
set PGPASSWORD=2664
echo Dropping existing database if exists...
set "PGPATH=C:\Program Files\PostgreSQL\16\bin"
where pg_restore >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set "DROPDB=dropdb"
    set "CREATEDB=createdb"
    set "PG_RESTORE=pg_restore"
) else (
    set "DROPDB=%PGPATH%\dropdb.exe"
    set "CREATEDB=%PGPATH%\createdb.exe"
    set "PG_RESTORE=%PGPATH%\pg_restore.exe"
)

echo Dropping existing database if exists...
"%DROPDB%" -U postgres --if-exists clinical_cosmos
echo Creating new database...
"%CREATEDB%" -U postgres clinical_cosmos
echo Restoring data...
"%PG_RESTORE%" -U postgres -d clinical_cosmos -v clinical_cosmos_backup.dump
echo Import Complete.
pause
