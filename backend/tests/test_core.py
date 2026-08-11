"""Unit tests for the core aggregation and reporting module."""

from datetime import date
from decimal import Decimal

import pytest

from core import ReportRequest, SalesReport, aggregate_sales


@pytest.fixture
def sample_records():
    """Fixture providing sample sales records for testing."""
    from parser import SaleRecord

    return [
        SaleRecord(product="T-Shirt", category="Clothing", quantity=3, unit_price="49.90", date="2024-01-10"),
        SaleRecord(product="Pants", category="Clothing", quantity=2, unit_price="99.90", date="2024-01-11"),
        SaleRecord(product="T-Shirt", category="Clothing", quantity=1, unit_price="49.90", date="2024-01-12"),
        SaleRecord(product="Shoes", category="Footwear", quantity=1, unit_price="199.90", date="2024-01-13"),
    ]


def test_aggregate_sales_totals_by_product(sample_records) -> None:
    """Test that sales are aggregated correctly by product."""
    report = aggregate_sales(sample_records)

    assert len(report.product_totals) == 3
    assert report.product_totals[0].product == "T-Shirt"
    assert report.product_totals[0].total_quantity == 4
    assert report.product_totals[0].total_value == "199.60"


def test_aggregate_sales_totals_by_category(sample_records) -> None:
    """Test that sales are aggregated correctly by category."""
    report = aggregate_sales(sample_records)

    category_dict = {c.category: c.total_value for c in report.category_totals}
    assert category_dict["Clothing"] == "399.40"
    assert category_dict["Footwear"] == "199.90"


def test_aggregate_sales_total_value(sample_records) -> None:
    """Test that total value is calculated correctly."""
    report = aggregate_sales(sample_records)

    assert report.total_value == "599.30"


def test_aggregate_sales_most_sold_product_by_quantity(sample_records) -> None:
    """Test that the most sold product (by quantity) is identified correctly."""
    report = aggregate_sales(sample_records)

    assert report.most_sold_product.product == "T-Shirt"
    assert report.most_sold_product.total_quantity == 4


def test_aggregate_sales_most_sold_product_tiebreaker_by_value(sample_records) -> None:
    """Test that tiebreaker for most sold uses total value."""
    from parser import SaleRecord

    records = [
        SaleRecord(product="A", category="Cat", quantity=2, unit_price="10.00", date="2024-01-01"),
        SaleRecord(product="B", category="Cat", quantity=2, unit_price="20.00", date="2024-01-02"),
    ]

    report = aggregate_sales(records)

    assert report.most_sold_product.product == "B"
    assert report.most_sold_product.total_value == "40.00"


def test_aggregate_sales_with_date_filter(sample_records) -> None:
    """Test aggregation with date range filter."""
    request = ReportRequest(start_date=date(2024, 1, 11), end_date=date(2024, 1, 12))
    report = aggregate_sales(sample_records, request)

    assert len(report.product_totals) == 2
    assert report.total_value == "249.70"


def test_aggregate_sales_with_category_filter(sample_records) -> None:
    """Test aggregation with category filter."""
    request = ReportRequest(category="Clothing")
    report = aggregate_sales(sample_records, request)

    assert all(c.category == "Clothing" for c in report.category_totals)
    assert report.total_value == "399.40"


def test_aggregate_sales_with_both_filters(sample_records) -> None:
    """Test aggregation with both date and category filters applied."""
    request = ReportRequest(start_date=date(2024, 1, 10), end_date=date(2024, 1, 11), category="Clothing")
    report = aggregate_sales(sample_records, request)

    assert report.total_value == "349.50"


def test_aggregate_sales_empty_records() -> None:
    """Test aggregation with empty records list."""
    report = aggregate_sales([])

    assert report.product_totals == []
    assert report.category_totals == []
    assert report.total_value == "0.00"
    assert report.most_sold_product.product == ""


def test_aggregate_sales_single_product(sample_records) -> None:
    """Test aggregation with single product."""
    single_record = [sample_records[0]]
    report = aggregate_sales(single_record)

    assert len(report.product_totals) == 1
    assert report.product_totals[0].product == "T-Shirt"
    assert report.total_value == "149.70"


def test_aggregate_sales_filter_no_results(sample_records) -> None:
    """Test aggregation when filter results in no records."""
    request = ReportRequest(category="NonExistent")
    report = aggregate_sales(sample_records, request)

    assert report.product_totals == []
    assert report.total_value == "0.00"


def test_aggregate_sales_date_filter_start_only(sample_records) -> None:
    """Test aggregation with start_date only."""
    request = ReportRequest(start_date=date(2024, 1, 12))
    report = aggregate_sales(sample_records, request)

    assert len(report.product_totals) == 2
    assert report.total_value == "249.80"


def test_aggregate_sales_date_filter_end_only(sample_records) -> None:
    """Test aggregation with end_date only."""
    request = ReportRequest(end_date=date(2024, 1, 11))
    report = aggregate_sales(sample_records, request)

    assert report.total_value == "349.50"
