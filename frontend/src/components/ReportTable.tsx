/**
 * ReportTable component for displaying aggregated sales data.
 */

import React from "react";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import type { CategoryTotal, ProductTotal, SalesReport } from "../types/api";
import { formatCurrency, formatQuantity } from "../utils/formatting";

interface ReportTableProps {
  report: SalesReport | null;
  loading?: boolean;
  onExportCsv?: () => void;
  onExportJson?: () => void;
}

export function ReportTable({
  report,
  loading = false,
  onExportCsv,
  onExportJson,
}: ReportTableProps): React.ReactElement {
  if (!report) {
    return (
      <div className="text-center text-gray-500">No report data available</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-blue-50 p-4 rounded border border-blue-200">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-lg font-bold text-blue-600">
            {formatCurrency(report.total_value)}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded border border-green-200">
          <p className="text-sm text-gray-600">Most Sold Product</p>
          <p className="text-lg font-bold text-green-600">
            {report.most_sold_product.product}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded border border-purple-200">
          <p className="text-sm text-gray-600">Qty (Most Sold)</p>
          <p className="text-lg font-bold text-purple-600">
            {formatQuantity(report.most_sold_product.total_quantity)}
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded border border-orange-200">
          <p className="text-sm text-gray-600">Value (Most Sold)</p>
          <p className="text-lg font-bold text-orange-600">
            {formatCurrency(report.most_sold_product.total_value)}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div>
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold">Products</h3>
          <div className="flex gap-2 justify-end">
            <Button
              label="CSV"
              icon="pi pi-download"
              onClick={onExportCsv}
              disabled={loading || !onExportCsv}
              className="p-button-sm p-button-secondary"
              aria-label="Export report as CSV"
            />
            <Button
              label="JSON"
              icon="pi pi-download"
              onClick={onExportJson}
              disabled={loading || !onExportJson}
              className="p-button-sm p-button-secondary"
              aria-label="Export report as JSON"
            />
          </div>
        </div>
        <DataTable
          value={report.product_totals}
          loading={loading}
          responsiveLayout="scroll"
        >
          <Column field="product" header="Product" sortable />
          <Column
            field="total_quantity"
            header="Quantity"
            body={(row: ProductTotal) => formatQuantity(row.total_quantity)}
            sortable
          />
          <Column
            field="total_value"
            header="Total Value"
            body={(row: ProductTotal) => formatCurrency(row.total_value)}
            sortable
          />
        </DataTable>
      </div>

      {/* Categories Table */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Categories</h3>
        <DataTable
          value={report.category_totals}
          loading={loading}
          responsiveLayout="scroll"
        >
          <Column field="category" header="Category" sortable />
          <Column
            field="total_value"
            header="Total Value"
            body={(row: CategoryTotal) => formatCurrency(row.total_value)}
            sortable
          />
        </DataTable>
      </div>
    </div>
  );
}
