# Intelliprivart Data Moat — Comprehensive Data Dictionary

> **Platform**: Intelliprivart — AI-Powered Institute Intelligence Platform  
> **Case Competition**: Nextute EdTech × Finance Club, IIT Patna 2026 (Case B: The Data Moat)  
> **Schema Version**: 1.0 (Canonical 11-Table Relational Schema)  
> **Classification**: Educational SaaS & Learning Analytics Specification

---

## 1. Relational Entity Overview

The Intelliprivart data architecture organizes disparate coaching data into 11 logically linked, tenant-isolated relational entities:

```
[institutes] ──< [batches] ──< [students] ──< [test_responses] >── [questions] >── [syllabus_topics]
                                   │
                                   ├──< [attendance]
                                   ├──< [fees]
                                   ├──< [engagement]
                                   └─── [outcomes] (1-to-1)
```

---

## 2. Table Specifications

### Table 1: `institutes`
*Defines registered coaching institute tenants.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `institute_id` | VARCHAR(50) | No | **PK** | Unique tenant identifier | `INST_PATNA_01` |
| `name` | VARCHAR(150) | No | - | Official registered coaching name | `Apex JEE & Medical Academy` |
| `city` | VARCHAR(100) | No | - | Geographic municipality | `Patna` |
| `city_tier` | VARCHAR(20) | No | - | City tier classification (`Tier-1`, `Tier-2`, `Tier-3`) | `Tier-2` |
| `exam_focus` | VARCHAR(50) | No | - | Primary competitive stream (`JEE`, `NEET`, `JEE/NEET`) | `JEE/NEET` |
| `student_count` | INTEGER | No | - | Active student enrollment capacity | `400` |
| `plan` | VARCHAR(50) | No | - | SaaS subscription tier (`Tier 1`, `Tier 2`, `Tier 3`) | `Tier 2: Intelligence` |
| `annual_fee_per_student` | FLOAT | No | - | Baseline annual tuition billed per learner (INR) | `60000.0` |

---

### Table 2: `batches`
*Defines academic class cohorts within an institute.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `batch_id` | VARCHAR(80) | No | **PK** | Unique cohort identifier | `INST_PATNA_01_B1_JEE_12` |
| `institute_id` | VARCHAR(50) | No | **FK** (`institutes.institute_id`) | Owning tenant identifier | `INST_PATNA_01` |
| `name` | VARCHAR(120) | No | - | Descriptive cohort title | `12th JEE Achievers Top-30` |
| `class_level` | VARCHAR(20) | No | - | Target class (`11th`, `12th`, `Dropper`) | `12th` |
| `target_exam` | VARCHAR(50) | No | - | Target competitive exam (`JEE Main`, `JEE Advanced`, `NEET`) | `JEE Advanced` |
| `faculty_in_charge` | VARCHAR(100) | No | - | Academic mentor faculty lead | `Er. R. K. Verma (Physics Lead)` |
| `max_capacity` | INTEGER | No | - | Cohort student seating limit | `120` |

---

### Table 3: `syllabus_topics`
*Defines canonical JEE/NEET knowledge graph hierarchy.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `topic_id` | VARCHAR(30) | No | **PK** | Canonical knowledge graph node ID | `TOP_07` |
| `subject` | VARCHAR(50) | No | - | Subject area (`Physics`, `Chemistry`, `Mathematics`, `Biology`) | `Mathematics` |
| `chapter` | VARCHAR(100) | No | - | Syllabus chapter title | `Calculus` |
| `topic` | VARCHAR(100) | No | - | Granular diagnostic syllabus concept | `Definite Integration` |
| `sub_topics` | TEXT | Yes | - | Detailed sub-topic skills & formulas | `Properties of Integrals, Area` |

---

### Table 4: `questions`
*Calibrated test items tagged to the syllabus graph with 2PL IRT parameters.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `question_id` | VARCHAR(50) | No | **PK** | Unique item identifier | `Q_151` |
| `topic_id` | VARCHAR(30) | No | **FK** (`syllabus_topics.topic_id`) | Associated knowledge graph topic | `TOP_07` |
| `subject` | VARCHAR(50) | No | - | Academic subject | `Mathematics` |
| `chapter` | VARCHAR(100) | No | - | Curriculum chapter | `Calculus` |
| `topic` | VARCHAR(100) | No | - | Topic title | `Definite Integration` |
| `difficulty_b` | FLOAT | No | - | 2PL IRT Difficulty parameter $b \in [-3.0, +3.0]$ | `0.65` |
| `discrimination_a` | FLOAT | No | - | 2PL IRT Discrimination parameter $a \in [0.5, 2.5]$ | `1.42` |
| `correct_option` | VARCHAR(10) | No | - | Answer key option (`Option_A`, `Option_B`, `Option_C`, `Option_D`) | `Option_B` |
| `source` | VARCHAR(100) | Yes | - | Origin item bank benchmark | `NTA Previous Years Benchmark` |

---

