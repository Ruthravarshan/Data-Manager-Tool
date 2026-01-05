
import sys
import os
import unittest

# Adjust path to import from backend
sys.path.append(os.path.abspath(r"C:\Users\2000171848\Documents\Data-Manager-Tool\backend"))

from app import file_classifier

class TestFileClassifier(unittest.TestCase):
    def test_lb_filename(self):
        fname = "rawlb1_raw_20251126_074704.csv"
        # We expect this to parse successfully now
        prefix, section, timestamp, error = file_classifier.parse_filename(fname)
        
        print(f"Testing '{fname}': prefix={prefix}, section={section}, ts={timestamp}, err={error}")
        
        self.assertIsNone(error, f"Should not have error but got: {error}")
        self.assertEqual(section, "LB (Laboratory)")
        self.assertIn("rawlb1", prefix) # original prefix is returned

    def test_pk_filename(self):
        fname = "rawpk1_raw_20251126.csv"
        prefix, section, timestamp, error = file_classifier.parse_filename(fname)
        self.assertEqual(section, "PK (Pharmacokinetics)", f"Error: {error}")

    def test_dynamic_section(self):
        # Test completely unknown prefix
        fname = "rawzz1_raw_20251126.csv"
        prefix, section, timestamp, error = file_classifier.parse_filename(fname)
        self.assertIsNone(error)
        self.assertEqual(section, "ZZ") # Should default to uppercase prefix


if __name__ == '__main__':
    unittest.main()
