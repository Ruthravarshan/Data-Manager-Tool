from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Clinical Cosmos API")

from fastapi.staticfiles import StaticFiles

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static Files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Welcome to Clinical Cosmos API"}

from .routers import dashboard, studies, integrations, data_manager

app.include_router(dashboard.router)
app.include_router(studies.router)
app.include_router(integrations.router)
app.include_router(data_manager.router)