### Table 5: `students`
*Student demographic and enrollment register.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `student_id` | VARCHAR(50) | No | **PK** | Unique pseudonymized student token | `STD_NA_01_001` |
| `institute_id` | VARCHAR(50) | No | **FK** (`institutes.institute_id`) | Owning tenant identifier | `INST_PATNA_01` |
| `batch_id` | VARCHAR(80) | No | **FK** (`batches.batch_id`) | Enrolled academic cohort | `INST_PATNA_01_B1_JEE_12` |
| `name` | VARCHAR(100) | No | - | Synthetic candidate full name | `Aarav Sharma` |
| `class_level` | VARCHAR(20) | No | - | Academic level (`11th`, `12th`, `Dropper`) | `12th` |
| `join_date` | DATE | No | - | Session admission date | `2025-04-03` |
| `fee_plan` | VARCHAR(100) | No | - | Fee installment contract schedule | `10-Installment Standard` |
| `parent_name` | VARCHAR(100) | Yes | - | Synthetic parent/guardian name | `Rajesh Sharma` |
| `parent_phone_masked` | VARCHAR(30) | Yes | - | DPDP masked contact string | `+91 98452 X4219` |
| `parent_contact_consent` | BOOLEAN | No | - | Verifiable Parental Consent (VPC) flag | `True` |
| `latent_ability_theta` | FLOAT | No | - | Latent unobserved true ability $\theta \sim \mathcal{N}(0, 1)$ | `0.45` |

---

### Table 6: `tests`
*Fortnightly mock examinations conducted across the 12-month academic session.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `test_id` | VARCHAR(60) | No | **PK** | Unique examination identifier | `TEST_NA_01_01` |
| `institute_id` | VARCHAR(50) | No | **FK** (`institutes.institute_id`) | Administering institute | `INST_PATNA_01` |
| `test_number` | INTEGER | No | - | Sequential test index ($1$ to $24$) | `1` |
| `title` | VARCHAR(150) | No | - | Milestone exam title | `Fortnightly Mock #01` |
| `test_date` | DATE | No | - | Examination administration date | `2025-04-14` |
| `academic_month` | INTEGER | No | - | Month of academic year ($1$ to $12$) | `1` |
| `total_questions` | INTEGER | No | - | Number of items in examination | `20` |
| `total_marks` | INTEGER | No | - | Maximum possible marks | `80` |
| `exam_type` | VARCHAR(50) | No | - | Stream (`JEE Main`, `NEET`) | `JEE Main` |

---

### Table 7: `test_responses`
*Question-level responses submitted by students.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `test_id` | VARCHAR(60) | No | **FK** (`tests.test_id`) | Mock examination ID | `TEST_NA_01_01` |
| `student_id` | VARCHAR(50) | No | **FK** (`students.student_id`) | Candidate token ID | `STD_NA_01_001` |
| `question_id` | VARCHAR(50) | No | **FK** (`questions.question_id`) | Question item ID | `Q_012` |
| `response` | VARCHAR(20) | No | - | Student selected option | `Option_A` |
| `is_correct` | INTEGER | No | - | Binary correctness indicator ($1$ or $0$) | `1` |
| `time_taken_sec` | INTEGER | No | - | Time spent on item in seconds | `78` |
| `test_date` | DATE | No | - | Exam date | `2025-04-14` |

---

### Table 8: `attendance`
*Daily classroom attendance records across 240 school days.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `student_id` | VARCHAR(50) | No | **FK** (`students.student_id`) | Candidate token ID | `STD_NA_01_001` |
| `date` | DATE | No | - | Academic lecture date | `2025-04-02` |
| `session_id` | VARCHAR(60) | No | - | Class session code | `SESS_20250402` |
| `present_flag` | INTEGER | No | - | Binary presence indicator ($1$=Present, $0$=Absent) | `1` |

---

### Table 9: `fees`
*10-installment tuition ledger.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `student_id` | VARCHAR(50) | No | **FK** (`students.student_id`) | Candidate token ID | `STD_NA_01_001` |
| `instalment_no` | INTEGER | No | - | Installment number ($1$ to $10$) | `3` |
| `due_date` | DATE | No | - | Contractual payment deadline | `2025-06-01` |
| `paid_date` | DATE | Yes | - | Actual settlement date (NULL if unpaid) | `2025-06-04` |
| `amount` | FLOAT | No | - | Installment amount in INR | `6000.0` |
| `status` | VARCHAR(20) | No | - | Payment state (`PAID`, `DEFAULTED`) | `PAID` |

---

### Table 10: `engagement`
*Weekly longitudinal engagement streams.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `student_id` | VARCHAR(50) | No | **FK** (`students.student_id`) | Candidate token ID | `STD_NA_01_001` |
| `date` | DATE | No | - | End date of weekly tracking window | `2025-04-08` |
| `doubts_asked` | INTEGER | No | - | Count of academic doubts raised in week | `3` |
| `homework_submitted`| INTEGER | No | - | Binary homework completion ($1$=Yes, $0$=No) | `1` |
| `app_logins` | INTEGER | No | - | Weekly digital portal login frequency | `6` |

---

### Table 11: `outcomes`
*Ground truth terminal outcome labels for supervised training and evaluation.*
| Field Name | Data Type | Nullable | Primary / Foreign Key | Description & Domain Constraints | Example |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `student_id` | VARCHAR(50) | No | **PK**, **FK** (`students.student_id`) | Candidate token ID | `STD_NA_01_001` |
| `dropped_out_flag` | INTEGER | No | - | Terminal disengagement indicator ($1$=Dropped, $0$=Completed) | `0` |
| `dropout_month` | INTEGER | Yes | - | Month of withdrawal ($3$ to $7$, NULL if completed) | `NULL` |
| `final_mock_percentile`| FLOAT | No | - | End-of-session comprehensive mock percentile | `88.5` |
| `actual_exam_percentile`| FLOAT | Yes | - | Real NTA competitive percentile (NULL if dropped) | `89.2` |
