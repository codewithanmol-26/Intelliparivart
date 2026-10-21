# DataMoat Financial Model: Nextute Case B Edition

> **Project**: DataMoat — AI-Powered Intelligence Platform for Coaching Institutes  
> **Competition**: Nextute Edtech Pvt. Ltd. × Finance Club, IIT Patna (Case B)  
> **Associated Spreadsheet**: [`04_Financial_model/DataMoat_Financial_Model.xlsx`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/04_Financial_model/DataMoat_Financial_Model.xlsx) (Live Excel Formulas)  
> **Status**: Comprehensive Financial Model Baseline  

---

## 1. Executive Summary & Core Value-to-Cost Asymmetry

DataMoat delivers an **extreme value-to-cost asymmetry** tailored to the financial realities of coaching institutes in educational hubs like Patna, Kota, Lucknow, Jaipur, and Indore.

### The Problem (The Institute's Lost Revenue)
* **Cohort Scale**: 400 enrolled students paying an average of **₹60,000 / year** (range: ₹30,000 – ₹1,50,000) over 10 months (₹6,000 / month).
* **Mid-Session Attrition**: 12% of students (48 students) drop out around Month 4 (after first major mock tests), defaulting on the remaining 6 months of unpaid installment fees (**₹36,000 per student**).
* **Total Tuition Lost**: $48 \times ₹36,000 = \mathbf{₹17,28,000 / \text{year}}$ in direct cashflow loss.

### The Solution (The DataMoat Value Equation)
* **Dropout Reduction**: Preventing just **20% of dropouts** (retaining 9.6 students) saves **₹3,45,600 / year** in retained tuition fees.
* **Platform Cost**: At **₹40 / student / month**, the annual platform cost is $400 \times ₹40 \times 12 = \mathbf{₹1,92,000 / \text{year}}$.
* **Net Financial Gain**: $₹3,45,600 - ₹1,92,000 = \mathbf{+₹1,53,600 / \text{year}}$.
* **Institute ROI Multiple**: **$1.80\text{x} - 2.25\text{x}$ immediate return** on software spend.
* **Breakeven Threshold**: Retaining just **5.3 students per year** completely covers the annual platform cost.

---

## 2. Challenging the Naive Model & Realistic Operating Assumptions

The official Nextute brief explicitly instructs teams to challenge naive assumptions. Here is our rigorous adjustment:

| Parameter | Naive Assumption in Brief | DataMoat Refined Value | Commercial Justification & Mitigation |
| :--- | :--- | :--- | :--- |
| **Pricing Structure** | ₹40 / student / month (Variable) | **₹40 / student / month billed annually** (₹1,92,000/yr) | Owners resist variable billing during off-season lulls; annual terms lock in cashflow. |
| **Dropout Prevention** | 25% flat reduction | **20% (Range: 15% – 25%)** | Evaluated empirically via 30-day intervention feedback loop vs control cohorts. |
| **Customer Acquisition Cost** | ₹25,000 CAC + ₹8,000 onboarding | **₹22,000 CAC + ₹6,000 onboarding** | Direct field sales in concentrated coaching hubs (Kota/Patna) + concierge historical OMR digitization in Month 1. |
| **Infra + AI Cost per Student** | ₹6.00 / student / month | **₹4.80 / student / month** | ₹2.20 compute + ₹1.50 AI tokens (de-identified prompt caching) + ₹1.10 storage/WhatsApp. |
| **Monthly Churn Rate** | 3.0% flat monthly churn | **2.5% blended (annualized ~25%)** | Accounts for post-exam seasonality (March–June intake cycle). |

---

## 3. Platform Unit Economics (Per 400-Student Institute / Month)

```
+-------------------------------------------------------------------------------------------------+
|                         DATAMOAT UNIT ECONOMICS (PER INSTITUTE / MONTH)                         |
+-------------------------------------------------------------------------------------------------+
|  Monthly Subscription Revenue (400 students @ ₹40/mo):                              ₹16,000.00  |
|  Cost of Goods Sold (COGS):                                                                     |
|    - Cloud Compute & VPS Hosting (FastAPI + PostgreSQL RLS @ ₹2.20/std):     ₹880.00            |
|    - AI Inference & API Tokens (Gemini 1.5 Flash @ ₹1.50/std):               ₹600.00            |
|    - S3 Storage, DB Backups & WhatsApp Cloud API (@ ₹1.10/std):              ₹440.00            |
|    - Direct Hosting & AI COGS per Institute:                                ₹1,920.00           |
|    - Allocated Customer Success & Field Support per Institute:               ₹2,500.00           |
|  Total Operational COGS:                                                             ₹4,420.00  |
+-------------------------------------------------------------------------------------------------+
|  Monthly Contribution Margin:                                                       ₹11,580.00  |
|  Gross Contribution Margin Percentage:                                                   72.4%  |
|  (Pure Infrastructure & AI Gross Margin: 88.0%)                                                 |
+-------------------------------------------------------------------------------------------------+
|  Total Acquisition Investment (CAC ₹22,000 + Onboarding ₹6,000):                    ₹28,000.00  |
|  CAC Payback Period:                                                        2.4 - 3.8 months   |
|  Average Customer Lifetime (at 2.5% monthly churn):                                 40.0 months |
|  Customer Lifetime Value (LTV):                                                    ₹4,63,200.00 |
|  LTV / CAC Ratio:                                                                        16.5x  |
+-------------------------------------------------------------------------------------------------+
```

