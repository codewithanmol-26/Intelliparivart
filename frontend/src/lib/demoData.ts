/**
 * INTELLIPRIVART SYNTHETIC DEMONSTRATION DATASET
 * Realistic, coherent benchmark dataset for Indian JEE & NEET Coaching Institutes.
 * 
 * Target Institute: Apex JEE & Medical Academy, Patna (Bihar)
 * Cohort: 1,200 Students across 3 Core Batches:
 *   1. Achievers JEE Advanced Top-30 (12th Grade)
 *   2. Foundation JEE Main & Advanced (11th Grade)
 *   3. Target NEET Achievers (12th / Droppers)
 * 
 * Designed for frontend demonstration with honest "Demo Mode - Sample Data" labeling.
 */

export interface DemoInstitute {
  id: string;
  name: string;
  city: string;
  state: string;
  totalStudents: number;
  batchesCount: number;
  avgAttendance: number;
  retentionRate: number;
  established: number;
  branches: string[];
}

export interface DemoBatch {
  id: string;
  name: string;
  targetExam: 'JEE Advanced' | 'JEE Main' | 'NEET';
  grade: string;
  studentCount: number;
  avgScore: number;
  avgAttendance: number;
  atRiskCount: number;
  leadFaculty: string;
  primarySubject: string;
}

export interface DemoStudent {
  id: string;
  name: string;
  rollNumber: string;
  batchId: string;
  batchName: string;
  targetExam: 'JEE Advanced' | 'JEE Main' | 'NEET';
  attendanceRate: number;
  overallPercentile: number;
  predictedPercentileMin: number;
  predictedPercentileMax: number;
  riskTier: 'Low' | 'Medium' | 'High';
  riskDriver?: string;
  recommendedAction?: string;
  strongTopics: string[];
  weakTopics: string[];
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  recentTestScores: Array<{
    testName: string;
    date: string;
    score: number;
    maxScore: number;
    percentile: number;
    subject: string;
  }>;
  attendanceHistory: Array<{
    month: string;
    rate: number;
    classesHeld: number;
    classesAttended: number;
  }>;
}

export interface DemoTopicMastery {
  topicId: string;
  topicName: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics' | 'Biology';
  bktMasteryProb: number; // 0 to 1
  irtThetaMean: number; // -3 to +3
  rawPercentMean: number; // 0 to 100
  sampleSize: number;
  uncertainty: number; // 0 to 1
  status: 'Mastered' | 'In Progress' | 'Struggling' | 'Low Practice';
  commonMisconception: string;
}

export interface DemoIntervention {
  id: string;
  studentId: string;
  studentName: string;
  batchName: string;
  interventionType: string;
  subject: string;
  topic: string;
  assignedFaculty: string;
  scheduledDate: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Pending Review';
  notes: string;
  outcomeMetric?: string;
}

// ------------------------------------------------------------------------------
// Institute Profile
// ------------------------------------------------------------------------------
export const DEMO_INSTITUTE: DemoInstitute = {
  id: 'INST_PATNA_01',
  name: 'Apex JEE & Medical Academy',
  city: 'Patna',
  state: 'Bihar',
  totalStudents: 1200,
  batchesCount: 14,
  avgAttendance: 88.6,
  retentionRate: 94.3,
  established: 2017,
  branches: ['Boring Road (Main)', 'Kankarbagh', 'Bailey Road']
};

