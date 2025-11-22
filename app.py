from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="PM Internship Backend")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "PM Internship Backend API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/auth/login")
def login():
    return {"message": "Login endpoint", "status": "available"}

@app.get("/auth")
def auth():
    return {"message": "Auth endpoint", "status": "available"}