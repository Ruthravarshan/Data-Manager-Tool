from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Trigger reload - type mismatch fix
app = FastAPI(title="Clinical Cosmos API")

from fastapi.staticfiles import StaticFiles

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],  # Vite dev server (multiple ports for fallback)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize database tables on startup
from .database import engine, Base
from .models import Study, IntegrationSource, Metric, Activity, Document

@app.on_event("startup")
def startup_event():
    """Create database tables on startup if they don't exist"""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables initialized")

@app.get("/")
def read_root():
    return {"message": "Welcome to Clinical Cosmos API"}

from .routers import dashboard, studies, integrations, activities, data_files, preview

app.include_router(dashboard.router)
app.include_router(studies.router)
app.include_router(integrations.router)
app.include_router(activities.router)
app.include_router(data_files.router)
app.include_router(preview.router)
