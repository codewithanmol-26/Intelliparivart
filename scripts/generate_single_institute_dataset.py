"""
Generator for Single Institution Dataset:
- 1 Institution: Apex JEE & Medical Academy, Patna (INST_PATNA_01)
- 1 Owner: Dr. S. K. Narayan (owner@apex.edu)
- 5 Teachers: 5 faculty leads across Physics, Chemistry, Math, Biology, Foundation
- 100 Students: STD_PAT_001 to STD_PAT_100 across 4 core batches
- 100 Parents: Exactly 1 matching parent per student (linked via student_id)
"""

import os
import json
import random
import datetime
import pandas as pd
from pathlib import Path

random.seed(42)

ROOT_DIR = Path("data/single_institute")
ROOT_DIR.mkdir(parents=True, exist_ok=True)

# 1. Single Institution
institutes = [
    {
        "id": "INST_PATNA_01",
        "name": "Apex JEE & Medical Academy, Patna",
        "city": "Patna",
        "city_tier": "Tier-2",
        "exam_focus": "JEE/NEET",
        "subscription_plan": "Tier 2: Intelligence",
        "annual_fee_per_student": 60000.0
    }
]
df_inst = pd.DataFrame(institutes)
df_inst.to_csv(ROOT_DIR / "institutes.csv", index=False)

# 2. Four Batches for the Single Institution (25 students each = 100 students)
batches = [
    {
        "id": "BATCH_TOP30",
        "tenant_id": "INST_PATNA_01",
        "name": "Achievers JEE Advanced Top-30",
        "class_level": "12th Grade",
        "target_exam": "JEE Advanced",
        "faculty_lead": "Prof. R. K. Verma"
    },
    {
        "id": "BATCH_NEET12",
        "tenant_id": "INST_PATNA_01",
        "name": "Target NEET Achievers PCB",
        "class_level": "12th / Droppers",
        "target_exam": "NEET-UG",
        "faculty_lead": "Dr. Sunita Mishra"
    },
    {
        "id": "BATCH_ELEV12",
        "tenant_id": "INST_PATNA_01",
        "name": "Elevate JEE 12th Batch B",
        "class_level": "12th Grade",
        "target_exam": "JEE Main",
        "faculty_lead": "Prof. Manoj Trivedi"
    },
    {
        "id": "BATCH_FND11",
        "tenant_id": "INST_PATNA_01",
        "name": "Foundation JEE & NEET 11th",
        "class_level": "11th Grade",
        "target_exam": "Foundation (11th)",
        "faculty_lead": "Er. Vikram Tiwari"
    }
]
df_batches = pd.DataFrame(batches)
df_batches.to_csv(ROOT_DIR / "batches.csv", index=False)

# 3. 100 Students and 100 Parents
FIRST_NAMES = [
    "Aarav", "Priya", "Rohan", "Aditya", "Ananya", "Harshvardhan", "Sneha", "Vikramaditya",
    "Ishaan", "Diya", "Kabir", "Tanvi", "Arjun", "Anushka", "Reyansh", "Meera",
    "Vivaan", "Saanvi", "Dhruv", "Riya", "Aayush", "Kavya", "Siddharth", "Pooja",
    "Aryan", "Nisha", "Aditi", "Manish", "Divya", "Suresh", "Karan", "Simran",
    "Rishi", "Bhavna", "Abhishek", "Shreya", "Naveen", "Jyoti", "Pranav", "Swati",
    "Gaurav", "Preeti", "Kartik", "Kajal", "Deepak", "Monika", "Varun", "Neha",
    "Ankit", "Ritika", "Rahul", "Sakshi", "Nikhil", "Akanksha", "Sameer", "Radhika",
    "Sachin", "Payal", "Amit", "Rashmi", "Alok", "Shikha", "Ashish", "Komal",
    "Rohit", "Richa", "Sanjay", "Garima", "Vikas", "Pallavi", "Pawan", "Sonali",
    "Mayank", "Barkha", "Sunil", "Anjali", "Rajesh", "Poonam", "Shubham", "Shivani",
    "Utkarsh", "Priyanka", "Vivek", "Kritika", "Sourabh", "Juhi", "Mohit", "Chhavi",
    "Tarun", "Kavita", "Akash", "Smriti", "Himanshu", "Sangeeta", "Lalit", "Sheetal",
    "Hemant", "Rupal", "Kunal", "Megha"
]