// ------------------------------------------------------------------------------
// Batches
// ------------------------------------------------------------------------------
export const DEMO_BATCHES: DemoBatch[] = [
  {
    id: 'BATCH_TOP30',
    name: 'Achievers JEE Advanced Top-30',
    targetExam: 'JEE Advanced',
    grade: '12th Grade',
    studentCount: 30,
    avgScore: 78.4,
    avgAttendance: 93.2,
    atRiskCount: 2,
    leadFaculty: 'Er. R. K. Verma (Physics)',
    primarySubject: 'Physics & Advanced Mathematics'
  },
  {
    id: 'BATCH_FND11',
    name: 'Foundation JEE Main & Adv',
    targetExam: 'JEE Main',
    grade: '11th Grade',
    studentCount: 420,
    avgScore: 64.8,
    avgAttendance: 86.5,
    atRiskCount: 18,
    leadFaculty: 'Dr. Anand Kumar (Mathematics)',
    primarySubject: 'PCM Integrated'
  },
  {
    id: 'BATCH_NEET12',
    name: 'Target NEET Achievers',
    targetExam: 'NEET',
    grade: '12th / Droppers',
    studentCount: 380,
    avgScore: 71.2,
    avgAttendance: 89.1,
    atRiskCount: 14,
    leadFaculty: 'Dr. Sunita Sahay (Biology)',
    primarySubject: 'PCB Integrated'
  },
  {
    id: 'BATCH_ELEV12',
    name: 'Elevate JEE 12th Batch B',
    targetExam: 'JEE Main',
    grade: '12th Grade',
    studentCount: 370,
    avgScore: 61.5,
    avgAttendance: 85.8,
    atRiskCount: 22,
    leadFaculty: 'Prof. S. N. Sinha (Chemistry)',
    primarySubject: 'PCM Regular'
  }
];

