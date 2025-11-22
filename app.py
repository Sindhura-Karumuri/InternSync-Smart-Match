import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'pm-internship-prototype2', 'backend'))

# Import the FastAPI app
from main import app

# Expose the app for uvicorn
app = app