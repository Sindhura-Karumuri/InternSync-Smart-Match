#!/usr/bin/env python3
# test-resume-api.py - Test resume generation API

import requests
import json
import webbrowser
import os

def test_resume_api():
    """Test the resume generation API"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Resume Generation API")
    print("=" * 40)
    
    try:
        # Test 1: Generate resumes for all users
        print("1. 📝 Generating resumes for all users...")
        response = requests.post(f"{base_url}/generate-resumes")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Generated {data['generated_count']} resumes out of {data['total_users']} users")
        else:
            print(f"❌ Failed to generate resumes: {response.status_code}")
            return
        
        # Test 2: Get resume stats
        print("\n2. 📊 Getting resume statistics...")
        response = requests.get(f"{base_url}/resumes/stats")
        
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Resume Stats:")
            print(f"   Total Users: {stats['total_users']}")
            print(f"   Generated Resumes: {stats['generated_resumes']}")
            print(f"   Generation Rate: {stats['generation_percentage']}%")
        else:
            print(f"❌ Failed to get stats: {response.status_code}")
        
        # Test 3: Get specific applicant resume
        print("\n3. 👤 Testing specific applicant resume...")
        applicant_id = 1  # Test with first user
        response = requests.get(f"{base_url}/applicants/{applicant_id}/resume")
        
        if response.status_code == 200:
            resume_data = response.json()
            print(f"✅ Got resume for: {resume_data['name']}")
            print(f"   Generated at: {resume_data['generated_at']}")
            
            # Show some resume details
            resume = resume_data['resume_data']
            print(f"   Objective: {resume['objective'][:100]}...")
            print(f"   Skills: {', '.join(resume['skills']['technical'][:5])}")
            print(f"   Projects: {len(resume['projects'])} projects")
            print(f"   Experience: {len(resume['experience'])} positions")
        else:
            print(f"❌ Failed to get resume: {response.status_code}")
        
        # Test 4: Preview resume in browser
        print("\n4. 🌐 Testing resume preview...")
        preview_url = f"{base_url}/applicants/{applicant_id}/resume/preview"
        print(f"✅ Resume preview available at: {preview_url}")
        
        # Test 5: Download resume
        print("\n5. 📥 Testing resume download...")
        download_url = f"{base_url}/applicants/{applicant_id}/resume/download"
        print(f"✅ Resume download available at: {download_url}")
        
        # Open preview in browser
        open_browser = input("\n🌐 Open resume preview in browser? (y/n): ").lower().strip()
        if open_browser in ['y', 'yes']:
            webbrowser.open(preview_url)
            print("✅ Opened resume preview in browser")
        
        print("\n🎉 All resume API tests completed successfully!")
        
        # Show available endpoints
        print("\n📋 Available Resume Endpoints:")
        print(f"   POST {base_url}/generate-resumes - Generate all resumes")
        print(f"   GET  {base_url}/resumes/stats - Get resume statistics")
        print(f"   GET  {base_url}/applicants/{{id}}/resume - Get resume data")
        print(f"   GET  {base_url}/applicants/{{id}}/resume/preview - Preview resume")
        print(f"   GET  {base_url}/applicants/{{id}}/resume/download - Download resume")
        
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure it's running at http://localhost:8000")
        print("💡 Start server with: python -m uvicorn backend.main:app --reload --port 8000")
    except Exception as e:
        print(f"❌ Test failed: {e}")

def show_sample_resume_data():
    """Show what resume data looks like"""
    print("\n📄 Sample Resume Data Structure:")
    sample = {
        "personal_info": {
            "name": "John Doe",
            "email": "john.doe@university.edu",
            "phone": "+91-9876543210",
            "address": "123, MG Road, Bangalore",
            "linkedin": "linkedin.com/in/john-doe",
            "github": "github.com/johndoe"
        },
        "objective": "Passionate Computer Science graduate seeking to leverage programming skills...",
        "education": {
            "degree": "Bachelor of Computer Science",
            "university": "University of Excellence",
            "graduation_year": 2024,
            "gpa": 3.8,
            "relevant_coursework": ["Data Structures", "Algorithms", "Web Development"]
        },
        "skills": {
            "technical": ["Python", "JavaScript", "React", "Node.js"],
            "languages": ["English", "Hindi"],
            "soft_skills": ["Communication", "Teamwork", "Problem Solving"]
        },
        "experience": [
            {
                "company": "TechCorp",
                "position": "Software Developer Intern",
                "start_date": "June 2023",
                "end_date": "August 2023",
                "responsibilities": ["Developed web applications", "Collaborated with teams"],
                "achievements": ["Best Intern Award"]
            }
        ],
        "projects": [
            {
                "title": "E-commerce Website Development",
                "duration": "4 months",
                "description": "Built a full-stack e-commerce platform",
                "technologies": ["React", "Node.js", "MongoDB"]
            }
        ],
        "achievements": ["Dean's List", "Best Project Award"],
        "certifications": ["AWS Certified", "Google Cloud Certified"],
        "interests": ["Technology Innovation", "Open Source Contribution"]
    }
    
    print(json.dumps(sample, indent=2))

if __name__ == "__main__":
    test_resume_api()
    
    show_sample = input("\n📄 Show sample resume data structure? (y/n): ").lower().strip()
    if show_sample in ['y', 'yes']:
        show_sample_resume_data()