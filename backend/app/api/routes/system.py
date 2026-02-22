from fastapi import APIRouter

router = APIRouter(tags=["system"])


@router.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/hello")
def hello() -> dict[str, str]:
    return {"message": "Hello world from Love Where You Live backend"}
