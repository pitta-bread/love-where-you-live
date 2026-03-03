from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from ...core.security import get_request_user_email
from ...db.session import get_session
from ...models.project import Project, ProjectCreate, ProjectRead

router = APIRouter(prefix="/projects", tags=["projects"])


def _normalize_project_name(name: str) -> str:
    return name.strip().lower()


def _sanitize_text(value: str) -> str:
    return value.strip()


@router.post("", response_model=ProjectRead, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    session: Session = Depends(get_session),
    user_email: str = Depends(get_request_user_email),
) -> Project:
    sanitized_name = _sanitize_text(project.name)
    sanitized_area = _sanitize_text(project.area)
    normalized_name = _normalize_project_name(project.name)

    if not sanitized_name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Project name is required.",
        )

    if not sanitized_area:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="Project area is required.",
        )

    existing_project = session.exec(
        select(Project.id).where(
            Project.user_email == user_email,
            Project.name_normalized == normalized_name,
        )
    ).first()
    if existing_project is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A move with this name already exists.",
        )

    db_project = Project(
        name=sanitized_name,
        area=sanitized_area,
        default_transport_mode=project.default_transport_mode,
        user_email=user_email,
        name_normalized=normalized_name,
    )
    session.add(db_project)

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A move with this name already exists.",
        ) from None

    session.refresh(db_project)
    return db_project


@router.get("", response_model=list[ProjectRead])
def list_projects(
    session: Session = Depends(get_session),
    user_email: str = Depends(get_request_user_email),
) -> list[Project]:
    statement = (
        select(Project)
        .where(Project.user_email == user_email)
        .order_by(Project.created_at.desc(), Project.id.desc())
    )
    projects = session.exec(statement).all()
    return list(projects)


@router.get("/{project_id}", response_model=ProjectRead)
def get_project(
    project_id: int,
    session: Session = Depends(get_session),
    user_email: str = Depends(get_request_user_email),
) -> Project:
    project = session.exec(
        select(Project).where(
            Project.id == project_id,
            Project.user_email == user_email,
        )
    ).first()
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Move not found.",
        )

    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    session: Session = Depends(get_session),
    user_email: str = Depends(get_request_user_email),
) -> Response:
    project = session.exec(
        select(Project).where(
            Project.id == project_id,
            Project.user_email == user_email,
        )
    ).first()
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Move not found.",
        )

    session.delete(project)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
