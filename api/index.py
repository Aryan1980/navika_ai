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

from app.main import app

# Export handler for Vercel / AWS Lambda ASGI compatibility
handler = app
