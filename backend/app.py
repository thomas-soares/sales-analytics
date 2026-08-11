"""FastAPI application for sales analytics platform."""

import logging
from datetime import date
from io import StringIO
from typing import Optional

from fastapi import FastAPI, File, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from core import ReportRequest, aggregate_sales
from output import serialize_report
from parser import parse_sales_csv

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sales Analytics API",
    description="Platform for sales consolidation and analysis from CSV files",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for uploaded records (reset on each restart)
_uploaded_records = []


@app.get("/health", tags=["Health"])
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/upload", tags=["Upload"])
async def upload_csv(file: UploadFile = File(...)) -> dict:
    """Upload and parse a CSV file containing sales data."""
    global _uploaded_records

    try:
        contents = await file.read()
        csv_content = contents.decode("utf-8")
        csv_file = StringIO(csv_content)

        # Write to a temporary file for parsing
        import tempfile

        with tempfile.NamedTemporaryFile(mode="w", suffix=".csv", delete=False, encoding="utf-8") as tmp:
            tmp.write(csv_content)
            tmp_path = tmp.name

        _uploaded_records = parse_sales_csv(tmp_path)

        # Clean up temp file
        import os

        os.unlink(tmp_path)

        logger.info("Uploaded and parsed %d records", len(_uploaded_records))
        return {"status": "success", "records_count": len(_uploaded_records)}

    except Exception as exc:
        logger.error("Error uploading CSV: %s", exc)
        return {"status": "error", "message": str(exc)}


@app.get("/report", tags=["Report"])
def get_report(
    start_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format"),
    end_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format"),
    category: Optional[str] = Query(None, description="Filter by category"),
) -> dict:
    """Get aggregated sales report with optional filters."""
    try:
        request = ReportRequest(
            start_date=date.fromisoformat(start_date) if start_date else None,
            end_date=date.fromisoformat(end_date) if end_date else None,
            category=category,
        )

        report = aggregate_sales(_uploaded_records, request)
        return serialize_report(report)

    except ValueError as exc:
        logger.error("Error generating report: %s", exc)
        return {"status": "error", "message": str(exc)}
