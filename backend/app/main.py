"""SamudraAI - Agentic Marine Intelligence Platform FastAPI Application."""
from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.config import settings
from app.database import init_db
from app.routes.api import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite schema safely
    try:
        init_db()
        print("SamudraAI database initialized.")
    except Exception as e:
        print(f"Warning: SQLite database initialization notice ({e}). Continuing in resilient mode.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agentic Marine Intelligence Platform for ISRO Problem Statement. Supports autonomous multi-agent planning, deterministic marine risk calculation, PFZ intelligence, geospatial geofencing, and multilingual voice interaction.",
    lifespan=lifespan
)

# Vercel Path Rewrite Middleware: Restores the original path when Vercel rewrites to /api/index.py
@app.middleware("http")
async def vercel_path_rewrite_middleware(request: Request, call_next):
    """Restores the original request path when Vercel rewrites to /api/index.py."""
    if request.url.path.startswith("/api/index") or request.url.path == "/api":
        orig_path = (
            request.query_params.get("__path")
            or request.headers.get("x-matched-path")
            or request.headers.get("x-forwarded-uri")
            or request.headers.get("x-original-url")
            or request.headers.get("x-rewrite-url")
        )
        if orig_path and not orig_path.startswith("/api/index") and orig_path != "/api":
            clean_path = orig_path.split("?")[0]
            request.scope["path"] = clean_path
            request.scope["raw_path"] = clean_path.encode("latin1")
    return await call_next(request)

# Configure CORS - allow all origins cleanly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API Router under /api prefix AND as root routes for proxies that strip /api
app.include_router(api_router, prefix="/api")
app.include_router(api_router)

# Mount frontend production build if available
possible_dist_dirs = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "frontend", "dist")),
]
frontend_dist = next((p for p in possible_dist_dirs if os.path.exists(p) and os.path.isfile(os.path.join(p, "index.html"))), None)

if frontend_dist:
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/")
    async def serve_root():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str = ""):
        # Avoid intercepting API routes or docs
        if full_path.startswith("api") or full_path in ["docs", "redoc", "openapi.json"]:
            return {"detail": "Not Found"}
        target = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(target):
            return FileResponse(target)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "platform": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "OPERATIONAL",
            "docs_url": "/docs",
            "api_prefix": settings.API_V1_STR,
            "mode": "DEMO DATA READY (Conforms to ISRO Problem Statement)"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

