import secrets
import re

from fastapi import HTTPException, Request, status

from .settings import settings

SHARED_SECRET_HEADER = 'x-backend-secret'
USER_EMAIL_HEADER = 'x-user-email'
USER_EMAIL_PATTERN = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


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


def get_request_user_email(request: Request) -> str:
    provided_email = request.headers.get(USER_EMAIL_HEADER)
    if not provided_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Missing required {USER_EMAIL_HEADER} header',
        )

    normalized_email = provided_email.strip().lower()
    if not USER_EMAIL_PATTERN.fullmatch(normalized_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f'Invalid {USER_EMAIL_HEADER} header',
        )

    return normalized_email
