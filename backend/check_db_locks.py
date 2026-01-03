from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:postgres@localhost:5432/clinical_cosmos")
engine = create_engine(DATABASE_URL)

def check_db():
    try:
        with engine.connect() as conn:
            print("--- Active Connections ---")
            result = conn.execute(text("SELECT count(*) FROM pg_stat_activity"))
            count = result.scalar()
            print(f"Total connections: {count}")
            
            print("\n--- Long Running Queries ---")
            result = conn.execute(text("""
                SELECT pid, now() - query_start as duration, query, state 
                FROM pg_stat_activity 
                WHERE state != 'idle' AND now() - query_start > interval '5 seconds'
            """))
            rows = result.fetchall()
            for row in rows:
                print(f"PID: {row.pid}, Duration: {row.duration}, State: {row.state}, Query: {row.query}")
                
            print("\n--- Locks ---")
            result = conn.execute(text("""
                SELECT blocked_locks.pid     AS blocked_pid,
                       blocked_activity.query  AS blocked_query,
                       blocking_locks.pid    AS blocking_pid,
                       blocking_activity.query AS blocking_query
                FROM  pg_catalog.pg_locks         blocked_locks
                JOIN pg_catalog.pg_stat_activity blocked_activity  ON blocked_locks.pid = blocked_activity.pid
                JOIN pg_catalog.pg_locks         blocking_locks 
                    ON blocking_locks.locktype = blocked_locks.locktype
                    AND blocking_locks.DATABASE IS NOT DISTINCT FROM blocked_locks.DATABASE
                    AND blocking_locks.relation IS NOT DISTINCT FROM blocked_locks.relation
                    AND blocking_locks.page IS NOT DISTINCT FROM blocked_locks.page
                    AND blocking_locks.tuple IS NOT DISTINCT FROM blocked_locks.tuple
                    AND blocking_locks.virtualxid IS NOT DISTINCT FROM blocked_locks.virtualxid
                    AND blocking_locks.transactionid IS NOT DISTINCT FROM blocked_locks.transactionid
                    AND blocking_locks.classid IS NOT DISTINCT FROM blocked_locks.classid
                    AND blocking_locks.objid IS NOT DISTINCT FROM blocked_locks.objid
                    AND blocking_locks.objsubid IS NOT DISTINCT FROM blocked_locks.objsubid
                    AND blocking_locks.pid != blocked_locks.pid
                JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_locks.pid = blocking_activity.pid
                WHERE NOT blocked_locks.GRANTED;
            """))
            rows = result.fetchall()
            if not rows:
                print("No active locks/blocks found.")
            for row in rows:
                print(f"Blocked PID: {row.blocked_pid} is waiting for Blocking PID: {row.blocking_pid}")
    except Exception as e:
        print(f"Error checking DB: {e}")

if __name__ == "__main__":
    check_db()
