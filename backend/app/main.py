from fastapi import FastAPI

from backend.app.api.routes import anchors_router, system_router

app = FastAPI(title="Love Where You Live API")
app.include_router(system_router)
app.include_router(anchors_router, prefix="/api/v1")
