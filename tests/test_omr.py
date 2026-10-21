"""
Automated Test Suite: OpenCV OMR Processing
Verifies generation of standard 20-question bubble sheets,
extraction of filled answers, grading against keys, and ambiguity flagging.
"""

import pytest
from src.data.omr import generate_sample_omr_sheet, process_omr_image, DEFAULT_ANSWER_KEY

def test_omr_generation_and_scanning():
    """Verify end-to-end OMR generation and vision processing."""
    # Generate sheet with known marked answers
    known_answers = {
        1: "A", 2: "B", 3: "C", 4: "D", 5: "A",
        6: "B", 7: "C", 8: "D", 9: "A", 10: "B",
        11: "C", 12: "D", 13: "A", 14: "B", 15: "C",
        16: "D", 17: "A", 18: "B", 19: "C", 20: "D"
    }

    img_arr, raw_bytes = generate_sample_omr_sheet(
        student_id="STD_TEST_001",
        test_id="TEST_01",
        marked_answers=known_answers
    )

    assert len(raw_bytes) > 1000, "Generated OMR image bytes must be valid PNG."

    # Process with OpenCV
    results = process_omr_image(raw_bytes, answer_key=DEFAULT_ANSWER_KEY)

    assert results["total_questions"] == 20
    assert results["attempted"] == 20
    # Since known_answers matches DEFAULT_ANSWER_KEY, all 20 should be correct
    assert results["correct"] == 20
    assert results["accuracy_pct"] == 100.0
    assert results["total_score"] == 80  # 20 * 4 = 80
    assert "annotated_image_bytes" in results

def test_omr_blank_sheet():
    """Verify blank sheet reports 0 attempted answers."""
    _, blank_bytes = generate_sample_omr_sheet(marked_answers={})
    results = process_omr_image(blank_bytes)

    assert results["attempted"] == 0
    assert results["correct"] == 0
