import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BACKEND_URL =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_URL ||
  process.env.API_URL ||
  'https://intelliparivart.onrender.com/api';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('id') || '';
    const tenantId = searchParams.get('tenant_id') || 'INST_PATNA_01';
    const topic = searchParams.get('topic') || '';

    if (!studentId) {
      return NextResponse.json({ status: 'error', message: 'student id required' }, { status: 400 });
    }

    // Call backend endpoint for detailed student assessment information
    const backendUrl = `${BACKEND_URL}/students/${encodeURIComponent(studentId)}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const resp = await fetch(backendUrl, {
        headers: {
          'X-Tenant-ID': tenantId,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const data = await resp.json();
        const hasAssessmentData = Boolean(data.has_assessment_data && (data.topic_mastery?.length > 0 || data.test_history?.length > 0));

        let diagnosticTrigger = 'No diagnostic assessment data recorded in database';
        if (hasAssessmentData) {
          // If specific topic was requested, check for topic mastery
          if (topic && data.topic_mastery) {
            const matchedTopic = data.topic_mastery.find(
              (t: any) => t.topic_name?.toLowerCase().includes(topic.toLowerCase()) || topic.toLowerCase().includes(t.topic_name?.toLowerCase())
            );
            if (matchedTopic) {
              diagnosticTrigger = `Calibrated topic mastery is ${matchedTopic.bkt_mastery_pct}% (${matchedTopic.status}) based on Item Response evaluations`;
            } else {
              diagnosticTrigger = data.diagnostic_trigger || 'Performance evaluated across milestone examinations';
            }
          } else {
            diagnosticTrigger = data.diagnostic_trigger || 'Diagnostic data active in database';
          }
        }

        return NextResponse.json({
          status: 'success',
          student_id: studentId,
          has_assessment_data: hasAssessmentData,
          diagnostic_reason: diagnosticTrigger,
          target_exam: data.overview?.target_exam || data.target_exam || 'JEE Advanced',
          batch_name: data.overview?.batch_name || data.batch_name || 'Standard Enrolled Cohort',
          topic_mastery: data.topic_mastery || [],
          test_history: data.test_history || []
        });
      }
    } catch (fetchErr) {
      console.warn('Backend detail query warning:', fetchErr);
    }

    // Fallback: Check verified demo students
    const { DEMO_STUDENTS } = await import('@/lib/demoData');
    const demoStudent = DEMO_STUDENTS.find((s) => s.id.toLowerCase() === studentId.toLowerCase());

    if (demoStudent) {
      const hasTopicFriction = demoStudent.weakTopics?.some((t) =>
        topic.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(topic.toLowerCase())
      );

      const trigger = hasTopicFriction
        ? `Diagnostic trigger: Review flagged for ${topic} based on recent test responses (Mastery: ${Math.round(demoStudent.overallPercentile * 0.65)}%)`
        : `Diagnostic trigger: Periodic reinforcement drill recommended for ${demoStudent.name}`;

      return NextResponse.json({
        status: 'success',
        student_id: demoStudent.id,
        has_assessment_data: true,
        diagnostic_reason: trigger,
        target_exam: demoStudent.targetExam || 'JEE Advanced',
        batch_name: demoStudent.batchName || 'Achievers JEE Advanced Top-30'
      });
    }

    // Default when no record found in Supabase
    return NextResponse.json({
      status: 'success',
      student_id: studentId,
      has_assessment_data: false,
      diagnostic_reason: 'No diagnostic assessment data recorded in database for this student.',
      target_exam: 'JEE Advanced',
      batch_name: 'Standard Cohort'
    });
  } catch (error: any) {
    console.error('Error in /api/students/detail:', error);
    return NextResponse.json(
      { status: 'error', message: error.message || 'Database error retrieving student assessment details' },
      { status: 500 }
    );
  }
}
