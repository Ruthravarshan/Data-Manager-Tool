
import re
import sys
import unittest
from datetime import datetime

# Import 'extract' module. 
# Since extract.py is in the root, and we are likely running from root or a subdir, we need to handle path.
sys.path.append(r"C:\Users\2000171848\Documents\Data-Manager-Tool")
import extract

class TestFilenameParsing(unittest.TestCase):
    def test_standard_filenames(self):
        # These should already work
        fname = "ae_raw_20251126_074704.csv"
        prefix, ts, ext = extract.parse_filename(fname)
        self.assertEqual(prefix, "ae")
        self.assertEqual(ts, "20251126_074704")
        self.assertEqual(ext, "csv")

    def test_lb_filenames(self):
        # This currently fails because of the digit '1' in 'rawlb1' and potentially 'raw' prefix
        fname = "rawlb1_raw_20251126_074704.csv"
        # Current expectation is failure or incorrect parsing
        # But we want it to parse eventually.
        # For now, let's see what it returns.
        prefix, ts, ext = extract.parse_filename(fname)
        print(f"Parsed '{fname}' -> prefix={prefix}, ts={ts}, ext={ext}")
        
        # We WANT this to return 'lb' (or something we can map to LB)
        # But for this test, let's just assert what we expect AFTER the fix.
        # If it fails now, that confirms work is needed.
        self.assertIsNotNone(prefix, "Should match the pattern")
        
        # After parsing, we might want to handle the 'raw' cleanup in logic, 
        # but let's see if we can extract 'rawlb1' as prefix first.
        # Currently the regex [A-Za-z]+ fails on '1'
        
if __name__ == '__main__':
    unittest.main()
