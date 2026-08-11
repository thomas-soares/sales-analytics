import { describe, expect, it } from "vitest";

import { validateSalesCsvFile } from "./csvValidation";

describe("CSV validation", () => {
  it("should accept CSV files with the required extended columns", async () => {
    const file = new File(
      [
        "product,category,quantity,unit_price,date\n",
        "T-Shirt,Clothing,1,49.90,2024-01-10",
      ],
      "sales.csv",
      { type: "text/csv" },
    );

    await expect(validateSalesCsvFile(file)).resolves.toBeUndefined();
  });

  it("should reject CSV files missing required columns", async () => {
    const file = new File(
      ["produto,quantidade,preco_unitario\nCamiseta,1,49.90"],
      "sales.csv",
      { type: "text/csv" },
    );

    await expect(validateSalesCsvFile(file)).rejects.toThrow(
      "Missing required CSV columns",
    );
  });
});
