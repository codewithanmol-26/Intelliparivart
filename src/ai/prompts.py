"""
Data Moat - Pedagogical Prompt Engineering & Deterministic Fallback Engine
Crafts bilingual parent progress cards, personalized 14-day revision plans,
teacher-facing intervention advice, and targeted practice questions.
"""

from typing import Dict, List, Optional, Any
from src.ai.adapter import llm_adapter, LLMResponse

def generate_bilingual_parent_report(
    student_name: str,
    class_level: str,
    target_exam: str,
    strong_topic: str,
    weak_topic: str,
    strong_pct: float,
    weak_pct: float,
    attendance_pct: float,
    predicted_band: str,
    root_causes: str,
    provider: Optional[str] = None
) -> LLMResponse:
    """Generates an empathetic, bilingual (English & Hindi) parent progress digest."""
    prompt = f"""
    Generate an empathetic bilingual parent progress report for:
    Student: {student_name} | Class: {class_level} | Target: {target_exam}
    Strengths: {strong_topic} ({strong_pct:.0f}% mastery)
    Focus Area: {weak_topic} ({weak_pct:.0f}% mastery)
    Attendance: {attendance_pct:.0f}%
    Predicted Exam Percentile Interval: {predicted_band}
    Root Causes: {root_causes}
    Rules: Non-alarmist, zero shaming, growth-oriented, actionable next steps. Include English and Hindi versions.
    """

    def fallback():
        return f"""================================================================================
DATA MOAT BILINGUAL PARENT PROGRESS CARD | नेक्स्ट्यूट प्रोग्रेस रिपोर्ट
Confidential Student Diagnostic Report | Nextute Intelligence Moat
================================================================================
Student: {student_name} | Class: {class_level} ({target_exam})
Predicted Exam Percentile Range: {predicted_band} (Calibrated 80% Confidence Interval)
Current Overall Attendance: {attendance_pct:.0f}% | Academic Status: Active

--------------------------------------------------------------------------------
ENGLISH VERSION (For Parents & Students)
--------------------------------------------------------------------------------
Dear Parent,
Greetings from the Academic Mentorship Team. Here is this month's learning digest:

KEY STRENGTHS:
* Excellent conceptual foundation in {strong_topic} ({strong_pct:.0f}% mastery level).
* Consistent effort and active participation in foundational problem-solving.

FOCUSED CATCH-UP PLAN (SUPPORTIVE ACTION):
* We have observed concept friction in {weak_topic} ({weak_pct:.0f}% mastery).
* Root Cause Diagnosis: {root_causes}.
* Institutional Action: A dedicated 15-minute doubt-clearing session with our mentor has been scheduled.
* A personalized 15-question concept catch-up worksheet has been assigned on the student portal.

Note on Student Well-Being:
Every student learns at their own pace. Our goal is targeted encouragement and concept mastery, never pressure.

--------------------------------------------------------------------------------
हिंदी संस्करण (अभिभावक एवं विद्यार्थी संवाद)
--------------------------------------------------------------------------------
आदरणीय अभिभावक,
अकादमिक मेंटरशिप टीम की ओर से सादर नमस्कार। प्रस्तुत है इस माह की सीखने की प्रगति रिपोर्ट:

मुख्य क्षमताएं एवं मजबूती:
* विद्यार्थी ने {strong_topic} में उत्कृष्ट समझ प्रदर्शित की है ({strong_pct:.0f}% दक्षता स्तर)।
* अभ्यास सत्रों में नियमित सहभागिता एवं प्रयास।

विशेष उपचारात्मक कार्ययोजना (सहयोगात्मक मार्गदर्शन):
* हालिया विश्लेषण में {weak_topic} में वैचारिक सुधार की आवश्यकता पाई गई है ({weak_pct:.0f}% दक्षता)।
* मुख्य कारण: {root_causes}।
* संस्थान द्वारा उठाया गया कदम: विद्यार्थी के लिए मेंटर के साथ 15 मिनट का व्यक्तिगत शंका-समाधान सत्र निर्धारित किया गया है।
* अभ्यास हेतु 15 प्रश्नों की विशेष कॉन्सेप्ट रिवीजन वर्कशीट आवंटित की गई है।

विद्यार्थी मानसिक स्वास्थ्य एवं सुरक्षा:
प्रत्येक विद्यार्थी अपनी गति से सीखता है। हमारा उद्देश्य सार्वजनिक रैंकिंग या दबाव बनाना नहीं, बल्कि समय पर सही मार्गदर्शन प्रदान करना है।
================================================================================
"""

    return llm_adapter.generate(prompt=prompt, provider_override=provider, deterministic_fallback_fn=fallback)

