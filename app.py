from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import random

app = FastAPI(title="PM Internship Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Vercel frontend + localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Seed HR users ──────────────────────────────────────────────────────────────
SEED_HR_USERS = [
    {"email": "it.hr@example.com",          "password": "it12345",      "name": "Rajesh Kumar",    "department_id": 1, "category": "IT & Software"},
    {"email": "bank.hr@example.com",         "password": "bank12345",    "name": "Priya Sharma",    "department_id": 2, "category": "Banking & Finance"},
    {"email": "fmcg.hr@example.com",         "password": "fmcg12345",    "name": "Amit Patel",      "department_id": 3, "category": "FMCG"},
    {"email": "oil.hr@example.com",          "password": "oil12345",     "name": "Sunita Reddy",    "department_id": 4, "category": "Oil & Gas"},
    {"email": "mfg.hr@example.com",          "password": "mfg12345",     "name": "Vikram Singh",    "department_id": 5, "category": "Manufacturing"},
    {"email": "health.hr@example.com",       "password": "health12345",  "name": "Dr. Meera Joshi", "department_id": 6, "category": "Healthcare"},
    {"email": "retail.hr@example.com",       "password": "retail12345",  "name": "Neha Gupta",      "department_id": 7, "category": "Retail"},
    {"email": "hospitality.hr@example.com",  "password": "hosp12345",    "name": "Arjun Mehta",     "department_id": 8, "category": "Hospitality"},
]

# ── Department roles ───────────────────────────────────────────────────────────
ROLES_BY_DEPT = {
    1: ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "ML Engineer", "DevOps Engineer", "Cloud Architect", "UI/UX Designer", "Product Designer", "QA Engineer", "Security Analyst", "Database Admin", "System Admin", "Network Engineer", "Mobile Developer", "Game Developer", "AI Researcher", "Blockchain Developer", "Cybersecurity Specialist", "Site Reliability Engineer", "Technical Writer", "Solutions Architect", "Data Engineer", "Platform Engineer"],
    2: ["Investment Banking Analyst", "Credit Analyst", "Risk Management Analyst", "Loan Officer", "Financial Advisor", "Portfolio Manager", "Compliance Officer", "Treasury Analyst", "Audit Associate", "Relationship Manager", "Trade Finance Specialist", "Derivatives Trader", "Equity Research Analyst", "Fixed Income Analyst", "Wealth Management Advisor", "Corporate Banking Associate", "Retail Banking Officer", "Digital Banking Specialist", "Anti-Money Laundering Analyst", "Credit Risk Analyst", "Market Risk Analyst", "Operations Analyst", "Product Manager - Banking", "Business Analyst - Finance", "Quantitative Analyst"],
    3: ["Brand Manager", "Product Manager", "Marketing Executive", "Sales Representative", "Supply Chain Analyst", "Quality Control Specialist", "Market Research Analyst", "Category Manager", "Trade Marketing Executive", "Digital Marketing Specialist", "Consumer Insights Analyst", "Demand Planner", "Procurement Specialist", "Distribution Manager", "Key Account Manager", "Retail Operations Executive", "Merchandising Executive", "Pricing Analyst", "Promotions Manager", "Channel Development Executive", "Customer Service Representative", "Inventory Analyst", "Logistics Coordinator", "Export-Import Executive", "Business Development Associate"],
    4: ["Petroleum Engineer", "Reservoir Engineer", "Drilling Engineer", "Production Engineer", "Geologist", "Geophysicist", "Process Engineer", "Safety Engineer", "Environmental Engineer", "Pipeline Engineer", "Refinery Operations Trainee", "HSE Specialist", "Project Engineer", "Maintenance Engineer", "Instrumentation Engineer", "Chemical Engineer", "Mechanical Engineer", "Electrical Engineer", "Civil Engineer", "Corrosion Engineer", "Facilities Engineer", "Operations Technician", "Laboratory Analyst", "Supply Chain Coordinator", "Commercial Analyst"],
    5: ["Production Engineer", "Quality Engineer", "Process Engineer", "Manufacturing Engineer", "Industrial Engineer", "Mechanical Engineer", "Electrical Engineer", "Automation Engineer", "Maintenance Engineer", "Safety Engineer", "Supply Chain Analyst", "Procurement Specialist", "Inventory Control Specialist", "Production Planner", "Quality Control Inspector", "Lean Manufacturing Specialist", "Operations Analyst", "Plant Manager Trainee", "Materials Engineer", "Design Engineer", "R&D Engineer", "Product Development Engineer", "Cost Analyst", "Logistics Coordinator", "Environmental Engineer"],
    6: ["Registered Nurse", "Medical Assistant", "Healthcare Administrator", "Clinical Research Coordinator", "Pharmacy Technician", "Medical Technologist", "Radiologic Technologist", "Physical Therapist Assistant", "Occupational Therapy Assistant", "Medical Records Specialist", "Healthcare Data Analyst", "Patient Care Coordinator", "Medical Billing Specialist", "Healthcare IT Specialist", "Quality Assurance Coordinator", "Infection Control Specialist", "Healthcare Marketing Coordinator", "Medical Device Sales Representative", "Clinical Documentation Specialist", "Healthcare Compliance Officer", "Patient Services Representative", "Medical Social Worker", "Healthcare Project Coordinator", "Biomedical Equipment Technician", "Healthcare Financial Analyst"],
    7: ["Sales Associate", "Store Manager Trainee", "Visual Merchandiser", "Inventory Specialist", "Customer Service Representative", "Cashier", "Stock Associate", "Loss Prevention Specialist", "Buyer Assistant", "Category Analyst", "E-commerce Specialist", "Digital Marketing Coordinator", "Store Operations Coordinator", "Supply Chain Coordinator", "Retail Analyst", "Product Coordinator", "Brand Ambassador", "Training Coordinator", "Store Planner", "Pricing Analyst", "Customer Experience Specialist", "Retail Technology Specialist", "Warehouse Associate", "Distribution Center Associate", "Retail Marketing Assistant"],
    8: ["Front Desk Associate", "Guest Relations Officer", "Food & Beverage Server", "Housekeeping Supervisor", "Event Coordinator", "Concierge", "Restaurant Manager Trainee", "Kitchen Assistant", "Banquet Coordinator", "Sales Coordinator", "Revenue Management Analyst", "Hotel Operations Trainee", "Maintenance Technician", "Security Officer", "Spa Therapist", "Travel Consultant", "Tour Guide", "Reservation Agent", "Catering Assistant", "Bar Tender", "Hotel Marketing Assistant", "Guest Services Coordinator", "Conference Services Coordinator", "Hospitality Trainer", "Quality Assurance Coordinator"],
}

