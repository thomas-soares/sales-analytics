from pathlib import Path

import pytest

from parser import parse_sales_csv


@pytest.fixture
def sample_csv_path(tmp_path: Path) -> Path:
    """Fixture providing a valid sample CSV file."""
    csv_content = """product,category,quantity,unit_price,date
T-Shirt,Clothing,3,49.90,2024-01-10
Pants,Clothing,2,99.90,2024-01-11
Shoes,Footwear,1,199.90,2024-01-12
"""
    path = tmp_path / "sales.csv"
    path.write_text(csv_content, encoding="utf-8")
    return path


def test_parse_sales_csv_returns_expected_records(sample_csv_path: Path) -> None:
    """Test that valid CSV is parsed correctly."""
    records = parse_sales_csv(sample_csv_path)

    assert len(records) == 3
    assert records[0].product == "T-Shirt"
    assert records[0].category == "Clothing"
    assert records[0].quantity == 3
    assert records[0].unit_price == "49.90"
    assert records[0].date == "2024-01-10"


def test_parse_sales_csv_rejects_missing_required_fields(tmp_path: Path) -> None:
    """Test that CSV with missing required field raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,,3,49.90,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="category"):
        parse_sales_csv(path)


def test_parse_sales_csv_rejects_invalid_quantity(tmp_path: Path) -> None:
    """Test that CSV with invalid quantity raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,Clothing,abc,49.90,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="quantity"):
        parse_sales_csv(path)
