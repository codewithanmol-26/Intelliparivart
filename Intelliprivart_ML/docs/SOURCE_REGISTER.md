# Intelliprivart Data Moat — Public Benchmark Data Source Register

> **Document**: External Research Benchmark Register & Licensing Audit  
> **Author**: Intelliprivart Data Science Team | Nextute EdTech × Finance Club, IIT Patna 2026  
> **Status**: Verified and Audited  

---

## 1. Ethical Data Policy & Architectural Grounding

Data Moat strictly distinguishes between **external academic benchmarks** used for algorithmic validation and **the canonical synthetic coaching dataset** built for the Indian JEE/NEET coaching domain.

We do **not** merge unrelated public datasets into one supposedly authentic Indian coaching dataset. EdNet, ASSISTments, and OULAD serve as methodology references for knowledge tracing and withdrawal dynamics, while our synthetic generator produces the domain-specific relational structure of tier-2 Indian coaching hubs (Patna, Kota, Lucknow).

---

## 2. Public Dataset Register

### Source 1: EdNet (Riiid AI Research)
* **Title**: EdNet: A Large-scale Hierarchical Dataset of Diverse Student Actions in Multi-platform Learning Environments
* **Original URL**: [https://github.com/riiid/ednet](https://github.com/riiid/ednet)
* **Publisher**: Riiid Labs / AIED 2020 Conference
* **Citation**: Choi, Y., Lee, Y., Cho, J., Baek, J., Kim, B., Cha, Y., Shin, D., Bae, C., & Heo, J. (2020). *EdNet: A Large-Scale Hierarchical Dataset in Multi-Platform Learning Environments.* Proceedings of the 21st International Conference on Artificial Intelligence in Education (AIED).
* **Licence & Terms**: Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
* **Access Requirements**: Direct public download from GitHub / AWS S3 bucket. No login or API token required.
* **Approximate Size**: KT1 subset: ~130M interactions (~3.2 GB uncompressed); KT4 subset: ~12 GB.
* **Relevant Fields**: `timestamp`, `solving_id`, `question_id`, `user_answer`, `elapsed_time`, `user_id`.
* **Intended Use**: Knowledge tracing benchmark and sequential item response modeling comparison.
* **Domain Differences & Limitations**: Collected from Korean adult students preparing for the TOEIC (Test of English for International Communication) on Santa TOEIC. Language learning dynamics, question structure (reading/listening), and adult motivation differ markedly from Indian adolescent STEM coaching (JEE/NEET).

---

### Source 2: ASSISTments Longitudinal Benchmarks
* **Title**: ASSISTments Data Mining Competition 2012 / 2017 Datasets
* **Original URL**: [https://sites.google.com/view/assistmentsdatamining/dataset](https://sites.google.com/view/assistmentsdatamining/dataset)
* **Publisher**: Worcester Polytechnic Institute (WPI) & Neil Heffernan Lab
* **Citation**: Selent, D., Patikorn, T., & Heffernan, N. (2016). *ASSISTments Longitudinal Data Mining Competition 2017.* In Proceedings of the 10th International Conference on Educational Data Mining (EDM).
* **Licence & Terms**: Open Research Data Access for Educational Research (Attribution Required).
* **Access Requirements**: Direct web download from Google Sites / WPI mirrors.
* **Approximate Size**: ~200 MB to 1.1 GB CSV files.
* **Relevant Fields**: `order_id`, `user_id`, `skill_name`, `problem_id`, `correct`, `hint_count`, `attempt_count`, `first_response_time`.
* **Intended Use**: Benchmark for Bayesian Knowledge Tracing (BKT) priors: $P(L_0), P(T), P(S), P(G)$.
* **Domain Differences & Limitations**: Collected from US middle-school and high-school students solving online math homework. Students receive automated scaffolded hints and multi-attempt retries, whereas JEE/NEET exams are strictly single-attempt 4-choice MCQs with negative marking (+4 / -1).

---

### Source 3: Open University Learning Analytics Dataset (OULAD)
* **Title**: Open University Learning Analytics Dataset (OULAD)
* **Original URL**: [https://analyse.kmi.open.ac.uk/open_dataset](https://analyse.kmi.open.ac.uk/open_dataset)
* **Publisher**: The Open University (UK) / Knowledge Media Institute (KMi)
* **Citation**: Kuzilek, J., Hlosta, M., & Zdrahal, Z. (2017). *Open University Learning Analytics Dataset.* Scientific Data, 4, 170171. Nature Publishing Group.
* **Licence & Terms**: Creative Commons Attribution 4.0 International (CC BY 4.0).
* **Access Requirements**: Direct HTTP download from Open University portal (zipped CSV tables).
* **Approximate Size**: ~180 MB zipped (~500 MB CSV).
* **Relevant Fields**: `id_student`, `code_module`, `code_presentation`, `date_registration`, `date_unregistration`, `final_result` (`Withdrawn`, `Fail`, `Pass`, `Distinction`), `sum_click`.
* **Intended Use**: Benchmarking longitudinal feature engineering (clickstream decay, submission delays, withdrawal curves).
* **Domain Differences & Limitations**: Covers adult UK distance learners enrolled in modular undergraduate open courses. Course fees, withdrawal policies, and learning velocity reflect adult distance education rather than intense, daily physical classroom coaching in India.

---

### Source 4: UCI Student Performance Dataset
* **Title**: Student Performance Data Set (Secondary Education)
* **Original URL**: [https://archive.ics.uci.edu/dataset/320/student+performance](https://archive.ics.uci.edu/dataset/320/student+performance)
* **Publisher**: University of California, Irvine (UCI) Machine Learning Repository
* **Citation**: Cortez, P., & Silva, A. (2008). *Using Data Mining to Predict Secondary School Student Performance.* In Proceedings of the 5th Annual Future Business Technology Conference (FUBUTEC).
* **Licence & Terms**: Creative Commons Attribution 4.0 International (CC BY 4.0).
* **Access Requirements**: Direct download via URL without authentication.
* **Approximate Size**: ~1 MB (649 rows for Portuguese language, 395 rows for Mathematics).
* **Relevant Fields**: `school`, `sex`, `age`, `famsize`, `studytime`, `failures`, `absences`, `G1`, `G2`, `G3` (Final Grade).
* **Intended Use**: Quick regression baseline for multi-period grade progression.
* **Domain Differences & Limitations**: Extremely small sample ($N=395$), cross-sectional European secondary school setting, lacking question-level responses, psychometric parameters, or competitive percentile ranking.

---

### Source 5: Kaggle Student Dropout and Academic Success
* **Title**: Predict Students' Dropout and Academic Success (Kaggle Playground Series s4e6)
* **Original URL**: [https://www.kaggle.com/competitions/studentdropout/data](https://www.kaggle.com/competitions/studentdropout/data)
* **Publisher**: Kaggle / Polytechnic Institute of Portalegre (Portugal)
* **Citation**: Valentim, R., et al. (2021). *Predicting Student Dropout and Academic Success in Higher Education.* Data in Brief.
* **Licence & Terms**: CC0: Public Domain.
* **Access Requirements**: Kaggle competition terms acceptance (Manual download or Kaggle CLI).
* **Approximate Size**: ~15 MB CSV.
* **Relevant Fields**: `Curricular units 1st sem (grade)`, `Curricular units 1st sem (enrolled)`, `Tuition fees up to date`, `Target` (`Dropout`, `Enrolled`, `Graduate`).
* **Intended Use**: Classification benchmark verifying that tuition fee defaults and early curricular completion correlate with withdrawal.
* **Domain Differences & Limitations**: Higher education (polytechnic/university) degree programs over multi-year semesters rather than 1-year competitive exam coaching.

---

### Source 6: National Testing Agency (NTA) Official JEE & NEET Materials
* **Title**: Information Bulletin & Official Syllabus: JEE (Main) & NEET (UG)
* **Original URL**: [https://nta.ac.in](https://nta.ac.in) / [https://jeemain.nta.nic.in](https://jeemain.nta.nic.in)
* **Publisher**: National Testing Agency (NTA), Ministry of Education, Government of India
* **Citation**: NTA. (2024). *Information Bulletin for Joint Entrance Examination (Main) 2024 & National Eligibility cum Entrance Test (UG) 2024.* Government of India.
* **Licence & Terms**: Public Government Document (Educational Reference).
* **Access Requirements**: Publicly accessible PDF bulletins.
* **Relevant Fields**: Subject syllabus units, chapter classifications, percentile normalization formulas, and marking schemes (+4 / -1).
* **Intended Use**: Grounding the 12-topic syllabus graph taxonomy and NTA percentile CDF transformations.
* **Domain Differences & Limitations**: Official syllabus outlines topics but does not release raw student-level response matrices or item discrimination coefficients.
