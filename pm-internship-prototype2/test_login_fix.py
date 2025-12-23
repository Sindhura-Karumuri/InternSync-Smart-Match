#!/usr/bin/env python3
"""
Test script to verify the login and posts loading fix
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_login_and_posts():
    print("🧪 Testing Login and Posts Loading Fix")
    print("=" * 50)
    
    # Test HR logins for all departments
    hr_credentials = [
        {"email": "it.hr@example.com", "password": "it12345", "name": "Rajesh Kumar", "dept": "IT & Software"},
        {"email": "oil.hr@example.com", "password": "oil12345", "name": "Sunita Reddy", "dept": "Oil & Gas"},
        {"email": "bank.hr@example.com", "password": "bank12345", "name": "Priya Sharma", "dept": "Banking & Finance"},
        {"email": "fmcg.hr@example.com", "password": "fmcg12345", "name": "Amit Patel", "dept": "FMCG"},
    ]
    
    for cred in hr_credentials:
        print(f"\n👤 Testing {cred['name']} ({cred['dept']})")
        print("-" * 40)
        
        try:
            # Test login
            login_response = requests.post(f"{BASE_URL}/auth/login", json={
                "email": cred["email"],
                "password": cred["password"]
            })
            
            if login_response.status_code == 200:
                login_data = login_response.json()
                print(f"✅ Login successful: {login_data.get('name')}")
                print(f"   Department ID: {login_data.get('department_id')}")
                print(f"   Category: {login_data.get('category')}")
                
                # Test posts for this department
                dept_id = login_data.get('department_id')
                if dept_id:
                    posts_response = requests.get(f"{BASE_URL}/departments/{dept_id}/posts")
                    if posts_response.status_code == 200:
                        posts = posts_response.json()
                        print(f"✅ Posts loaded: {len(posts)} posts found")
                        
                        if posts:
                            sample_post = posts[0]
                            print(f"   Sample post: {sample_post.get('title')}")
                            print(f"   Company: {sample_post.get('company_name')}")
                            print(f"   Applicants: {sample_post.get('total_applicants')}")
                        else:
                            print("❌ No posts found!")
                    else:
                        print(f"❌ Failed to load posts: {posts_response.status_code}")
                else:
                    print("❌ No department ID in login response")
            else:
                print(f"❌ Login failed: {login_response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing {cred['name']}: {e}")
    
    print(f"\n🎉 Testing completed!")
    print("\n📋 Fix Summary:")
    print("✅ Updated HR users to use numeric department IDs (1-8)")
    print("✅ Fixed department name mapping in frontend")
    print("✅ Updated all department-related endpoints")
    print("✅ Posts should now load properly for all HR users")

if __name__ == "__main__":
    test_login_and_posts()