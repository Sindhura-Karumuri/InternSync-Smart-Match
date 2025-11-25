#!/usr/bin/env python3
import uvicorn
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

if __name__ == "__main__":
    # Import the FastAPI app
    from main import app
    
    print("Starting backend server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)