FROM python:3.11-slim

WORKDIR /app

COPY . ./
RUN pip install --no-cache-dir -e ".[dev]"

CMD ["sh", "-c", "uvicorn app:app --host '' --port ${PORT:-8000}"]