// ------------------------------------------------------------------------------
// Consistent Sample Students
// ------------------------------------------------------------------------------
export const DEMO_STUDENTS: DemoStudent[] = [
  {
    id: 'STD_PAT_001',
    name: 'Aarav Sharma',
    rollNumber: 'APX-2026-001',
    batchId: 'BATCH_TOP30',
    batchName: 'Achievers JEE Advanced Top-30',
    targetExam: 'JEE Advanced',
    attendanceRate: 91.5,
    overallPercentile: 94.2,
    predictedPercentileMin: 91.0,
    predictedPercentileMax: 96.5,
    riskTier: 'Medium',
    riskDriver: 'Concept friction in Rotational Dynamics & 8% attendance dip in Month 3',
    recommendedAction: 'Schedule 15-minute 1-on-1 torque equilibrium drill with Er. R. K. Verma',
    strongTopics: ['Kinematics', 'Chemical Bonding', 'Calculus (Limits & Derivatives)', 'Atomic Structure'],
    weakTopics: ['Rotational Dynamics', 'Coordinate Geometry (Conics)', 'Ionic Equilibrium'],
    guardianName: 'Mr. Rajesh Sharma',
    guardianRelation: 'Father',
    guardianPhone: '+91 98350 XXXXX',
    recentTestScores: [
      { testName: 'Milestone Test M1 (Mechanics 1)', date: '2026-06-15', score: 142, maxScore: 180, percentile: 96.2, subject: 'Physics' },
      { testName: 'Milestone Test M2 (Physical Chem)', date: '2026-07-20', score: 138, maxScore: 180, percentile: 94.0, subject: 'Chemistry' },
      { testName: 'Milestone Test M3 (Rotational Slump)', date: '2026-08-25', score: 104, maxScore: 180, percentile: 86.4, subject: 'Physics' },
      { testName: 'Milestone Test M4 (Integral Calculus)', date: '2026-09-30', score: 132, maxScore: 180, percentile: 92.1, subject: 'Mathematics' },
      { testName: 'Milestone Test M5 (Full Mock 1)', date: '2026-10-18', score: 218, maxScore: 300, percentile: 94.5, subject: 'PCM Combined' }
    ],
    attendanceHistory: [
      { month: 'Jun 2026', rate: 96.0, classesHeld: 25, classesAttended: 24 },
      { month: 'Jul 2026', rate: 92.0, classesHeld: 26, classesAttended: 24 },
      { month: 'Aug 2026', rate: 84.6, classesHeld: 26, classesAttended: 22 },
      { month: 'Sep 2026', rate: 92.3, classesHeld: 26, classesAttended: 24 },
      { month: 'Oct 2026', rate: 95.8, classesHeld: 24, classesAttended: 23 }
    ]
  },
  {
    id: 'STD_PAT_002',
    name: 'Priya Patel',
    rollNumber: 'APX-2026-002',
    batchId: 'BATCH_NEET12',
    batchName: 'Target NEET Achievers',
    targetExam: 'NEET',
    attendanceRate: 96.2,
    overallPercentile: 97.4,
    predictedPercentileMin: 95.0,
    predictedPercentileMax: 98.8,
    riskTier: 'Low',
    strongTopics: ['Human Physiology', 'Genetics & Evolution', 'Coordination Compounds', 'Ray Optics'],
    weakTopics: ['Electromagnetism', 'Organic Synthesis Pathways'],
    guardianName: 'Dr. Manoj Patel',
    guardianRelation: 'Father',
    guardianPhone: '+91 94310 XXXXX',
    recentTestScores: [
      { testName: 'NEET Mock 1 (Biology Core)', date: '2026-06-18', score: 342, maxScore: 360, percentile: 98.5, subject: 'Biology' },
      { testName: 'NEET Mock 2 (Chem & Physics)', date: '2026-07-25', score: 310, maxScore: 360, percentile: 96.2, subject: 'PC' },
      { testName: 'NEET Milestone 3 (Full 720)', date: '2026-08-28', score: 648, maxScore: 720, percentile: 97.8, subject: 'PCB' },
      { testName: 'NEET Milestone 4 (Full 720)', date: '2026-10-12', score: 654, maxScore: 720, percentile: 98.1, subject: 'PCB' }
    ],
    attendanceHistory: [
      { month: 'Jun 2026', rate: 98.0, classesHeld: 25, classesAttended: 24 },
      { month: 'Jul 2026', rate: 96.0, classesHeld: 26, classesAttended: 25 },
      { month: 'Aug 2026', rate: 96.0, classesHeld: 26, classesAttended: 25 },
      { month: 'Sep 2026', rate: 96.0, classesHeld: 26, classesAttended: 25 },
      { month: 'Oct 2026', rate: 95.0, classesHeld: 24, classesAttended: 23 }
    ]
  },
  {
    id: 'STD_PAT_003',
    name: 'Rohan Verma',
    rollNumber: 'APX-2026-003',
    batchId: 'BATCH_TOP30',
    batchName: 'Achievers JEE Advanced Top-30',
    targetExam: 'JEE Advanced',
    attendanceRate: 78.4,
    overallPercentile: 76.5,
    predictedPercentileMin: 70.0,
    predictedPercentileMax: 82.5,
    riskTier: 'High',
    riskDriver: 'Consecutive score decline across 3 milestone tests & fee payment delay of 14 days',
    recommendedAction: 'Parent advisory meeting regarding hostel commute fatigue; assign peer study partner',
    strongTopics: ['Algebra', 'Organic Reaction Basics'],
    weakTopics: ['Rotational Dynamics', 'Integral Calculus', 'Thermodynamics'],
    guardianName: 'Mrs. Kanti Verma',
    guardianRelation: 'Mother',
    guardianPhone: '+91 97090 XXXXX',
    recentTestScores: [
      { testName: 'Milestone Test M1', date: '2026-06-15', score: 128, maxScore: 180, percentile: 88.0, subject: 'Physics' },
      { testName: 'Milestone Test M2', date: '2026-07-20', score: 112, maxScore: 180, percentile: 81.5, subject: 'Chemistry' },
      { testName: 'Milestone Test M3', date: '2026-08-25', score: 86, maxScore: 180, percentile: 71.0, subject: 'Physics' },
      { testName: 'Milestone Test M4', date: '2026-09-30', score: 92, maxScore: 180, percentile: 74.2, subject: 'Mathematics' }
    ],
    attendanceHistory: [
      { month: 'Jun 2026', rate: 90.0, classesHeld: 25, classesAttended: 22 },
      { month: 'Jul 2026', rate: 84.6, classesHeld: 26, classesAttended: 22 },
      { month: 'Aug 2026', rate: 73.0, classesHeld: 26, classesAttended: 19 },
      { month: 'Sep 2026', rate: 76.9, classesHeld: 26, classesAttended: 20 },
      { month: 'Oct 2026', rate: 83.3, classesHeld: 24, classesAttended: 20 }
    ]
  },
  {
    id: 'STD_PAT_004',
    name: 'Ananya Singh',
    rollNumber: 'APX-2026-004',
    batchId: 'BATCH_FND11',
    batchName: 'Foundation JEE Main & Adv',
    targetExam: 'JEE Main',
    attendanceRate: 94.0,
    overallPercentile: 89.2,
    predictedPercentileMin: 86.0,
    predictedPercentileMax: 92.5,
    riskTier: 'Low',
    strongTopics: ['Straight Lines', 'Trigonometry', 'Vectors', 'Periodic Table'],
    weakTopics: ['Newtonian Friction', 'Chemical Equilibrium'],
    guardianName: 'Mr. Arvind Singh',
    guardianRelation: 'Father',
    guardianPhone: '+91 93040 XXXXX',
    recentTestScores: [
      { testName: 'Foundation Mock 1', date: '2026-06-22', score: 156, maxScore: 200, percentile: 87.5, subject: 'PCM' },
      { testName: 'Foundation Mock 2', date: '2026-08-10', score: 168, maxScore: 200, percentile: 90.1, subject: 'PCM' },
      { testName: 'Foundation Mock 3', date: '2026-10-05', score: 172, maxScore: 200, percentile: 91.4, subject: 'PCM' }
    ],
    attendanceHistory: [
      { month: 'Jun 2026', rate: 96.0, classesHeld: 25, classesAttended: 24 },
      { month: 'Jul 2026', rate: 92.3, classesHeld: 26, classesAttended: 24 },
      { month: 'Aug 2026', rate: 96.0, classesHeld: 26, classesAttended: 25 },
      { month: 'Sep 2026', rate: 92.3, classesHeld: 26, classesAttended: 24 },
      { month: 'Oct 2026', rate: 95.8, classesHeld: 24, classesAttended: 23 }
    ]
  },
  {
    id: 'STD_PAT_005',
    name: 'Vikramaditya Mishra',
    rollNumber: 'APX-2026-005',
    batchId: 'BATCH_TOP30',
    batchName: 'Achievers JEE Advanced Top-30',
    targetExam: 'JEE Advanced',
    attendanceRate: 82.1,
    overallPercentile: 81.0,
    predictedPercentileMin: 76.0,
    predictedPercentileMax: 85.5,
    riskTier: 'Medium',
    riskDriver: 'High calculation fatigue in 3-hour tests, resulting in negative marking surge',
    recommendedAction: 'Practice time-budgeting: enforce 60-second rule on ambiguous questions',
    strongTopics: ['Modern Physics', 'Electrochemistry', 'Differential Equations'],
    weakTopics: ['Conic Sections', 'Rotational Dynamics'],
    guardianName: 'Mr. Alok Mishra',
    guardianRelation: 'Father',
    guardianPhone: '+91 98352 XXXXX',
    recentTestScores: [
      { testName: 'Milestone Test M1', date: '2026-06-15', score: 134, maxScore: 180, percentile: 91.0, subject: 'Physics' },
      { testName: 'Milestone Test M2', date: '2026-07-20', score: 124, maxScore: 180, percentile: 85.0, subject: 'Chemistry' },
      { testName: 'Milestone Test M3', date: '2026-08-25', score: 98, maxScore: 180, percentile: 79.5, subject: 'Physics' },
      { testName: 'Milestone Test M4', date: '2026-09-30', score: 110, maxScore: 180, percentile: 82.0, subject: 'Mathematics' }
    ],
    attendanceHistory: [
      { month: 'Jun 2026', rate: 88.0, classesHeld: 25, classesAttended: 22 },
      { month: 'Jul 2026', rate: 84.6, classesHeld: 26, classesAttended: 22 },
      { month: 'Aug 2026', rate: 80.7, classesHeld: 26, classesAttended: 21 },
      { month: 'Sep 2026', rate: 76.9, classesHeld: 26, classesAttended: 20 },
      { month: 'Oct 2026', rate: 83.3, classesHeld: 24, classesAttended: 20 }
    ]
  },
  {
    id: 'STD_PAT_006',
    name: 'Sneha Gupta',
    rollNumber: 'APX-2026-006',
    batchId: 'BATCH_NEET12',
    batchName: 'Target NEET Achievers',
    targetExam: 'NEET',
    attendanceRate: 74.2,
    overallPercentile: 71.8,
    predictedPercentileMin: 65.0,
    predictedPercentileMax: 78.0,
    riskTier: 'High',
    riskDriver: 'Attendance fallen below 75% threshold in Month 4, risk of test disqualification',
    recommendedAction: 'Send compassionate non-punitive guardian SMS; schedule academic counseling',
    strongTopics: ['Plant Physiology', 'Ecology'],
    weakTopics: ['Physics Mechanics', 'Organic Reactions', 'Biomolecules'],
    guardianName: 'Mrs. Rekha Gupta',
    guardianRelation: 'Mother',
    guardianPhone: '+91 99340 XXXXX',
    recentTestScores: [
      { testName: 'NEET Mock 1', date: '2026-06-18', score: 280, maxScore: 360, percentile: 82.0, subject: 'Biology' },
      { testName: 'NEET Mock 2', date: '2026-07-25', score: 245, maxScore: 360, percentile: 74.0, subject: 'PC' },
      { testName: 'NEET Milestone 3', date: '2026-08-28', score: 480, maxScore: 720, percentile: 70.2, subject: 'PCB' }
    ],
    attendanceHistory: [
      { month: 'Jun 2026', rate: 88.0, classesHeld: 25, classesAttended: 22 },
      { month: 'Jul 2026', rate: 80.7, classesHeld: 26, classesAttended: 21 },
      { month: 'Aug 2026', rate: 69.2, classesHeld: 26, classesAttended: 18 },
      { month: 'Sep 2026', rate: 65.4, classesHeld: 26, classesAttended: 17 },
      { month: 'Oct 2026', rate: 75.0, classesHeld: 24, classesAttended: 18 }
    ]
  }
];

