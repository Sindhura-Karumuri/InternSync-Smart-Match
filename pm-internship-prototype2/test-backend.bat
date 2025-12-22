@echo off
echo Testing backend server connection...
echo.

echo 1. Testing root endpoint:
curl -s http://localhost:8000/ || echo "Failed to connect to backend server"
echo.

echo 2. Testing posts endpoint:
curl -s http://localhost:8000/posts/p4 || echo "Failed to get post p4"
echo.

echo 3. Backend server status:
netstat -an | findstr :8000 || echo "Port 8000 not listening"
echo.

echo If you see errors above, please:
echo 1. Navigate to the backend directory
echo 2. Run: python main.py
echo 3. Or run: uvicorn main:app --reload --port 8000
pause