/**
 * FilterPanel component for report filtering.
 */

import React, { useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

export interface FilterValues {
  start_date?: string;
  end_date?: string;
  category?: string;
}

interface FilterPanelProps {
  categories: string[];
  onApplyFilters: (filters: FilterValues) => void;
  loading: boolean;
}

export function FilterPanel({
  categories,
  onApplyFilters,
  loading,
}: FilterPanelProps): React.ReactElement {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const handleApply = () => {
    const filters: FilterValues = {};
    if (startDate) filters.start_date = startDate;
    if (endDate) filters.end_date = endDate;
    if (category) filters.category = category;

    onApplyFilters(filters);
  };

  const handleReset = () => {
    setStartDate("");
    setEndDate("");
    setCategory(null);
    onApplyFilters({});
  };

  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4">
      <h3 className="text-lg font-semibold">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date (YYYY-MM-DD)
          </label>
          <InputText
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date (YYYY-MM-DD)
          </label>
          <InputText
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
            disabled={loading}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <Dropdown
            value={category}
            onChange={(e) => setCategory(e.value)}
            options={categories}
            placeholder="Select a category"
            className="w-full"
            disabled={loading}
            showClear
          />
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button
          label="Reset"
          icon="pi pi-refresh"
          onClick={handleReset}
          className="p-button-secondary"
          disabled={loading}
        />
        <Button
          label="Apply Filters"
          icon="pi pi-filter"
          onClick={handleApply}
          loading={loading}
          disabled={loading}
        />
      </div>
    </div>
  );
}
