import type { CategoryTotal, ProductTotal, SalesReport } from "../types/api";

type ExportFormat = "csv" | "json";

function escapeCsvCell(value: string | number): string {
  const text = String(value);

  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function toCsvRow(values: Array<string | number>): string {
  return values.map(escapeCsvCell).join(",");
}

function productRow(product: ProductTotal): string {
  return toCsvRow([
    "product",
    product.product,
    product.total_quantity,
    product.total_value,
  ]);
}

function categoryRow(category: CategoryTotal): string {
  return toCsvRow(["category", category.category, "", category.total_value]);
}

export function serializeReportToCsv(report: SalesReport): string {
  const rows = [
    toCsvRow(["section", "name", "quantity", "value"]),
    toCsvRow(["summary", "total_value", "", report.total_value]),
    toCsvRow([
      "summary",
      `most_sold_product:${report.most_sold_product.product}`,
      report.most_sold_product.total_quantity,
      report.most_sold_product.total_value,
    ]),
    ...report.product_totals.map(productRow),
    ...report.category_totals.map(categoryRow),
  ];

  return `${rows.join("\n")}\n`;
}

export function serializeReportToJson(report: SalesReport): string {
  return JSON.stringify(report, null, 2);
}

export function downloadReport(report: SalesReport, format: ExportFormat): void {
  const content =
    format === "csv" ? serializeReportToCsv(report) : serializeReportToJson(report);
  const mimeType = format === "csv" ? "text/csv" : "application/json";
  const filename = `sales-report.${format}`;
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
