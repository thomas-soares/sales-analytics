import argparse
import csv
import logging
from dataclasses import dataclass
from decimal import Decimal
from pathlib import Path
from typing import List

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class SaleRecord:
    """Represents a single sales record from the CSV."""
    product: str
    category: str
    quantity: int
    unit_price: str
    date: str


def _parse_quantity(value: str) -> int:
    """Parse and validate a quantity value."""
    try:
        quantity = int(value)
    except ValueError as exc:
        raise ValueError("Invalid quantity") from exc

    if quantity <= 0:
        raise ValueError("Invalid quantity")

    return quantity


def _parse_price(value: str) -> Decimal:
    """Parse and validate a price value as Decimal."""
    try:
        return Decimal(value)
    except Exception as exc:  # pragma: no cover - defensive branch
        raise ValueError("Invalid unit_price") from exc


def parse_sales_csv(csv_path: str | Path) -> List[SaleRecord]:
    """Parse a CSV file and return a list of SaleRecord objects."""
    path = Path(csv_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {path}")

    records: List[SaleRecord] = []

    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            raise ValueError("Empty CSV")

        required_fields = {"product", "category", "quantity", "unit_price", "date"}
        missing_fields = required_fields.difference(reader.fieldnames)
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(sorted(missing_fields))}")

        for row_number, row in enumerate(reader, start=2):
            product = (row.get("product") or "").strip()
            category = (row.get("category") or "").strip()
            quantity_raw = (row.get("quantity") or "").strip()
            price_raw = (row.get("unit_price") or "").strip()
            date_str = (row.get("date") or "").strip()

            if not product:
                raise ValueError(f"Row {row_number}: empty product")
            if not category:
                raise ValueError(f"Row {row_number}: invalid category")
            if not quantity_raw:
                raise ValueError(f"Row {row_number}: invalid quantity")
            if not price_raw:
                raise ValueError(f"Row {row_number}: invalid unit_price")
            if not date_str:
                raise ValueError(f"Row {row_number}: invalid date")

            quantity = _parse_quantity(quantity_raw)
            _parse_price(price_raw)

            records.append(
                SaleRecord(
                    product=product,
                    category=category,
                    quantity=quantity,
                    unit_price=price_raw,
                    date=date_str,
                )
            )

    logger.info("Parsed %d sales records from %s", len(records), path)
    return records


def main() -> None:
    """Command-line entry point for CSV parsing."""
    parser = argparse.ArgumentParser(description="Parse a sales CSV file")
    parser.add_argument("csv_path", help="Path to the sales CSV file")
    args = parser.parse_args()

    records = parse_sales_csv(args.csv_path)
    for record in records:
        print(record)


if __name__ == "__main__":
    main()
