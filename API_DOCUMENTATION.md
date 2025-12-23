# 📚 InternSync Smart Match - Complete API Documentation

## 🌐 Base URL
```
Live Production: https://intern-sync-smart-match.vercel.app/
Local Development: http://localhost:8000
```

> **🚀 Live Demo**: The application is fully deployed and functional at [https://intern-sync-smart-match.vercel.app/](https://intern-sync-smart-match.vercel.app/)
> 
> **Note**: The live version runs the frontend on Vercel. For full backend API functionality including resume generation and advanced features, you may need to run the backend locally.

## 🔐 Authentication

All HR endpoints require authentication. Use the login endpoint to get a token.

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "it.hr@example.com",
  "password": "it12345"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "access_token": "demo-token",
  "user": {
    "email": "it.hr@example.com",
    "name": "Rajesh Kumar",
    "department_id": 1,
    "category": "IT & Software"
  }
}
```

## 🏠 Core System APIs

### Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "healthy"
}
```

### System Info
```http
GET /
```
**Response:**
```json
{
  "message": "InternSync Smart Match API",
  "status": "running",
  "algorithm": "Enhanced AI Matching"
}
```

### Dashboard Overview
```http
GET /dashboard
```
**Response:**
```json
{
  "departments": [
    {
      "id": 1,
      "name": "IT & Software",
      "posts_count": 25
    }
  ]
}
```

## 🏢 Department & Posts APIs

### Get Department Posts
```http
GET /departments/{dept_id}/posts
```

**Parameters:**
- `dept_id` (int): Department ID (1-8)

**Response:**
```json
[
  {
    "id": 1,
    "title": "Software Engineer",
    "department": 1,
    "description": "Join our dynamic team to develop cutting-edge software solutions...",
    "positions": 5,
    "positions_filled": 2,
    "total_applicants": 45,
    "status": "open",
    "location": "Bangalore",
    "duration": "6 months",
    "stipend": "₹35,000/month",
    "required_skills": ["Python", "JavaScript", "React"],
    "company_name": "TechCorp Solutions",
    "application_deadline": "2024-02-15",
    "start_date": "2024-03-01"
  }
]
```

### Get Specific Post
```http
GET /posts/{post_id}
```

**Parameters:**
- `post_id` (int): Post ID

**Response:**
```json
{
  "id": 1,
  "title": "Software Engineer",
  "department": 1,
  "positions": 5,
  "positions_filled": 2,
  "status": "open",
  "total_applicants": 45
}
```

### Get Post Applicants
```http
GET /departments/{dept_id}/posts/{post_id}/applicants
```

**Parameters:**
- `dept_id` (int): Department ID
- `post_id` (int): Post ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "gpa": 3.8,
    "major": "Computer Science",
    "skills": ["Python", "JavaScript", "React"],
    "score": 87.5,
    "match_reasons": [
      "Strong technical skills match",
      "Excellent academic performance",
      "Relevant project experience"
    ]
  }
]
```

## 🤖 AI Matching & Selection APIs

### Run AI Matching
```http
POST /posts/{post_id}/match
Content-Type: application/json

{
  "mode": "20%"
}
```

**Parameters:**
- `post_id` (int): Post ID
- `mode` (string): Matching mode ("20%", "positions", "all")

**Response:**
```json
{
  "message": "Matching completed successfully",
  "matched_count": 12,
  "total_applicants": 45,
  "mode": "20%"
}
```

### Select Candidate
```http
POST /posts/{post_id}/select
Content-Type: application/json

{
  "applicant_id": 123
}
```

**Response:**
```json
{
  "message": "Candidate selected successfully",
  "candidate": {
    "id": 123,
    "name": "John Doe",
    "selected_at": "2024-01-15T10:30:00Z"
  }
}
```

### Reject Candidate
```http
POST /posts/{post_id}/reject
Content-Type: application/json

