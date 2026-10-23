import sys, os
sys.path.insert(0, os.path.abspath('.'))

import cv2, io, json
import pandas as pd
import numpy as np
from src.data.omr import process_omr_image, DEFAULT_ANSWER_KEY
from backend.app.routes.ingest import parse_tabular_file, detect_file_shape
from backend.app.services.omr_service import assess_image_quality

# 1. Test OMR Sheet
with open('data/omr_samples/sample_omr_clean.png', 'rb') as f:
    omr_bytes = f.read()

omr_res = process_omr_image(omr_bytes, DEFAULT_ANSWER_KEY)
img_nparr = np.frombuffer(omr_bytes, np.uint8)
img = cv2.imdecode(img_nparr, cv2.IMREAD_COLOR)
quality = assess_image_quality(img)

print('=== OMR SHEET PROCESSING RESULT ===')
print(f"Image Resolution: {img.shape[1]}x{img.shape[0]} px, Channels: {img.shape[2]}")
print(f"Image Quality Assessment: Status={quality['status']}, Laplacian Sharpness={quality['laplacian_var']}, Brightness={quality['brightness']}")
print(f"Total Questions Evaluated: {omr_res['total_questions']}")
print(f"Attempted: {omr_res['attempted']}")
print(f"Correct: {omr_res['correct']}")
print(f"Ambiguous / Smudged: {omr_res['ambiguous']}")
print(f"Accuracy Rate: {omr_res['accuracy_pct']}%")
print(f"Raw Score (JEE Scheme: +4 / -1): {omr_res['total_score']} marks")

print('\nDetailed Per-Question OMR Vector:')
for r in omr_res['results']:
    det = r['detected_option'] if r['detected_option'] else 'BLANK'
    corr_status = 'CORRECT' if r['is_correct'] == 1 else ('WRONG' if det != 'BLANK' else 'BLANK')
    print(f"  Q{r['question_no']:02d}: Marked={det:5s}  AnswerKey={r['correct_key']}  Result={corr_status:7s}  FillDensity={r['fill_density']:.3f}  Confidence={r['confidence']*100:.1f}%")

# 2. Test Excel File
with open('data/sample_test_results.xlsx', 'rb') as f:
    excel_bytes = f.read()

excel_df = parse_tabular_file('sample_test_results.xlsx', excel_bytes)
shape = detect_file_shape(excel_df)

print('\n=== EXCEL SPREADSHEET INGESTION RESULT ===')
print(f"Detected Table Shape: {shape}")
print(f"Total Rows Processed: {len(excel_df)}")
print(f"Unique Student Cohort: {excel_df['student_id'].nunique()}")
print(f"Unique Test Questions: {excel_df['question_id'].nunique()}")

# Subject summary
subj_summary = excel_df.groupby('subject').agg(
    total_responses=('is_correct', 'count'),
    correct_responses=('is_correct', 'sum'),
    avg_accuracy=('is_correct', 'mean'),
    avg_marks=('marks_awarded', 'mean')
).reset_index()
subj_summary['accuracy_pct'] = (subj_summary['avg_accuracy'] * 100).round(1)
print('\nSubject-Wise Performance Matrix:')
print(subj_summary[['subject', 'total_responses', 'correct_responses', 'accuracy_pct', 'avg_marks']].to_string(index=False))

# Topic summary
topic_summary = excel_df.groupby(['subject', 'topic']).agg(
    responses=('is_correct', 'count'),
    accuracy=('is_correct', 'mean'),
    avg_marks=('marks_awarded', 'mean')
).reset_index()
topic_summary['accuracy_pct'] = (topic_summary['accuracy'] * 100).round(1)
print('\nTopic-Level Psychometric Mastery Matrix:')
print(topic_summary[['subject', 'topic', 'responses', 'accuracy_pct', 'avg_marks']].to_string(index=False))

# Student Score Distribution
student_scores = excel_df.groupby(['student_id', 'student_name']).agg(
    total_marks=('marks_awarded', 'sum'),
    correct_count=('is_correct', 'sum'),
    attendance=('attendance_pct', 'first')
).reset_index().sort_values('total_marks', ascending=False)
print('\nTop 5 Performing Students:')
print(student_scores.head(5).to_string(index=False))
print('\nBottom 5 At-Risk Students (Triage Required):')
print(student_scores.tail(5).to_string(index=False))
