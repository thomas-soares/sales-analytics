"""Generate Shields.io endpoint badge JSON files from coverage reports."""

from __future__ import annotations

import argparse
import json
from pathlib import Path


def coverage_color(percent: float) -> str:
    if percent >= 90:
        return "brightgreen"
    if percent >= 80:
        return "green"
    if percent >= 70:
        return "yellowgreen"
    if percent >= 60:
        return "yellow"
    if percent >= 50:
        return "orange"
    return "red"


def write_badge(path: Path, label: str, percent: float) -> None:
    path.write_text(
        json.dumps(
            {
                "schemaVersion": 1,
                "label": label,
                "message": f"{percent:.2f}%",
                "color": coverage_color(percent),
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )


def read_backend_coverage(path: Path) -> float:
    data = json.loads(path.read_text(encoding="utf-8"))
    return float(data["totals"]["percent_covered"])


def read_frontend_coverage(path: Path) -> float:
    data = json.loads(path.read_text(encoding="utf-8"))
    return float(data["total"]["statements"]["pct"])


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--backend", type=Path, required=True)
    parser.add_argument("--frontend", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    args = parser.parse_args()

    args.out.mkdir(parents=True, exist_ok=True)
    write_badge(args.out / "backend-coverage.json", "backend coverage", read_backend_coverage(args.backend))
    write_badge(args.out / "frontend-coverage.json", "frontend coverage", read_frontend_coverage(args.frontend))


if __name__ == "__main__":
    main()
