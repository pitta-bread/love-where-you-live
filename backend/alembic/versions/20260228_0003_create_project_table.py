"""create project table

Revision ID: 20260228_0003
Revises: 20260227_0002
Create Date: 2026-02-28 00:00:00.000000

"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260228_0003"
down_revision: str | None = "20260227_0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def travel_mode_enum() -> sa.Enum:
    bind = op.get_bind()
    create_type = bind.dialect.name != "postgresql"
    return sa.Enum(
        "DRIVE",
        "TRANSIT",
        "WALK",
        name="travelmode",
        create_type=create_type,
    )


def upgrade() -> None:
    op.create_table(
        "project",
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("area", sa.String(length=120), nullable=False),
        sa.Column(
            "default_transport_mode",
            travel_mode_enum(),
            nullable=False,
        ),
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_email", sa.String(length=320), nullable=False),
        sa.Column("name_normalized", sa.String(length=120), nullable=False),
        sa.Column(
            "search_started_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_email",
            "name_normalized",
            name="uq_project_user_email_name_normalized",
        ),
    )
    op.create_index("ix_project_user_email", "project", ["user_email"])


def downgrade() -> None:
    op.drop_index("ix_project_user_email", table_name="project")
    op.drop_table("project")
