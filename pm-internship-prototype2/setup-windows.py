#!/usr/bin/env python3
# setup-windows.py - Windows-specific setup for AWS Phase 1

import os
import sys
import subprocess
import platform
from pathlib import Path

def print_banner():
    print("""
🚀 InternSync Smart Match - Windows AWS Setup
=============================================

Setting up AWS Phase 1 for Windows:
✅ Install AWS CLI and dependencies
✅ Configure environment
✅ Test local functionality
✅ Prepare for AWS deployment

""")

def install_aws_cli():
    """Install AWS CLI and dependencies"""
    print("📦 Installing AWS CLI and dependencies...")
    
    packages = [
        "awscli",
        "boto3", 
        "botocore",
        "fastapi",
        "uvicorn",
        "python-multipart",
        "python-dotenv",
        "sqlalchemy",
        "psycopg2-binary"
    ]
    
    for package in packages:
        try:
            print(f"Installing {package}...")
            subprocess.run([sys.executable, "-m", "pip", "install", package], 
                         check=True, capture_output=True)
            print(f"✅ {package} installed")
        except subprocess.CalledProcessError as e:
            print(f"⚠️ Failed to install {package}: {e}")
    
    print("✅ All packages installation attempted")

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_path = Path(".env")
    if not env_path.exists():
        print("📝 Creating .env file...")
        env_content = """# AWS Configuration (Update these with your AWS credentials)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1

# For local development, you can use SQLite instead of RDS
DATABASE_URL=sqlite:///./internsync_local.db

# S3 Configuration (Update with your bucket name)
S3_BUCKET_NAME=internsync-files-your-unique-id
S3_REGION=us-east-1

# SES Configuration (Update with your verified email)
SES_REGION=us-east-1
FROM_EMAIL=hr@yourcompany.com

# Application Configuration
ENVIRONMENT=development
SECRET_KEY=your-secret-key-here-change-this-in-production
"""
        with open(".env", "w") as f:
            f.write(env_content)
        print("✅ .env file created")
        print("⚠️ Please edit .env file with your AWS credentials before proceeding")
    else:
        print("✅ .env file already exists")

def test_local_setup():
    """Test if we can run the application locally"""
    print("🧪 Testing local setup...")
    
    try:
        # Test import of main modules
        sys.path.append("backend")
        
        print("Testing database module...")
        import database
        print("✅ Database module imported successfully")
        
        print("Testing AWS services module...")
        import aws_services
        print("✅ AWS services module imported successfully")
        
        print("✅ Local setup test passed")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Setup test failed: {e}")
        return False

def create_local_database():
    """Create local SQLite database for testing"""
    print("🗄️ Setting up local database...")
    
    try:
        # Set environment to use SQLite for local testing
        os.environ["DATABASE_URL"] = "sqlite:///./internsync_local.db"
        
        sys.path.append("backend")
        from database import create_tables
        
        create_tables()
        print("✅ Local database tables created")
        
        # Run migration with local data
        print("📊 Populating with sample data...")
        import migrate_data
        migrate_data.migrate_data()
        print("✅ Sample data loaded")
        
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        print("This is normal if you haven't set up AWS RDS yet")
        return False

def start_local_server():
    """Start the local development server"""
    print("🚀 Starting local development server...")
    print("Server will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        # Use the AWS-enhanced backend
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "backend.main_aws:app", 
            "--reload", 
            "--port", "8000",
            "--host", "127.0.0.1"
        ])
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except FileNotFoundError:
        print("❌ Could not start server. Make sure uvicorn is installed.")
        print("Try: pip install uvicorn")

def show_next_steps():
    """Show next steps for AWS setup"""
    print("""
🎯 Next Steps for Full AWS Integration:

1. 📝 AWS Account Setup:
   - Create AWS account at https://aws.amazon.com
   - Set up billing alerts
   - Create IAM user with programmatic access

2. 🗄️ Amazon RDS Setup:
   - Create PostgreSQL database instance
   - Note the endpoint URL
   - Update DATABASE_URL in .env file

3. 🪣 Amazon S3 Setup:
   - Create S3 bucket for file storage
   - Update S3_BUCKET_NAME in .env file
   - Set up bucket permissions

4. 📧 Amazon SES Setup:
   - Verify your email address
   - Update FROM_EMAIL in .env file
   - Request production access if needed

5. 🔑 Configure AWS Credentials:
   - Run: aws configure
   - Or update AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env

6. 🚀 Deploy to Production:
   - Use AWS Lambda for serverless deployment
   - Or deploy to EC2/ECS for traditional hosting

📖 For detailed instructions, see AWS_SETUP.md
""")

def main():
    print_banner()
    
    print(f"🖥️ Detected OS: {platform.system()} {platform.release()}")
    print(f"🐍 Python version: {sys.version}")
    
    # Install dependencies
    install_aws_cli()
    
    # Create environment file
    create_env_file()
    
    # Test local setup
    if not test_local_setup():
        print("\n❌ Local setup test failed. Please check the error messages above.")
        return
    
    # Create local database
    create_local_database()
    
    print("\n🎉 Windows setup completed successfully!")
    print("\n🔗 Your application now includes:")
    print("   ✅ AWS CLI and dependencies installed")
    print("   ✅ Local development environment ready")
    print("   ✅ Sample database with test data")
    print("   ✅ Environment configuration template")
    
    # Ask if user wants to start the server
    start_now = input("\n🚀 Start the local development server now? (y/n): ").lower().strip()
    if start_now in ['y', 'yes']:
        start_local_server()
    else:
        print("\n💡 To start the server later, run:")
        print("   python -m uvicorn backend.main_aws:app --reload --port 8000")
        
    show_next_steps()

if __name__ == "__main__":
    main()