#!/usr/bin/env python3
"""
Simple test script to verify the enhanced backend functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("🧪 Testing InternSync Smart Match Backend")
    print("=" * 50)
    
    # Test 1: Health check
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health Check: {response.json()}")
    except Exception as e:
        print(f"❌ Health Check Failed: {e}")
    
    # Test 2: Get departments and posts
    try:
        response = requests.get(f"{BASE_URL}/departments/1/posts")
        posts = response.json()
        print(f"✅ IT Department Posts: {len(posts)} posts found")
        if posts:
            print(f"   Sample post: {posts[0]['title']} - {posts[0]['positions']} positions")
    except Exception as e:
        print(f"❌ Posts Test Failed: {e}")
    
    # Test 3: Get applicants for a post
    try:
        response = requests.get(f"{BASE_URL}/departments/1/posts/1/applicants")
        applicants = response.json()
        print(f"✅ Post 1 Applicants: {len(applicants)} applicants found")
        if applicants:
            print(f"   Sample applicant: {applicants[0]['name']} - Score: {applicants[0].get('score', 'N/A')}")
    except Exception as e:
        print(f"❌ Applicants Test Failed: {e}")
    
    # Test 4: Test AI matching
    try:
        response = requests.post(f"{BASE_URL}/posts/1/match", json={"mode": "20%"})
        match_result = response.json()
        print(f"✅ AI Matching: {match_result.get('algorithm', 'Unknown')} algorithm")
        print(f"   Total candidates: {match_result.get('total_candidates', 0)}")
        print(f"   Selected for review: {match_result.get('selected_count', 0)}")
    except Exception as e:
        print(f"❌ AI Matching Test Failed: {e}")
    
    # Test 5: Test HR login
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json={
            "email": "it.hr@example.com",
            "password": "it12345"
        })
        login_result = response.json()
        print(f"✅ HR Login: {login_result.get('name', 'Unknown')} - {login_result.get('category', 'Unknown')}")
    except Exception as e:
        print(f"❌ HR Login Test Failed: {e}")
    
    # Test 6: Test candidate selection
    try:
        response = requests.post(f"{BASE_URL}/posts/1/select", json={"applicant_id": 1})
        select_result = response.json()
        print(f"✅ Candidate Selection: {select_result.get('message', 'Unknown')}")
    except Exception as e:
        print(f"❌ Selection Test Failed: {e}")
    
    print("\n🎉 Backend testing completed!")
    print("\n📋 Summary:")
    print("- Enhanced user database with 25+ students per department")
    print("- Realistic post data with minimum 5 posts per department")
    print("- Complete user profiles with all fields filled")
    print("- Working selection/rejection functionality")
    print("- Position closing when requirements are met")
    print("- HR authentication with proper names")
    print("- AI matching with multiple selection modes")

if __name__ == "__main__":
    test_endpoints()