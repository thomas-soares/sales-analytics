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


def test_parse_sales_csv_empty_quantity(tmp_path: Path) -> None:
    """Test that empty quantity field raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,Clothing,,49.90,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="quantity"):
        parse_sales_csv(path)


def test_parse_sales_csv_empty_unit_price(tmp_path: Path) -> None:
    """Test that empty unit_price field raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,Clothing,3,,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="unit_price"):
        parse_sales_csv(path)


def test_parse_sales_csv_file_not_found() -> None:
    """Test that missing file raises FileNotFoundError."""
    with pytest.raises(FileNotFoundError):
        parse_sales_csv("/nonexistent/path/sales.csv")


def test_parse_sales_csv_empty_file(tmp_path: Path) -> None:
    """Test that empty CSV raises ValueError."""
    path = tmp_path / "empty.csv"
    path.write_text("", encoding="utf-8")

    with pytest.raises(ValueError, match="Empty CSV"):
        parse_sales_csv(path)


def test_parse_sales_csv_missing_all_required_fields(tmp_path: Path) -> None:
    """Test that CSV with wrong headers raises ValueError."""
    invalid_csv = """wrong_header1,wrong_header2
value1,value2
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="Missing required fields"):
        parse_sales_csv(path)


def test_parse_sales_csv_empty_product(tmp_path: Path) -> None:
    """Test that empty product raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
,Clothing,3,49.90,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="empty product"):
        parse_sales_csv(path)


def test_parse_sales_csv_zero_quantity(tmp_path: Path) -> None:
    """Test that zero quantity raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,Clothing,0,49.90,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="Invalid quantity"):
        parse_sales_csv(path)


def test_parse_sales_csv_negative_quantity(tmp_path: Path) -> None:
    """Test that negative quantity raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,Clothing,-5,49.90,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="Invalid quantity"):
        parse_sales_csv(path)


def test_parse_sales_csv_invalid_price(tmp_path: Path) -> None:
    """Test that invalid price raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,Clothing,3,invalid,2024-01-10
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="unit_price"):
        parse_sales_csv(path)


def test_main_prints_records(tmp_path: Path, capsys) -> None:
    """Test that main() prints parsed records to stdout."""
    import sys
    from unittest.mock import patch
    from parser import main

    csv_content = """product,category,quantity,unit_price,date
T-Shirt,Clothing,1,49.90,2024-01-10
"""
    path = tmp_path / "sales.csv"
    path.write_text(csv_content, encoding="utf-8")

    with patch.object(sys, "argv", ["parser", str(path)]):
        main()

    captured = capsys.readouterr()
    assert "T-Shirt" in captured.out


def test_parse_sales_csv_empty_date(tmp_path: Path) -> None:
    """Test that empty date raises ValueError."""
    invalid_csv = """product,category,quantity,unit_price,date
T-Shirt,Clothing,3,49.90,
"""
    path = tmp_path / "invalid.csv"
    path.write_text(invalid_csv, encoding="utf-8")

    with pytest.raises(ValueError, match="date"):
        parse_sales_csv(path)


def test_parse_sales_csv_with_whitespace(tmp_path: Path) -> None:
    """Test that whitespace is trimmed correctly."""
    csv_content = """product,category,quantity,unit_price,date
  T-Shirt  ,  Clothing  ,3,49.90,2024-01-10
"""
    path = tmp_path / "sales.csv"
    path.write_text(csv_content, encoding="utf-8")
    records = parse_sales_csv(path)

    assert records[0].product == "T-Shirt"
    assert records[0].category == "Clothing"