// ------------------------------------------------------------------------------
// Topic Mastery Matrix (Physics, Chemistry, Mathematics, Biology)
// ------------------------------------------------------------------------------
export const DEMO_TOPIC_MASTERY: DemoTopicMastery[] = [
  // Physics
  {
    topicId: 'PHY_ROT_01',
    topicName: 'Rotational Dynamics',
    subject: 'Physics',
    bktMasteryProb: 0.44,
    irtThetaMean: -0.42,
    rawPercentMean: 48.6,
    sampleSize: 420,
    uncertainty: 0.12,
    status: 'Struggling',
    commonMisconception: 'Confusing torque about center of mass with torque about instantaneous axis of rotation.'
  },
  {
    topicId: 'PHY_KIN_01',
    topicName: 'Kinematics & Vectors',
    subject: 'Physics',
    bktMasteryProb: 0.91,
    irtThetaMean: 1.24,
    rawPercentMean: 86.2,
    sampleSize: 1200,
    uncertainty: 0.05,
    status: 'Mastered',
    commonMisconception: 'Misidentifying frame of reference in relative velocity River-Boat problems.'
  },
  {
    topicId: 'PHY_NLM_01',
    topicName: 'Newton\'s Laws & Friction',
    subject: 'Physics',
    bktMasteryProb: 0.82,
    irtThetaMean: 0.78,
    rawPercentMean: 76.4,
    sampleSize: 1180,
    uncertainty: 0.07,
    status: 'In Progress',
    commonMisconception: 'Assuming static friction always equals mu * N rather than being bounded by it.'
  },
  {
    topicId: 'PHY_THM_01',
    topicName: 'Thermodynamics & KTG',
    subject: 'Physics',
    bktMasteryProb: 0.68,
    irtThetaMean: 0.22,
    rawPercentMean: 64.0,
    sampleSize: 840,
    uncertainty: 0.09,
    status: 'In Progress',
    commonMisconception: 'Sign conventions in First Law of Thermodynamics: work done BY gas vs ON gas.'
  },
  {
    topicId: 'PHY_ELC_01',
    topicName: 'Electrostatics & Gauss Law',
    subject: 'Physics',
    bktMasteryProb: 0.79,
    irtThetaMean: 0.65,
    rawPercentMean: 73.5,
    sampleSize: 760,
    uncertainty: 0.08,
    status: 'In Progress',
    commonMisconception: 'Evaluating electric flux through non-symmetric Gaussian surfaces.'
  },
  // Chemistry
  {
    topicId: 'CHM_ORG_01',
    topicName: 'Organic Reaction Mechanisms',
    subject: 'Chemistry',
    bktMasteryProb: 0.48,
    irtThetaMean: -0.35,
    rawPercentMean: 51.2,
    sampleSize: 780,
    uncertainty: 0.11,
    status: 'Struggling',
    commonMisconception: 'Rote memorization of named reagents without mapping electrophile/nucleophile arrows.'
  },
  {
    topicId: 'CHM_BND_01',
    topicName: 'Chemical Bonding & MOT',
    subject: 'Chemistry',
    bktMasteryProb: 0.85,
    irtThetaMean: 0.92,
    rawPercentMean: 81.0,
    sampleSize: 1150,
    uncertainty: 0.06,
    status: 'Mastered',
    commonMisconception: 'Applying Lewis structures without accounting for d-orbital expansion in period 3+.'
  },
  {
    topicId: 'CHM_EQM_01',
    topicName: 'Ionic & Chemical Equilibrium',
    subject: 'Chemistry',
    bktMasteryProb: 0.62,
    irtThetaMean: 0.10,
    rawPercentMean: 59.4,
    sampleSize: 890,
    uncertainty: 0.10,
    status: 'In Progress',
    commonMisconception: 'Buffer pH calculations when strong acid exceeds weak base buffer capacity.'
  },
  {
    topicId: 'CHM_COR_01',
    topicName: 'Coordination Compounds',
    subject: 'Chemistry',
    bktMasteryProb: 0.77,
    irtThetaMean: 0.58,
    rawPercentMean: 74.0,
    sampleSize: 720,
    uncertainty: 0.08,
    status: 'In Progress',
    commonMisconception: 'Confusing CFT crystal field splitting with valence bond hybridization geometry.'
  },
  // Mathematics
  {
    topicId: 'MTH_CON_01',
    topicName: 'Coordinate Geometry (Conics)',
    subject: 'Mathematics',
    bktMasteryProb: 0.46,
    irtThetaMean: -0.38,
    rawPercentMean: 49.5,
    sampleSize: 750,
    uncertainty: 0.11,
    status: 'Struggling',
    commonMisconception: 'Using Cartesian tangent forms instead of parametric coordinates for chord of contact.'
  },
  {
    topicId: 'MTH_INT_01',
    topicName: 'Definite & Indefinite Integrals',
    subject: 'Mathematics',
    bktMasteryProb: 0.54,
    irtThetaMean: -0.15,
    rawPercentMean: 56.0,
    sampleSize: 820,
    uncertainty: 0.10,
    status: 'Struggling',
    commonMisconception: 'Overlooking integrand symmetry and King\'s property before algebraic integration.'
  },
  {
    topicId: 'MTH_ALG_01',
    topicName: 'Matrices & Determinants',
    subject: 'Mathematics',
    bktMasteryProb: 0.88,
    irtThetaMean: 1.05,
    rawPercentMean: 84.8,
    sampleSize: 890,
    uncertainty: 0.06,
    status: 'Mastered',
    commonMisconception: 'Assuming matrix multiplication commutes: AB != BA in general.'
  },
  {
    topicId: 'MTH_CAL_01',
    topicName: 'Differential Calculus & Limits',
    subject: 'Mathematics',
    bktMasteryProb: 0.72,
    irtThetaMean: 0.45,
    rawPercentMean: 68.2,
    sampleSize: 860,
    uncertainty: 0.08,
    status: 'In Progress',
    commonMisconception: 'Applying L\'Hopital\'s rule when denominator limit is non-zero.'
  }
];

