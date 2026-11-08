from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import settings

# Alembic использует settings.database_url (psycopg2), приложение - asyncpg.
async_url = settings.database_url.replace('postgresql://', 'postgresql+asyncpg://', 1)

engine = create_async_engine(async_url)
SessionLocal = async_sessionmaker(engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with SessionLocal() as db:
        yield db
