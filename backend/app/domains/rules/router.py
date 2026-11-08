from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models import Rule
from app.schemas import RuleCreate, RuleRead


router = APIRouter(prefix='/rules', tags=['rules'])


@router.get('', response_model=list[RuleRead])
async def list_rules(db: AsyncSession = Depends(get_db)):
    return (await db.scalars(select(Rule))).all()


@router.post('', response_model=RuleRead, status_code=201)
async def create_rule(data: RuleCreate, db: AsyncSession = Depends(get_db)):
    rule = Rule(**data.model_dump())
    db.add(rule)
    await db.commit()
    await db.refresh(rule)
    return rule


@router.put('/{rule_id}', response_model=RuleRead)
async def update_rule(rule_id: int, data: RuleCreate, db: AsyncSession = Depends(get_db)):
    rule = await db.get(Rule, rule_id)
    if rule is None:
        raise HTTPException(status_code=404, detail='Rule not found')
    for field, value in data.model_dump().items():
        setattr(rule, field, value)
    await db.commit()
    await db.refresh(rule)
    return rule


@router.delete('/{rule_id}', status_code=204)
async def delete_rule(rule_id: int, db: AsyncSession = Depends(get_db)):
    rule = await db.get(Rule, rule_id)
    if rule is None:
        raise HTTPException(status_code=404, detail='Rule not found')
    await db.delete(rule)
    await db.commit()
