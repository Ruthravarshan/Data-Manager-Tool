
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Classify clinical trial CSV files from a source folder (set in code),
copy to section-specific folders, and generate an HTML dashboard with previews
and download links. Unreadable/corrupt files are skipped with logging.

Filename expectations (tolerant):
  <prefix>_raw_<yyyymmdd>[ _<hhmmss> ][ _anythingElse ].csv
Examples:
  ae_raw_20251126_074704.csv
  dm_raw_20251201.csv
  vs_raw_20250101_120000_siteA.csv

Configure SOURCE_DIR below, then run:
    python classify_trials_csv.py

Dependencies:
    pip install pandas
"""

import os
import re
import shutil
from datetime import datetime
from typing import Dict, List, Optional, Tuple

import pandas as pd

# =========================
# Configuration (edit here)
# =========================

# Path to your data_source folder containing CSV files
SOURCE_DIR = r"C:\Users\2000171848\Documents\Data-Manager-Tool\data_source"  # <-- set this

# Base output folder; a timestamped subfolder will be created automatically
OUTPUT_BASE_DIR = r"C:\Users\2000171848\Documents\Data-Manager-Tool\trial_data_output"

# Number of top rows to preview from the CSV
PREVIEW_ROWS = 10

# Scan subfolders too?
RECURSIVE_SCAN = True

# Optional: Try multiple encodings for CSVs (fallbacks)
CSV_ENCODINGS = ["utf-8", "utf-8-sig", "latin1"]

# Optional: Separator candidates (if you have semicolon-delimited files, etc.)
CSV_SEPARATORS = [",", ";", "\t"]

# =========================
# Constants & Mappings
# =========================

PREFIX_TO_SECTION = {
    "dm": "DM (Demographics)",
    "sv": "SV (Subject Visits)",
    "ds": "DS (Disposition)",
    "ae": "AE (Adverse Events)",
    "sae": "SAE (Serious Adverse Events)",
    "mh": "MH (Medical History)",
    "cm": "CM (Concomitant Medications)",
    "pd": "PD (Protocol Deviations)",
    "vs": "VS (Vitals)",
    "lb": "LB (Laboratory)",
    "ex": "EX (Exposure)",
    "pk": "PK (Pharmacokinetics)",
    "tu": "TU (Tumor Identification)",
    "rs": "RS (Response)",
}

UNCLASSIFIED_SECTION = "Unclassified"

# More tolerant filename pattern (CSV):
# <prefix>_raw_<date>[ _<time> ][ _anythingElse ].csv
# - prefix: letters/digits (to support rawlb1, etc.)
# - raw: case-insensitive
# - date: yyyymmdd
# - time: hhmmss (optional)
FILENAME_PATTERN = re.compile(
    r"""^(?P<prefix>[A-Za-z0-9]+)       # prefix (letters + digits allowed)
         _(?P<raw>raw)                  # literal 'raw' (case-insensitive)
         _(?P<date>\d{8})               # date yyyymmdd
         (?:_(?P<time>\d{6}))?          # optional time hhmmss
         (?:_[^.]*)?                    # optional extra tokens before extension
         \.(?P<ext>csv)$                # extension
    """,
    re.VERBOSE | re.IGNORECASE,
)

# =========================
# Helpers
# =========================

def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)

def parse_filename(fname: str) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    """
    Returns (prefix_lower, timestamp_str, ext) if match, else (None, None, None).
    timestamp_str is either 'yyyymmdd_hhmmss' or just 'yyyymmdd' if time missing.
    """
    m = FILENAME_PATTERN.match(fname)
    if not m:
        return None, None, None
    prefix = m.group("prefix").lower()
    date = m.group("date")
    time = m.group("time")
    ext = m.group("ext").lower()
    timestamp = f"{date}_{time}" if time else date
    return prefix, timestamp, ext

def map_prefix_to_section(prefix: Optional[str]) -> str:
    if prefix is None:
        return UNCLASSIFIED_SECTION
    
    # Clean up: strip leading 'raw' and trailing digits
    # e.g. 'rawlb1' -> 'lb'
    clean = prefix
    if clean.startswith("raw"):
        clean = clean[3:]
    
    # Remove trailing digits
    clean = re.sub(r'\d+$', '', clean)
    
    return PREFIX_TO_SECTION.get(clean, UNCLASSIFIED_SECTION)

def copy_file(src: str, dst_dir: str) -> str:
    ensure_dir(dst_dir)
    dst_path = os.path.join(dst_dir, os.path.basename(src))
    shutil.copy2(src, dst_path)
    return dst_path

def safe_dt_parse(ts: Optional[str]) -> Optional[datetime]:
    """
    Parse 'yyyymmdd_hhmmss' or 'yyyymmdd' into datetime.
    """
    if not ts:
        return None
    for fmt in ("%Y%m%d_%H%M%S", "%Y%m%d"):
        try:
            return datetime.strptime(ts, fmt)
        except Exception:
            continue
    return None

def html_escape(s: str) -> str:
    return (
        s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
        if s is not None
        else ""
    )

# =========================
# CSV Preview
# =========================

def read_csv_preview(file_path: str, preview_rows: int):
    """
    Try reading top N rows from CSV using candidate encodings and separators.
    Returns (df, used_encoding, used_sep, error_msg).
    """
    for enc in CSV_ENCODINGS:
        for sep in CSV_SEPARATORS:
            try:
                df = pd.read_csv(file_path, nrows=preview_rows, encoding=enc, sep=sep)
                return df, enc, sep, None
            except Exception:
                continue
    return None, None, None, "Failed to read CSV with tried encodings/separators"

# =========================
# Core Processing
# =========================

def iter_csv_files(source_dir: str, recursive: bool) -> List[str]:
    files = []
    if recursive:
        for root, _, fnames in os.walk(source_dir):
            for f in fnames:
                if f.lower().endswith(".csv"):
                    files.append(os.path.join(root, f))
    else:
        for f in os.listdir(source_dir):
            if f.lower().endswith(".csv"):
                files.append(os.path.join(source_dir, f))
    return files

def scan_and_classify(source_dir: str, output_dir: str, preview_rows: int, log_path: str) -> Dict[str, List[dict]]:
    results: Dict[str, List[dict]] = {}
    ensure_dir(output_dir)

    all_files = iter_csv_files(source_dir, RECURSIVE_SCAN)

    with open(log_path, "w", encoding="utf-8") as log:
        log.write(f"Classification Log - {datetime.now().isoformat()}\n")
        log.write(f"Source: {source_dir}\nOutput: {output_dir}\n")
        log.write(f"Recursive: {RECURSIVE_SCAN}\n\n")

        if not all_files:
            log.write("INFO: No CSV files found in the source directory.\n")

        for src_path in all_files:
            fname = os.path.basename(src_path)
            prefix, ts, ext = parse_filename(fname)

            if ext is None:
                log.write(f"SKIP (pattern mismatch): {fname}\n")
                continue

            section = map_prefix_to_section(prefix)
            if section == UNCLASSIFIED_SECTION:
                log.write(f"WARNING: Unclassified file (unknown or missing prefix): {fname}\n")

            # Attempt preview
            df, enc, sep, err = read_csv_preview(src_path, preview_rows)
            if err:
                log.write(f"ERROR: {fname} - {err}\n")
                log.write(f"SKIP: {fname} (unreadable/corrupt or incompatible)\n\n")
                continue

            # Copy file to section folder
            section_dir_name = section.split(" ")[0]  # 'DM', 'AE', etc.
            section_dir = os.path.join(output_dir, section_dir_name)
            copied_path = copy_file(src_path, section_dir)

            # Timestamp display
            dt_obj = safe_dt_parse(ts)
            if dt_obj:
                if "_" in (ts or ""):
                    dt_display = dt_obj.strftime("%Y-%m-%d %H:%M:%S")
                else:
                    dt_display = dt_obj.strftime("%Y-%m-%d")
            else:
                dt_display = ts or "N/A"

            entry = {
                "filename": fname,
                "source_path": src_path,
                "copied_path": copied_path,
                "section": section,
                "section_dir": section_dir,
                "timestamp": dt_display,
                "rows_previewed": preview_rows,
                "preview_html": df.to_html(index=False, border=0, classes="preview-table"),
                "encoding": enc,
                "separator": sep,
            }
            results.setdefault(section, []).append(entry)
            log.write(f"OK: {fname} -> Section '{section}' | Copied to: {copied_path}\n")
            log.write(f"CSV read with encoding='{enc}', sep='{sep}'\n\n")

    return results

# =========================
# HTML Report Generation
# =========================

def generate_html_dashboard(results: Dict[str, List[dict]], output_dir: str, title: str = "Trial Data Management") -> str:
    index_path = os.path.join(output_dir, "index.html")
    css = """
    body { font-family: Arial, sans-serif; margin: 24px; background: #f7f9fc; color: #1f2937; }
    h1 { margin-bottom: 8px; }
    .meta { color: #6b7280; margin-bottom: 24px; }
    .section { margin-bottom: 32px; padding: 16px; background: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section h2 { margin-top: 0; }
    .file-card { margin: 16px 0; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fafafa; }
    .file-meta { font-size: 0.95em; color: #374151; margin: 8px 0; }
    .preview-table { border-collapse: collapse; width: 100%; }
    .preview-table th, .preview-table td { border: 1px solid #e5e7eb; padding: 6px 8px; font-size: 0.92em; }
    .preview-table th { background: #f3f4f6; }
    .btn-row { margin-top: 8px; }
    .btn { display: inline-block; padding: 8px 12px; background: #2563eb; color: #fff; border-radius: 6px; text-decoration: none; margin-right: 8px; }
    .btn.secondary { background: #6b7280; }
    .pill { display: inline-block; padding: 4px 8px; background: #eef2ff; color: #3730a3; border-radius: 999px; font-size: 0.85em; margin-left: 8px; }
    """
    sections_sorted = sorted([s for s in results.keys() if s != UNCLASSIFIED_SECTION]) + (
        [UNCLASSIFIED_SECTION] if UNCLASSIFIED_SECTION in results else []
    )

    chunks = []
    chunks.append("<!doctype html><html><head><meta charset='utf-8'><title>{}</title>".format(html_escape(title)))
    chunks.append("<style>{}</style></head><body>".format(css))
    chunks.append("<h1>{}</h1>".format(html_escape(title)))
    chunks.append("<div class='meta'>Generated: {}</div>".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

    if not results:
        chunks.append("<p>No files found.</p>")
    else:
        for section in sections_sorted:
            entries = results.get(section, [])
            chunks.append("<div class='section'>")
            chunks.append("<h2>{}</h2>".format(html_escape(section)))
            if not entries:
                chunks.append("<p>No files in this section.</p>")
            else:
                # Sort by parsed dt where available; fallback to filename
                def sort_key(e):
                    ts = e["timestamp"]
                    try:
                        return datetime.strptime(ts, "%Y-%m-%d %H:%M:%S")
                    except:
                        try:
                            return datetime.strptime(ts, "%Y-%m-%d")
                        except:
                            return ts
                entries_sorted = sorted(entries, key=sort_key)
                for e in entries_sorted:
                    fname = e["filename"]
                    ts = e["timestamp"]
                    copied_rel = os.path.relpath(e["copied_path"], output_dir)
                    chunks.append("<div class='file-card'>")
                    chunks.append(f"<div class='file-meta'><strong>{html_escape(fname)}</strong>"
                                  f" <span class='pill'>{html_escape(ts)}</span></div>")
                    chunks.append(f"<div class='file-meta'>Encoding: {html_escape(str(e.get('encoding')))} | Separator: {html_escape(str(e.get('separator')))}</div>")
                    chunks.append("<div class='btn-row'>")
                    # Proper anchor for download
                    chunks.append(f"<a class='btn' href='{html_escape(copied_rel)}' download>Download</a>")
                    chunks.append("</div>")
                    if e["preview_html"]:
                        chunks.append("<div style='margin-top:12px;'>")
                        chunks.append("<div class='file-meta'>Preview (top {} rows):</div>".format(e["rows_previewed"]))
                        chunks.append(e["preview_html"])
                        chunks.append("</div>")
                    chunks.append("</div>")
            chunks.append("</div>")
    chunks.append("</body></html>")
    html_str = "\n".join(chunks)

    with open(index_path, "w", encoding="utf-8") as f:
        f.write(html_str)
    return index_path

# =========================
# Entry Point
# =========================

def run():
    source_dir = os.path.abspath(SOURCE_DIR)
    if not os.path.isdir(source_dir):
        raise FileNotFoundError(f"Source directory not found: {source_dir}")

    ts_folder = datetime.now().strftime("%Y-%m-%d_%H%M%S")
    output_dir = os.path.abspath(os.path.join(OUTPUT_BASE_DIR, ts_folder))
    ensure_dir(output_dir)

    log_path = os.path.join(output_dir, "classification_log.txt")
    results = scan_and_classify(source_dir, output_dir, PREVIEW_ROWS, log_path)
    index_path = generate_html_dashboard(results, output_dir, title="Trial Data Management")

    total_files = sum(len(v) for v in results.values())
    print(f"[OK] Output folder: {output_dir}")
    print(f"[OK] Dashboard: {index_path}")
    print(f"[OK] Log: {log_path}")
    print(f"[SUMMARY] Total classified files: {total_files}")
    for section, items in results.items():
        print(f"  - {section}: {len(items)} files")

if __name__ == "__main__":
    run()
