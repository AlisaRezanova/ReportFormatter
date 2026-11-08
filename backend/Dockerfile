FROM python:3.14-slim

WORKDIR /app

# LibreOffice для конвертации docx -> pdf (предпросмотр).
# fonts-liberation: метрически совместимы с Times New Roman/Arial, иначе страницы поплывут.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libreoffice-writer \
        fonts-liberation \
        fonts-dejavu-core \
        fontconfig \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]