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

    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/End Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
  });

  it("should call onApplyFilters with filter values", () => {
    const { container } = render(
      <FilterPanel
        categories={categories}
        onApplyFilters={mockOnApplyFilters}
        loading={false}
      />,
    );

    const startDateInput = screen.getByLabelText(
      /Start Date/i,
    ) as HTMLInputElement;
    const applyButton = screen.getByText(/Apply Filters/i);

    fireEvent.change(startDateInput, { target: { value: "2024-01-10" } });
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

    const resetButton = screen.getByText(/Reset/i);
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

    const applyButton = screen.getByText(/Apply Filters/i) as HTMLButtonElement;
    expect(applyButton).toBeDisabled();
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
    const applyButton = screen.getByText(/Apply Filters/i);

    fireEvent.change(startDateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(endDateInput, { target: { value: "2024-01-31" } });
    fireEvent.click(applyButton);

    expect(mockOnApplyFilters).toHaveBeenCalledWith({
      start_date: "2024-01-01",
      end_date: "2024-01-31",
    });
  });
});
