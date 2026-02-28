"""add anchor user email

Revision ID: 20260227_0002
Revises: 20260222_0001
Create Date: 2026-02-27 00:00:00.000000

"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '20260227_0002'
down_revision: str | None = '20260222_0001'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _column_names(table_name: str) -> set[str]:
    inspector = sa.inspect(op.get_bind())
    return {column['name'] for column in inspector.get_columns(table_name)}


def _index_names(table_name: str) -> set[str]:
    inspector = sa.inspect(op.get_bind())
    return {index['name'] for index in inspector.get_indexes(table_name)}


def upgrade() -> None:
    if 'user_email' not in _column_names('anchor'):
        op.add_column(
            'anchor',
            sa.Column('user_email', sa.String(length=320), nullable=True),
        )

    op.execute(
        "UPDATE anchor SET user_email = 'legacy@placeholder.local' "
        'WHERE user_email IS NULL'
    )

    bind = op.get_bind()
    if bind.dialect.name == 'sqlite':
        with op.batch_alter_table('anchor') as batch_op:
            batch_op.alter_column(
                'user_email',
                existing_type=sa.String(length=320),
                nullable=False,
            )
    else:
        op.alter_column(
            'anchor',
            'user_email',
            existing_type=sa.String(length=320),
            nullable=False,
        )

    if 'ix_anchor_user_email' not in _index_names('anchor'):
        op.create_index('ix_anchor_user_email', 'anchor', ['user_email'])


def downgrade() -> None:
    if 'ix_anchor_user_email' in _index_names('anchor'):
        op.drop_index('ix_anchor_user_email', table_name='anchor')

    if 'user_email' in _column_names('anchor'):
        bind = op.get_bind()
        if bind.dialect.name == 'sqlite':
            with op.batch_alter_table('anchor') as batch_op:
                batch_op.drop_column('user_email')
        else:
            op.drop_column('anchor', 'user_email')
