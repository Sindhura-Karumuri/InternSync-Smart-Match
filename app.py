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
    sample_posts = [
        {"id": 1, "title": "Software Engineer", "department": dept_id, "description": "Full-stack development role", "applicants": 15},
        {"id": 2, "title": "Data Scientist", "department": dept_id, "description": "ML and analytics role", "applicants": 8},
        {"id": 3, "title": "Product Manager", "department": dept_id, "description": "Product strategy and management", "applicants": 12},
        {"id": 4, "title": "UI/UX Designer", "department": dept_id, "description": "User interface and experience design", "applicants": 6},
        {"id": 5, "title": "DevOps Engineer", "department": dept_id, "description": "Infrastructure and deployment", "applicants": 4}
    ]
    return {"posts": sample_posts}

@app.get("/posts/{post_id}")
def get_post(post_id: int):
    return {"id": post_id, "title": "Software Engineer", "description": "Demo post"}

@app.get("/departments/{dept_id}/posts/{post_id}/applicants")
def get_applicants(dept_id: int, post_id: int):
    return {"applicants": [{"id": 1, "name": "John Doe", "post_id": post_id}]}

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
    return {"id": applicant_id, "name": "John Doe", "email": "john@example.com"}

@app.get("/departments/{dept}/rejected")
def get_rejected(dept: str):
    return {"rejected": []}

@app.get("/departments/{dept}/selected")
def get_selected(dept: str):
    return {"selected": []}

@app.get("/departments/{dept}/selected/export")
def export_selected(dept: str):
    return {"export_url": "demo-export.csv"}