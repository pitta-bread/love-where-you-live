from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.app.api.routes import anchors_router, system_router
from backend.app.db.init_db import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title="Love Where You Live API", lifespan=lifespan)
app.include_router(system_router)
app.include_router(anchors_router, prefix="/api/v1")
