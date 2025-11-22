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
    import random
    
    # Generate 25 posts per department
    it_roles = ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Architect", "UI/UX Designer", "Product Designer", "QA Engineer", "Security Analyst", "Database Admin", "System Admin", "Network Engineer", "Mobile Developer", "Game Developer", "AI Researcher", "Blockchain Developer", "Cybersecurity Specialist", "Site Reliability Engineer", "Technical Writer", "Solutions Architect", "Data Engineer", "Platform Engineer"]
    
    marketing_roles = ["Digital Marketing Specialist", "Content Writer", "SEO Analyst", "Social Media Manager", "Brand Manager", "Marketing Coordinator", "Email Marketing Specialist", "PPC Specialist", "Content Strategist", "Influencer Marketing Manager", "Marketing Analyst", "Growth Hacker", "Community Manager", "PR Specialist", "Event Coordinator", "Creative Director", "Copywriter", "Video Marketing Specialist", "Affiliate Marketing Manager", "Marketing Automation Specialist", "Brand Strategist", "Market Research Analyst", "Campaign Manager", "Product Marketing Manager", "Digital Content Creator"]
    
    finance_roles = ["Financial Analyst", "Investment Analyst", "Accounting Intern", "Tax Associate", "Budget Analyst", "Credit Analyst", "Risk Analyst", "Treasury Analyst", "Audit Associate", "Financial Planner", "Portfolio Manager", "Compliance Officer", "Financial Controller", "Cost Accountant", "Payroll Specialist", "Accounts Payable Clerk", "Accounts Receivable Clerk", "Financial Advisor", "Insurance Underwriter", "Loan Officer", "Investment Banking Analyst", "Equity Research Analyst", "Derivatives Trader", "Financial Consultant", "Corporate Finance Analyst"]
    
    hr_roles = ["HR Generalist", "Talent Acquisition Specialist", "Recruiter", "HR Coordinator", "Training Coordinator", "Compensation Analyst", "Benefits Administrator", "Employee Relations Specialist", "HR Business Partner", "Organizational Development Specialist", "Performance Management Specialist", "HR Analytics Specialist", "Diversity & Inclusion Coordinator", "Learning & Development Specialist", "HR Information Systems Analyst", "Payroll Administrator", "HR Compliance Officer", "Talent Management Specialist", "Employee Engagement Coordinator", "HR Operations Specialist", "Workforce Planning Analyst", "HR Project Manager", "Culture & Engagement Manager", "HR Data Analyst", "Change Management Specialist"]
    
    role_lists = {1: it_roles, 2: marketing_roles, 3: finance_roles, 4: hr_roles}
    
    if dept_id not in role_lists:
        return {"posts": []}
    
    roles = role_lists[dept_id]
    posts = []
    
    for i, role in enumerate(roles):
        post_id = (dept_id - 1) * 25 + i + 1
        posts.append({
            "id": post_id,
            "title": role,
            "department": dept_id,
            "description": f"{role} position with growth opportunities",
            "applicants": random.randint(5, 30),
            "status": "open",
            "location": "Remote/Hybrid",
            "duration": "3-6 months"
        })
    
    return {"posts": posts}

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    return {"id": post_id, "title": "Software Engineer", "description": "Demo post"}

@app.get("/departments/{dept_id}/posts/{post_id}/applicants")
def get_applicants(dept_id: int, post_id: int):
    import random
    
    first_names = ["Alice", "Bob", "Carol", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack", "Kate", "Liam", "Maya", "Noah", "Olivia", "Paul", "Quinn", "Ruby", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xavier", "Yara", "Zoe", "Alex", "Blake", "Casey", "Drew"]
    last_names = ["Johnson", "Smith", "Davis", "Wilson", "Brown", "Miller", "Lee", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Lopez", "Hill", "Scott"]
    majors = ["Computer Science", "Information Technology", "Software Engineering", "Data Science", "Marketing", "Finance", "Human Resources", "Business Administration", "Economics", "Psychology", "Communications", "Engineering", "Mathematics", "Statistics"]
    years = ["Sophomore", "Junior", "Senior", "Graduate"]
    
    num_applicants = random.randint(8, 15)
    applicants = []
    
    for i in range(num_applicants):
        applicant_id = post_id * 100 + i + 1
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        
        applicants.append({
            "id": applicant_id,
            "name": f"{first_name} {last_name}",
            "email": f"{first_name.lower()}.{last_name.lower()}@university.edu",
            "gpa": round(random.uniform(3.0, 4.0), 2),
            "major": random.choice(majors),
            "year": random.choice(years),
            "post_id": post_id,
            "phone": f"+1-555-{random.randint(1000, 9999)}",
            "status": random.choice(["pending", "reviewed", "shortlisted"])
        })
    
    return {"applicants": applicants}

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
    import random
    
    # Generate dynamic profile based on applicant_id
    first_names = ["Alice", "Bob", "Carol", "David", "Emma", "Frank", "Grace", "Henry", "Ivy", "Jack"]
    last_names = ["Johnson", "Smith", "Davis", "Wilson", "Brown", "Miller", "Lee", "Taylor", "Anderson", "Thomas"]
    majors = ["Computer Science", "Information Technology", "Software Engineering", "Data Science", "Marketing", "Finance", "Human Resources", "Business Administration"]
    skill_sets = {
        "Computer Science": ["Python", "Java", "React", "SQL", "Git"],
        "Marketing": ["Digital Marketing", "SEO", "Content Creation", "Analytics", "Social Media"],
        "Finance": ["Excel", "Financial Modeling", "Bloomberg", "QuickBooks", "SAP"],
        "Human Resources": ["Recruitment", "HRIS", "Employee Relations", "Training", "Compliance"]
    }
    
    # Use applicant_id as seed for consistent data
    random.seed(applicant_id)
    
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    major = random.choice(majors)
    
    profile = {
        "id": applicant_id,
        "name": f"{first_name} {last_name}",
        "email": f"{first_name.lower()}.{last_name.lower()}@university.edu",
        "phone": f"+1-555-{random.randint(1000, 9999)}",
        "gpa": round(random.uniform(3.0, 4.0), 2),
        "major": major,
        "year": random.choice(["Sophomore", "Junior", "Senior", "Graduate"]),
        "skills": random.sample(skill_sets.get(major, ["Communication", "Teamwork", "Problem Solving"]), 3),
        "experience": random.choice(["Internship experience", "Project work", "Research assistant", "Part-time job", "Volunteer work"]),
        "resume_url": f"https://example.com/resumes/{applicant_id}.pdf",
        "linkedin": f"https://linkedin.com/in/{first_name.lower()}{last_name.lower()}",
        "github": f"https://github.com/{first_name.lower()}{last_name.lower()}" if major in ["Computer Science", "Software Engineering"] else None
    }
    
    return profile

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