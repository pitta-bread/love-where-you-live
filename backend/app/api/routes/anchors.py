from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select

from backend.app.db.session import get_session
from backend.app.models.anchor import Anchor, AnchorCreate, AnchorRead

router = APIRouter(prefix="/anchors", tags=["anchors"])


@router.post("", response_model=AnchorRead, status_code=status.HTTP_201_CREATED)
def create_anchor(
    anchor: AnchorCreate,
    session: Session = Depends(get_session),
) -> Anchor:
    db_anchor = Anchor.model_validate(anchor)
    session.add(db_anchor)
    session.commit()
    session.refresh(db_anchor)
    return db_anchor


@router.get("", response_model=list[AnchorRead])
def list_anchors(session: Session = Depends(get_session)) -> list[Anchor]:
    statement = select(Anchor).order_by(Anchor.id)
    anchors = session.exec(statement).all()
    return list(anchors)
