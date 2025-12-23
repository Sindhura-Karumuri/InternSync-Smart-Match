@echo off
echo.
echo 🚀 InternSync Smart Match - Windows Setup
echo =========================================
echo.

echo 📦 Installing AWS dependencies...
pip install awscli boto3 botocore fastapi uvicorn python-multipart python-dotenv sqlalchemy psycopg2-binary

echo.
echo ✅ Dependencies installed!
echo.

echo 🚀 Running Windows setup script...
python setup-windows.py

pause