"""Unit tests for the FastAPI application endpoints."""

import pytest
from fastapi.testclient import TestClient

from app import app


@pytest.fixture
def client():
    """Fixture providing a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def sample_csv_content():
    """Fixture providing sample CSV content as bytes."""
    return b"""product,category,quantity,unit_price,date
T-Shirt,Clothing,3,49.90,2024-01-10
Pants,Clothing,2,99.90,2024-01-11
Shoes,Footwear,1,199.90,2024-01-12
"""


def test_health_check(client):
    """Test that health check endpoint responds correctly."""
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_upload_csv_success(client, sample_csv_content):
    """Test successful CSV upload."""
    response = client.post("/upload", files={"file": ("sales.csv", sample_csv_content, "text/csv")})

    assert response.status_code == 200
    result = response.json()
    assert result["status"] == "success"
    assert result["records_count"] == 3


def test_get_report_without_filters(client, sample_csv_content):
    """Test report generation without filters."""
    # First upload
    client.post("/upload", files={"file": ("sales.csv", sample_csv_content, "text/csv")})

    # Then get report
    response = client.get("/report")

    assert response.status_code == 200
    report = response.json()
    assert len(report["product_totals"]) == 3
    assert report["total_value"] == "499.40"
    assert report["most_sold_product"]["product"] == "T-Shirt"


def test_get_report_with_category_filter(client, sample_csv_content):
    """Test report generation with category filter."""
    # First upload
    client.post("/upload", files={"file": ("sales.csv", sample_csv_content, "text/csv")})

    # Get report filtered by category
    response = client.get("/report?category=Clothing")

    assert response.status_code == 200
    report = response.json()
    assert all(c["category"] == "Clothing" for c in report["category_totals"])
    assert report["total_value"] == "299.50"


def test_get_report_with_date_filter(client, sample_csv_content):
    """Test report generation with date range filter."""
    # First upload
    client.post("/upload", files={"file": ("sales.csv", sample_csv_content, "text/csv")})

    # Get report filtered by date
    response = client.get("/report?start_date=2024-01-11&end_date=2024-01-11")

    assert response.status_code == 200
    report = response.json()
    assert report["total_value"] == "199.80"