// ------------------------------------------------------------------------------
// Active Interventions
// ------------------------------------------------------------------------------
export const DEMO_INTERVENTIONS: DemoIntervention[] = [
  {
    id: 'INT_2026_01',
    studentId: 'STD_PAT_001',
    studentName: 'Aarav Sharma',
    batchName: 'Achievers Top-30',
    interventionType: '1-on-1 Faculty Mentorship',
    subject: 'Physics',
    topic: 'Rotational Dynamics',
    assignedFaculty: 'Er. R. K. Verma',
    scheduledDate: '2026-10-25',
    status: 'Scheduled',
    notes: 'Focus on instantaneous center of rotation and free-body diagram isolation.',
    outcomeMetric: 'Targeting +15% on M6 Physics score'
  },
  {
    id: 'INT_2026_02',
    studentId: 'STD_PAT_003',
    studentName: 'Rohan Verma',
    batchName: 'Achievers Top-30',
    interventionType: 'Guardian Advisory & Counseling',
    subject: 'General / Well-being',
    topic: 'Attendance Recovery & Burnout',
    assignedFaculty: 'Dr. S. K. Narayan (Director)',
    scheduledDate: '2026-10-24',
    status: 'In Progress',
    notes: 'Supportive non-punitive discussion regarding hostel commute and sleep hygiene.',
    outcomeMetric: 'Attendance target: >85% in Month 5'
  },
  {
    id: 'INT_2026_03',
    studentId: 'STD_PAT_005',
    studentName: 'Vikramaditya Mishra',
    batchName: 'Achievers Top-30',
    interventionType: 'Exam Strategy Micro-Drill',
    subject: 'Mathematics',
    topic: 'Negative Marking Mitigation',
    assignedFaculty: 'Dr. Anand Kumar',
    scheduledDate: '2026-10-26',
    status: 'Scheduled',
    notes: 'Teach 3-pass paper solving and enforce the 60-second skip heuristic.',
    outcomeMetric: 'Reduce negative marks from -16 to under -6'
  },
  {
    id: 'INT_2026_04',
    studentId: 'STD_PAT_006',
    studentName: 'Sneha Gupta',
    batchName: 'Target NEET Achievers',
    interventionType: 'Remedial Concept Module',
    subject: 'Physics',
    topic: 'Mechanics Catch-Up for NEET',
    assignedFaculty: 'Prof. K. P. Singh',
    scheduledDate: '2026-10-23',
    status: 'Completed',
    notes: 'Assigned 15-question NCERT-level foundational mechanics problem set.',
    outcomeMetric: 'Completed 14/15 correct in follow-up check'
  }
];

