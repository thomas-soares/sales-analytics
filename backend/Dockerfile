FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml ./
RUN pip install --no-cache-dir "fastapi>=0.116.0" "uvicorn[standard]>=0.35.0" "pytest>=8.4.0" "pytest-cov>=6.2.0"

COPY . ./

EXPOSE 8000
