import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app import app  # FastAPI instance

# Vercel calls this file as an ASGI handler.
# The rewrite rule sends /api/* here, but the path in scope still includes /api.
# We wrap the app to strip the /api prefix before FastAPI sees the request.

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


# This is the ASGI entrypoint Vercel will call
handler = _StripPrefix(app)
