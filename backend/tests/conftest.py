"""
Shared pytest fixtures.

Per Section 11: integration tests should run against the Firebase Local
Emulator Suite (Firestore + Auth emulators), never the real production
project. Set FIRESTORE_EMULATOR_HOST (e.g. localhost:8080) before running
tests that touch Firestore. Unit tests below don't need the emulator at all
— they test pure functions (normalization, probability, diffing).
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
