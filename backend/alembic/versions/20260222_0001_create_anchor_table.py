"""create anchor table

Revision ID: 20260222_0001
Revises:
Create Date: 2026-02-22 00:00:00.000000

"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "20260222_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "anchor",
        sa.Column("name", sa.String(length=120), nullable=False),
        sa.Column("address", sa.String(length=255), nullable=False),
        sa.Column(
            "mode",
            sa.Enum("DRIVE", "TRANSIT", "WALK", name="travelmode"),
            nullable=False,
        ),
        sa.Column("frequency_per_week", sa.Integer(), nullable=False),
        sa.Column("importance_weight", sa.Integer(), nullable=False),
        sa.Column("id", sa.Integer(), nullable=False),
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
        sa.CheckConstraint(
            "frequency_per_week >= 1",
            name="ck_anchor_frequency_per_week_ge_1",
        ),
        sa.CheckConstraint(
            "frequency_per_week <= 14",
            name="ck_anchor_frequency_per_week_le_14",
        ),
        sa.CheckConstraint(
            "importance_weight >= 1",
            name="ck_anchor_importance_weight_ge_1",
        ),
        sa.CheckConstraint(
            "importance_weight <= 5",
            name="ck_anchor_importance_weight_le_5",
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("anchor")
    op.execute("DROP TYPE IF EXISTS travelmode")