def generate_personalized_study_plan(
    student_name: str,
    target_exam: str,
    weak_topics: List[str],
    strong_topics: List[str],
    provider: Optional[str] = None
) -> LLMResponse:
    """Generates a structured 14-day study plan focused on weak topic catch-up."""
    weak_str = ", ".join(weak_topics) if weak_topics else "General Revision"
    strong_str = ", ".join(strong_topics) if strong_topics else "Core Fundamentals"

    prompt = f"Create a 14-day structured revision schedule for {student_name} targeting {target_exam}. Weak topics: {weak_str}. Strong topics: {strong_str}."

    def fallback():
        return f"""### 📅 14-Day Targeted Study & Mastery Plan
**Student**: {student_name} | **Target Exam**: {target_exam}
**Primary Focus Areas**: {weak_str}
**Reinforcement Areas**: {strong_str}

---
#### **Week 1: Concept Reconstruction & Foundational Drills**
* **Day 1–2 ({weak_topics[0] if weak_topics else 'Mechanics'})**:
  - *Slot 1 (45 mins)*: Review NCERT / Class theory notes and highlight core definitions.
  - *Slot 2 (60 mins)*: Solve 12 Level-1 conceptual problems with formula sheet.
* **Day 3–4 ({weak_topics[1] if len(weak_topics) > 1 else weak_topics[0] if weak_topics else 'Calculus'})**:
  - *Slot 1 (45 mins)*: Derivation drill & standard substitution techniques.
  - *Slot 2 (60 mins)*: Attempt 10 Previous Year Questions (PYQs 2021-2024).
* **Day 5 (Mixed Review & Mentorship)**:
  - 15-minute 1-on-1 doubt clearing session with Subject Faculty.
* **Day 6–7 (Speed & Accuracy Drill)**:
  - 25-question timed sectional quiz (45 mins). Target: >70% accuracy with zero negative marking guessing.

---
#### **Week 2: Advanced Application & Fortnightly Mock Preparation**
* **Day 8–10 (Multi-Concept Linkage)**:
  - Solve 15 combined problems connecting {weak_topics[0] if weak_topics else 'Physics'} with {strong_topics[0] if strong_topics else 'Chemistry'}.
* **Day 11–12 (Error Log Analysis)**:
  - Re-attempt all incorrect questions from the last 2 fortnightly mock exams.
* **Day 13 (Rest & Consolidation)**:
  - Light formula revision, sleep hygiene check, and exam pacing strategy.
* **Day 14 (Milestone Mock Exam)**:
  - Full-length test simulation under actual exam conditions.
"""

    return llm_adapter.generate(prompt=prompt, provider_override=provider, deterministic_fallback_fn=fallback)

def generate_teacher_intervention_advice(
    student_name: str,
    weak_topic: str,
    risk_score: float,
    primary_drivers: str,
    provider: Optional[str] = None
) -> LLMResponse:
    """Provides pedagogical and behavioral counsel for faculty mentors."""
    prompt = f"Provide faculty mentor intervention guidelines for {student_name}. Weak topic: {weak_topic}. Disengagement Risk: {risk_score:.2f}. Drivers: {primary_drivers}."

    def fallback():
        return f"""### 👨‍🏫 Faculty Mentor Intervention Protocol
**Student**: {student_name} | **Current Risk Index**: {risk_score*100:.1f}%
**Diagnostic Drivers**: {primary_drivers}

1. **Empathetic Diagnostic Inquiry (Initial 5 Minutes)**:
   - Schedule a private, informal check-in before or after class. Avoid mentioning 'risk' or 'dropout'.
   - Sample Prompt: *"Hi {student_name}, I noticed the recent problems in {weak_topic} had some tricky calculus steps. How did that section feel for you during the test?"*

2. **Concept Scaffolding (10 Minutes)**:
   - Identify whether the friction is **notational confusion**, **algebraic slip**, or **fundamental theorem gap**.
   - Work through 2 illustrative examples together, allowing the student to lead the arithmetic.

3. **Low-Stakes Recovery Commitment**:
   - Assign the targeted 15-question concept catch-up worksheet.
   - Set a follow-up checkpoint in 7 days to celebrate progress.

4. **Well-Being & DPDP Privacy Guardrails**:
   - Do NOT share this student's risk tier with peers or publish on ranking boards.
   - Log the counseling note in the Data Moat intervention tracker.
"""

    return llm_adapter.generate(prompt=prompt, provider_override=provider, deterministic_fallback_fn=fallback)

