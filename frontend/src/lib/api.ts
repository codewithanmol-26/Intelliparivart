import {
  IngestionResult,
  QuarantineRecord,
  MasteryMatrixResponse,
  RiskStudent,
  ConformalPrediction,
  ParentReport,
  OwnerDashboardData,
  ConsentRecord,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  tenantId: string = 'INST001'
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});
  headers.set('X-Tenant-ID', tenantId);
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
  // Ingest & OMR
  async uploadCsv(file: File, tenantId: string): Promise<IngestionResult> {
    const formData = new FormData();
    formData.append('file', file);
    return request<IngestionResult>('/ingest/upload-csv', {
      method: 'POST',
      body: formData,
    }, tenantId);
  },

  async uploadOmr(file: File, testId: string, tenantId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('test_id', testId);
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
      body: JSON.stringify({ corrected_data: correctedData }),
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
        base_students: baseStudents,
        annual_fee: annualFee,
        saved_rate: savedRate,
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
