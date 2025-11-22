from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PM Internship Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "PM Internship Backend API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/auth/login")
def login(credentials: dict):
    return {"message": "Login successful", "token": "demo-token", "user": {"id": 1, "name": "Demo User"}}

@app.post("/auth/register")
def register(user_data: dict):
    return {"message": "Registration successful", "token": "demo-token", "user": {"id": 1, "name": "Demo User"}}

@app.get("/auth")
def auth_get(category: str = None):
    return {"message": "Auth endpoint", "category": category, "data": []}

@app.get("/departments/{dept_id}/posts")
def get_department_posts(dept_id: int):
    dept_roles = {
        1: [  # IT & Software
            {"id": 1, "title": "Software Engineer", "department": dept_id, "description": "Full-stack development", "applicants": 25},
            {"id": 2, "title": "Data Scientist", "department": dept_id, "description": "ML and analytics", "applicants": 18},
            {"id": 3, "title": "DevOps Engineer", "department": dept_id, "description": "Infrastructure management", "applicants": 12},
            {"id": 4, "title": "UI/UX Designer", "department": dept_id, "description": "User experience design", "applicants": 15}
        ],
        2: [  # Marketing
            {"id": 5, "title": "Digital Marketing Specialist", "department": dept_id, "description": "Social media and campaigns", "applicants": 22},
            {"id": 6, "title": "Content Writer", "department": dept_id, "description": "Blog and marketing content", "applicants": 19},
            {"id": 7, "title": "SEO Analyst", "department": dept_id, "description": "Search optimization", "applicants": 14},
            {"id": 8, "title": "Brand Manager", "department": dept_id, "description": "Brand strategy", "applicants": 8}
        ],
        3: [  # Finance
            {"id": 9, "title": "Financial Analyst", "department": dept_id, "description": "Financial planning and analysis", "applicants": 16},
            {"id": 10, "title": "Accounting Intern", "department": dept_id, "description": "Bookkeeping and reporting", "applicants": 20},
            {"id": 11, "title": "Investment Analyst", "department": dept_id, "description": "Portfolio analysis", "applicants": 11},
            {"id": 12, "title": "Tax Associate", "department": dept_id, "description": "Tax preparation", "applicants": 9}
        ],
        4: [  # HR
            {"id": 13, "title": "HR Generalist", "department": dept_id, "description": "Recruitment and employee relations", "applicants": 17},
            {"id": 14, "title": "Talent Acquisition", "department": dept_id, "description": "Hiring and onboarding", "applicants": 13},
            {"id": 15, "title": "Training Coordinator", "department": dept_id, "description": "Employee development", "applicants": 10},
            {"id": 16, "title": "Compensation Analyst", "department": dept_id, "description": "Salary benchmarking", "applicants": 7}
        ]
    }
    return {"posts": dept_roles.get(dept_id, [])}

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    return {"id": post_id, "title": "Software Engineer", "description": "Demo post"}

@app.get("/departments/{dept_id}/posts/{post_id}/applicants")
def get_applicants(dept_id: int, post_id: int):
    sample_applicants = [
        {"id": 1, "name": "Alice Johnson", "email": "alice@university.edu", "gpa": 3.8, "major": "Computer Science", "year": "Senior", "post_id": post_id},
        {"id": 2, "name": "Bob Smith", "email": "bob@university.edu", "gpa": 3.6, "major": "Information Technology", "year": "Junior", "post_id": post_id},
        {"id": 3, "name": "Carol Davis", "email": "carol@university.edu", "gpa": 3.9, "major": "Software Engineering", "year": "Senior", "post_id": post_id},
        {"id": 4, "name": "David Wilson", "email": "david@university.edu", "gpa": 3.5, "major": "Data Science", "year": "Junior", "post_id": post_id},
        {"id": 5, "name": "Emma Brown", "email": "emma@university.edu", "gpa": 3.7, "major": "Marketing", "year": "Senior", "post_id": post_id},
        {"id": 6, "name": "Frank Miller", "email": "frank@university.edu", "gpa": 3.4, "major": "Finance", "year": "Junior", "post_id": post_id},
        {"id": 7, "name": "Grace Lee", "email": "grace@university.edu", "gpa": 3.8, "major": "Human Resources", "year": "Senior", "post_id": post_id},
        {"id": 8, "name": "Henry Taylor", "email": "henry@university.edu", "gpa": 3.6, "major": "Business Administration", "year": "Junior", "post_id": post_id}
    ]
    return {"applicants": sample_applicants}

