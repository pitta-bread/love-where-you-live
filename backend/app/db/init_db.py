from sqlmodel import SQLModel

from .session import engine
from ..models import Anchor, Project  # noqa: F401


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
