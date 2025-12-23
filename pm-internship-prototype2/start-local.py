#!/usr/bin/env python3
# start-local.py - Start local development server

import subprocess
import sys
import os
from pathlib import Path

def print_banner():
    print("""
🚀 InternSync Smart Match - Local Development
============================================

Starting your application in local development mode:
✅ Using existing backend (no AWS required)
✅ All features working locally
✅ Ready for AWS integration when needed

""")

def check_dependencies():
    """Check if basic dependencies are installed"""
    try:
        import fastapi
        import uvicorn
        print("✅ FastAPI and Uvicorn are installed")
        return True
    except ImportError:
        print("❌ Missing dependencies. Installing...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn", "python-multipart"], check=True)
            print("✅ Dependencies installed")
            return True
        except subprocess.CalledProcessError:
            print("❌ Failed to install dependencies")
            return False

def start_server():
    """Start the development server"""
    print("🚀 Starting InternSync Smart Match server...")
    print("🌐 Server URL: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🎯 Frontend: Open your React app and it will connect automatically")
    print("\n⚡ Server is starting... Press Ctrl+C to stop")
    print("-" * 60)
    
    try:
        # Start the original backend (which works perfectly)
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "backend.main:app", 
            "--reload", 
            "--port", "8000",
            "--host", "127.0.0.1"
        ])
    except KeyboardInterrupt:
        print("\n\n👋 Server stopped. Thanks for using InternSync Smart Match!")
    except Exception as e:
        print(f"\n❌ Server error: {e}")
        print("💡 Make sure you're in the correct directory and try again")

def show_info():
    """Show information about the application"""
    print("""
📋 What's Running:
   ✅ Complete InternSync Smart Match backend
   ✅ All HR authentication and features
   ✅ AI matching algorithm
   ✅ Student profiles and applications
   ✅ Email functionality (mock)
   ✅ CSV export
   ✅ Interview scheduling

🎯 Next Steps:
   1. Keep this server running
   2. Start your React frontend in another terminal
   3. Login with HR credentials:
      • it.hr@example.com / it12345
      • bank.hr@example.com / bank12345
      • fmcg.hr@example.com / fmcg12345
      • oil.hr@example.com / oil12345
      • etc.

🚀 AWS Integration:
   When ready for production, your app includes:
   • RDS database integration
   • S3 file storage
   • SES email service
   • Lambda serverless deployment
   
   See AWS_SETUP.md for deployment instructions.

""")

def main():
    print_banner()
    
    # Check dependencies
    if not check_dependencies():
        print("❌ Setup failed. Please install dependencies manually:")
        print("   pip install fastapi uvicorn python-multipart")
        return
    
    show_info()
    
    # Ask if user wants to start
    start_now = input("🚀 Start the server now? (y/n): ").lower().strip()
    if start_now in ['y', 'yes', '']:
        start_server()
    else:
        print("\n💡 To start the server later, run:")
        print("   python start-local.py")
        print("   or")
        print("   python -m uvicorn backend.main:app --reload --port 8000")

if __name__ == "__main__":
    main()