import React, { useState } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Panel } from "primereact/panel";

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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startDateText, setStartDateText] = useState("");
  const [endDateText, setEndDateText] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseDateInput = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return null;

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
      date.getFullYear() !== Number(year) ||
      date.getMonth() !== Number(month) - 1 ||
      date.getDate() !== Number(day)
    ) {
      return null;
    }

    return date;
  };

  const handleApply = () => {
    const filters: FilterValues = {};
    const parsedStartDate = startDate ?? parseDateInput(startDateText);
    const parsedEndDate = endDate ?? parseDateInput(endDateText);

    if (parsedStartDate) filters.start_date = formatDate(parsedStartDate);
    if (parsedEndDate) filters.end_date = formatDate(parsedEndDate);
    if (category) filters.category = category;

    onApplyFilters(filters);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setStartDateText("");
    setEndDateText("");
    setCategory(null);
    onApplyFilters({});
  };

  return (
    <Panel header="Filters" className="filter-panel">
      <div className="filter-grid">
        <div className="field">
          <label htmlFor="start-date">Start Date</label>
          <Calendar
            inputId="start-date"
            value={startDate}
            onChange={(e) => {
              const date = e.value as Date | null;
              setStartDate(date);
              setStartDateText(date ? formatDate(date) : "");
            }}
            onInput={(e) => setStartDateText(e.currentTarget.value)}
            onBlur={(e) => {
              const date = parseDateInput(e.target.value);
              setStartDate(date);
              setStartDateText(date ? formatDate(date) : e.target.value);
            }}
            dateFormat="yy-mm-dd"
            placeholder="YYYY-MM-DD"
            showIcon
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="end-date">End Date</label>
          <Calendar
            inputId="end-date"
            value={endDate}
            onChange={(e) => {
              const date = e.value as Date | null;
              setEndDate(date);
              setEndDateText(date ? formatDate(date) : "");
            }}
            onInput={(e) => setEndDateText(e.currentTarget.value)}
            onBlur={(e) => {
              const date = parseDateInput(e.target.value);
              setEndDate(date);
              setEndDateText(date ? formatDate(date) : e.target.value);
            }}
            dateFormat="yy-mm-dd"
            placeholder="YYYY-MM-DD"
            showIcon
            disabled={loading}
          />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <Dropdown
            inputId="category"
            value={category}
            onChange={(e) => setCategory(e.value)}
            options={categories}
            placeholder="Select a category"
            disabled={loading}
            showClear
          />
        </div>
      </div>

      <div className="actions">
        <Button
          label="Reset"
          icon="pi pi-refresh"
          onClick={handleReset}
          severity="secondary"
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
    </Panel>
  );
}
