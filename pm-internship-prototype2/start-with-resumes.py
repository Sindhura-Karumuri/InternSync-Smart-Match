#!/usr/bin/env python3
# start-with-resumes.py - Start server with resume functionality

import subprocess
import sys
import os
import time
import requests

def check_server_status():
    """Check if server is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=2)
        return response.status_code == 200
    except:
        return False

def start_server():
    """Start the server with resume functionality"""
    print("🚀 Starting InternSync Smart Match with Resume Generation")
    print("=" * 55)
    
    # Check if server is already running
    if check_server_status():
        print("✅ Server is already running at http://localhost:8000")
    else:
        print("🔄 Starting server...")
        try:
            # Start server in background
            process = subprocess.Popen([
                sys.executable, "-m", "uvicorn", 
                "backend.main:app", 
                "--reload", 
                "--port", "8000"
            ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            
            # Wait a bit for server to start
            time.sleep(3)
            
            if check_server_status():
                print("✅ Server started successfully!")
            else:
                print("⚠️ Server may still be starting...")
            
        except Exception as e:
            print(f"❌ Failed to start server: {e}")
            return False
    
    print("\n🌐 Server URLs:")
    print("   Main API: http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    print("   Health Check: http://localhost:8000/health")
    
    return True

def test_resume_functionality():
    """Test resume generation functionality"""
    print("\n🧪 Testing Resume Functionality...")
    
    try:
        # Generate resumes
        print("📝 Generating resumes for all users...")
        response = requests.post("http://localhost:8000/generate-resumes", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Generated {data['generated_count']} resumes!")
            
            # Get stats
            stats_response = requests.get("http://localhost:8000/resumes/stats")
            if stats_response.status_code == 200:
                stats = stats_response.json()
                print(f"📊 Resume Statistics:")
                print(f"   Total Users: {stats['total_users']}")
                print(f"   Generated: {stats['generated_resumes']}")
                print(f"   Success Rate: {stats['generation_percentage']}%")
            
            # Test specific resume
            print("\n👤 Testing specific resume...")
            resume_response = requests.get("http://localhost:8000/applicants/1/resume")
            if resume_response.status_code == 200:
                resume_data = resume_response.json()
                print(f"✅ Sample resume for: {resume_data['name']}")
                print(f"   Preview: http://localhost:8000/applicants/1/resume/preview")
                print(f"   Download: http://localhost:8000/applicants/1/resume/download")
            
            return True
        else:
            print(f"❌ Resume generation failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Resume test failed: {e}")
        return False

def show_resume_endpoints():
    """Show available resume endpoints"""
    print("\n📋 Resume API Endpoints:")
    print("   POST /generate-resumes")
    print("        → Generate resumes for all users")
    print("   GET  /resumes/stats")
    print("        → Get resume generation statistics")
    print("   GET  /applicants/{id}/resume")
    print("        → Get resume data for specific applicant")
    print("   GET  /applicants/{id}/resume/preview")
    print("        → Preview resume in browser")
    print("   GET  /applicants/{id}/resume/download")
    print("        → Download resume as HTML file")

def show_hr_credentials():
    """Show HR login credentials"""
    print("\n🔑 HR Login Credentials:")
    credentials = [
        ("IT Department", "it.hr@example.com", "it12345"),
        ("Banking", "bank.hr@example.com", "bank12345"),
        ("FMCG", "fmcg.hr@example.com", "fmcg12345"),
        ("Oil & Gas", "oil.hr@example.com", "oil12345"),
        ("Manufacturing", "mfg.hr@example.com", "mfg12345"),
        ("Healthcare", "health.hr@example.com", "health12345"),
        ("Retail", "retail.hr@example.com", "retail12345"),
        ("Hospitality", "hospitality.hr@example.com", "hosp12345")
    ]
    
    for dept, email, password in credentials:
        print(f"   {dept}: {email} / {password}")

def main():
    """Main function"""
    print("🎯 InternSync Smart Match - Resume Generation Setup")
    print("=" * 50)
    
    # Start server
    if not start_server():
        print("❌ Failed to start server. Exiting.")
        return
    
    # Test resume functionality
    if test_resume_functionality():
        print("\n🎉 Resume functionality is working perfectly!")
        
        show_resume_endpoints()
        show_hr_credentials()
        
        print("\n🚀 Next Steps:")
        print("1. ✅ Server is running with resume generation")
        print("2. 📝 All users now have auto-generated resumes")
        print("3. 🌐 Start your React frontend")
        print("4. 🔑 Login with HR credentials above")
        print("5. 👤 View candidate profiles with resume download buttons")
        
        print("\n💡 Resume Features:")
        print("   • Realistic work experience based on user profile")
        print("   • Department-specific projects and skills")
        print("   • Professional formatting and layout")
        print("   • Download as HTML (easily convertible to PDF)")
        print("   • Auto-generated based on existing user data")
        
        # Keep server running
        try:
            print("\n⚡ Server is running. Press Ctrl+C to stop...")
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n👋 Server stopped. Thanks for using InternSync Smart Match!")
    
    else:
        print("❌ Resume functionality test failed.")
        print("💡 Check server logs for errors.")

if __name__ == "__main__":
    main()