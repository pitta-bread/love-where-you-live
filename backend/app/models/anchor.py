from datetime import datetime, timezone
from enum import Enum

from sqlalchemy import DateTime, func
from sqlmodel import Field, SQLModel


class TravelMode(str, Enum):
    DRIVE = "drive"
    TRANSIT = "transit"
    WALK = "walk"


class AnchorBase(SQLModel):
    name: str = Field(min_length=1, max_length=120)
    address: str = Field(min_length=1, max_length=255)
    mode: TravelMode
    frequency_per_week: int = Field(ge=1, le=14)
    importance_weight: int = Field(ge=1, le=5)


class Anchor(AnchorBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_email: str = Field(min_length=3, max_length=320, index=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now(), "nullable": False},
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={
            "server_default": func.now(),
            "onupdate": func.now(),
            "nullable": False,
        },
    )


class AnchorCreate(AnchorBase):
    pass


class AnchorRead(AnchorBase):
    id: int
    created_at: datetime
    updated_at: datetime
