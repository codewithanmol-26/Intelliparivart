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

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error [${response.status}] ${response.statusText}: ${errorText}`);
  }

  return response.json();
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
    return request<any>('/genai/status');
  },

  async generateAiWorksheet(payload: {
    topic: string;
    subject: string;
    target_exam?: string;
    student_name?: string;
    weakness_reason?: string;
  }, tenantId?: string): Promise<any> {
    return request<any>('/genai/worksheet', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, tenantId);
  },

  async askAiCopilot(prompt: string, context?: string, tenantId?: string): Promise<any> {
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
