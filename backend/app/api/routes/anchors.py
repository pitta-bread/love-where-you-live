from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select

from ...core.security import get_request_user_email
from ...db.session import get_session
from ...models.anchor import Anchor, AnchorCreate, AnchorRead

router = APIRouter(prefix="/anchors", tags=["anchors"])


@router.post("", response_model=AnchorRead, status_code=status.HTTP_201_CREATED)
def create_anchor(
    anchor: AnchorCreate,
    session: Session = Depends(get_session),
    user_email: str = Depends(get_request_user_email),
) -> Anchor:
    db_anchor = Anchor(**anchor.model_dump(), user_email=user_email)
    session.add(db_anchor)
    session.commit()
    session.refresh(db_anchor)
    return db_anchor


@router.get("", response_model=list[AnchorRead])
def list_anchors(
    session: Session = Depends(get_session),
    user_email: str = Depends(get_request_user_email),
) -> list[Anchor]:
    statement = (
        select(Anchor)
        .where(Anchor.user_email == user_email)
        .order_by(Anchor.id)
    )
    anchors = session.exec(statement).all()
    return list(anchors)
