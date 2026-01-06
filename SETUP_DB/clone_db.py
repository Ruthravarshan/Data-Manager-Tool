"""
clone_db.py

This script duplicates the entire PostgreSQL database (schema + data) from a source to a target database using Python.

Usage:
    python clone_db.py --source postgresql://user:pass@localhost:5432/source_db --target postgresql://user:pass@localhost:5432/target_db

Requirements:
    pip install sqlalchemy psycopg2-binary
"""
import argparse
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.schema import CreateTable
import psycopg2
import psycopg2.extras


def clone_database(source_url, target_url):
    # Connect to source and target
    source_engine = create_engine(source_url)
    target_engine = create_engine(target_url)
    source_conn = source_engine.connect()
    target_conn = target_engine.connect()
    metadata = MetaData()
    metadata.reflect(bind=source_engine)

    # 1. Recreate tables in target
    for table in metadata.sorted_tables:
        target_conn.execute(CreateTable(table, if_not_exists=True))

    # 2. Copy data
    for table in metadata.sorted_tables:
        rows = source_conn.execute(table.select()).fetchall()
        if rows:
            target_conn.execute(table.insert(), [dict(row) for row in rows])
        print(f"Copied {len(rows)} rows for table {table.name}")

    source_conn.close()
    target_conn.close()
    print("Database clone complete.")


def main():
    parser = argparse.ArgumentParser(description="Clone PostgreSQL DB schema and data.")
    parser.add_argument('--source', required=True, help='Source DB URL')
    parser.add_argument('--target', required=True, help='Target DB URL')
    args = parser.parse_args()
    clone_database(args.source, args.target)

if __name__ == "__main__":
    main()
