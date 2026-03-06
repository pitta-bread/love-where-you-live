from datetime import datetime, timezone

from sqlalchemy import DateTime, UniqueConstraint, func
from sqlmodel import Field, SQLModel

from .anchor import TravelMode


class ProjectBase(SQLModel):
    name: str = Field(min_length=1, max_length=120)
    area: str = Field(min_length=1, max_length=120)
    default_transport_mode: TravelMode


class Project(ProjectBase, table=True):
    __table_args__ = (
        UniqueConstraint(
            "user_email",
            "name_normalized",
            name="uq_project_user_email_name_normalized",
        ),
    )

    id: int | None = Field(default=None, primary_key=True)
    user_email: str = Field(min_length=3, max_length=320, index=True)
    name_normalized: str = Field(min_length=1, max_length=120)
    search_started_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        sa_type=DateTime(timezone=True),
        sa_column_kwargs={"server_default": func.now(), "nullable": False},
    )
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


class ProjectCreate(ProjectBase):
    pass


class ProjectRead(ProjectBase):
    id: int
    search_started_at: datetime
    created_at: datetime
    updated_at: datetime
