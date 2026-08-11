import { beforeEach, describe, expect, it } from "vitest";

import type { SalesReport } from "../types/api";
import {
  clearStoredReport,
  loadStoredReport,
  saveStoredReport,
} from "./reportStorage";

describe("Report Storage Utils", () => {
  const report: SalesReport = {
    product_totals: [{ product: "T-Shirt", total_quantity: 4, total_value: "199.60" }],
    category_totals: [{ category: "Clothing", total_value: "199.60" }],
    total_value: "199.60",
    most_sold_product: {
      product: "T-Shirt",
      total_quantity: 4,
      total_value: "199.60",
    },
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("should save and load the latest report", () => {
    saveStoredReport(report);

    expect(loadStoredReport()).toEqual(report);
  });

  it("should return null for invalid stored data", () => {
    window.localStorage.setItem("sales-analytics:last-report", "not-json");

    expect(loadStoredReport()).toBeNull();
  });

  it("should clear the stored report", () => {
    saveStoredReport(report);
    clearStoredReport();

    expect(loadStoredReport()).toBeNull();
  });
});