DEPT_NAMES = {
    1: "IT & Software", 2: "Banking & Finance", 3: "FMCG", 4: "Oil & Gas",
    5: "Manufacturing", 6: "Healthcare", 7: "Retail", 8: "Hospitality",
}

COMPANIES = ["TechCorp", "FinanceHub", "RetailGiant", "HealthPlus", "OilPro", "ManuFact", "HospitalityGroup", "FMCGBrands"]
STIPENDS = ["RM 800/month", "RM 1000/month", "RM 1200/month", "RM 1500/month", "RM 2000/month"]
DURATIONS = ["3 months", "4 months", "6 months"]

# In-memory state (resets on server restart — fine for demo)
_selected: dict[int, list] = {}   # post_id -> list of applicant dicts
_rejected: dict[int, list] = {}   # post_id -> list of applicant dicts

SAMPLE_APPLICANTS = [
    {"id": 1, "name": "Alice Johnson",  "email": "alice@university.edu",  "gpa": 3.8, "major": "Computer Science",    "year": "Senior", "skills": ["Python", "Machine Learning", "SQL"],       "qualifications": "Computer Science",    "location": "Remote"},
    {"id": 2, "name": "Bob Smith",      "email": "bob@university.edu",    "gpa": 3.6, "major": "Information Technology","year": "Junior", "skills": ["Java", "Spring Boot", "MySQL"],           "qualifications": "Information Technology","location": "New York"},
    {"id": 3, "name": "Carol Davis",    "email": "carol@university.edu",  "gpa": 3.9, "major": "Software Engineering", "year": "Senior", "skills": ["React", "Node.js", "TypeScript"],          "qualifications": "Software Engineering",  "location": "California"},
    {"id": 4, "name": "David Wilson",   "email": "david@university.edu",  "gpa": 3.4, "major": "Computer Science",    "year": "Junior", "skills": ["C++", "Algorithms", "Data Structures"],    "qualifications": "Computer Science",    "location": "Texas"},
    {"id": 5, "name": "Eva Brown",      "email": "eva@university.edu",    "gpa": 3.7, "major": "Data Science",        "year": "Senior", "skills": ["Data Science", "SQL", "Tableau"],           "qualifications": "Data Science",        "location": "Remote"},
    {"id": 6, "name": "Frank Lee",      "email": "frank@university.edu",  "gpa": 3.5, "major": "Electrical Engineering","year": "Senior","skills": ["MATLAB", "Circuit Design", "Python"],      "qualifications": "Electrical Engineering","location": "Chicago"},
    {"id": 7, "name": "Grace Kim",      "email": "grace@university.edu",  "gpa": 3.8, "major": "Business Analytics",  "year": "Senior", "skills": ["Excel", "Power BI", "SQL"],                "qualifications": "Business Analytics",  "location": "Remote"},
    {"id": 8, "name": "Henry Tan",      "email": "henry@university.edu",  "gpa": 3.3, "major": "Finance",             "year": "Junior", "skills": ["Financial Modeling", "Excel", "Bloomberg"], "qualifications": "Finance",             "location": "New York"},
]


