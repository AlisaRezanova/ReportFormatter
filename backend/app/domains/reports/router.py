import asyncio

from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user
from app.domains.reports import service
from app.models import Issue, Report, ReportStatus, Rule, User
from app.schemas import ReportRead


router = APIRouter(prefix='/reports', tags=['reports'])


async def get_owned_report(db: AsyncSession, report_id: int, user: User) -> Report:
    report = await db.get(Report, report_id)
    if report is None or report.owner_id != user.id:
        raise HTTPException(status_code=404, detail='Report not found')
    return report


@router.get('', response_model=list[ReportRead])
async def list_reports(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = (
        select(Report)
        .where(Report.owner_id == user.id)
        .order_by(Report.created_at.desc())
    )
    return (await db.scalars(query)).all()


@router.post('', response_model=ReportRead, status_code=201)
async def create_report(
    file: UploadFile,
    rule_id: int = Form(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    filename = file.filename or ''
    if not filename.lower().endswith('.docx'):
        raise HTTPException(status_code=400, detail='Only .docx files are supported')

    rule = await db.get(Rule, rule_id)
    if rule is None or rule.owner_id not in (None, user.id):
        raise HTTPException(status_code=404, detail='Rule not found')

    report = Report(owner_id=user.id, rule_id=rule_id, filename=filename)
    db.add(report)
    await db.flush()  # нужен report.id для имени файла на диске

    path = await service.save_upload(report.id, file)
    items = await asyncio.to_thread(service.check_document, path, rule)
    # Issue добавляем через report_id, а не через report.issues: в async-сессии
    # обращение к невыгруженной коллекции вызвало бы ленивую загрузку.
    db.add_all([Issue(report_id=report.id, **item) for item in items])
    report.status = ReportStatus.CHECKED
    await db.commit()
    await db.refresh(report)  # подтягивает created_at и issues (lazy="selectin")
    return report


@router.get('/{report_id}', response_model=ReportRead)
async def get_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await get_owned_report(db, report_id, user)


@router.post('/{report_id}/format')
async def format_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    report = await get_owned_report(db, report_id, user)
    source = service.upload_path(report.id)
    if not source.exists():
        raise HTTPException(status_code=404, detail='File not found')

    result = await asyncio.to_thread(service.format_document, source, report.rule)
    report.status = ReportStatus.FIXED
    await db.commit()
    return FileResponse(result, filename=report.filename)


@router.delete('/{report_id}', status_code=204)
async def delete_report(
    report_id: int,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    report = await get_owned_report(db, report_id, user)
    await db.delete(report)
    await db.commit()
    service.delete_upload(report_id)
