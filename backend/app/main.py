from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Clinical Cosmos API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Clinical Cosmos API"}

from .routers import dashboard, studies, integrations

app.include_router(dashboard.router)
app.include_router(studies.router)
app.include_router(integrations.router)
