/**
 * Tests for the ReportTable component.
 */

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import type { SalesReport } from "../types/api";
import { ReportTable } from "./ReportTable";

describe("ReportTable", () => {
  const mockReport: SalesReport = {
    product_totals: [
      { product: "T-Shirt", total_quantity: 4, total_value: "199.60" },
      { product: "Pants", total_quantity: 2, total_value: "199.80" },
    ],
    category_totals: [{ category: "Clothing", total_value: "399.40" }],
    total_value: "399.40",
    most_sold_product: {
      product: "T-Shirt",
      total_quantity: 4,
      total_value: "199.60",
    },
  };

  it("should render report summary with total value", () => {
    render(<ReportTable report={mockReport} />);

    expect(screen.getByText(/399\.40/)).toBeInTheDocument();
    expect(screen.getByText("T-Shirt")).toBeInTheDocument();
  });

  it("should render product totals table with correct data", () => {
    render(<ReportTable report={mockReport} />);

    expect(screen.getByText("T-Shirt")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("should render category totals", () => {
    render(<ReportTable report={mockReport} />);

    expect(screen.getByText("Clothing")).toBeInTheDocument();
  });
});
