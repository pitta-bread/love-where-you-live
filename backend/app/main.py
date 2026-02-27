from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import api_v1_router, system_router
from .core.settings import (
    compile_cors_allowed_origin_regex,
    settings,
    split_cors_allowed_origins,
)
from .db.init_db import init_db


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title='Love Where You Live API', lifespan=lifespan)
cors_exact_origins, cors_wildcard_origins = split_cors_allowed_origins(
    settings.cors_allowed_origins
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_exact_origins,
    allow_origin_regex=compile_cors_allowed_origin_regex(cors_wildcard_origins),
    allow_credentials=False,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.include_router(system_router)
app.include_router(api_v1_router)
