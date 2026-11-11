#!/usr/bin/env python3
"""
Attestor Master Test Automation Runner
Executes all verification layers (Unit, Integration, Statistical Evaluation Gates, Security/SSRF)
SPDX-License-Identifier: Apache-2.0
"""
import sys
import unittest

def main():
    print("=" * 72)
    print(" ATTESTOR MASTER VERIFICATION SUITE — STARTUP BUILDATHON INDIA 2026")
    print("=" * 72)
    loader = unittest.TestLoader()
    suite = loader.discover("tests", pattern="test_*.py")
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    print("\n" + "=" * 72)
    if result.wasSuccessful():
        print(f" ✓ ALL VERIFICATION GATES PASSED (Ran {result.testsRun} tests)")
        print("   Trustworthy evidence verified across all architectural layers.")
        print("=" * 72)
        sys.exit(0)
    else:
        print(f" ✗ TEST FAILURES DETECTED ({len(result.failures)} failures, {len(result.errors)} errors)")
        print("=" * 72)
        sys.exit(1)

if __name__ == "__main__":
    main()
