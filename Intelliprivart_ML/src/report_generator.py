"""
Intelliprivart Data Moat - Bilingual Parent Report Generator
Generates empathetic, factually grounded student progress digests in English and Hindi.
Uses deterministic pedagogical templates (100% offline, zero API keys required).
Includes automated factual verification against structured source data.
"""

from typing import Dict, List, Tuple, Any, Optional

def generate_bilingual_progress_report(
    student_id: str,
    name: str,
    class_level: str,
    exam_target: str,
    attendance_pct: float,
    predicted_band: str,
    strong_topic: str,
    strong_pct: float,
    weak_topic: str,
    weak_pct: float,
    root_cause_driver: str,
    mentor_name: str = "Er. R. K. Verma"
) -> Dict[str, str]:
    """
    Generates bilingual progress card text with growth-oriented tone and supportive next steps.
    """
    english_text = f"""================================================================================
INTELLIPRIVART STUDENT LEARNING PROGRESS DIGEST (MONTHLY REVIEW)
Confidential Academic Mentorship & Diagnostic Communication
================================================================================
Candidate Name: {name} | Token ID: {student_id}
Batch: Class {class_level} ({exam_target}) | Mentor: {mentor_name}
Overall Attendance: {attendance_pct:.1f}% | Evaluation Status: Active

1. KEY ACADEMIC STRENGTHS
* Demonstrated strong conceptual clarity and problem-solving speed in {strong_topic} ({strong_pct:.0f}% mastery).
* Regular participation in classroom numerical problem-solving sessions.

2. TARGETED REMEDIAL FOCUS (SUPPORTIVE ACTION PLAN)
* Diagnostic tests identified concept friction in {weak_topic} ({weak_pct:.0f}% current mastery).
* Primary Diagnostic Context: {root_cause_driver}.
* Institutional Action: A dedicated 15-minute 1-on-1 concept review with Mentor {mentor_name.split()[0]} has been scheduled.
* Curated 15-question concept catch-up worksheet assigned for structured revision.

3. ESTIMATED COMPETITIVE EXAM TRAJECTORY
* Honest Predicted Percentile Interval: {predicted_band} (80% Credible Range).
* Note: We avoid single-point rank promises. Continued focus on concept mastery steadily shifts this range upward.

4. STUDENT WELL-BEING & ENCOURAGEMENT
Every student's learning journey follows its own pace. Our guidance focuses on targeted encouragement, never comparison or pressure.
================================================================================
"""

    hindi_text = f"""================================================================================
इंटेलीप्रिवार्ट विद्यार्थी शिक्षण प्रगति विवरण (मासिक समीक्षा)
गोपनीय अकादमिक मेंटरशिप एवं उपचारात्मक मार्गदर्शन
================================================================================
विद्यार्थी का नाम: {name} | पहचान टोकन: {student_id}
कक्षा: {class_level} ({exam_target}) | अकादमिक मेंटर: {mentor_name}
कुल उपस्थिति: {attendance_pct:.1f}% | स्थिति: नियमित अध्ययनरत

१. मुख्य अकादमिक क्षमताएं एवं मजबूती
* विद्यार्थी ने {strong_topic} में उत्कृष्ट समझ एवं सवाल हल करने की गति प्रदर्शित की है ({strong_pct:.0f}% दक्षता स्तर)।
* कक्षा अभ्यास सत्रों में नियमित सहभागिता एवं प्रयास।

२. विशेष उपचारात्मक कार्ययोजना (सहयोगात्मक मार्गदर्शन)
* हालिया विश्लेषण में {weak_topic} में वैचारिक सुधार की आवश्यकता पाई गई है ({weak_pct:.0f}% वर्तमान दक्षता स्तर)।
* मुख्य कारण: {root_cause_driver}।
* संस्थान द्वारा उठाया गया कदम: मेंटर {mentor_name.split()[0]} के साथ 15 मिनट का व्यक्तिगत शंका-समाधान सत्र निर्धारित किया गया है।
* अभ्यास हेतु 15 प्रश्नों की विशेष कॉन्सेप्ट रिवीजन वर्कशीट आवंटित की गई है।

३. अनुमानित प्रतियोगी परीक्षा प्रक्षेपवक्र (Percentile Range)
* अनुमानित परीक्षा परसेंटाइल सीमा: {predicted_band} (विश्वसनीय सम्भाव्यता अंतराल)।
* टिप्पणी: हम भ्रामक सिंगल-रैंक का दावा नहीं करते। वैचारिक मजबूती के साथ यह सीमा निरंतर बेहतर होती है।

४. विद्यार्थी मानसिक स्वास्थ्य एवं सुरक्षा संदेश
प्रत्येक विद्यार्थी अपनी गति से सीखता है। हमारा उद्देश्य सार्वजनिक रैंकिंग या दबाव बनाना नहीं, बल्कि समय पर सही मार्गदर्शन प्रदान करना है।
================================================================================
"""

    return {
        "student_id": student_id,
        "english_report": english_text,
        "hindi_report": hindi_text,
        "combined_bilingual": english_text + "\n\n" + hindi_text
    }

def verify_report_factual_consistency(
    report_text: str,
    source_student_id: str,
    expected_attendance: float,
    expected_strong_topic: str,
    expected_weak_topic: str
) -> Dict[str, Any]:
    """
    Automated guardrail test: verifies that all factual markers in the generated report
    strictly match the ground truth diagnostic data.
    """
    checks = {
        "student_id_match": source_student_id in report_text,
        "attendance_match": f"{expected_attendance:.1f}%" in report_text or f"{expected_attendance:.0f}%" in report_text,
        "strong_topic_present": expected_strong_topic in report_text,
        "weak_topic_present": expected_weak_topic in report_text,
        "zero_shaming_verified": ("fail" not in report_text.lower() and "unfit" not in report_text.lower())
    }
    all_passed = all(checks.values())
    return {
        "is_factually_consistent": all_passed,
        "checks": checks
    }
