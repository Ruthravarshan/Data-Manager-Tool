from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Trigger reload - type mismatch fix
app = FastAPI(title="Clinical Cosmos API")

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
static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")


# Serve data_source folder for direct file access (download/preview)
# The correct data_source directory is a sibling to 'backend', not inside it
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
data_source_dir = os.path.join(root_dir, "data_source")
if os.path.exists(data_source_dir):
    app.mount("/data_source", StaticFiles(directory=data_source_dir), name="data_source")

# Initialize database tables on startup
from .database import engine, Base
from .models import Study, IntegrationSource, Metric, Activity, Document

@app.on_event("startup")
def startup_event():
    """Create database tables on startup if they don't exist"""
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized")

@app.get("/")
def read_root():
    return {"message": "Welcome to Clinical Cosmos API"}

<<<<<<< HEAD
from .routers import dashboard, studies, integrations, activities, data_files, preview
=======

from .routers import dashboard, studies, integrations, data_files, preview, database_connections
>>>>>>> origin/Priyesh

app.include_router(dashboard.router)
app.include_router(studies.router)
app.include_router(integrations.router)
<<<<<<< HEAD
app.include_router(activities.router)
app.include_router(data_files.router)
app.include_router(preview.router)
=======
app.include_router(data_files.router)
app.include_router(preview.router)
app.include_router(database_connections.router)
>>>>>>> origin/Priyesh
