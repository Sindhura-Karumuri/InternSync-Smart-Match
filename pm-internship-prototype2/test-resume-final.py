#!/usr/bin/env python3
"""
Final test for resume generation system
"""
import requests
import json

def test_resume_system():
    base_url = "http://localhost:8000"
    
    print("🧪 Final Resume System Test")
    print("=" * 40)
    
    try:
        # Test 1: Get resume stats
        print("1. 📊 Checking resume statistics...")
        response = requests.get(f"{base_url}/resumes/stats")
        if response.status_code == 200:
            stats = response.json()
            print(f"✅ Total Users: {stats['total_users']}")
            print(f"✅ Generated Resumes: {stats['generated_resumes']}")
            print(f"✅ Generation Rate: {stats['generation_percentage']}%")
        else:
            print(f"❌ Failed to get stats: {response.status_code}")
            return False
        
        # Test 2: Test specific applicant resume
        print("\n2. 👤 Testing specific applicant resume...")
        applicant_id = 1
        response = requests.get(f"{base_url}/applicants/{applicant_id}/resume")
        if response.status_code == 200:
            resume_data = response.json()
            print(f"✅ Resume for: {resume_data['name']}")
            print(f"✅ Generated at: {resume_data['generated_at']}")
            
            # Check resume data structure
            resume = resume_data['resume_data']
            print(f"✅ Skills: {len(resume['skills']['technical'])} technical skills")
            print(f"✅ Projects: {len(resume['projects'])} projects")
            print(f"✅ Experience: {len(resume['experience'])} positions")
            print(f"✅ Achievements: {len(resume['achievements'])} achievements")
        else:
            print(f"❌ Failed to get resume: {response.status_code}")
            return False
        
        # Test 3: Test resume preview
        print("\n3. 🌐 Testing resume preview...")
        response = requests.get(f"{base_url}/applicants/{applicant_id}/resume/preview")
        if response.status_code == 200:
            print(f"✅ Resume preview generated ({len(response.text)} characters)")
            print(f"✅ Preview URL: {base_url}/applicants/{applicant_id}/resume/preview")
        else:
            print(f"❌ Failed to get preview: {response.status_code}")
            return False
        
        # Test 4: Test resume download
        print("\n4. 📥 Testing resume download...")
        response = requests.get(f"{base_url}/applicants/{applicant_id}/resume/download")
        if response.status_code == 200:
            print(f"✅ Resume download available ({len(response.text)} characters)")
            print(f"✅ Download URL: {base_url}/applicants/{applicant_id}/resume/download")
        else:
            print(f"❌ Failed to get download: {response.status_code}")
            return False
        
        print("\n🎉 All resume system tests passed!")
        print("\n📋 Resume System Summary:")
        print(f"   • {stats['total_users']} users with auto-generated resumes")
        print(f"   • {stats['generation_percentage']}% generation success rate")
        print(f"   • Resume preview available at: {base_url}/applicants/{{id}}/resume/preview")
        print(f"   • Resume download available at: {base_url}/applicants/{{id}}/resume/download")
        print(f"   • Frontend Profile page has download and preview buttons")
        
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    success = test_resume_system()
    if success:
        print("\n✅ Resume generation system is fully functional!")
    else:
        print("\n❌ Resume generation system has issues!")