{
  "applicant_id": 123
}
```

**Response:**
```json
{
  "message": "Candidate rejected successfully",
  "candidate": {
    "id": 123,
    "name": "John Doe"
  }
}
```

## 📄 Resume Generation APIs

### Generate All Resumes
```http
POST /generate-resumes
```

**Response:**
```json
{
  "message": "Resumes generated successfully",
  "generated_count": 243,
  "total_users": 243
}
```

### Get Resume Statistics
```http
GET /resumes/stats
```

**Response:**
```json
{
  "total_users": 243,
  "generated_resumes": 243,
  "generation_percentage": 100.0,
  "department_stats": {
    "1": {"total": 35, "generated": 35},
    "2": {"total": 30, "generated": 30}
  }
}
```

### Get Applicant Resume
```http
GET /applicants/{applicant_id}/resume
```

**Response:**
```json
{
  "applicant_id": 1,
  "name": "John Doe",
  "resume_data": {
    "personal_info": {
      "name": "John Doe",
      "email": "john.doe@university.edu",
      "phone": "+91-9876543210",
      "linkedin": "linkedin.com/in/john-doe"
    },
    "objective": "Passionate Computer Science graduate seeking...",
    "education": {
      "degree": "Bachelor of Computer Science",
      "university": "University of Excellence",
      "gpa": 3.8
    },
    "skills": {
      "technical": ["Python", "JavaScript", "React"],
      "soft_skills": ["Communication", "Teamwork"]
    },
    "projects": [
      {
        "title": "E-commerce Website Development",
        "duration": "4 months",
        "technologies": ["React", "Node.js"]
      }
    ]
  },
  "generated_at": "2024-01-15T10:30:00Z"
}
```

### Download Resume
```http
GET /applicants/{applicant_id}/resume/download
```

**Response:** HTML file download with professional resume formatting

### Preview Resume
```http
GET /applicants/{applicant_id}/resume/preview
```

**Response:** HTML content for browser preview

## 📊 Analytics & Reporting APIs

### Department Analytics
```http
GET /departments/{dept_id}/analytics
```

**Response:**
```json
{
  "department_id": 1,
  "total_applicants": 156,
  "diversity_metrics": {
    "rural_percentage": 23.1,
    "female_percentage": 43.6,
    "reserved_percentage": 35.2,
    "first_time_percentage": 67.3,
    "category_distribution": {
      "General": 101,
      "OBC": 35,
      "SC": 15,
      "ST": 5
    },
    "gender_distribution": {
      "Male": 88,
      "Female": 68
    }
  },
  "ai_metrics": {
    "accuracy": 87.3,
    "avg_score": 78.5,
    "time_saved": 65,
    "skill_match": 92
  },
  "geographic_distribution": {
    "metro": 45,
    "tier2": 35,
    "tier3": 15,
    "rural": 5
  },
  "educational_distribution": {
    "engineering": 75,
    "management": 15,
    "science": 8,
    "others": 2
  }
}
```

### Get Selected Candidates
```http
GET /departments/{dept}/selected
```

**Response:**
```json
[
  {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@university.edu",
    "post_id": 1,
    "post_title": "Software Engineer",
    "selected_at": "2024-01-15T10:30:00Z",
    "gpa": 3.8,
    "skills": ["Python", "JavaScript"]
  }
]
```

### Export Selected Candidates
```http
GET /departments/{dept}/selected/export
```

**Response:** CSV file download with complete candidate data

## 📧 Communication APIs

### Send Emails to Top Candidates
```http
POST /posts/{post_id}/send_top_emails
Content-Type: application/json

{
  "method": "top_percent",
  "value": 20
}
```

**Parameters:**
- `method` (string): "top_percent" or "positions"
- `value` (int): Percentage or number of positions

**Response:**
```json
{
  "message": "Emails sent to top 12 candidates",
  "sent_count": 12,
  "method": "top_percent",
  "value": 20,
  "recipients": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@university.edu"
    }
  ]
}
```

## 📅 Interview Management APIs

### Schedule Interview
```http
POST /posts/{post_id}/schedule
Content-Type: application/json

{
  "applicant_id": 123,
  "interview_date": "2024-02-01",
  "interview_time": "10:00"
}
```

**Response:**
```json
{
  "message": "Scheduled successfully"
}
```

### Get Meetings
```http
GET /posts/{post_id}/meetings
```

**Response:**
```json
{
  "meetings": []
}
```

## 🤖 LLM Integration APIs (AWS Version)

### LLM Candidate Analysis
```http
POST /posts/{post_id}/llm-analysis
Content-Type: application/json

{
  "candidate_id": 123
}
```

### Generate Interview Questions
```http
POST /posts/{post_id}/generate-interview-questions
Content-Type: application/json

{
  "candidate_id": 123,
  "difficulty": "medium"
}
```

### Generate Personalized Email
```http
POST /posts/{post_id}/llm-email
Content-Type: application/json

{
  "candidate_id": 123,
  "email_type": "selection"
}
```

### Extract Skills from Text
```http
POST /extract-skills-from-text
Content-Type: application/json

{
  "text": "I have experience in Python, JavaScript, and React development..."
}
```

### LLM Status
```http
GET /llm/status
```

## 🔧 Error Handling

All APIs return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error description",
  "message": "Detailed error message"
}
```

## 📝 HR Login Credentials

For testing purposes, use these credentials:

| Department | Email | Password |
|------------|-------|----------|
| IT & Software | `it.hr@example.com` | `it12345` |
| Banking & Finance | `bank.hr@example.com` | `bank12345` |
| FMCG | `fmcg.hr@example.com` | `fmcg12345` |
| Oil & Gas | `oil.hr@example.com` | `oil12345` |
| Manufacturing | `mfg.hr@example.com` | `mfg12345` |
| Healthcare | `health.hr@example.com` | `health12345` |
| Retail | `retail.hr@example.com` | `retail12345` |
| Hospitality | `hospitality.hr@example.com` | `hosp12345` |

## 🚀 Rate Limits

- **Standard APIs**: 100 requests/minute
- **Resume Generation**: 10 requests/minute
- **Analytics**: 50 requests/minute
- **LLM APIs**: 20 requests/minute

## 📊 Response Times

- **Standard APIs**: < 200ms
- **AI Matching**: < 2s
- **Resume Generation**: < 5s
- **Analytics**: < 1s
- **LLM APIs**: < 10s

---

For more information, visit the [main documentation](README.md) or check out the repository at [https://github.com/SindhuraKarumuri/InternSync-Smart-Match](https://github.com/SindhuraKarumuri/InternSync-Smart-Match).