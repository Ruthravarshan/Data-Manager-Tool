"""Test script to debug scan_folder function"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.file_classifier import scan_folder

# Get data_source path using same logic as backend
backend_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(backend_dir)
data_source_path = os.path.join(root_dir, "data_source")

print(f"Backend dir: {backend_dir}")
print(f"Root dir: {root_dir}")
print(f"Data source path: {data_source_path}")
print(f"Path exists: {os.path.exists(data_source_path)}")

if os.path.exists(data_source_path):
    print(f"\nFiles in directory:")
    for f in os.listdir(data_source_path):
        print(f"  - {f}")
    
    print(f"\nScanning folder...")
    results, warnings = scan_folder(data_source_path)
    print(f"Found {len(results)} files")
    print(f"Warnings: {warnings}")
    
    if results:
        print(f"\nFirst result:")
        r = results[0]
        print(f"  Filename: {r.filename}")
        print(f"  Prefix: {r.prefix}")
        print(f"  Section: {r.section}")
        print(f"  Status: {r.status}")
        print(f"  Error: {r.error}")
