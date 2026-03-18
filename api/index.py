import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import random

# Re-create the app here so Vercel detects the `app` name directly in this file.
# We import all the data/logic from the root app.py by re-using its globals.
import app as _root

# Wrap root app with /api prefix stripping
class _StripPrefix:
    def __init__(self, inner, prefix: str = "/api"):
        self._inner = inner
        self._prefix = prefix.encode()
        self._prefix_str = prefix

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            path: str = scope.get("path", "")
            if path.startswith(self._prefix_str):
                stripped = path[len(self._prefix_str):] or "/"
                scope = dict(scope)
                scope["path"] = stripped
                raw = scope.get("raw_path", b"")
                if raw.startswith(self._prefix):
                    scope["raw_path"] = raw[len(self._prefix):] or b"/"
        await self._inner(scope, receive, send)

# Vercel looks for a variable named `app` in this file
app = _StripPrefix(_root.app)
