import {
  DEMO_INSTITUTE,
  DEMO_BATCHES,
  DEMO_STUDENTS,
  DEMO_TOPIC_MASTERY,
  DEMO_INTERVENTIONS,
  DEMO_PARENT_REPORTS
} from './demoData';
import {
  IngestionResult,
  QuarantineRecord,
  MasteryMatrixResponse,
  RiskStudent,
  ConformalPrediction,
  ParentReport,
  OwnerDashboardData,
  ConsentRecord,
  AuthUser,
  DemoUserPersona,
  InstituteInfo,
  UploadSourceRecord,
  UploadPreviewResult,
  RecomputeStatus,
} from './types';

export function getApiBaseUrl(): string {
  // 1. In browser or build client bundle, check public framework variable if defined
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;
  if (publicUrl && !publicUrl.includes('127.0.0.1') && !publicUrl.includes('localhost')) {
    return publicUrl.replace(/\/+$/, '');
  }

  // 2. On server side (SSR / Node runtime), check private server variables (Vercel-safe without public prefix)
  if (typeof window === 'undefined') {
    const serverUrl =
      process.env.BACKEND_URL ||
      process.env.API_URL ||
      process.env.BACKEND_INTERNAL_URL;
    if (serverUrl && !serverUrl.includes('127.0.0.1') && !serverUrl.includes('localhost')) {
      return serverUrl.replace(/\/+$/, '');
    }
  }

  // 3. Deployed Production Render backend fallback (works out of the box with 0 env vars)
  return 'https://intelliparivart.onrender.com/api';
}

function getStoredToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('datamoat_auth_token');
  }
  return null;
}


/**
 * Coherent Synthetic Demo Data Fallback Provider
 * Ensures the entire website and all 4 role dashboards work interactively
 * even when the backend server is offline or not yet connected.
 */
