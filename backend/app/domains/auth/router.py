import asyncio

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.deps import get_current_user
from app.models import User
from app.schemas import TokenRead, UserCreate, UserRead
from app.security import create_access_token, hash_password, verify_password


router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/register', response_model=UserRead, status_code=201)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    exists = await db.scalar(select(User).where(User.email == data.email))
    if exists is not None:
        raise HTTPException(status_code=409, detail='Email already registered')
    # scrypt - тяжёлое вычисление, в потоке, чтобы не блокировать event loop
    password_hash = await asyncio.to_thread(hash_password, data.password)
    user = User(email=data.email, password_hash=password_hash)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.post('/login', response_model=TokenRead)
async def login(data: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == data.email))
    if user is None or not await asyncio.to_thread(
        verify_password, data.password, user.password_hash
    ):
        raise HTTPException(status_code=401, detail='Invalid email or password')
    return TokenRead(access_token=create_access_token(user.id), user=user)


@router.get('/me', response_model=UserRead)
async def me(user: User = Depends(get_current_user)):
    return user
