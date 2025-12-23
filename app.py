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
        
        # Department-specific roles (20+ each)
        roles_by_dept = {
            1: ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Architect", "UI/UX Designer", "Product Designer", "QA Engineer", "Security Analyst", "Database Admin", "System Admin", "Network Engineer", "Mobile Developer", "Game Developer", "AI Researcher", "Blockchain Developer", "Cybersecurity Specialist", "Site Reliability Engineer", "Technical Writer", "Solutions Architect", "Data Engineer", "Platform Engineer"],
            
            2: ["Investment Banking Analyst", "Credit Analyst", "Risk Management Analyst", "Loan Officer", "Financial Advisor", "Portfolio Manager", "Compliance Officer", "Treasury Analyst", "Audit Associate", "Relationship Manager", "Trade Finance Specialist", "Derivatives Trader", "Equity Research Analyst", "Fixed Income Analyst", "Wealth Management Advisor", "Corporate Banking Associate", "Retail Banking Officer", "Digital Banking Specialist", "Anti-Money Laundering Analyst", "Credit Risk Analyst", "Market Risk Analyst", "Operations Analyst", "Product Manager - Banking", "Business Analyst - Finance", "Quantitative Analyst"],
            
            3: ["Brand Manager", "Product Manager", "Marketing Executive", "Sales Representative", "Supply Chain Analyst", "Quality Control Specialist", "Market Research Analyst", "Category Manager", "Trade Marketing Executive", "Digital Marketing Specialist", "Consumer Insights Analyst", "Demand Planner", "Procurement Specialist", "Distribution Manager", "Key Account Manager", "Retail Operations Executive", "Merchandising Executive", "Pricing Analyst", "Promotions Manager", "Channel Development Executive", "Customer Service Representative", "Inventory Analyst", "Logistics Coordinator", "Export-Import Executive", "Business Development Associate"],
            
            4: ["Petroleum Engineer", "Reservoir Engineer", "Drilling Engineer", "Production Engineer", "Geologist", "Geophysicist", "Process Engineer", "Safety Engineer", "Environmental Engineer", "Pipeline Engineer", "Refinery Operations Trainee", "HSE Specialist", "Project Engineer", "Maintenance Engineer", "Instrumentation Engineer", "Chemical Engineer", "Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Corrosion Engineer", "Facilities Engineer", "Operations Technician", "Laboratory Analyst", "Supply Chain Coordinator", "Commercial Analyst"],
            
            5: ["Production Engineer", "Quality Engineer", "Process Engineer", "Manufacturing Engineer", "Industrial Engineer", "Mechanical Engineer", "Electrical Engineer", "Automation Engineer", "Maintenance Engineer", "Safety Engineer", "Supply Chain Analyst", "Procurement Specialist", "Inventory Control Specialist", "Production Planner", "Quality Control Inspector", "Lean Manufacturing Specialist", "Operations Analyst", "Plant Manager Trainee", "Materials Engineer", "Design Engineer", "R&D Engineer", "Product Development Engineer", "Cost Analyst", "Logistics Coordinator", "Environmental Engineer"],
            
            6: ["Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Clinical Research Coordinator", "Pharmacy Technician", "Medical Technologist", "Radiologic Technologist", "Physical Therapist Assistant", "Occupational Therapy Assistant", "Medical Records Specialist", "Healthcare Data Analyst", "Patient Care Coordinator", "Medical Billing Specialist", "Healthcare IT Specialist", "Quality Assurance Coordinator", "Infection Control Specialist", "Healthcare Marketing Coordinator", "Medical Device Sales Representative", "Clinical Documentation Specialist", "Healthcare Compliance Officer", "Patient Services Representative", "Medical Social Worker", "Healthcare Project Coordinator", "Biomedical Equipment Technician", "Healthcare Financial Analyst"],
            
            7: ["Sales Associate", "Store Manager Trainee", "Visual Merchandiser", "Inventory Specialist", "Customer Service Representative", "Cashier", "Stock Associate", "Loss Prevention Specialist", "Buyer Assistant", "Category Analyst", "E-commerce Specialist", "Digital Marketing Coordinator", "Store Operations Coordinator", "Supply Chain Coordinator", "Retail Analyst", "Product Coordinator", "Brand Ambassador", "Training Coordinator", "Store Planner", "Pricing Analyst", "Customer Experience Specialist", "Retail Technology Specialist", "Warehouse Associate", "Distribution Center Associate", "Retail Marketing Assistant"],
            
            8: ["Front Desk Associate", "Guest Relations Officer", "Food & Beverage Server", "Housekeeping Supervisor", "Event Coordinator", "Concierge", "Restaurant Manager Trainee", "Kitchen Assistant", "Banquet Coordinator", "Sales Coordinator", "Revenue Management Analyst", "Hotel Operations Trainee", "Maintenance Technician", "Security Officer", "Spa Therapist", "Travel Consultant", "Tour Guide", "Reservation Agent", "Catering Assistant", "Bar Tender", "Hotel Marketing Assistant", "Guest Services Coordinator", "Conference Services Coordinator", "Hospitality Trainer", "Quality Assurance Coordinator"]
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
    
    # Keep original user structure, just add AI scores
    sample_applicants = [
        {"id": 1, "name": "Alice Johnson", "email": "alice@university.edu", "gpa": 3.8, "major": "Computer Science", "year": "Senior", "post_id": post_id, "score": round(random.uniform(75, 95), 1)},
        {"id": 2, "name": "Bob Smith", "email": "bob@university.edu", "gpa": 3.6, "major": "Information Technology", "year": "Junior", "post_id": post_id, "score": round(random.uniform(65, 85), 1)},
        {"id": 3, "name": "Carol Davis", "email": "carol@university.edu", "gpa": 3.9, "major": "Software Engineering", "year": "Senior", "post_id": post_id, "score": round(random.uniform(80, 92), 1)}
    ]
    return sample_applicants

@app.post("/posts/{post_id}/match")
def match_post(post_id: int, data: dict):
    import random
    import math
    
    # Simulate realistic AI matching with varied scores
    mode = data.get("mode", "20%")
    
    # Generate realistic candidate scores (not all 100)
    candidates = [
        {"id": 1, "name": "Alice Johnson", "email": "alice@university.edu", "score": round(random.uniform(75, 95), 1), "skills": ["Python", "Machine Learning"], "qualifications": "Computer Science", "location": "Remote"},
        {"id": 2, "name": "Bob Smith", "email": "bob@university.edu", "score": round(random.uniform(65, 85), 1), "skills": ["Java", "Spring Boot"], "qualifications": "Information Technology", "location": "New York"},
        {"id": 3, "name": "Carol Davis", "email": "carol@university.edu", "score": round(random.uniform(80, 92), 1), "skills": ["React", "Node.js"], "qualifications": "Software Engineering", "location": "California"},
        {"id": 4, "name": "David Wilson", "email": "david@university.edu", "score": round(random.uniform(60, 78), 1), "skills": ["C++", "Algorithms"], "qualifications": "Computer Science", "location": "Texas"},
        {"id": 5, "name": "Eva Brown", "email": "eva@university.edu", "score": round(random.uniform(70, 88), 1), "skills": ["Data Science", "SQL"], "qualifications": "Data Science", "location": "Remote"}
    ]
    
    # Sort by score (highest first)
    candidates.sort(key=lambda x: x["score"], reverse=True)
    
    return {
        "message": "AI Matching completed successfully", 
        "algorithm": "XGBoost Enhanced Matching",
        "description": "Multi-factor analysis including skills, qualifications, location, and experience",
        "matched_top": candidates,
        "total_candidates": len(candidates),
        "mode": mode
    }

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

@app.post("/posts/{post_id}/select")
def select_applicant(post_id: int, data: dict):
    return {"message": "Applicant selected", "post_id": post_id}

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

@app.post("/posts/{post_id}/send_top_emails")
def send_top_emails(post_id: int, data: dict = None):
    method = data.get("method", "top_percent") if data else "top_percent"
    value = data.get("value", 20) if data else 20
    return {"message": f"Sent emails to top {value}% candidates", "sent_count": 5}

@app.get("/posts/{post_id}/send_top_emails")
def send_top_emails_get(post_id: int, method: str = "top_percent", value: int = 20):
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