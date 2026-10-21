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
} from './types';

const RAW_API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const API_BASE = RAW_API_BASE.replace(/\/+$/, '');

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
  const url = `${API_BASE}${cleanEndpoint}`;
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
  async uploadCsv(file: File, tenantId: string): Promise<IngestionResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenant_id', tenantId);
    return request<IngestionResult>('/ingest/upload-csv', {
      method: 'POST',
      body: formData,
    }, tenantId);
  },

  async uploadOmr(file: File, testId: string, tenantId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('test_id', testId);
    formData.append('tenant_id', tenantId);
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

  async resetData(tenantId: string): Promise<any> {
    return request<any>('/demo/reset', { method: 'POST' }, tenantId);
  },
};
