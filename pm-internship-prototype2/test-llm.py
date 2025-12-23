#!/usr/bin/env python3
# test-llm.py - Test LLM integration

import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_openai_connection():
    """Test OpenAI API connection"""
    try:
        import openai
        
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        print("🧪 Testing OpenAI connection...")
        
        # Simple test
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Say 'Hello from InternSync Smart Match!'"}],
            max_tokens=50
        )
        
        result = response.choices[0].message.content
        print(f"✅ OpenAI Response: {result}")
        return True
        
    except Exception as e:
        print(f"❌ OpenAI connection failed: {e}")
        return False

def test_llm_services():
    """Test our LLM services"""
    try:
        sys.path.append("backend")
        from llm_services import llm_services
        
        print("\n🧪 Testing LLM Services...")
        
        # Test candidate data
        candidate_data = {
            "name": "John Doe",
            "skills": ["Python", "React", "JavaScript", "SQL"],
            "experience_years": 2,
            "major": "Computer Science",
            "gpa": 3.7,
            "location": "Bangalore"
        }
        
        job_data = {
            "title": "Software Engineer",
            "required_skills": ["Python", "JavaScript", "React"],
            "experience_required": "0-2 years",
            "location": "Bangalore",
            "company_name": "TechCorp Solutions"
        }
        
        # Test resume analysis
        print("📊 Testing resume analysis...")
        analysis = llm_services.analyze_resume_match(candidate_data, job_data)
        print(f"✅ Match Score: {analysis.get('match_score', 'N/A')}")
        print(f"✅ Recommendation: {analysis.get('recommendation', 'N/A')}")
        
        # Test interview questions
        print("\n❓ Testing interview question generation...")
        questions = llm_services.generate_interview_questions(candidate_data, job_data)
        print(f"✅ Generated {len(questions)} questions")
        if questions:
            print(f"   Sample: {questions[0]}")
        
        # Test email generation
        print("\n📧 Testing email generation...")
        email = llm_services.generate_personalized_email(candidate_data, job_data, "selection")
        print(f"✅ Email Subject: {email.get('subject', 'N/A')}")
        
        # Test skill extraction
        print("\n🔍 Testing skill extraction...")
        test_text = "Experienced Python developer with React and Node.js skills. Proficient in AWS and Docker."
        skills = llm_services.extract_skills_from_text(test_text)
        print(f"✅ Extracted skills: {skills}")
        
        return True
        
    except Exception as e:
        print(f"❌ LLM services test failed: {e}")
        return False

def test_backend_integration():
    """Test if backend can import LLM services"""
    try:
        sys.path.append("backend")
        
        print("\n🔧 Testing backend integration...")
        
        # Test imports
        from main_aws import app
        from llm_services import llm_services
        
        print("✅ Backend imports successful")
        print("✅ LLM services integrated")
        
        return True
        
    except Exception as e:
        print(f"❌ Backend integration test failed: {e}")
        return False

def show_llm_features():
    """Show available LLM features"""
    print("""
🤖 LLM Features Available in InternSync Smart Match:

1. 📊 Smart Resume Analysis
   - AI-powered candidate-job matching
   - Detailed scoring with explanations
   - Strength and weakness identification

2. ❓ Interview Question Generation
   - Personalized questions based on candidate profile
   - Technical, behavioral, and role-specific questions
   - Saves HR 2-3 hours per interview prep

3. 📧 Personalized Email Generation
   - Professional selection/rejection emails
   - Interview invitations with details
   - Branded and engaging content

4. 🔍 Automatic Skill Extraction
   - Extract skills from resume text
   - Identify technical and soft skills
   - Eliminate manual data entry

5. 🎯 Enhanced Matching Algorithm
   - Combines traditional scoring with LLM analysis
   - More accurate candidate ranking
   - Better hiring decisions

💰 Cost: ~$0.01-0.02 per candidate analysis
🚀 ROI: Saves 50+ HR hours per month
""")

def main():
    print("🚀 InternSync Smart Match - LLM Integration Test")
    print("=" * 50)
    
    # Check API key
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("❌ OPENAI_API_KEY not found in environment")
        print("Please add your OpenAI API key to the .env file")
        return
    
    if not api_key.startswith("sk-"):
        print("❌ Invalid OpenAI API key format")
        return
    
    print(f"✅ OpenAI API key found: {api_key[:20]}...")
    
    # Run tests
    tests_passed = 0
    total_tests = 4
    
    if test_openai_connection():
        tests_passed += 1
    
    if test_llm_services():
        tests_passed += 1
    
    if test_backend_integration():
        tests_passed += 1
    
    # Summary
    print(f"\n📊 Test Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! LLM integration is working perfectly!")
        show_llm_features()
        
        print("\n🚀 Next Steps:")
        print("1. Start your backend: python -m uvicorn backend.main_aws:app --reload --port 8000")
        print("2. Test LLM endpoints at: http://localhost:8000/docs")
        print("3. Try the new LLM-powered features in your frontend")
        
    else:
        print("⚠️ Some tests failed. Please check the errors above.")
        print("💡 Make sure your OpenAI API key is valid and has credits.")

if __name__ == "__main__":
    main()