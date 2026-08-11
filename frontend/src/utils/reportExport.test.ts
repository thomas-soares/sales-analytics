import { describe, expect, it } from "vitest";

import type { SalesReport } from "../types/api";
import { serializeReportToCsv, serializeReportToJson } from "./reportExport";

describe("Report Export Utils", () => {
  const report: SalesReport = {
    product_totals: [
      { product: "T-Shirt", total_quantity: 4, total_value: "199.60" },
      { product: 'Quoted "Name"', total_quantity: 1, total_value: "10.00" },
    ],
    category_totals: [{ category: "Clothing", total_value: "209.60" }],
    total_value: "209.60",
    most_sold_product: {
      product: "T-Shirt",
      total_quantity: 4,
      total_value: "199.60",
    },
  };

  it("should serialize report to CSV", () => {
    const csv = serializeReportToCsv(report);

    expect(csv).toContain("section,name,quantity,value");
    expect(csv).toContain("product,T-Shirt,4,199.60");
    expect(csv).toContain('product,"Quoted ""Name""",1,10.00');
    expect(csv).toContain("category,Clothing,,209.60");
  });

  it("should serialize report to formatted JSON", () => {
    const json = serializeReportToJson(report);

    expect(JSON.parse(json)).toEqual(report);
    expect(json).toContain('\n  "product_totals"');
  });
});
