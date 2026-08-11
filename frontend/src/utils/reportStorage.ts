import type { SalesReport } from "../types/api";

const REPORT_STORAGE_KEY = "sales-analytics:last-report";

function isSalesReport(value: unknown): value is SalesReport {
  if (!value || typeof value !== "object") {
    return false;
  }

  const report = value as Partial<SalesReport>;

  return (
    Array.isArray(report.product_totals) &&
    Array.isArray(report.category_totals) &&
    typeof report.total_value === "string" &&
    typeof report.most_sold_product === "object" &&
    report.most_sold_product !== null
  );
}

export function loadStoredReport(): SalesReport | null {
  try {
    const storedReport = window.localStorage.getItem(REPORT_STORAGE_KEY);
    if (!storedReport) {
      return null;
    }

    const parsedReport: unknown = JSON.parse(storedReport);
    return isSalesReport(parsedReport) ? parsedReport : null;
  } catch {
    return null;
  }
}

export function saveStoredReport(report: SalesReport): void {
  window.localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(report));
}

export function clearStoredReport(): void {
  window.localStorage.removeItem(REPORT_STORAGE_KEY);
}
