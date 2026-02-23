from sqlmodel import SQLModel

from backend.app.db.session import engine
from backend.app.models import Anchor  # noqa: F401


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