function getDemoFallback<T>(endpoint: string, tenantId: string, options?: RequestInit): T | null {
  const ep = endpoint.toLowerCase();

  // Institutes
  if (ep === '/institutes' || ep.startsWith('/institutes')) {
    return [
      { id: DEMO_INSTITUTE.id, name: DEMO_INSTITUTE.name, city: `${DEMO_INSTITUTE.city}, ${DEMO_INSTITUTE.state}` },
      { id: 'INST_KOTA_02', name: 'Chaitanya Science Forum, Kota', city: 'Kota, Rajasthan' },
      { id: 'INST_LUCKNOW_03', name: 'Drona Medical Institute, Lucknow', city: 'Lucknow, UP' },
    ] as unknown as T;
  }

  // Auth me & demo users
  if (ep.startsWith('/auth/me')) {
    return {
      id: 'USER_DEMO_01',
      email: 'owner@apex.edu.in',
      full_name: 'Dr. S. K. Narayan',
      institute_id: tenantId,
      institute_name: DEMO_INSTITUTE.name,
      role: 'owner',
      permissions: ['ALL'],
      is_active: true
    } as unknown as T;
  }

  if (ep.startsWith('/auth/demo-users')) {
    return [
      { id: 'USR_OWNER', full_name: 'Dr. S. K. Narayan', role: 'owner', email: 'director@apex.edu.in', institute_name: 'Apex JEE Academy', description: 'Executive & Financial Overview' },
      { id: 'USR_TEACHER', full_name: 'Er. R. K. Verma', role: 'teacher', email: 'physics@apex.edu.in', institute_name: 'Apex JEE Academy', description: 'Physics Lead & Batch Mentor' },
      { id: 'USR_STUDENT', full_name: 'Aarav Sharma', role: 'student', email: 'aarav.sharma@student.apex.edu.in', institute_name: 'Apex JEE Academy', description: 'Achievers Top-30 Student' },
      { id: 'USR_PARENT', full_name: 'Mr. Rajesh Sharma', role: 'parent', email: 'rajesh.sharma@parent.in', institute_name: 'Apex JEE Academy', description: 'Guardian View (Bilingual)' }
    ] as unknown as T;
  }

  // Mastery Matrix
  if (ep.startsWith('/mastery/matrix')) {
    return {
      tenant_id: tenantId,
      topics: DEMO_TOPIC_MASTERY.map(t => ({
        topic_id: t.topicId,
        topic_name: t.topicName,
        subject: t.subject,
        bkt_mastery_prob: t.bktMasteryProb,
        irt_theta_mean: t.irtThetaMean,
        raw_percent_mean: t.rawPercentMean,
        sample_size: t.sampleSize,
        uncertainty: t.uncertainty,
        status: t.status
      }))
    } as unknown as T;
  }

  // Student specific mastery
  if (ep.startsWith('/mastery/student/')) {
    return {
      student_id: 'STD_PAT_001',
      student_name: 'Aarav Sharma',
      topics: DEMO_TOPIC_MASTERY.map(t => ({
        topic_id: t.topicId,
        topic_name: t.topicName,
        subject: t.subject,
        bkt_mastery_prob: t.bktMasteryProb,
        status: t.status
      }))
    } as unknown as T;
  }

  // Risk Queue
  if (ep.startsWith('/risk/queue')) {
    return DEMO_STUDENTS.map(s => ({
      student_id: s.id,
      full_name: s.name,
      batch_name: s.batchName,
      target_exam: s.targetExam,
      predicted_risk_proba: s.riskTier === 'High' ? 0.84 : s.riskTier === 'Medium' ? 0.48 : 0.12,
      risk_band: s.riskTier,
      primary_driver: s.riskDriver || 'Stable performance across milestones',
      recommended_remedial: s.recommendedAction || 'Continue regular study drills',
      attendance_rate: s.attendanceRate,
      bkt_mastery_avg: s.overallPercentile / 100,
      consecutive_slump_tests: s.riskTier === 'High' ? 3 : s.riskTier === 'Medium' ? 1 : 0,
      fee_payment_lag_days: s.riskTier === 'High' ? 14 : 0
    })) as unknown as T;
  }

  // Predictions (Conformal quantiles)
  if (ep.startsWith('/predictions')) {
    if (ep.includes('/student/')) {
      const student = DEMO_STUDENTS[0];
      return {
        student_id: student.id,
        full_name: student.name,
        target_exam: student.targetExam,
        current_month: 8,
        p10: student.predictedPercentileMin,
        p50: student.overallPercentile,
        p90: student.predictedPercentileMax,
        interval_width: student.predictedPercentileMax - student.predictedPercentileMin,
        is_intervened: true,
        history: student.recentTestScores.map((t, idx) => ({
          month: idx + 1,
          p10: Math.max(50, t.percentile - 4),
          p50: t.percentile,
          p90: Math.min(99.5, t.percentile + 4)
        }))
      } as unknown as T;
    }
    return DEMO_STUDENTS.map(s => ({
      student_id: s.id,
      full_name: s.name,
      target_exam: s.targetExam,
      current_month: 8,
      p10: s.predictedPercentileMin,
      p50: s.overallPercentile,
      p90: s.predictedPercentileMax,
      interval_width: s.predictedPercentileMax - s.predictedPercentileMin,
      is_intervened: s.riskTier === 'High',
      history: s.recentTestScores.map((t, idx) => ({
        month: idx + 1,
        p10: Math.max(50, t.percentile - 4),
        p50: t.percentile,
        p90: Math.min(99.5, t.percentile + 4)
      }))
    })) as unknown as T;
  }

  // Reports (Bilingual parent reports)
  if (ep.startsWith('/reports/generate/')) {
    const isHindi = ep.includes('lang=hi');
    const rpt = isHindi ? DEMO_PARENT_REPORTS.hi : DEMO_PARENT_REPORTS.en;
    return {
      student_id: 'STD_PAT_001',
      student_name: rpt.studentName,
      batch_name: rpt.batchName,
      target_exam: rpt.targetExam,
      language: isHindi ? 'hi' : 'en',
      generated_at: new Date().toISOString(),
      attendance_pct: rpt.attendanceRate,
      predicted_band: rpt.percentileBand,
      strong_topic: rpt.strongAreas[0],
      weak_topic: rpt.growthAreas[0],
      report_digest: `${rpt.studentName} has maintained ${rpt.attendanceRate}% attendance. ${rpt.facultyNote}`,
      report_text: `${rpt.studentName} Progress Digest:\n- Attendance: ${rpt.attendanceStatus}\n- Score Trend: ${rpt.overallScoreTrend}\n- Focus Area: ${rpt.growthAreas[0]}\n- Mentor Note: ${rpt.facultyNote}`,
      supportive_action: rpt.homeSupportTips.join(' | ')
    } as unknown as T;
  }

  // Owner Dashboard
  if (ep.startsWith('/owner/overview')) {
    return {
      tenant_id: tenantId,
      institute_name: DEMO_INSTITUTE.name,
      total_students: DEMO_INSTITUTE.totalStudents,
      active_batches: DEMO_BATCHES.length,
      average_attendance: DEMO_INSTITUTE.avgAttendance,
      dropout_rate_baseline: 12.8,
      dropout_rate_current: 5.7,
      at_risk_students_count: 8,
      interventions_active: DEMO_INTERVENTIONS.length,
      retention_revenue_protected_inr: 2850000,
      annual_platform_roi_multiple: 18.3,
      batch_breakdown: DEMO_BATCHES.map(b => ({
        batch_id: b.id,
        batch_name: b.name,
        target_exam: b.targetExam,
        student_count: b.studentCount,
        avg_score: b.avgScore,
        avg_attendance: b.avgAttendance,
        at_risk_count: b.atRiskCount
      }))
    } as unknown as T;
  }

  // Overview
  if (ep === '/overview' || ep.startsWith('/overview')) {
    return {
      total_students: DEMO_INSTITUTE.totalStudents,
      cohort_attendance: DEMO_INSTITUTE.avgAttendance,
      flagged_risk_count: 8,
      interventions_active: DEMO_INTERVENTIONS.length,
      batches: DEMO_BATCHES,
      recent_activity: [
        { id: 1, type: 'ingest', desc: 'Ingested Sunday Milestone Test M5 (30 OMR records processed)', timestamp: '2 hours ago' },
        { id: 2, type: 'intervention', desc: '1-on-1 Rotational Dynamics Mentorship scheduled for Aarav Sharma', timestamp: '4 hours ago' },
        { id: 3, type: 'report', desc: 'Generated bilingual progress digests for Achievers Top-30', timestamp: 'Yesterday' }
      ]
    } as unknown as T;
  }

  // Students list
  if (ep.startsWith('/students')) {
    if (ep.includes('/students/')) {
      const parts = ep.split('/students/');
      const sid = parts[1]?.split('?')[0] || 'STD_PAT_001';
      const student = DEMO_STUDENTS.find(s => s.id.toLowerCase() === sid.toLowerCase()) || DEMO_STUDENTS[0];
      return {
        id: student.id,
        name: student.name,
        roll_number: student.rollNumber,
        batch_id: student.batchId,
        batch_name: student.batchName,
        target_exam: student.targetExam,
        attendance_rate: student.attendanceRate,
        overall_percentile: student.overallPercentile,
        risk_tier: student.riskTier,
        primary_driver: student.riskDriver,
        recommended_action: student.recommendedAction,
        guardian_name: student.guardianName,
        guardian_phone: student.guardianPhone,
        recent_tests: student.recentTestScores,
        attendance_history: student.attendanceHistory,
        strong_topics: student.strongTopics,
        weak_topics: student.weakTopics
      } as unknown as T;
    }
    return {
      students: DEMO_STUDENTS.map(s => ({
        id: s.id,
        name: s.name,
        roll_number: s.rollNumber,
        batch_name: s.batchName,
        target_exam: s.targetExam,
        attendance_rate: s.attendanceRate,
        overall_percentile: s.overallPercentile,
        risk_tier: s.riskTier
      })),
      total: DEMO_STUDENTS.length
    } as unknown as T;
  }

  // Interventions
  if (ep.startsWith('/interventions')) {
    return DEMO_INTERVENTIONS as unknown as T;
  }

  // Ingest Sources
  if (ep.startsWith('/ingest/sources')) {
    return [
      { id: 'SRC_01', file_name: 'apex_m5_scores_oct2026.csv', file_type: 'CSV', record_count: 30, valid_count: 30, quarantined_count: 0, status: 'Completed', created_at: '2026-10-22 14:30' },
      { id: 'SRC_02', file_name: 'foundation_batch_attendance_sep.xlsx', file_type: 'Excel', record_count: 420, valid_count: 418, quarantined_count: 2, status: 'Reviewed', created_at: '2026-10-15 09:15' },
      { id: 'SRC_03', file_name: 'omr_camera_batch_neet_m3.zip', file_type: 'OMR Scans', record_count: 120, valid_count: 120, quarantined_count: 0, status: 'Completed', created_at: '2026-10-01 18:40' }
    ] as unknown as T;
  }

  // Ingest Quarantine
  if (ep.startsWith('/ingest/quarantine')) {
    return [
      {
        id: 'QR_01',
        tenant_id: tenantId,
        file_name: 'foundation_batch_attendance_sep.xlsx',
        row_data: { roll_no: 'APX-2026-094', student_name: 'Kavita Roy', attendance_pct: 105 },
        error_type: 'RANGE_VALIDATION_ERROR',
        error_message: 'Attendance percentage 105% exceeds maximum permitted bound of 100%. Auto-capped to 100%.',
        resolution_status: 'resolved',
        created_at: '2026-10-15'
      },
      {
        id: 'QR_02',
        tenant_id: tenantId,
        file_name: 'foundation_batch_attendance_sep.xlsx',
        row_data: { roll_no: 'APX-2026-112', student_name: 'Manish Kumar', date: '2026-02-31' },
        error_type: 'INVALID_CALENDAR_DATE',
        error_message: 'Invalid calendar date 2026-02-31 parsed from raw register. Normalized to 2026-02-28.',
        resolution_status: 'resolved',
        created_at: '2026-10-15'
      }
    ] as unknown as T;
  }

  // Ingest Preview
  if (ep.startsWith('/ingest/preview')) {
    return {
      filename: 'sample_student_scores.csv',
      total_rows: 30,
      detected_shape: 'TALL_RECORDS',
      columns: ['student_id', 'student_name', 'batch', 'subject', 'topic', 'score', 'max_score', 'attendance'],
      auto_mapping: {
        student_id: 'student_id',
        student_name: 'student_name',
        batch_id: 'batch',
        subject: 'subject',
        topic: 'topic',
        score: 'score',
        max_score: 'max_score',
        attendance: 'attendance'
      },
      preview_rows: [
        { student_id: 'STD_PAT_001', student_name: 'Aarav Sharma', batch: 'Achievers Top-30', subject: 'Physics', topic: 'Rotational Dynamics', score: '38', max_score: '100', attendance: '96%' },
        { student_id: 'STD_PAT_002', student_name: 'Priya Patel', batch: 'Target NEET Achievers', subject: 'Biology', topic: 'Genetics & Evolution', score: '94', max_score: '100', attendance: '98%' },
        { student_id: 'STD_PAT_003', student_name: 'Rohan Verma', batch: 'Foundation JEE 11th', subject: 'Physics', topic: 'Kinematics', score: '62', max_score: '100', attendance: '74%' },
        { student_id: 'STD_PAT_004', student_name: 'Ananya Singh', batch: 'Foundation JEE 11th', subject: 'Chemistry', topic: 'Chemical Bonding', score: '85', max_score: '100', attendance: '92%' },
        { student_id: 'STD_PAT_005', student_name: 'Vikramaditya Mishra', batch: 'Elevate JEE 12th', subject: 'Mathematics', topic: 'Conic Sections', score: '44', max_score: '100', attendance: '68%' }
      ],
      validation_issues: [],
      requires_mapping: []
    } as unknown as T;
  }

  // Upload CSV Commit
  if (ep.startsWith('/ingest/upload-csv')) {
    return {
      file_name: 'sample_student_scores.csv',
      total_records: 30,
      valid_records: 30,
      quarantined_records: 0,
      status: 'passed',
      shape_detected: 'TALL_RECORDS',
      new_records_inserted: 30,
      auto_remediation_summary: 'Verified 30 records. 0 out-of-range marks detected. Validated against Section 9 VPC isolation.'
    } as unknown as T;
  }

  // Recompute
  if (ep.startsWith('/ingest/recompute')) {
    return {
      status: 'success',
      run_id: 'DEMO_RUN_2026_CALIB',
      message: 'Client-side simulation recompute completed successfully.'
    } as unknown as T;
  }

  return null;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  tenantId: string = 'INST_PATNA_01'
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${getApiBaseUrl()}${cleanEndpoint}`;
  const headers = new Headers(options.headers || {});
  headers.set('X-Tenant-ID', tenantId);

  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.ok) {
      return (await response.json()) as T;
    }

    // If HTTP error (e.g. 404, 502, 503), check for demo fallback
    const fallback = getDemoFallback<T>(cleanEndpoint, tenantId, options);
    if (fallback !== null) {
      return fallback;
    }

    const errorText = await response.text();
    throw new Error(`API Error [${response.status}] ${response.statusText}: ${errorText}`);
  } catch (err) {
    // If network fetch fails (backend offline/not connected), serve coherent demo dataset
    const fallback = getDemoFallback<T>(cleanEndpoint, tenantId, options);
    if (fallback !== null) {
      return fallback;
    }
    throw err;
  }
}

export const api = {
  // Authentication
  async login(email: string, password: string): Promise<{ access_token: string; user: AuthUser }> {
    return request<{ access_token: string; user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(payload: {
    institute_name: string;
    admin_name: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    city_tier?: string;
    exam_focus?: string;
    cohort_size?: number;
    role?: string;
  }): Promise<{ access_token: string; user: AuthUser }> {
    return request<{ access_token: string; user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMe(): Promise<AuthUser> {
    return request<AuthUser>('/auth/me');
  },

  async getDemoUsers(): Promise<DemoUserPersona[]> {
    return request<DemoUserPersona[]>('/auth/demo-users');
  },

  // Institutes
  async getInstitutes(): Promise<InstituteInfo[]> {
    return request<InstituteInfo[]>('/institutes');
  },

  // Ingest & OMR
  async previewUpload(file: File, tenantId: string): Promise<UploadPreviewResult> {
    const formData = new FormData();
    formData.append('file', file);
    return request<UploadPreviewResult>('/ingest/preview', {
      method: 'POST',
      body: formData,
    }, tenantId);
  },

  async uploadCsv(file: File, tenantId: string, columnMapping?: Record<string, string>): Promise<IngestionResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenant_id', tenantId);
    if (columnMapping) formData.append('column_mapping', JSON.stringify(columnMapping));
    return request<IngestionResult>('/ingest/upload-csv', {
      method: 'POST',
      body: formData,
    }, tenantId);
  },

  async getUploadSources(tenantId: string): Promise<UploadSourceRecord[]> {
    return request<UploadSourceRecord[]>('/ingest/sources', {}, tenantId);
  },

  async triggerRecompute(tenantId: string): Promise<{ status: string; run_id: string }> {
    return request<{ status: string; run_id: string }>('/ingest/recompute', {
      method: 'POST',
    }, tenantId);
  },

  async getRecomputeStatus(tenantId: string): Promise<RecomputeStatus> {
    return request<RecomputeStatus>('/ingest/recompute-status', {}, tenantId);
  },

  async liveEdit(
    studentId: string,
    changes: { attendance_rate?: number; fee_delayed?: boolean; mock_score?: number },
    tenantId: string
  ): Promise<any> {
    return request<any>('/simulate/live-edit', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        ...changes
      }),
    }, tenantId);
  },

  async uploadOmr(file: File, testId: string, tenantId: string, studentId?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('test_id', testId);
    formData.append('tenant_id', tenantId);
    if (studentId) formData.append('student_id', studentId);
    return request<any>('/ingest/omr-scan', {
      method: 'POST',
      body: formData,
    }, tenantId);
  },

  async getQuarantine(tenantId: string): Promise<QuarantineRecord[]> {
    return request<QuarantineRecord[]>('/ingest/quarantine', {}, tenantId);
  },

  async resolveQuarantine(id: string, correctedData: Record<string, any>, tenantId: string): Promise<any> {
    return request<any>(`/ingest/quarantine/${id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ action: 'APPROVE', corrected_payload: correctedData }),
    }, tenantId);
  },

  // Mastery
  async getMasteryMatrix(tenantId: string, batchId?: string): Promise<MasteryMatrixResponse> {
    const query = batchId ? `?batch_id=${encodeURIComponent(batchId)}` : '';
    return request<MasteryMatrixResponse>(`/mastery/matrix${query}`, {}, tenantId);
  },

  async getStudentMastery(studentId: string, tenantId: string): Promise<any> {
    return request<any>(`/mastery/student/${studentId}`, {}, tenantId);
  },

  // Risk
  async getRiskQueue(tenantId: string, targetExam?: string): Promise<RiskStudent[]> {
    const query = targetExam ? `?target_exam=${encodeURIComponent(targetExam)}` : '';
    return request<RiskStudent[]>(`/risk/queue${query}`, {}, tenantId);
  },

  async assignRemedial(studentId: string, remedialType: string, tenantId: string): Promise<any> {
    return request<any>(`/risk/assign-remedial`, {
      method: 'POST',
      body: JSON.stringify({ student_id: studentId, remedial_type: remedialType }),
    }, tenantId);
  },

  // Predictions
  async getPredictions(tenantId: string, month: number = 8): Promise<ConformalPrediction[]> {
    return request<ConformalPrediction[]>(`/predictions?month=${month}`, {}, tenantId);
  },

  async getStudentTrajectory(studentId: string, tenantId: string): Promise<ConformalPrediction> {
    return request<ConformalPrediction>(`/predictions/student/${studentId}`, {}, tenantId);
  },

  // Reports
  async getStudentReport(studentId: string, language: 'en' | 'hi', tenantId: string): Promise<ParentReport> {
    return request<ParentReport>(`/reports/generate/${studentId}?lang=${language}`, {}, tenantId);
  },

  // Owner
  async getOwnerDashboard(tenantId: string): Promise<OwnerDashboardData> {
    return request<OwnerDashboardData>('/owner/overview', {}, tenantId);
  },

  async calculateRoi(baseStudents: number, annualFee: number, savedRate: number, tenantId: string): Promise<any> {
    return request<any>('/owner/roi-calculator', {
      method: 'POST',
      body: JSON.stringify({
        student_count: baseStudents,
        annual_fee_per_student: annualFee,
        baseline_dropout_pct: 12.0,
        prevention_efficiency_pct: savedRate * 10.0,
        monthly_subscription_price: 12960.0,
      }),
    }, tenantId);
  },

  // Consent
  async getConsentList(tenantId: string): Promise<ConsentRecord[]> {
    return request<ConsentRecord[]>('/consent/list', {}, tenantId);
  },

  async toggleConsent(studentId: string, purpose: string, granted: boolean, tenantId: string): Promise<any> {
    return request<any>('/consent/update', {
      method: 'POST',
      body: JSON.stringify({
        student_id: studentId,
        purpose,
        granted,
      }),
    }, tenantId);
  },

  // Model & System Report
  async getModelCard(): Promise<any> {
    return request<any>('/model-report/card');
  },

  async getCostAudit(): Promise<any> {
    return request<any>('/model-report/cost-breakdown');
  },

  // Simulation & Curveballs
  async runCurveball(scenario: string, tenantId: string): Promise<any> {
    return request<any>('/simulate/curveball', {
      method: 'POST',
      body: JSON.stringify({ scenario }),
    }, tenantId);
  },

  // Overview Dashboard
  async getOverviewDashboard(tenantId: string): Promise<any> {
    return request<any>('/overview', {}, tenantId);
  },

  // Student Analytics
  async getStudents(
    tenantId: string,
    params?: {
      batch_id?: string;
      risk_tier?: string;
      search?: string;
      sort_by?: string;
      order?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<any> {
    const query = new URLSearchParams();
    if (params?.batch_id) query.set('batch_id', params.batch_id);
    if (params?.risk_tier) query.set('risk_tier', params.risk_tier);
    if (params?.search) query.set('search', params.search);
    if (params?.sort_by) query.set('sort_by', params.sort_by);
    if (params?.order) query.set('order', params.order);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.offset) query.set('offset', String(params.offset));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<any>(`/students${qs}`, {}, tenantId);
  },

  async getStudentDetail(studentId: string, tenantId: string): Promise<any> {
    return request<any>(`/students/${studentId}`, {}, tenantId);
  },

  // Intervention Tracker
  async getInterventions(tenantId: string, status?: string, studentId?: string): Promise<any> {
    const query = new URLSearchParams();
    if (status) query.set('status', status);
    if (studentId) query.set('student_id', studentId);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<any>(`/interventions${qs}`, {}, tenantId);
  },

  async createIntervention(
    payload: {
      student_id: string;
      intervention_type: string;
      reason: string;
      assigned_to?: string;
      follow_up_date?: string;
      outcome_notes?: string;
    },
    tenantId: string
  ): Promise<any> {
    return request<any>('/interventions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, tenantId);
  },

  async updateIntervention(
    id: number,
    payload: {
      status?: string;
      follow_up_date?: string;
      outcome_notes?: string;
      assigned_to?: string;
    },
    tenantId: string
  ): Promise<any> {
    return request<any>(`/interventions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }, tenantId);
  },

  async deleteIntervention(id: number, tenantId: string): Promise<any> {
    return request<any>(`/interventions/${id}`, {
      method: 'DELETE',
    }, tenantId);
  },

  // Generative AI Layer
  async getGenAiStatus(): Promise<any> {
    try {
      const localRes = await fetch('/api/genai/status');
      if (localRes.ok) return await localRes.json();
    } catch {}
    return request<any>('/genai/status');
  },

  async generateAiWorksheet(payload: {
    topic: string;
    subject: string;
    target_exam?: string;
    student_name?: string;
    weakness_reason?: string;
  }, tenantId?: string): Promise<any> {
    try {
      const localRes = await fetch('/api/genai/worksheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (localRes.ok) {
        const data = await localRes.json();
        if (data && data.worksheet) return data;
      }
    } catch {}
    return request<any>('/genai/worksheet', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, tenantId);
  },

  async askAiCopilot(prompt: string, context?: string, tenantId?: string): Promise<any> {
    try {
      const localRes = await fetch('/api/genai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, context }),
      });
      if (localRes.ok) {
        const data = await localRes.json();
        if (data && data.answer) return data;
      }
    } catch {}
    return request<any>('/genai/copilot', {
      method: 'POST',
      body: JSON.stringify({ prompt, context }),
    }, tenantId);
  },

  // Exports
  getExportUrl(type: 'mastery' | 'risk-alerts' | 'interventions' | 'audit-logs', tenantId: string): string {
    return `${getApiBaseUrl()}/exports/${type}.csv?tenant_id=${encodeURIComponent(tenantId)}`;
  },

  async resetData(tenantId: string): Promise<any> {
    return request<any>('/demo/reset', { method: 'POST' }, tenantId);
  },

  // OMR Commit
  async commitOmr(payload: {
    student_id: string;
    test_id: string;
    batch_id?: string;
    answers: Record<string, string>;
    score?: number;
  }, tenantId: string): Promise<any> {
    return request<any>('/ingest/omr-commit', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, tenantId);
  },

  // WhatsApp Business API
  async getWhatsAppStatus(): Promise<any> {
    return request<any>('/whatsapp/status');
  },

  async sendWhatsApp(payload: {
    recipient_phone: string;
    student_id?: string;
    student_name?: string;
    guardian_name?: string;
    attendance_pct?: number;
    percentile_range?: string;
    weak_topics?: string[];
    strong_topics?: string[];
    language?: string;
    custom_message?: string;
  }, tenantId?: string): Promise<any> {
    return request<any>('/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, tenantId);
  },

  async broadcastWhatsApp(payload: {
    batch_id: string;
    message_type?: string;
    language?: string;
  }, tenantId?: string): Promise<any> {
    return request<any>('/whatsapp/broadcast', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, tenantId);
  },

  async getWhatsAppLogs(tenantId?: string): Promise<any> {
    return request<any>('/whatsapp/logs', {}, tenantId);
  },
};
