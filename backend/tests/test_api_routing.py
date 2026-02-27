from app.api import api_v1_router
from app.core.security import verify_backend_secret


def test_api_v1_router_uses_backend_secret_dependency() -> None:
    dependency_calls = [
        dependency.dependency for dependency in api_v1_router.dependencies
    ]

    assert verify_backend_secret in dependency_calls
