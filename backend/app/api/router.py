from fastapi import APIRouter

from app.domains.auth.router import router as auth_router
from app.domains.reports.router import router as reports_router
from app.domains.rules.router import router as rules_router


router = APIRouter(prefix='/api')
router.include_router(auth_router)
router.include_router(rules_router)
router.include_router(reports_router)


@router.get("/ping")
def ping():
    return {"pong": True}