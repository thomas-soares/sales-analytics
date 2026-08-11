"""Output formatting and serialization for sales reports."""

from typing import Any, Dict, List

from core import CategoryTotal, ProductSold, ProductTotal, SalesReport


def serialize_product_total(pt: ProductTotal) -> Dict[str, Any]:
    """Serialize a ProductTotal to a dictionary."""
    return {
        "product": pt.product,
        "total_quantity": pt.total_quantity,
        "total_value": pt.total_value,
    }


def serialize_category_total(ct: CategoryTotal) -> Dict[str, Any]:
    """Serialize a CategoryTotal to a dictionary."""
    return {
        "category": ct.category,
        "total_value": ct.total_value,
    }


def serialize_product_sold(ps: ProductSold) -> Dict[str, Any]:
    """Serialize a ProductSold to a dictionary."""
    return {
        "product": ps.product,
        "total_quantity": ps.total_quantity,
        "total_value": ps.total_value,
    }


def serialize_report(report: SalesReport) -> Dict[str, Any]:
    """Serialize a SalesReport to a dictionary suitable for JSON response."""
    return {
        "product_totals": [serialize_product_total(pt) for pt in report.product_totals],
        "category_totals": [serialize_category_total(ct) for ct in report.category_totals],
        "total_value": report.total_value,
        "most_sold_product": serialize_product_sold(report.most_sold_product),
    }