LAST_NAMES = [
    "Sharma", "Patel", "Verma", "Nair", "Deshmukh", "Rao", "Gupta", "Roy",
    "Singh", "Pandey", "Mishra", "Jha", "Choudhary", "Chatterjee", "Banerjee", "Mukherjee",
    "Sen", "Dutta", "Das", "Bose", "Ghosh", "Sinha", "Prasad", "Srivastava",
    "Thakur", "Yadav", "Tiwari", "Dubey", "Tripathi", "Shukla", "Pathak", "Upadhyay",
    "Saxena", "Bhardwaj", "Aggarwal", "Bansal", "Goel", "Garg", "Mittal", "Jindal",
    "Jain", "Mehta", "Shah", "Kothari", "Parikh", "Bhatt", "Dave", "Patil",
    "Kulkarni", "Joshi", "Kashyap", "Malhotra", "Kapoor", "Khanna", "Bhatia", "Chopra",
    "Arora", "Sethi", "Bhasin", "Ahluwalia", "Gill", "Dhillon", "Sandhu", "Grewal",
    "Iyer", "Iyengar", "Menon", "Pillai", "Nambiar", "Kurup", "Reddy", "Naidu",
    "Raju", "Chowdary", "Varma", "Goud", "Hegde", "Shetty", "Bhandary", "Pai",
    "Shenoy", "Kamath", "Bhat", "Rao", "Nayak", "Kini", "Prabhu", "Mallya",
    "Alva", "Rai", "Karkera", "Kotian", "Suvarna", "Poojary", "Salian", "Bhat",
    "Kamat", "Shenoy", "Baidya", "Saha"
]

PARENT_PREFIXES = ["Mr.", "Dr.", "Prof.", "Mrs.", "Er."]

students = []
users = []

# Add Owner (1 Owner)
users.append({
    "id": "USR_OWNER_01",
    "email": "owner@apex.edu",
    "full_name": "Dr. S. K. Narayan",
    "role": "owner",
    "tenant_id": "INST_PATNA_01",
    "student_id": None,
    "description": "Sole Institute Owner & Managing Director"
})

# Add 5 Teachers (5 Teachers)
teachers_data = [
    {
        "id": "USR_TCH_01",
        "email": "verma.physics@apex.edu",
        "full_name": "Prof. R. K. Verma",
        "subject": "Physics",
        "description": "Senior Physics Faculty & JEE Advanced Academic Lead"
    },
    {
        "id": "USR_TCH_02",
        "email": "mishra.chem@apex.edu",
        "full_name": "Dr. Sunita Mishra",
        "subject": "Chemistry",
        "description": "HOD Chemistry & Physical Chemistry Lead"
    },
    {
        "id": "USR_TCH_03",
        "email": "trivedi.math@apex.edu",
        "full_name": "Prof. Manoj Trivedi",
        "subject": "Mathematics",
        "description": "JEE Advanced & Main Mathematics Lead"
    },
    {
        "id": "USR_TCH_04",
        "email": "sharma.bio@apex.edu",
        "full_name": "Dr. Neha Sharma",
        "subject": "Biology",
        "description": "HOD Biology & NEET-UG Faculty Lead"
    },
    {
        "id": "USR_TCH_05",
        "email": "tiwari.foundation@apex.edu",
        "full_name": "Er. Vikram Tiwari",
        "subject": "Physics / Foundation",
        "description": "Class 11 Foundation Program Lead"
    }
]

for t in teachers_data:
    users.append({
        "id": t["id"],
        "email": t["email"],
        "full_name": t["full_name"],
        "role": "teacher",
        "tenant_id": "INST_PATNA_01",
        "student_id": None,
        "description": t["description"]
    })

# Add 100 Students and 100 Parents
batch_keys = ["BATCH_TOP30", "BATCH_NEET12", "BATCH_ELEV12", "BATCH_FND11"]

