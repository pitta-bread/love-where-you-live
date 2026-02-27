import secrets

from fastapi import HTTPException, Request, status

from .settings import settings

SHARED_SECRET_HEADER = 'x-backend-secret'


def verify_backend_secret(request: Request) -> None:
    configured_secret = settings.api_shared_secret

    if not configured_secret:
        return

    provided_secret = request.headers.get(SHARED_SECRET_HEADER)
    if not provided_secret or not secrets.compare_digest(
        provided_secret, configured_secret
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Forbidden',
        )
