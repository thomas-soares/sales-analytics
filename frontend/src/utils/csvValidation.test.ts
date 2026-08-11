import { describe, expect, it } from "vitest";

import { validateSalesCsvFile } from "./csvValidation";

describe("CSV validation", () => {
  function salesFile(content: string): File {
    return new File([content], "sales.csv", { type: "text/csv" });
  }

  it("should accept CSV files with the required extended columns", async () => {
    const file = salesFile(
      [
        "product,category,quantity,unit_price,date",
        "T-Shirt,Clothing,1,49.90,2024-01-10",
        "Shoes,Footwear,2,199.90,2024-01-11",
      ].join("\n"),
    );

    await expect(validateSalesCsvFile(file)).resolves.toBeUndefined();
  });

  it("should reject CSV files missing required columns", async () => {
    const file = salesFile(
      "produto,quantidade,preco_unitario\nCamiseta,1,49.90",
    );

    await expect(validateSalesCsvFile(file)).rejects.toThrow(
      "Missing required CSV columns",
    );
  });

  it("should reject rows with empty product or category", async () => {
    const file = salesFile(
      "product,category,quantity,unit_price,date\n,Clothing,1,49.90,2024-01-10",
    );

    await expect(validateSalesCsvFile(file)).rejects.toThrow(
      "Row 2: product is required",
    );
  });

  it("should reject invalid quantities", async () => {
    const file = salesFile(
      "product,category,quantity,unit_price,date\nT-Shirt,Clothing,0,49.90,2024-01-10",
    );

    await expect(validateSalesCsvFile(file)).rejects.toThrow(
      "Row 2: quantity must be a positive integer",
    );
  });

  it("should reject invalid unit prices", async () => {
    const file = salesFile(
      "product,category,quantity,unit_price,date\nT-Shirt,Clothing,1,abc,2024-01-10",
    );

    await expect(validateSalesCsvFile(file)).rejects.toThrow(
      "Row 2: unit_price must be a valid number",
    );
  });

  it("should reject invalid dates", async () => {
    const file = salesFile(
      "product,category,quantity,unit_price,date\nT-Shirt,Clothing,1,49.90,2024-02-31",
    );

    await expect(validateSalesCsvFile(file)).rejects.toThrow(
      "Row 2: date must use YYYY-MM-DD format",
    );
  });
});
