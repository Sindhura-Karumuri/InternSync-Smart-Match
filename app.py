from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

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

@app.get("/favicon.ico")
def favicon():
    return {"message": "No favicon"}



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
def get_department_posts(dept_id):
    try:
        import random
        
        # Simple roles for each department
        roles_by_dept = {
            1: ["Software Engineer", "Data Scientist", "DevOps Engineer", "UI/UX Designer", "Product Manager"],
            2: ["Investment Analyst", "Credit Analyst", "Risk Analyst", "Loan Officer", "Financial Advisor"],
            3: ["Brand Manager", "Product Manager", "Marketing Executive", "Sales Representative", "Supply Chain Analyst"],
            4: ["Petroleum Engineer", "Reservoir Engineer", "Drilling Engineer", "Geologist", "Process Engineer"],
            5: ["Production Engineer", "Quality Engineer", "Manufacturing Engineer", "Industrial Engineer", "Safety Engineer"],
            6: ["Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Clinical Research Coordinator", "Pharmacy Technician"],
            7: ["Sales Associate", "Store Manager", "Visual Merchandiser", "Inventory Specialist", "Customer Service Representative"],
            8: ["Front Desk Associate", "Guest Relations Officer", "Event Coordinator", "Food & Beverage Server", "Concierge"]
        }
        
        # Handle string or undefined dept_id
        try:
            dept_id = int(dept_id)
        except (ValueError, TypeError):
            dept_id = 1  # Default to IT department
            
        if dept_id not in roles_by_dept:
            return []
        
        roles = roles_by_dept[dept_id]
        posts = []
        
        for i, role in enumerate(roles):
            post_id = (dept_id - 1) * 5 + i + 1
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
        
        return posts
    except Exception as e:
        return []

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    return {"id": post_id, "title": "Sample Role", "description": "Demo post"}

@app.get("/departments/{dept_id}/posts/{post_id}/applicants")
def get_applicants(dept_id, post_id: int):
    import random
    
    # Handle undefined dept_id
    try:
        dept_id = int(dept_id)
    except (ValueError, TypeError):
        dept_id = 1
    
    sample_applicants = [
        {"id": 1, "name": "Alice Johnson", "email": "alice@university.edu", "gpa": 3.8, "major": "Computer Science", "year": "Senior", "post_id": post_id},
        {"id": 2, "name": "Bob Smith", "email": "bob@university.edu", "gpa": 3.6, "major": "Information Technology", "year": "Junior", "post_id": post_id},
        {"id": 3, "name": "Carol Davis", "email": "carol@university.edu", "gpa": 3.9, "major": "Software Engineering", "year": "Senior", "post_id": post_id}
    ]
    return sample_applicants

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
    return {"id": applicant_id, "name": "Sample Student", "email": "student@university.edu", "gpa": 3.7, "major": "Computer Science"}

@app.get("/departments/{dept}/rejected")
def get_rejected(dept: str):
    return []

@app.get("/departments/{dept}/selected")
def get_selected(dept: str):
    return []

@app.get("/departments/{dept}/selected/export")
def export_selected(dept: str):
    return {"export_url": "demo-export.csv"}

@app.get("/posts/{post_id}/send_top_emails")
def send_top_emails(post_id: int, method: str = "top_percent", value: int = 20):
    return {"message": f"Sent emails to top {value}% candidates", "sent_count": 5}

@app.get("/dashboard")
def get_dashboard():
    return {
        "departments": [
            {"id": 1, "name": "IT & Software", "posts_count": 5},
            {"id": 2, "name": "Banking & Finance", "posts_count": 5},
            {"id": 3, "name": "FMCG", "posts_count": 5},
            {"id": 4, "name": "Oil & Gas", "posts_count": 5},
            {"id": 5, "name": "Manufacturing", "posts_count": 5},
            {"id": 6, "name": "Healthcare", "posts_count": 5},
            {"id": 7, "name": "Retail", "posts_count": 5},
            {"id": 8, "name": "Hospitality", "posts_count": 5}
        ]
    }