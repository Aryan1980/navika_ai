import sys
import os

# Add candidate backend directories to sys.path so app can be resolved in any environment
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))

candidate_paths = [
    os.path.join(parent_dir, "backend"),
    os.path.join(current_dir, "backend"),
    os.path.join(parent_dir, "backend", "app"),
    parent_dir,
    current_dir,
]

for p in candidate_paths:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

try:
    from app.main import app
except Exception as _startup_err:
    import traceback
    _startup_trace = traceback.format_exc()
    print(f"CRITICAL: Failed to import app.main: {_startup_trace}", file=sys.stderr)
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    app = FastAPI(title="SamudraAI Fallback Service")

    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"])
    async def fallback_route(full_path: str = ""):
        return JSONResponse(
            status_code=500,
            content={
                "error": "BACKEND_STARTUP_ERROR",
                "message": "SamudraAI backend encountered a startup error.",
                "details": str(_startup_err),
                "traceback": _startup_trace
            }
        )

# Export handler for Vercel / AWS Lambda ASGI compatibility
handler = app
