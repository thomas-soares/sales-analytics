"""Generate coverage badge SVG files from coverage reports."""

from __future__ import annotations

import argparse
import html
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


def text_width(text: str) -> int:
    return 10 + len(text) * 7


def write_badge(path: Path, label: str, percent: float) -> None:
    message = f"{percent:.2f}%"
    label_width = text_width(label)
    message_width = text_width(message)
    width = label_width + message_width

    path.write_text(
        f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="20" role="img" aria-label="{html.escape(label)}: {message}">
  <title>{html.escape(label)}: {message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="{width}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="{label_width}" height="20" fill="#555"/>
    <rect x="{label_width}" width="{message_width}" height="20" fill="{coverage_color(percent)}"/>
    <rect width="{width}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="{label_width * 5}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="{(label_width - 10) * 10}">{html.escape(label)}</text>
    <text x="{label_width * 5}" y="140" transform="scale(.1)" textLength="{(label_width - 10) * 10}">{html.escape(label)}</text>
    <text aria-hidden="true" x="{label_width * 10 + message_width * 5}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="{(message_width - 10) * 10}">{message}</text>
    <text x="{label_width * 10 + message_width * 5}" y="140" transform="scale(.1)" textLength="{(message_width - 10) * 10}">{message}</text>
  </g>
</svg>
""",
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
    write_badge(args.out / "backend-coverage.svg", "backend coverage", read_backend_coverage(args.backend))
    write_badge(args.out / "frontend-coverage.svg", "frontend coverage", read_frontend_coverage(args.frontend))


if __name__ == "__main__":
    main()