---

## 4. 3-Year Quarterly Financial Summary (Consolidated)

*(All live calculations available in [`04_Financial_model/DataMoat_Financial_Model.xlsx`](file:///c:/Users/aryan/OneDrive/Desktop/Data%20Moat/04_Financial_model/DataMoat_Financial_Model.xlsx))*

| Line Item | Year 1 Total (28 Inst.) | Year 2 Total (110 Inst.) | Year 3 Total (280 Inst.) |
| :--- | :--- | :--- | :--- |
| **Active Institutes (Year End)** | **28 centers** | **110 centers** | **280 centers** |
| **Total Active Students Monitored** | **11,200 students** | **44,000 students** | **1,12,000 students** |
| **Gross Subscription Revenue** | **₹32,25,600** | **₹1,40,54,400** | **₹3,77,28,000** |
| Total Direct COGS (Hosting, AI, Support) | ₹8,90,620 | ₹38,80,800 | ₹1,04,22,600 |
| **Gross Profit** | **₹23,34,980 (72.4%)** | **₹1,01,73,600 (72.4%)** | **₹2,73,05,400 (72.4%)** |
| Sales, Marketing & Field Travel | ₹9,15,000 | ₹24,25,000 | ₹42,75,000 |
| Software Engineering & ML R&D | ₹13,05,000 | ₹27,85,000 | ₹48,45,000 |
| General, Admin & DPDP Compliance | ₹3,42,000 | ₹6,78,000 | ₹11,34,000 |
| Total Operating Expenses (OpEx) | ₹25,62,000 | ₹58,88,000 | ₹1,02,54,000 |
| **EBITDA (Operating Profit)** | **-₹2,27,020** | **+₹42,85,600** | **+₹1,70,51,400** |
| **EBITDA Margin (%)** | **-7.0% (Near Break-Even)** | **+30.5%** | **+45.2%** |
| **Cumulative Cash Flow** | **-₹2,27,020** | **+₹40,58,580** | **+₹2,11,10,000** |

* **Operational Break-Even**: Achieved in **Month 9 (Q3)** at 18 active subscribing institutes.
* **Self-Sustaining Growth**: Zero external institutional equity dilution required; Year 2 cashflow fully funds engineering and regional field expansion.

---

## 5. Two-Way Sensitivity & Stress Testing

### Sensitivity 1: Pricing per Student vs. Monthly Logo Churn $\rightarrow$ Customer LTV

| Pricing per Student \ Churn | 1.5% Churn | 2.5% Churn (Base) | 3.5% Churn | 4.5% Churn | 6.0% Churn |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **₹25.00 / student** | ₹3,72,000 | ₹2,23,200 | ₹1,59,429 | ₹1,24,000 | ₹93,000 |
| **₹35.00 / student** | ₹6,38,667 | ₹3,83,200 | ₹2,73,714 | ₹2,12,889 | ₹1,59,667 |
| **₹40.00 / student (Base)** | ₹7,72,000 | **₹4,63,200** | ₹3,30,857 | ₹2,57,333 | ₹1,93,000 |
| **₹50.00 / student** | ₹10,38,667 | ₹6,23,200 | ₹4,45,143 | ₹3,46,222 | ₹2,59,667 |
| **₹65.00 / student** | ₹14,38,667 | ₹8,63,200 | ₹6,16,571 | ₹4,79,556 | ₹3,59,667 |

### Sensitivity 2: Dropout Prevention % vs. Institute Annual Tuition $\rightarrow$ Institute ROI

| Dropout Prevention \ Tuition | ₹35,000 Fee | ₹50,000 Fee | ₹60,000 Fee (Base) | ₹80,000 Fee | ₹1,10,000 Fee |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **10% Dropout Reduction** | 0.53x | 0.75x | 0.90x | 1.20x | 1.65x |
| **15% Dropout Reduction** | 0.79x | 1.13x | 1.35x | 1.80x | 2.48x |
| **20% Dropout Reduction (Base)**| 1.05x | 1.50x | **1.80x** | 2.40x | 3.30x |
| **25% Dropout Reduction** | 1.31x | 1.88x | 2.25x | 3.00x | 4.13x |
| **30% Dropout Reduction** | 1.58x | 2.25x | 2.70x | 3.60x | 4.95x |

> **Key Takeaway**: Across all institutes charging ₹50,000+ in annual tuition, preventing just 15% of dropouts yields a positive ROI ($>1.13\text{x}$), guaranteeing strong willingness to pay.