def _build_post(dept_id: int, idx: int, role: str) -> dict:
    post_id = (dept_id - 1) * 25 + idx + 1
    positions = random.randint(2, 5)
    filled = len(_selected.get(post_id, []))
    total_applicants = len(SAMPLE_APPLICANTS)
    return {
        "id": post_id,
        "title": role,
        "department": dept_id,
        "description": f"{role} internship position with growth opportunities in {DEPT_NAMES.get(dept_id, 'the industry')}.",
        "status": "closed" if filled >= positions else "open",
        "location": "Remote/Hybrid",
        "duration": random.choice(DURATIONS),
        "positions": positions,
        "positions_filled": filled,
        "total_applicants": total_applicants,
        "company_name": COMPANIES[(dept_id - 1) % len(COMPANIES)],
        "stipend": random.choice(STIPENDS),
        "experience_required": "Fresh Graduate / Final Year",
        "application_deadline": "2026-06-30",
        "required_skills": SAMPLE_APPLICANTS[idx % len(SAMPLE_APPLICANTS)]["skills"],
    }


# ── Routes ─────────────────────────────────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "PM Internship Backend API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)


@app.post("/auth/login")
def login(credentials: dict):
    email = credentials.get("email", "").lower().strip()
    password = credentials.get("password", "")
    user = next((u for u in SEED_HR_USERS if u["email"] == email and u["password"] == password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "access_token": f"demo-token-{user['department_id']}",
        "token_type": "bearer",
        "department_id": user["department_id"],
        "name": user["name"],
        "category": user["category"],
    }


@app.post("/auth/register")
def register(user_data: dict):
    return {"message": "Registration successful — use demo credentials to log in."}


@app.get("/auth")
def auth_get(category: str = None):
    return {"message": "Auth endpoint", "category": category}


@app.get("/departments/{dept_id}/posts")
def get_department_posts(dept_id):
    try:
        dept_id = int(dept_id)
    except (ValueError, TypeError):
        dept_id = 1
    if dept_id not in ROLES_BY_DEPT:
        return []
    return [_build_post(dept_id, i, role) for i, role in enumerate(ROLES_BY_DEPT[dept_id])]


@app.get("/departments/{dept_id}/analytics")
def get_analytics(dept_id):
    try:
        dept_id = int(dept_id)
    except (ValueError, TypeError):
        dept_id = 1
    roles = ROLES_BY_DEPT.get(dept_id, [])
    total_posts = len(roles)
    total_applicants = total_posts * len(SAMPLE_APPLICANTS)
    total_selected = sum(len(v) for k, v in _selected.items() if (k - 1) // 25 + 1 == dept_id)
    total_rejected = sum(len(v) for k, v in _rejected.items() if (k - 1) // 25 + 1 == dept_id)
    return {
        "total_posts": total_posts,
        "total_applicants": total_applicants,
        "total_selected": total_selected,
        "total_rejected": total_rejected,
        "open_positions": total_posts - total_selected,
    }


@app.get("/posts/{post_id}")
def get_post(post_id: int):
    dept_id = (post_id - 1) // 25 + 1
    idx = (post_id - 1) % 25
    roles = ROLES_BY_DEPT.get(dept_id, [])
    if idx >= len(roles):
        raise HTTPException(status_code=404, detail="Post not found")
    return _build_post(dept_id, idx, roles[idx])


@app.get("/departments/{dept_id}/posts/{post_id}/applicants")
def get_applicants(dept_id, post_id: int):
    selected_ids = {a["id"] for a in _selected.get(post_id, [])}
    rejected_ids = {a["id"] for a in _rejected.get(post_id, [])}
    result = []
    for a in SAMPLE_APPLICANTS:
        app = dict(a)
        app["post_id"] = post_id
        app["score"] = round(random.uniform(60, 95), 1)
        if a["id"] in selected_ids:
            app["status"] = "selected"
        elif a["id"] in rejected_ids:
            app["status"] = "rejected"
        else:
            app["status"] = "pending"
        result.append(app)
    return result


@app.post("/posts/{post_id}/match")
def match_post(post_id: int, data: dict):
    mode = data.get("mode", "20%")
    candidates = []
    for a in SAMPLE_APPLICANTS:
        c = dict(a)
        c["score"] = round(random.uniform(60, 95), 1)
        candidates.append(c)
    candidates.sort(key=lambda x: x["score"], reverse=True)
    return {
        "message": "AI Matching completed successfully",
        "algorithm": "XGBoost Enhanced Matching",
        "description": "Multi-factor analysis including skills, qualifications, location, and experience",
        "matched_top": candidates,
        "total_candidates": len(candidates),
        "mode": mode,
    }


@app.post("/posts/{post_id}/select")
def select_applicant(post_id: int, data: dict):
    applicant_id = data.get("applicant_id")
    candidate = next((a for a in SAMPLE_APPLICANTS if a["id"] == applicant_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Applicant not found")

    post = get_post(post_id)
    already_selected = [a["id"] for a in _selected.get(post_id, [])]
    if applicant_id in already_selected:
        filled = len(already_selected)
        return {"message": "Already selected", "candidate": {**candidate, "post_id": post_id}, "positions_filled": filled, "total_positions": post["positions"], "position_closed": filled >= post["positions"]}

    candidate_with_post = {**candidate, "post_id": post_id}
    _selected.setdefault(post_id, []).append(candidate_with_post)
    # Remove from rejected if present
    _rejected[post_id] = [a for a in _rejected.get(post_id, []) if a["id"] != applicant_id]

    filled = len(_selected[post_id])
    position_closed = filled >= post["positions"]
    return {
        "message": "Applicant selected",
        "candidate": candidate_with_post,
        "positions_filled": filled,
        "total_positions": post["positions"],
        "position_closed": position_closed,
    }


@app.post("/posts/{post_id}/reject")
def reject_applicant(post_id: int, data: dict):
    applicant_id = data.get("applicant_id")
    candidate = next((a for a in SAMPLE_APPLICANTS if a["id"] == applicant_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Applicant not found")

    already_rejected = [a["id"] for a in _rejected.get(post_id, [])]
    if applicant_id not in already_rejected:
        _rejected.setdefault(post_id, []).append(candidate)
    # Remove from selected if present
    _selected[post_id] = [a for a in _selected.get(post_id, []) if a["id"] != applicant_id]

    return {"message": "Applicant rejected", "candidate": candidate}


@app.post("/posts/{post_id}/schedule")
def schedule_post(post_id: int, data: dict):
    import uuid
    meeting_id = str(uuid.uuid4())[:8]
    join_url = data.get("join_url") or f"https://meet.example.com/{meeting_id}"
    return {
        "message": "Interview scheduled and email sent successfully",
        "meeting_id": meeting_id,
        "join_url": join_url,
        "datetime": data.get("datetime_iso", ""),
    }


@app.get("/posts/{post_id}/meetings")
def get_meetings(post_id: int):
    return {"meetings": []}


@app.post("/posts/{post_id}/tiebreak")
def tiebreak(post_id: int, data: dict):
    return {"message": "Tiebreak created", "created": 2, "score": 85, "links": {}}


@app.post("/posts/{post_id}/tiebreak/send")
def send_tiebreak(post_id: int, data: dict):
    return {"message": "Tiebreak emails sent", "sent_count": 2}


@app.post("/posts/{post_id}/send_top_emails")
def send_top_emails(post_id: int, method: str = "top_percent", value: int = 20, data: dict = None):
    emails = [
        {"to": a["email"], "subject": f"Internship Opportunity - Post #{post_id}", "body": f"Dear {a['name']},\n\nYou have been shortlisted for an internship position.\n\nRegards,\nHR Team", "applicant_id": a["id"]}
        for a in SAMPLE_APPLICANTS[:3]
    ]
    return {"message": f"Emails sent to top candidates", "sent_count": len(emails), "emails": emails}


@app.get("/posts/{post_id}/send_top_emails")
def send_top_emails_get(post_id: int, method: str = "top_percent", value: int = 20):
    return {"message": f"Sent emails to top {value}% candidates", "sent_count": 3}


@app.get("/applicants/{applicant_id}/resume/download")
def download_resume(applicant_id: int):
    candidate = next((a for a in SAMPLE_APPLICANTS if a["id"] == applicant_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Applicant not found")
    content = f"""RESUME
======
Name:  {candidate['name']}
Email: {candidate['email']}
Major: {candidate['major']}
GPA:   {candidate['gpa']}
Year:  {candidate['year']}
Skills: {', '.join(candidate['skills'])}
"""
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(
        content=content,
        headers={"Content-Disposition": f"attachment; filename=resume_{applicant_id}.txt"}
    )


@app.get("/applicants/{applicant_id}/resume/preview")
def preview_resume(applicant_id: int):
    candidate = next((a for a in SAMPLE_APPLICANTS if a["id"] == applicant_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Applicant not found")
    from fastapi.responses import HTMLResponse
    html = f"""<html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px;border:1px solid #ddd;border-radius:8px">
<h1>{candidate['name']}</h1>
<p>📧 {candidate['email']} | 📍 {candidate['location']}</p>
<hr/>
<h2>Education</h2>
<p><b>{candidate['major']}</b> — GPA: {candidate['gpa']} | {candidate['year']}</p>
<h2>Skills</h2>
<p>{', '.join(candidate['skills'])}</p>
<h2>Qualifications</h2>
<p>{candidate['qualifications']}</p>
</body></html>"""
    return HTMLResponse(content=html)


@app.get("/applicants/{applicant_id}")
def get_applicant(applicant_id: int):
    candidate = next((a for a in SAMPLE_APPLICANTS if a["id"] == applicant_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Applicant not found")
    return candidate


@app.get("/departments/{dept}/rejected")
def get_rejected(dept: str):
    try:
        dept_id = int(dept)
    except (ValueError, TypeError):
        return []
    result = []
    for post_id, applicants in _rejected.items():
        if (post_id - 1) // 25 + 1 == dept_id:
            result.extend(applicants)
    return result


@app.get("/departments/{dept}/selected")
def get_selected(dept: str):
    try:
        dept_id = int(dept)
    except (ValueError, TypeError):
        return []
    result = []
    for post_id, applicants in _selected.items():
        if (post_id - 1) // 25 + 1 == dept_id:
            result.extend(applicants)
    return result


@app.get("/departments/{dept}/closed")
def get_closed(dept: str):
    try:
        dept_id = int(dept)
    except (ValueError, TypeError):
        return []
    roles = ROLES_BY_DEPT.get(dept_id, [])
    result = []
    for i, role in enumerate(roles):
        post_id = (dept_id - 1) * 25 + i + 1
        sel = _selected.get(post_id, [])
        post = _build_post(dept_id, i, role)
        if post["status"] == "closed":
            result.append({
                **post,
                "closed_at": "2026-03-18",
                "selected_candidates_count": len(sel),
            })
    return result


@app.get("/departments/{dept}/selected/export")
def export_selected(dept: str):
    return {"export_url": f"demo-export-dept-{dept}.csv"}


@app.get("/dashboard")
def get_dashboard():
    return {
        "departments": [
            {"id": i, "name": name, "posts_count": len(ROLES_BY_DEPT.get(i, []))}
            for i, name in DEPT_NAMES.items()
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
