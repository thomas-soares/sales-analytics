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

SAMPLE_REPORT_RESPONSE = {
    "product_totals": [
        {"product": "Camiseta", "total_quantity": 4, "total_value": "199.60"},
        {"product": "Calca", "total_quantity": 2, "total_value": "199.80"},
    ],
    "category_totals": [
        {"category": "Vestuario", "total_value": "399.40"},
    ],
    "total_value": "399.40",
    "most_sold_product": {
        "product": "Camiseta",
        "total_quantity": 4,
        "total_value": "199.60",
    },
}

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


@app.get(
    "/health",
    tags=["Health"],
    responses={
        200: {
            "description": "API health status",
            "content": {
                "application/json": {
                    "example": {"status": "ok"},
                },
            },
        },
    },
)
def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "ok"}


@app.post(
    "/upload",
    tags=["Upload"],
    responses={
        200: {
            "description": "CSV upload result",
            "content": {
                "application/json": {
                    "examples": {
                        "success": {
                            "summary": "Successful upload",
                            "value": {"status": "success", "records_count": 4},
                        },
                        "error": {
                            "summary": "Invalid CSV",
                            "value": {
                                "status": "error",
                                "message": "Missing required fields: category, date",
                            },
                        },
                    },
                },
            },
        },
    },
)
async def upload_csv(
    file: UploadFile = File(
        ...,
        description="CSV file with columns: product, category, quantity, unit_price, date",
    ),
) -> dict:
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


@app.get(
    "/report",
    tags=["Report"],
    responses={
        200: {
            "description": "Aggregated sales report",
            "content": {
                "application/json": {
                    "example": SAMPLE_REPORT_RESPONSE,
                },
            },
        },
    },
)
def get_report(
    start_date: Optional[str] = Query(
        None,
        description="Start date in YYYY-MM-DD format",
        examples=["2024-01-10"],
    ),
    end_date: Optional[str] = Query(
        None,
        description="End date in YYYY-MM-DD format",
        examples=["2024-01-31"],
    ),
    category: Optional[str] = Query(
        None,
        description="Filter by category",
        examples=["Vestuario"],
    ),
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
