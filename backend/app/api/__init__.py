from fastapi import APIRouter, Depends

from ..core.security import verify_backend_secret
from .routes import anchors_router, projects_router, system_router

api_v1_router = APIRouter(
    prefix='/api/v1',
    dependencies=[Depends(verify_backend_secret)],
)
api_v1_router.include_router(anchors_router)
api_v1_router.include_router(projects_router)

__all__ = ['api_v1_router', 'system_router']