def generate_targeted_practice_questions(
    topic: str,
    difficulty: str = "Moderate",
    provider: Optional[str] = None
) -> LLMResponse:
    """Generates 3 calibrated practice questions with full step-by-step solutions."""
    prompt = f"Generate 3 JEE/NEET practice multiple-choice questions for topic: {topic} at {difficulty} level with explanations."

    def fallback():
        return f"""### 📝 Targeted Concept Catch-Up Questions: {topic}
**Difficulty**: {difficulty} | **Source**: Curated Syllabus Benchmark Bank

---
**Question 1**:
A particle moves in a straight line such that its displacement $x$ at time $t$ satisfies $x^2 = 2t^2 + 6t$. What is the acceleration of the particle?
* A) Proportional to $x^{{-3}}$
* B) Proportional to $x^2$
* C) Constant
* D) Proportional to $x^{{-1}}$

*Answer*: **A**  
*Step-by-Step Solution*:
Differentiating both sides with respect to $t$: $2x \\frac{{dx}}{{dt}} = 4t + 6 \\implies v = \\frac{{2t+3}}{{x}}$.  
Differentiating again: $a = \\frac{{dv}}{{dt}} = \\frac{{2x - (2t+3)v}}{{x^2}} = \\frac{{2x - \\frac{{(2t+3)^2}}{{x}}}}{{x^2}} = \\frac{{2x^2 - (4t^2+12t+9)}}{{x^3}}$.  
Since $2x^2 = 4t^2 + 12t$, the numerator becomes $(4t^2 + 12t) - (4t^2+12t+9) = -9$.  
Thus $a = \\frac{{-9}}{{x^3}} \\propto x^{{-3}}$.

---
**Question 2**:
For a first-order chemical reaction, if the rate constant $k = 2.303 \\times 10^{{-3}} \\text{{ s}}^{{-1}}$, what is the time required for $75\\%$ of the reactant to decompose?
* A) 300 seconds
* B) 600 seconds
* C) 900 seconds
* D) 1200 seconds

*Answer*: **B**  
*Step-by-Step Solution*:
For a first-order reaction: $t = \\frac{{2.303}}{{k}} \\log_{{10}}\\left(\\frac{{[A]_0}}{{[A]_t}}\\right)$.  
When $75\\%$ decomposes, $[A]_t = 0.25 [A]_0$, so $\\frac{{[A]_0}}{{[A]_t}} = 4$.  
$t = \\frac{{2.303}}{{2.303 \\times 10^{{-3}}}} \\log_{{10}}(4) = 1000 \\times 2(0.3010) \\approx 602 \\text{{ seconds}} \\approx 600 \\text{{ s}}$.

---
**Question 3**:
Evaluate the definite integral: $I = \\int_{{0}}^{{\\pi/2}} \\frac{{\\sin^3 x}}{{\\sin^3 x + \\cos^3 x}} dx$.
* A) $\\pi$
* B) $\\pi / 2$
* C) $\\pi / 4$
* D) 0

*Answer*: **C**  
*Step-by-Step Solution*:
Using property $\\int_{{0}}^{{a}} f(x) dx = \\int_{{0}}^{{a}} f(a-x) dx$:  
$I = \\int_{{0}}^{{\\pi/2}} \\frac{{\\cos^3 x}}{{\\cos^3 x + \\sin^3 x}} dx$.  
Adding the two equations: $2I = \\int_{{0}}^{{\\pi/2}} 1 \\, dx = \\frac{{\\pi}}{{2}} \\implies I = \\frac{{\\pi}}{{4}}$.
"""

    return llm_adapter.generate(prompt=prompt, provider_override=provider, deterministic_fallback_fn=fallback)