@app.post("/posts/{post_id}/match")
def match_post(post_id: int, data: dict):
    return {"message": "Matching completed", "matches": []}

@app.post("/posts/{post_id}/schedule")
def schedule_post(post_id: int, data: dict):
    return {"message": "Scheduled successfully"}

@app.get("/posts/{post_id}/meetings")
def get_meetings(post_id: int):
    return {"meetings": []}

@app.post("/posts/{post_id}/tiebreak")
def tiebreak(post_id: int, data: dict):
    return {"message": "Tiebreak created"}

@app.post("/posts/{post_id}/tiebreak/send")
def send_tiebreak(post_id: int, data: dict):
    return {"message": "Tiebreak sent"}

@app.post("/posts/{post_id}/reject")
def reject_applicant(post_id: int, data: dict):
    return {"message": "Applicant rejected"}

@app.get("/applicants/{applicant_id}")
def get_applicant(applicant_id: int):
    profiles = {
        1: {"id": 1, "name": "Alice Johnson", "email": "alice@university.edu", "phone": "+1-555-0101", "gpa": 3.8, "major": "Computer Science", "year": "Senior", "skills": ["Python", "React", "SQL"], "experience": "2 years coding experience"},
        2: {"id": 2, "name": "Bob Smith", "email": "bob@university.edu", "phone": "+1-555-0102", "gpa": 3.6, "major": "Information Technology", "year": "Junior", "skills": ["Java", "AWS", "Docker"], "experience": "1 year internship"},
        3: {"id": 3, "name": "Carol Davis", "email": "carol@university.edu", "phone": "+1-555-0103", "gpa": 3.9, "major": "Software Engineering", "year": "Senior", "skills": ["JavaScript", "Node.js", "MongoDB"], "experience": "3 years project experience"},
        4: {"id": 4, "name": "David Wilson", "email": "david@university.edu", "phone": "+1-555-0104", "gpa": 3.5, "major": "Data Science", "year": "Junior", "skills": ["Python", "R", "Machine Learning"], "experience": "Research assistant"},
        5: {"id": 5, "name": "Emma Brown", "email": "emma@university.edu", "phone": "+1-555-0105", "gpa": 3.7, "major": "Marketing", "year": "Senior", "skills": ["Digital Marketing", "Analytics", "Content Creation"], "experience": "Marketing club president"},
        6: {"id": 6, "name": "Frank Miller", "email": "frank@university.edu", "phone": "+1-555-0106", "gpa": 3.4, "major": "Finance", "year": "Junior", "skills": ["Excel", "Financial Modeling", "Bloomberg"], "experience": "Finance society member"},
        7: {"id": 7, "name": "Grace Lee", "email": "grace@university.edu", "phone": "+1-555-0107", "gpa": 3.8, "major": "Human Resources", "year": "Senior", "skills": ["Recruitment", "Employee Relations", "HRIS"], "experience": "HR volunteer work"},
        8: {"id": 8, "name": "Henry Taylor", "email": "henry@university.edu", "phone": "+1-555-0108", "gpa": 3.6, "major": "Business Administration", "year": "Junior", "skills": ["Project Management", "Leadership", "Strategy"], "experience": "Student government"}
    }
    return profiles.get(applicant_id, {"id": applicant_id, "name": "Unknown Student", "email": "unknown@university.edu"})

@app.get("/departments/{dept}/rejected")
def get_rejected(dept: str):
    rejected_students = [
        {"id": 6, "name": "Frank Miller", "role": "Financial Analyst", "department": dept, "reason": "Experience requirements not met"},
        {"id": 8, "name": "Henry Taylor", "role": "HR Generalist", "department": dept, "reason": "Skills mismatch"}
    ]
    return {"rejected": rejected_students}

@app.get("/departments/{dept}/selected")
def get_selected(dept: str):
    selected_students = [
        {"id": 1, "name": "Alice Johnson", "role": "Software Engineer", "department": dept},
        {"id": 3, "name": "Carol Davis", "role": "UI/UX Designer", "department": dept},
        {"id": 5, "name": "Emma Brown", "role": "Digital Marketing Specialist", "department": dept}
    ]
    return {"selected": selected_students}

@app.get("/departments/{dept}/selected/export")
def export_selected(dept: str):
    return {"export_url": "demo-export.csv"}