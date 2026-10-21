export type UserRole = 'owner' | 'teacher' | 'student' | 'parent';

export interface TenantContext {
  tenantId: string;
  role: UserRole;
  selectedStudentId?: string;
  selectedBatchId?: string;
}

export interface IngestionResult {
  file_name: string;
  total_records: number;
  valid_records: number;
  quarantined_records: number;
  status: 'passed' | 'review_required';
  auto_remediation_summary: string;
}

export interface QuarantineRecord {
  id: string;
  tenant_id: string;
  file_name: string;
  row_data: Record<string, any>;
  error_type: string;
  error_message: string;
  resolution_status: 'unresolved' | 'resolved' | 'ignored';
  created_at: string;
}

export interface TopicMastery {
  topic_id: string;
  topic_name: string;
  subject: string;
  bkt_mastery_prob: number;
  irt_theta_mean: number;
  raw_percent_mean: number;
  sample_size: number;
  uncertainty: number;
  status: 'Mastered' | 'In Progress' | 'Struggling' | 'Low Practice';
}

export interface MasteryMatrixResponse {
  tenant_id: string;
  batch_id?: string;
  topics: TopicMastery[];
}

export interface RiskStudent {
  student_id: string;
  full_name: string;
  batch_name: string;
  target_exam: string;
  predicted_risk_proba: number;
  risk_band: 'High' | 'Medium' | 'Low';
  primary_driver: string;
  recommended_remedial: string;
  attendance_rate: number;
  bkt_mastery_avg: number;
  consecutive_slump_tests: number;
  fee_payment_lag_days: number;
}

export interface ConformalPrediction {
  student_id: string;
  full_name: string;
  target_exam: string;
  current_month: number;
  p10: number;
  p50: number;
  p90: number;
  interval_width: number;
  is_intervened: boolean;
  history: Array<{
    month: number;
    p10: number;
    p50: number;
    p90: number;
  }>;
}

export interface ParentReport {
  student_id: string;
  student_name: string;
  batch_name: string;
  target_exam: string;
  language: 'en' | 'hi';
  generated_at: string;
  report_digest: string;
  facts_cited: {
    tests_completed: number;
    recent_trend: string;
    strengths: string[];
    priority_revisions: string[];
    attendance_rate: string;
  };
  audit_status: 'passed' | 'blocked';
  audit_violations: string[];
  tone_check: string;
}

export interface OwnerDashboardData {
  tenant_id: string;
  institute_name: string;
  total_enrolled: number;
  active_students: number;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  retention_rate_pct: number;
  estimated_dropout_loss_inr: number;
  remedials_active: number;
  batches: Array<{
    batch_id: string;
    name: string;
    target_exam: string;
    student_count: number;
    avg_mastery: number;
    high_risk_count: number;
  }>;
  financial_roi: {
    base_students: number;
    annual_fee_per_student: number;
    retention_without_platform_pct: number;
    retention_with_platform_pct: number;
    students_saved: number;
    annual_revenue_protected: number;
    platform_annual_cost: number;
    net_roi_ratio: number;
  };
}

export interface ConsentRecord {
  id: string;
  tenant_id: string;
  student_id: string;
  guardian_phone: string;
  consent_purpose: string;
  is_granted: boolean;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  tenant_id: string;
  institute_name?: string;
  student_id?: string;
}

export interface DemoUserPersona {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: UserRole;
  tenant_id: string;
  institute_name: string;
  description: string;
  student_id?: string;
}

export interface InstituteInfo {
  id: string;
  name: string;
  city: string;
  city_tier?: string;
  exam_focus?: string;
  annual_fee_per_student?: number;
}
