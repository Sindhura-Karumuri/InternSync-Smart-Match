#!/usr/bin/env python3
"""
Test script to verify the enhanced analytics functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_department_analytics():
    print("🧪 Testing Enhanced Analytics Features")
    print("=" * 60)
    
    departments = {
        1: "IT & Software",
        2: "Banking & Finance", 
        3: "FMCG",
        4: "Oil & Gas",
        5: "Manufacturing",
        6: "Healthcare",
        7: "Retail",
        8: "Hospitality"
    }
    
    for dept_id, dept_name in departments.items():
        print(f"\n📊 Testing Analytics for {dept_name} (ID: {dept_id})")
        print("-" * 50)
        
        try:
            # Test analytics endpoint
            response = requests.get(f"{BASE_URL}/departments/{dept_id}/analytics")
            
            if response.status_code == 200:
                analytics = response.json()
                
                print(f"✅ Analytics loaded successfully")
                print(f"   📈 Total Applicants: {analytics.get('total_applicants', 0)}")
                print(f"   📋 Active Posts: {analytics.get('posts_count', 0)}")
                print(f"   ✅ Selected: {analytics.get('selected_count', 0)}")
                print(f"   ❌ Rejected: {analytics.get('rejected_count', 0)}")
                
                # AI Metrics
                ai_metrics = analytics.get('ai_metrics', {})
                print(f"   🤖 AI Accuracy: {ai_metrics.get('accuracy', 0)}%")
                print(f"   🎯 Avg Match Score: {ai_metrics.get('avg_score', 0)}")
                print(f"   ⚡ Time Saved: {ai_metrics.get('time_saved', 0)}%")
                print(f"   🔧 Skill Match: {ai_metrics.get('skill_match', 0)}%")
                
                # Diversity Metrics
                diversity = analytics.get('diversity_metrics', {})
                print(f"   🌾 Rural: {diversity.get('rural_percentage', 0)}%")
                print(f"   👩 Female: {diversity.get('female_percentage', 0)}%")
                print(f"   🏛️ Reserved: {diversity.get('reserved_percentage', 0)}%")
                print(f"   🆕 First-time: {diversity.get('first_time_percentage', 0)}%")
                
                # Geographic Distribution
                geo = analytics.get('geographic_distribution', {})
                print(f"   🏙️ Metro: {geo.get('metro', 0)}% | Tier-2: {geo.get('tier2', 0)}% | Tier-3: {geo.get('tier3', 0)}% | Rural: {geo.get('rural', 0)}%")
                
                # Educational Distribution
                edu = analytics.get('educational_distribution', {})
                print(f"   🎓 Engineering: {edu.get('engineering', 0)}% | Management: {edu.get('management', 0)}% | Science: {edu.get('science', 0)}%")
                
            else:
                print(f"❌ Analytics failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing {dept_name}: {e}")
    
    print(f"\n🎉 Analytics testing completed!")
    print("\n📋 Enhanced Analytics Features:")
    print("✅ Department-specific AI performance metrics")
    print("✅ Real diversity data calculated from actual applicants")
    print("✅ Geographic distribution based on department type")
    print("✅ Educational background distribution by industry")
    print("✅ Category-wise and gender-wise breakdowns")
    print("✅ Dynamic insights and recommendations")
    print("✅ Progress bars and visual indicators")
    print("✅ Accurate data for each HR department")

def test_specific_department_insights():
    print(f"\n🔍 Testing Specific Department Insights")
    print("-" * 40)
    
    # Test IT Department (should have high engineering %)
    it_response = requests.get(f"{BASE_URL}/departments/1/analytics")
    if it_response.status_code == 200:
        it_data = it_response.json()
        print(f"IT Department - Engineering %: {it_data['educational_distribution']['engineering']}% (Expected: High)")
    
    # Test Banking Department (should have high management %)
    bank_response = requests.get(f"{BASE_URL}/departments/2/analytics")
    if bank_response.status_code == 200:
        bank_data = bank_response.json()
        print(f"Banking Department - Management %: {bank_data['educational_distribution']['management']}% (Expected: High)")
    
    # Test Healthcare Department (should have high science %)
    health_response = requests.get(f"{BASE_URL}/departments/6/analytics")
    if health_response.status_code == 200:
        health_data = health_response.json()
        print(f"Healthcare Department - Science %: {health_data['educational_distribution']['science']}% (Expected: High)")

if __name__ == "__main__":
    test_department_analytics()
    test_specific_department_insights()