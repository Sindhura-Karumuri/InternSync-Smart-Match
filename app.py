import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pm-internship-prototype2', 'backend'))

try:
    # Import the FastAPI app
    from main import app
except ImportError:
    # Fallback: create a simple FastAPI app
    from fastapi import FastAPI
    app = FastAPI()
    
    @app.get("/")
    def read_root():
        return {"message": "PM Internship Backend API", "status": "running"}
    
    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

# Add health check to any app
if hasattr(app, 'get'):
    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

# Expose the app for uvicorn
app = app