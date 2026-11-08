import asyncio
from pathlib import Path
from fastapi import UploadFile
from app.models import Rule


UPLOAD_DIR = Path('uploads')
CHUNK_SIZE = 1024 * 1024


def upload_path(report_id: int) -> Path:
    return UPLOAD_DIR / f'{report_id}.docx'


async def save_upload(report_id: int, file: UploadFile) -> Path:
    UPLOAD_DIR.mkdir(exist_ok=True)
    path = upload_path(report_id)
    with path.open('wb') as out:
        while chunk := await file.read(CHUNK_SIZE):
            await asyncio.to_thread(out.write, chunk)
    return path


def delete_upload(report_id: int) -> None:
    upload_path(report_id).unlink(missing_ok=True)


def check_document(path: Path, rule: Rule) -> list[dict]:
    """Сравнивает документ с правилом, возвращает список расхождений
    в формате {parameter, expected, actual}.

    Синхронная (в роутере вызывается через asyncio.to_thread): реальная
    проверка будет блокирующей.
    TODO: реальная проверка (Qwen + LibreOffice). Пока заглушка без замечаний.
    """
    return []


def format_document(path: Path, rule: Rule) -> Path:
    """Возвращает путь к исправленному документу.

    TODO: реальное форматирование. Пока заглушка отдаёт исходный файл.
    """
    return path


def get_pdf_from_docx(report_id):
