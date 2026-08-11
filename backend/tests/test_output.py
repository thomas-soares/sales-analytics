"""Unit tests for the output serialization module."""

from core import CategoryTotal, ProductSold, ProductTotal, SalesReport
from output import serialize_report


def test_serialize_report_to_json_structure() -> None:
    """Test that a SalesReport is serialized correctly to JSON-compatible structure."""
    report = SalesReport(
        product_totals=[ProductTotal(product="T-Shirt", total_quantity=4, total_value="199.60")],
        category_totals=[CategoryTotal(category="Clothing", total_value="299.50")],
        total_value="499.40",
        most_sold_product=ProductSold(product="T-Shirt", total_quantity=4, total_value="199.60"),
    )

    result = serialize_report(report)

    assert result["product_totals"][0]["product"] == "T-Shirt"
    assert result["product_totals"][0]["total_quantity"] == 4
    assert result["product_totals"][0]["total_value"] == "199.60"
    assert result["category_totals"][0]["category"] == "Clothing"
    assert result["total_value"] == "499.40"
    assert result["most_sold_product"]["product"] == "T-Shirt"
