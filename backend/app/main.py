from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Clinical Cosmos API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
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

@app.get("/")
def read_root():
    return {"message": "Welcome to Clinical Cosmos API"}


from .routers import dashboard, studies, integrations, data_files, preview, database_connections

app.include_router(dashboard.router)
app.include_router(studies.router)
app.include_router(integrations.router)
app.include_router(data_files.router)
app.include_router(preview.router)
app.include_router(database_connections.router)
