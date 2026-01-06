@echo off
echo Exporting Clinical Cosmos Database...
set PGPASSWORD=2664
set "PGPATH=C:\Program Files\PostgreSQL\16\bin"
where pg_dump >nul 2>nul
if %ERRORLEVEL% EQU 0 ( set "PG_DUMP=pg_dump" ) else ( set "PG_DUMP=%PGPATH%\pg_dump.exe" )

"%PG_DUMP%" -U postgres -d clinical_cosmos -F c -b -v -f clinical_cosmos_backup.dump
echo Export Complete: clinical_cosmos_backup.dump
pause