// ------------------------------------------------------------------------------
// Bilingual Parent Report Samples (Aarav Sharma)
// ------------------------------------------------------------------------------
export const DEMO_PARENT_REPORTS = {
  en: {
    studentName: 'Aarav Sharma',
    batchName: 'Achievers JEE Advanced Top-30',
    targetExam: 'JEE Advanced 2026',
    month: 'October 2026',
    attendanceRate: 91.5,
    attendanceStatus: 'Good (23/24 classes attended this month)',
    overallScoreTrend: 'Strong (Rank 5 in Batch of 30)',
    percentileBand: '91.0% – 96.5% Calibrated JEE Percentile Range',
    strongAreas: [
      'Kinematics & Vector Mechanics (Mastery: 91%)',
      'Chemical Bonding & Molecular Orbital Theory (Mastery: 85%)',
      'Calculus Fundamentals & Limits (Mastery: 82%)'
    ],
    growthAreas: [
      'Rotational Dynamics (Mastery: 44% — currently reviewing torque equilibrium)',
      'Coordinate Geometry Conics (Speed drills recommended)'
    ],
    homeSupportTips: [
      'Encourage regular 7-hour sleep before Sunday milestone tests.',
      'Ensure 15 minutes of uninterrupted daily formula review rather than late-night cramming.',
      'Aarav is showing great focus in chemistry; positive encouragement will build physics confidence.'
    ],
    facultyNote: 'Aarav has strong analytical capability. He has been scheduled for a 15-minute dedicated mentor clinic with Er. R. K. Verma this Friday to master rotational mechanics before Milestone Test 6.',
    mentorName: 'Er. R. K. Verma',
    mentorRole: 'Senior Physics Faculty & Batch Mentor'
  },
  hi: {
    studentName: 'आरव शर्मा',
    batchName: 'अचीवर्स जेईई एडवांस्ड टॉप-30',
    targetExam: 'जेईई एडवांस्ड 2026',
    month: 'अक्टूबर 2026',
    attendanceRate: 91.5,
    attendanceStatus: 'उत्कृष्ट (इस माह 24 में से 23 कक्षाएं उपस्थित)',
    overallScoreTrend: 'सशक्त (30 छात्रों के बैच में 5वां स्थान)',
    percentileBand: '91.0% – 96.5% अनुमानित जेईई पर्सेंटाइल दायरा',
    strongAreas: [
      'गतिविज्ञान एवं सदिश यांत्रिकी (दक्षता: 91%)',
      'रासायनिक आबंधन एवं आणविक कक्षक सिद्धांत (दक्षता: 85%)',
      'कलन एवं सीमा सिद्धांत (दक्षता: 82%)'
    ],
    growthAreas: [
      'घूर्णन गतिविज्ञान (दक्षता: 44% — वर्तमान में बल-आघूर्ण संतुलन का अभ्यास जारी)',
      'निर्देशांक ज्यामिति (शंकु परिच्छेद गति अभ्यास की आवश्यकता)'
    ],
    homeSupportTips: [
      'रविवार के मुख्य परीक्षण से पहले कम से कम 7 घंटे की निर्बाध नींद सुनिश्चित करें।',
      'देर रात तक रटने के बजाय प्रतिदिन 15 मिनट सूत्र पुनरावृत्ति को प्रोत्साहित करें।',
      'आरव रसायन विज्ञान में बहुत अच्छा प्रदर्शन कर रहा है; सकारात्मक प्रोत्साहन से भौतिकी में भी आत्मविश्वास बढ़ेगा।'
    ],
    facultyNote: 'आरव में उत्कृष्ट विश्लेषणात्मक क्षमता है। टेस्ट 6 से पहले घूर्णन यांत्रिकी में सुधार के लिए इस शुक्रवार को इं. आर. के. वर्मा के साथ 15 मिनट का विशेष मेंटर सत्र निर्धारित किया गया है।',
    mentorName: 'इंजी. आर. के. वर्मा',
    mentorRole: 'वरिष्ठ भौतिकी संकाय एवं बैच मेंटर'
  }
};

