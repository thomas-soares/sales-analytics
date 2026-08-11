/**
 * Tests for the FilterPanel component.
 */

import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { FilterPanel } from "./FilterPanel";

describe("FilterPanel", () => {
  const mockOnApplyFilters = vi.fn();
  const categories = ["Clothing", "Footwear", "Electronics"];

  it("should render filter inputs", () => {
    render(
      <FilterPanel
        categories={categories}
        onApplyFilters={mockOnApplyFilters}
        loading={false}
      />,
    );

    expect(screen.getByText("Filters")).toBeTruthy();
    expect(screen.getByLabelText(/Start Date/i)).toBeTruthy();
    expect(screen.getByLabelText(/End Date/i)).toBeTruthy();
    expect(screen.getAllByLabelText(/Category/i).length).toBeGreaterThan(0);
  });

  it("should call onApplyFilters with filter values", () => {
    render(
      <FilterPanel
        categories={categories}
        onApplyFilters={mockOnApplyFilters}
        loading={false}
      />,
    );

    const startDateInput = screen.getByLabelText(
      /Start Date/i,
    ) as HTMLInputElement;
    const applyButton = screen.getByRole("button", { name: "Apply Filters" });

    fireEvent.input(startDateInput, { target: { value: "2024-01-10" } });
    fireEvent.blur(startDateInput);
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledWith({
      start_date: "2024-01-10",
    });
  });

  it("should reset filters when Reset button is clicked", () => {
    render(
      <FilterPanel
        categories={categories}
        onApplyFilters={mockOnApplyFilters}
        loading={false}
      />,
    );

    const resetButton = screen.getByRole("button", { name: "Reset" });
    fireEvent.click(resetButton);

    expect(mockOnApplyFilters).toHaveBeenCalledWith({});
  });

  it("should disable buttons when loading", () => {
    render(
      <FilterPanel
        categories={categories}
        onApplyFilters={mockOnApplyFilters}
        loading={true}
      />,
    );

    const applyButton = screen.getByRole("button", {
      name: "Apply Filters",
    }) as HTMLButtonElement;
    expect(applyButton.disabled).toBe(true);
  });

  it("should apply all filters together", () => {
    render(
      <FilterPanel
        categories={categories}
        onApplyFilters={mockOnApplyFilters}
        loading={false}
      />,
    );

    const startDateInput = screen.getByLabelText(
      /Start Date/i,
    ) as HTMLInputElement;
    const endDateInput = screen.getByLabelText(/End Date/i) as HTMLInputElement;
    const applyButton = screen.getByRole("button", { name: "Apply Filters" });

    fireEvent.input(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.blur(startDateInput);
    fireEvent.input(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.blur(endDateInput);
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledWith({
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    });
  });
});