for i in range(1, 101):
    std_id = f"STD_PAT_{i:03d}"
    roll_no = f"APX-2026-{i:03d}"
    first_name = FIRST_NAMES[(i - 1) % len(FIRST_NAMES)]
    last_name = LAST_NAMES[(i - 1) % len(LAST_NAMES)]
    full_name = f"{first_name} {last_name}"
    
    # 25 students per batch
    batch_idx = (i - 1) // 25
    b_id = batch_keys[batch_idx]
    
    # Target Exam based on batch
    if b_id == "BATCH_TOP30":
        class_lvl = "12th Grade"
        target_exam = "JEE Advanced"
        base_theta = round(random.uniform(0.5, 2.2), 2)
    elif b_id == "BATCH_NEET12":
        class_lvl = "12th / Droppers"
        target_exam = "NEET-UG"
        base_theta = round(random.uniform(0.2, 2.4), 2)
    elif b_id == "BATCH_ELEV12":
        class_lvl = "12th Grade"
        target_exam = "JEE Main"
        base_theta = round(random.uniform(-0.5, 1.4), 2)
    else:
        class_lvl = "11th Grade"
        target_exam = "Foundation (11th)"
        base_theta = round(random.uniform(0.0, 1.6), 2)

    # Specific benchmark calibrations for top students
    if i == 1:
        full_name = "Aarav Sharma"
        base_theta = 1.82
    elif i == 2:
        full_name = "Priya Patel"
        base_theta = 2.15
    elif i == 3:
        full_name = "Rohan Verma"
        base_theta = 0.25
    elif i == 4:
        full_name = "Aditya Nair"
        base_theta = 0.95

    # Parent Details (Exactly 1 parent per student)
    p_prefix = PARENT_PREFIXES[(i - 1) % len(PARENT_PREFIXES)]
    parent_first = ["Rajesh", "Manoj", "Vinay", "Shobha", "Prakash", "K. V.", "Anil", "Debashree", "Suresh", "Deepak"][(i - 1) % 10]
    guardian_name = f"{p_prefix} {parent_first} {last_name}"
    phone_tail = f"{10000 + i * 37}"[-5:]
    guardian_phone = f"+91 98350 {phone_tail}"

    # Student Record
    students.append({
        "id": std_id,
        "tenant_id": "INST_PATNA_01",
        "batch_id": b_id,
        "pseudonymous_code": f"PSEUDO_PAT_{i:04d}",
        "name": full_name,
        "class_level": class_lvl,
        "join_date": datetime.date(2025, 4, 1) + datetime.timedelta(days=(i % 15)),
        "parent_contact_consent": True,
        "guardian_name": guardian_name,
        "guardian_phone": guardian_phone,
        "latent_ability_theta": base_theta,
        "target_exam": target_exam
    })

    # Student User Account (1 per student)
    std_email = f"std_{i:03d}@apex.edu"
    users.append({
        "id": f"USR_STD_{i:03d}",
        "email": std_email,
        "full_name": full_name,
        "role": "student",
        "tenant_id": "INST_PATNA_01",
        "student_id": std_id,
        "description": f"Enrolled Student in {b_id} ({target_exam})"
    })

    # Parent User Account (1 per student)
    par_email = f"parent_{i:03d}@apex.edu"
    users.append({
        "id": f"USR_PAR_{i:03d}",
        "email": par_email,
        "full_name": f"{guardian_name} (Guardian)",
        "role": "parent",
        "tenant_id": "INST_PATNA_01",
        "student_id": std_id,
        "description": f"Verified Guardian of {full_name} ({std_id})"
    })

df_std = pd.DataFrame(students)
df_std.to_csv(ROOT_DIR / "students.csv", index=False)

df_users = pd.DataFrame(users)
df_users.to_csv(ROOT_DIR / "users.csv", index=False)

print("Generated Single Institution Dataset:")
print(f"Institutes: {len(df_inst)} (Apex JEE & Medical Academy, Patna)")
print(f"Batches: {len(df_batches)}")
print(f"Students: {len(df_std)} (100 students)")
print(f"Users: {len(df_users)} (1 Owner, 5 Teachers, 100 Students, 100 Parents = {len(df_users)} total)")
