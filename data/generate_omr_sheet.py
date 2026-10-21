"""
Intelliprivart Data Moat - Synthetic OMR Sheet Generator
Generates realistic 20-question bubble sheets:
1. Clean high-contrast OMR sheet
2. Rotated / perspective-skewed OMR photo (mobile camera capture simulation)
3. Blurry OMR photo (low-quality capture simulation)
"""

import os
import random
import cv2
import numpy as np

def generate_omr_samples(output_dir: str = "data/omr_samples"):
    os.makedirs(output_dir, exist_ok=True)
    random.seed(42)

    # 1. Base Canvas (800 x 1100 px, white background)
    width, height = 800, 1100
    canvas = np.ones((height, width, 3), dtype=np.uint8) * 255

    # Header & Alignment Markers (Fiducial corners)
    cv2.rectangle(canvas, (30, 30), (70, 70), (0, 0, 0), -1)
    cv2.rectangle(canvas, (width - 70, 30), (width - 30, 70), (0, 0, 0), -1)
    cv2.rectangle(canvas, (30, height - 70), (70, height - 70), (0, 0, 0), -1)
    cv2.rectangle(canvas, (width - 70, height - 70), (width - 30, height - 70), (0, 0, 0), -1)

    # Title & Metadata
    cv2.putText(canvas, "INTELLIPRIVART OMR EVALUATION SHEET", (120, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (15, 23, 42), 2)
    cv2.putText(canvas, "Nextute EdTech x Finance Club, IIT Patna (20 Questions)", (120, 85), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (71, 85, 105), 1)

    # Student Info Box
    cv2.rectangle(canvas, (100, 110), (width - 100, 160), (203, 213, 225), 1)
    cv2.putText(canvas, "Student ID: STD-PAT-001    Name: Aarav Sharma    Batch: 12th JEE", (120, 140), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (30, 41, 59), 1)

    # Draw 20 Questions (2 columns of 10)
    options = ["A", "B", "C", "D"]
    answer_key = {i: random.choice(options) for i in range(1, 21)}
    student_answers = answer_key.copy()
    student_answers[4] = "C" # Intentional error
    student_answers[12] = "D" # Intentional error

    bubble_radius = 12
    bubble_spacing = 38

    for q_idx in range(1, 21):
        is_right_col = q_idx > 10
        x_base = 450 if is_right_col else 120
        y = 220 + ((q_idx - 11) if is_right_col else (q_idx - 1)) * 45

        # Question label
        cv2.putText(canvas, f"Q{q_idx:02d}:", (x_base, y + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (15, 23, 42), 1)

        # 4 Options: A, B, C, D
        for opt_idx, opt in enumerate(options):
            bx = x_base + 60 + opt_idx * bubble_spacing
            by = y
            # Draw outer ring
            cv2.circle(canvas, (bx, by), bubble_radius, (71, 85, 105), 2)
            cv2.putText(canvas, opt, (bx - 4, by + 4), cv2.FONT_HERSHEY_SIMPLEX, 0.35, (71, 85, 105), 1)

            # Filled bubble for marked answer
            if student_answers[q_idx] == opt:
                # Fill with charcoal/graphite texture
                cv2.circle(canvas, (bx, by), bubble_radius - 2, (30, 30, 30), -1)

    # Save 1: Clean Template
    clean_path = os.path.join(output_dir, "sample_omr_clean.png")
    cv2.imwrite(clean_path, canvas)
    print(f"  • Generated clean OMR: {clean_path}")

    # Save 2: Rotated / Perspective-skewed OMR
    # Mild perspective distortion simulating phone camera angle
    pts1 = np.float32([[0, 0], [width, 0], [0, height], [width, height]])
    pts2 = np.float32([[25, 20], [width - 35, 15], [10, height - 25], [width - 20, height - 15]])
    M_perspective = cv2.getPerspectiveTransform(pts1, pts2)
    rotated = cv2.warpPerspective(canvas, M_perspective, (width, height), borderValue=(240, 240, 240))
    rotated_path = os.path.join(output_dir, "sample_omr_rotated.png")
    cv2.imwrite(rotated_path, rotated)
    print(f"  • Generated rotated OMR: {rotated_path}")

    # Save 3: Blurry OMR (Gaussian blur simulating out-of-focus capture)
    blurry = cv2.GaussianBlur(canvas, (17, 17), 6)
    blurry_path = os.path.join(output_dir, "sample_omr_blurry.png")
    cv2.imwrite(blurry_path, blurry)
    print(f"  • Generated blurry OMR: {blurry_path}")

if __name__ == "__main__":
    generate_omr_samples()
