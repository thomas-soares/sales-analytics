"""Core aggregation and reporting logic for sales analytics."""

from dataclasses import dataclass
from datetime import date
from decimal import Decimal
from typing import List, Optional

from parser import SaleRecord


@dataclass(slots=True)
class ProductTotal:
    """Aggregated sales data for a single product."""

    product: str
    total_quantity: int
    total_value: str


@dataclass(slots=True)
class CategoryTotal:
    """Aggregated sales data for a single category."""

    category: str
    total_value: str


@dataclass(slots=True)
class ProductSold:
    """Represents the most sold product."""

    product: str
    total_quantity: int
    total_value: str


@dataclass(slots=True)
class ReportRequest:
    """Request parameters for generating a sales report."""

    start_date: Optional[date] = None
    end_date: Optional[date] = None
    category: Optional[str] = None


@dataclass(slots=True)
class SalesReport:
    """Complete sales report with aggregated metrics."""

    product_totals: List[ProductTotal]
    category_totals: List[CategoryTotal]
    total_value: str
    most_sold_product: ProductSold


def _format_decimal(value: Decimal) -> str:
    """Format Decimal value to 2 decimal places as a string."""
    return f"{value:.2f}"


def _filter_records(
    records: List[SaleRecord], request: Optional[ReportRequest] = None
) -> List[SaleRecord]:
    """Filter records by date range and/or category."""
    if not request:
        return records

    filtered = records

    if request.start_date:
        filtered = [r for r in filtered if date.fromisoformat(r.date) >= request.start_date]

    if request.end_date:
        filtered = [r for r in filtered if date.fromisoformat(r.date) <= request.end_date]

    if request.category:
        filtered = [r for r in filtered if r.category == request.category]

    return filtered


def aggregate_sales(records: List[SaleRecord], request: Optional[ReportRequest] = None) -> SalesReport:
    """Aggregate sales records and generate a comprehensive report."""
    filtered_records = _filter_records(records, request)

    if not filtered_records:
        return SalesReport(
            product_totals=[],
            category_totals=[],
            total_value="0.00",
            most_sold_product=ProductSold(product="", total_quantity=0, total_value="0.00"),
        )

    # Aggregate by product
    product_dict: dict[str, tuple[int, Decimal]] = {}
    for record in filtered_records:
        qty, val = product_dict.get(record.product, (0, Decimal("0")))
        price = Decimal(record.unit_price)
        product_dict[record.product] = (qty + record.quantity, val + (Decimal(record.quantity) * price))

    # Build product totals
    product_totals = [
        ProductTotal(product=p, total_quantity=qty, total_value=_format_decimal(val))
        for p, (qty, val) in product_dict.items()
    ]

    # Aggregate by category
    category_dict: dict[str, Decimal] = {}
    for record in filtered_records:
        price = Decimal(record.unit_price)
        total = Decimal(record.quantity) * price
        category_dict[record.category] = category_dict.get(record.category, Decimal("0")) + total

    category_totals = [
        CategoryTotal(category=c, total_value=_format_decimal(val)) for c, val in sorted(category_dict.items())
    ]

    # Calculate total value
    total_amount = sum(val for _, val in product_dict.values())
    total_value_str = _format_decimal(total_amount)

    # Find most sold product (by quantity, then by value)
    most_sold = max(product_dict.items(), key=lambda x: (x[1][0], x[1][1]))
    most_sold_product = ProductSold(
        product=most_sold[0],
        total_quantity=most_sold[1][0],
        total_value=_format_decimal(most_sold[1][1]),
    )

    return SalesReport(
        product_totals=product_totals,
        category_totals=category_totals,
        total_value=total_value_str,
        most_sold_product=most_sold_product,
    )