// ------------------------------------------------------------------------------
// Sample CSV Content for 1-Click Browser Download Demo
// ------------------------------------------------------------------------------
export const SAMPLE_CSV_CONTENT = `student_id,student_name,batch,subject,topic,score,max_score,attendance
STD_PAT_001,Aarav Sharma,Achievers Top-30,Physics,Rotational Dynamics,42,100,0.92
STD_PAT_002,Priya Patel,Target NEET Achievers,Biology,Human Physiology,94,100,0.98
STD_PAT_003,Rohan Verma,Achievers Top-30,Physics,Rotational Dynamics,34,100,0.76
STD_PAT_004,Ananya Singh,Foundation JEE,Mathematics,Straight Lines,82,100,0.95
STD_PAT_005,Vikramaditya Mishra,Achievers Top-30,Mathematics,Conic Sections,58,100,0.84
STD_PAT_006,Sneha Gupta,Target NEET Achievers,Chemistry,Organic Mechanisms,46,100,0.72
STD_PAT_007,Aryan Kumar,Achievers Top-30,Physics,Kinematics,88,100,0.96
STD_PAT_008,Diya Kumari,Target NEET Achievers,Biology,Genetics,91,100,0.94
STD_PAT_009,Harsh Vardhan,Foundation JEE,Chemistry,Chemical Bonding,78,100,0.89
STD_PAT_010,Kavya Rani,Target NEET Achievers,Physics,Optics,68,100,0.88`;
