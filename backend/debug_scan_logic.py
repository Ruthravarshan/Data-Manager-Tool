import os
import sys

# Mocking FileClassificationResult for standalone run
class FileClassificationResult:
    def __init__(self, filename, protocol_id=None, error=None, **kwargs):
        self.filename = filename
        self.protocol_id = protocol_id
        self.error = error

def scan_folder_recursive_debug(folder_path):
    results = []
    print(f"Scanning: {folder_path}")
    if not os.path.exists(folder_path):
        print("Folder does not exist!")
        return

    for root, dirs, files in os.walk(folder_path):
        rel_path = os.path.relpath(root, folder_path)
        print(f"Walking: {root} (Rel: {rel_path})")
        
        protocol_id = None
        if rel_path != '.':
            protocol_id = rel_path.split(os.sep)[0]
        
        print(f"  -> Extracted Protocol ID: {protocol_id}")

        for filename in files:
            print(f"    - File: {filename}")
            results.append({"filename": filename, "protocol_id": protocol_id})
            
    return results

if __name__ == "__main__":
    # Pointing to the data_source directory
    base_dir = r"c:\Users\2000171692\Desktop\Data-Manager-Tool\data_source"
    scan_folder_recursive_debug(base_dir)
