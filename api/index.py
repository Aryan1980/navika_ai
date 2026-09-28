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
    handler = app
except Exception as e:
    import traceback
    err_tb = traceback.format_exc()
    print(f"CRITICAL: Failed to initialize app.main on startup:\n{err_tb}", file=sys.stderr)
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    app = FastAPI(title="SamudraAI Fallback Service")

    @app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
    async def fallback_catchall(path: str = ""):
        return JSONResponse(
            status_code=500,
            content={
                "status": "BACKEND_STARTUP_ERROR",
                "message": "SamudraAI backend initialization error.",
                "error": str(e),
                "traceback": err_tb
            }
        )
    handler = app
