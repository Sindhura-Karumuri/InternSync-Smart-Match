# 🚀 InternSync Smart Match

**AI-Powered Internship Matching Platform with Advanced Analytics & Resume Generation**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org)
[![AWS](https://img.shields.io/badge/AWS-Ready-orange.svg)](https://aws.amazon.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black.svg)](https://intern-sync-smart-match.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **🌐 [Live Application](https://intern-sync-smart-match.vercel.app/)** - Try it now!

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Overview

InternSync Smart Match is a comprehensive AI-powered platform that revolutionizes internship recruitment by intelligently matching candidates with positions across 8 major industry domains. The platform features advanced analytics, automated resume generation, and seamless HR management tools.

> **🌐 [Try the Live Application](https://intern-sync-smart-match.vercel.app/)** - Fully deployed and functional!

### 🔑 Quick Access (Live Demo)
Use these HR credentials to explore the platform:
- **IT HR**: `it.hr@example.com` / `it12345`
- **Banking HR**: `bank.hr@example.com` / `bank12345`
- **FMCG HR**: `fmcg.hr@example.com` / `fmcg12345`

### 🏢 Supported Industries
- **IT & Software** - 25+ roles including Full Stack, AI/ML, DevOps
- **Banking & Finance** - Investment Banking, Risk Management, Financial Analysis
- **FMCG** - Brand Management, Marketing, Supply Chain
- **Oil & Gas** - Petroleum Engineering, Process Engineering, Safety
- **Manufacturing** - Production Engineering, Quality Control, Automation
- **Healthcare** - Clinical Research, Healthcare IT, Medical Administration
- **Retail** - Store Management, E-commerce, Customer Experience
- **Hospitality** - Hotel Management, Event Planning, Tourism

## ✨ Features

### 🤖 AI-Powered Matching
- **Smart Algorithm**: Advanced matching based on skills, GPA, experience, and major compatibility
- **Real-time Scoring**: Dynamic candidate scoring with 60-95% accuracy range
- **Department-Specific Logic**: Tailored matching criteria for each industry domain

### 📊 Advanced Analytics Dashboard
- **Diversity Metrics**: Rural/Urban, Gender, Category distribution analysis
- **Performance Insights**: AI accuracy rates, time savings, skill match percentages
- **Geographic Distribution**: Metro, Tier-2, Tier-3, Rural candidate mapping
- **Educational Background**: Engineering, Management, Science distribution

### 📄 Automated Resume Generation
- **AI-Generated Content**: Realistic resumes based on candidate profiles
- **Department-Specific**: Industry-relevant skills, projects, and experience
- **Professional Formatting**: Clean HTML resumes with download/preview options
- **Bulk Generation**: Generate resumes for all 240+ candidates instantly

### 🎛️ HR Management Tools
- **Multi-Department Access**: 8 specialized HR dashboards
- **Candidate Selection**: Select, reject, and manage candidate pipelines
- **Interview Scheduling**: Automated interview coordination
- **Email Integration**: Bulk email sending to top candidates
- **CSV Export**: Export selected candidates with complete profiles

### 🌐 Cloud-Ready Architecture
- **AWS Integration**: RDS, S3, SES, Lambda support
- **LLM Integration**: OpenAI GPT-3.5 for intelligent features
- **Scalable Design**: Microservices architecture with FastAPI
- **Modern Frontend**: React with Tailwind CSS and responsive design

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **Database**: SQLite (Local) / PostgreSQL (AWS RDS)
- **AI/ML**: Custom matching algorithms + OpenAI GPT-3.5
- **Cloud**: AWS (RDS, S3, SES, Lambda)
- **Authentication**: JWT-based HR authentication

### Frontend
- **Framework**: React 18.2+ with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Chart.js with React integration
- **Routing**: React Router DOM

### DevOps & Deployment
- **Containerization**: Docker & Docker Compose
- **Serverless**: AWS Lambda ready
- **CI/CD**: GitHub Actions compatible
- **Monitoring**: Built-in health checks and analytics

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/SindhuraKarumuri/InternSync-Smart-Match.git
cd InternSync-Smart-Match/pm-internship-prototype2
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start backend server
cd backend
python main.py
```
Backend will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
# Install Node dependencies
cd frontend
npm install

# Start development server
npm run dev
```
Frontend will be available at `http://localhost:5174`

### 4. Generate Sample Data
```bash
# Generate resumes for all users
curl -X POST http://localhost:8000/generate-resumes
```

### 5. Access HR Dashboard
Use these credentials to login:
- **IT HR**: `it.hr@example.com` / `it12345`
- **Banking HR**: `bank.hr@example.com` / `bank12345`
- **FMCG HR**: `fmcg.hr@example.com` / `fmcg12345`

## 📚 API Documentation

### Core Endpoints
```
GET  /health                              # Health check
GET  /dashboard                           # Departments overview
POST /auth/login                          # HR authentication
```

### Department & Posts
```
GET  /departments/{dept_id}/posts         # Get department posts
GET  /posts/{post_id}                     # Get specific post
GET  /departments/{dept_id}/posts/{post_id}/applicants  # Get applicants
```

### AI Matching & Selection
```
POST /posts/{post_id}/match               # Run AI matching
POST /posts/{post_id}/select              # Select candidate
POST /posts/{post_id}/reject              # Reject candidate
```

### Resume Generation
```
POST /generate-resumes                    # Generate all resumes
GET  /applicants/{id}/resume              # Get resume data
GET  /applicants/{id}/resume/download     # Download resume
GET  /applicants/{id}/resume/preview      # Preview resume
GET  /resumes/stats                       # Resume statistics
```

### Analytics & Export
```
GET  /departments/{dept_id}/analytics     # Department analytics
GET  /departments/{dept}/selected/export  # Export CSV
```

[📖 **Complete API Documentation**](API_DOCUMENTATION.md)

## 📁 Project Structure

```
InternSync-Smart-Match/
├── pm-internship-prototype2/
│   ├── backend/
│   │   ├── main.py                 # Main FastAPI application
│   │   ├── main_aws.py            # AWS-integrated version
│   │   ├── resume_generator.py    # Resume generation service
│   │   ├── llm_services.py        # LLM integration
│   │   ├── database.py            # Database models
│   │   └── aws_services.py        # AWS services integration
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── pages/             # React components
│   │   │   ├── utils/             # Utilities and API client
│   │   │   └── App.jsx            # Main React app
│   │   ├── package.json
│   │   └── vite.config.js
│   ├── k8s/                       # Kubernetes configurations
│   ├── requirements.txt           # Python dependencies
│   ├── docker-compose.yml         # Docker setup
│   └── README.md                  # Project documentation
└── README.md                      # This file
```

## 🌟 Key Highlights

### 📈 Scale & Performance
- **240+ Candidates** across 8 departments
- **100% Resume Generation** success rate
- **35+ API Endpoints** for comprehensive functionality
- **Real-time Analytics** with department-specific insights

### 🎯 Smart Features
- **Minimum 5 posts per department** with realistic company data
- **25+ candidates per post** with complete profiles
- **Department-specific content** for resumes and job descriptions
- **Automated position closing** when requirements are met

### 🔒 Enterprise Ready
- **JWT Authentication** for HR users
- **Role-based Access Control** by department
- **Data Export Capabilities** with CSV format
- **Cloud Deployment Ready** with AWS integration

## 🚀 Deployment

### 🌐 Live Production (Vercel)
The application is currently deployed and running at:
**https://intern-sync-smart-match.vercel.app/**

### Local Development
```bash
# Start both services
docker-compose up -d
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel --prod

# For full-stack deployment with API routes
vercel --prod
```

### AWS Deployment
```bash
# Setup AWS services
python quick-start-aws.py

# Deploy to Lambda
serverless deploy
```

### Kubernetes
```bash
# Deploy to K8s cluster
kubectl apply -f k8s/
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

**Repository**: [https://github.com/SindhuraKarumuri/InternSync-Smart-Match](https://github.com/SindhuraKarumuri/InternSync-Smart-Match)

## 📊 Project Stats

- **Lines of Code**: 5000+
- **API Endpoints**: 35+
- **Departments Covered**: 8
- **Sample Users**: 240+
- **Resume Templates**: Department-specific
- **Test Coverage**: Comprehensive API testing

## 🏆 Achievements

✅ **Complete AI Matching System** with department-specific algorithms  
✅ **Automated Resume Generation** for all candidates  
✅ **Advanced Analytics Dashboard** with diversity metrics  
✅ **Multi-Department HR Management** with role-based access  
✅ **Cloud-Ready Architecture** with AWS integration  
✅ **LLM Integration** for intelligent candidate analysis  
✅ **Professional UI/UX** with responsive design  
✅ **Comprehensive API Documentation** with 35+ endpoints  

## 🌐 Live Demo

**🚀 [View Live Application](https://intern-sync-smart-match.vercel.app/)**

The application is deployed on Vercel and fully functional. You can:
- Login with HR credentials
- Explore the AI matching system
- View candidate profiles with resume download/preview
- Access analytics dashboards
- Test all features in real-time

## 📞 Support

For support, create an issue in this repository or contact the development team.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the InternSync Team

[🌐 Live Demo](https://intern-sync-smart-match.vercel.app/) | [📚 API Documentation](API_DOCUMENTATION.md) | [🐛 Report Bug](https://github.com/SindhuraKarumuri/InternSync-Smart-Match/issues)

</div>

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the InternSync Team

[🌐 Live Demo](https://intern-sync-smart-match.vercel.app/) | [📚 Documentation](API_DOCUMENTATION.md) | [🐛 Report Bug](https://github.com/yourusername/InternSync-Smart-Match/issues)

</div>