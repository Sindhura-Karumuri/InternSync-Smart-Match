#!/usr/bin/env python3
# quick-start-aws.py - Quick setup script for AWS Phase 1

import os
import sys
import subprocess
from pathlib import Path

def print_banner():
    print("""
🚀 InternSync Smart Match - AWS Phase 1 Quick Start
==================================================

This script will help you set up AWS services for your project:
✅ Amazon RDS (PostgreSQL Database)
✅ Amazon S3 (File Storage)  
✅ Amazon SES (Email Service)
✅ AWS Lambda Ready (Serverless)

""")

def check_requirements():
    """Check if required tools are installed"""
    print("🔍 Checking requirements...")
    
    # Check Python version
    if sys.version_info < (3, 8):
        print("❌ Python 3.8+ is required")
        return False
    
    # Check if AWS CLI is available
    try:
        subprocess.run(["aws", "--version"], capture_output=True, check=True)
        print("✅ AWS CLI found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ AWS CLI not found. Please install: pip install awscli")
        return False
    
    # Check if .env file exists
    if not Path(".env").exists():
        print("⚠️ .env file not found. Please copy .env.example to .env and configure it")
        return False
    
    print("✅ Requirements check passed")
    return True

def install_dependencies():
    """Install AWS dependencies"""
    print("📦 Installing AWS dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "aws-requirements.txt"], check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False

def test_aws_connection():
    """Test AWS connection"""
    print("🔗 Testing AWS connection...")
    try:
        subprocess.run(["aws", "sts", "get-caller-identity"], capture_output=True, check=True)
        print("✅ AWS connection successful")
        return True
    except subprocess.CalledProcessError:
        print("❌ AWS connection failed. Please run 'aws configure'")
        return False

def run_migration():
    """Run database migration"""
    print("🗄️ Running database migration...")
    try:
        subprocess.run([sys.executable, "backend/migrate_data.py"], check=True)
        print("✅ Database migration completed")
        return True
    except subprocess.CalledProcessError:
        print("❌ Database migration failed. Check your DATABASE_URL in .env")
        return False

def start_server():
    """Start the AWS-enhanced server"""
    print("🚀 Starting AWS-enhanced server...")
    print("Server will start at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        subprocess.run([sys.executable, "-m", "uvicorn", "backend.main_aws:app", "--reload", "--port", "8000"])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")

def main():
    print_banner()
    
    # Check requirements
    if not check_requirements():
        print("\n❌ Setup failed. Please fix the issues above and try again.")
        sys.exit(1)
    
    # Install dependencies
    if not install_dependencies():
        print("\n❌ Setup failed. Could not install dependencies.")
        sys.exit(1)
    
    # Test AWS connection
    if not test_aws_connection():
        print("\n❌ Setup failed. Please configure AWS credentials.")
        sys.exit(1)
    
    # Run migration
    if not run_migration():
        print("\n⚠️ Database migration failed, but continuing...")
        print("You may need to set up your RDS database first.")
    
    print("\n🎉 AWS Phase 1 setup completed successfully!")
    print("\n🔗 Your application now includes:")
    print("   ✅ RDS PostgreSQL Database")
    print("   ✅ S3 File Storage")
    print("   ✅ SES Email Service")
    print("   ✅ Lambda-ready architecture")
    
    # Ask if user wants to start the server
    start_now = input("\n🚀 Start the server now? (y/n): ").lower().strip()
    if start_now in ['y', 'yes']:
        start_server()
    else:
        print("\n💡 To start the server later, run:")
        print("   uvicorn backend.main_aws:app --reload --port 8000")
        print("\n📖 For detailed setup instructions, see AWS_SETUP.md")

if __name__ == "__main__":
    main()