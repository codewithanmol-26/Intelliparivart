"""
Data Moat - Bilingual PDF Parent Progress Card Generator
Generates publication-quality, formatted A4 PDF progress reports using ReportLab.
Adheres strictly to DPDP Act 2023 privacy safeguards and MoE 2024 non-shaming guidelines.
"""

import io
from typing import Dict, Any, Optional
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable

def generate_parent_report_pdf(
    student_name: str,
    student_id: str,
    institute_name: str,
    class_level: str,
    batch_name: str,
    strong_topic: str,
    weak_topic: str,
    strong_pct: float,
    weak_pct: float,
    attendance_pct: float,
    predicted_band: str,
    root_causes: str,
    mentor_notes: Optional[str] = None
) -> bytes:
    """
    Compiles an empathetic, professional PDF parent report card into raw bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0F172A")
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748B")
    )

    section_heading = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#0D9488")
    )

    body_style = ParagraphStyle(
        "ReportBody",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155")
    )

    body_bold = ParagraphStyle(
        "ReportBodyBold",
        parent=body_style,
        fontName="Helvetica-Bold"
    )

    elements = []

    # 1. Header Banner
    elements.append(Paragraph(f"<b>{institute_name.upper()}</b>", title_style))
    elements.append(Paragraph("DATA MOAT — STUDENT LEARNING PROGRESS DIGEST", subtitle_style))
    elements.append(Paragraph("Confidential Academic Mentorship & Diagnostic Communication", subtitle_style))
    elements.append(Spacer(1, 10))
    elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0D9488"), spaceAfter=15))

    # 2. Student Metadata Box
    meta_data = [
        [
            Paragraph(f"<b>Candidate Name:</b> {student_name}", body_style),
            Paragraph(f"<b>Token ID:</b> {student_id}", body_style)
        ],
        [
            Paragraph(f"<b>Academic Batch:</b> {batch_name}", body_style),
            Paragraph(f"<b>Class Level:</b> {class_level}", body_style)
        ],
        [
            Paragraph(f"<b>Predicted Percentile Interval:</b> <b>{predicted_band}</b>", body_style),
            Paragraph(f"<b>Overall Attendance:</b> {attendance_pct:.0f}%", body_style)
        ]
    ]
    meta_table = Table(meta_data, colWidths=[260, 250])
    meta_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 15))

    # 3. Strengths Section (Green Card)
    elements.append(Paragraph("1. KEY ACADEMIC STRENGTHS", section_heading))
    strength_text = f"""
    The student demonstrates high conceptual clarity in <b>{strong_topic}</b> with an estimated topic mastery of <b>{strong_pct:.0f}%</b>.
    Problem-solving speed and fundamental formula retention in this area have been consistently strong across recent fortnightly mock evaluations.
    """
    strength_data = [[Paragraph(strength_text, body_style)]]
    strength_table = Table(strength_data, colWidths=[510])
    strength_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0FDF4")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#86EFAC")),
        ("PADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(strength_table)
    elements.append(Spacer(1, 12))

    # 4. Supportive Action Plan (Amber Card)
    elements.append(Paragraph("2. FOCUSED CATCH-UP & REMEDIAL ROADMAP", section_heading))
    catchup_text = f"""
    Diagnostic analysis identified concept friction in <b>{weak_topic}</b> (current mastery: <b>{weak_pct:.0f}%</b>).<br/>
    <b>Identified Diagnostic Drivers:</b> {root_causes}.<br/>
    <b>Supportive Institutional Actions Scheduled:</b><br/>
    • A personalized 15-minute 1-on-1 concept review with the subject faculty mentor.<br/>
    • Dedicated 15-question concept catch-up worksheet assigned for structured revision.<br/>
    • Attendance recovery pacing tracked over the upcoming 14-day cycle.
    """
    catchup_data = [[Paragraph(catchup_text, body_style)]]
    catchup_table = Table(catchup_data, colWidths=[510])
    catchup_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FFFBEB")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#FDE68A")),
        ("PADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(catchup_table)
    elements.append(Spacer(1, 12))

    # 5. Bilingual Message (English & Hindi)
    elements.append(Paragraph("3. BILINGUAL MENTOR COMMUNICATION (ENGLISH & HINDI)", section_heading))
    bilingual_text = f"""
    <b>English:</b> Dear Parent, competitive preparation is a marathon of steady growth. Our pedagogical monitoring aims to provide timely guidance and concept mastery, never pressure. Please encourage regular attendance and self-paced revision.<br/><br/>
    <b>हिंदी:</b> आदरणीय अभिभावक, प्रतियोगी परीक्षा की तैयारी धैर्य एवं नियमित अभ्यास का सफर है। हमारा उद्देश्य विद्यार्थी पर दबाव बनाना नहीं, बल्कि सही समय पर सही मार्गदर्शन प्रदान करना है। विद्यार्थी के नियमित अभ्यास में सहयोग प्रदान करें।
    """
    bilingual_data = [[Paragraph(bilingual_text, body_style)]]
    bilingual_table = Table(bilingual_data, colWidths=[510])
    bilingual_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
        ("BOX", (0, 0), (-1, -1), 1, colors.HexColor("#CBD5E1")),
        ("PADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(bilingual_table)
    elements.append(Spacer(1, 15))

    # 6. Compliance & Well-Being Safeguards Footer
    footer_text = """
    <b>Privacy & Student Well-Being Notice:</b> Prepared under DPDP Act 2023 Verifiable Parental Consent (VPC) and MoE Coaching Guidelines 2024.
    Diagnostic indicators and prediction intervals are confidential educational support signals. Public ranking, shaming, or comparative peer display is strictly prohibited.
    """
    elements.append(Paragraph(footer_text, ParagraphStyle("Footer", parent=styles["Normal"], fontSize=7.5, leading=10, textColor=colors.HexColor("#64748B"))))

    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
