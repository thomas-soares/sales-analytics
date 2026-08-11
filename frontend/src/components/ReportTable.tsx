import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Panel } from "primereact/panel";
import { Toolbar } from "primereact/toolbar";

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
    return <div className="empty-state">No report data available</div>;
  }

  return (
    <div className="report-content">
      <div className="summary-grid">
        <Card className="summary-card summary-card--blue">
          <p>Total Value</p>
          <strong>{formatCurrency(report.total_value)}</strong>
        </Card>

        <Card className="summary-card summary-card--green">
          <p>Most Sold Product</p>
          <strong>{report.most_sold_product.product}</strong>
        </Card>

        <Card className="summary-card summary-card--purple">
          <p>Qty (Most Sold)</p>
          <strong>
            {formatQuantity(report.most_sold_product.total_quantity)}
          </strong>
        </Card>

        <Card className="summary-card summary-card--orange">
          <p>Value (Most Sold)</p>
          <strong>{formatCurrency(report.most_sold_product.total_value)}</strong>
        </Card>
      </div>

      <Panel
        header={
          <Toolbar
            className="table-toolbar"
            start={<h3>Products</h3>}
            end={
              <div className="actions">
                <Button
                  label="CSV"
                  icon="pi pi-download"
                  onClick={onExportCsv}
                  disabled={loading || !onExportCsv}
                  severity="secondary"
                  size="small"
                  aria-label="Export report as CSV"
                />
                <Button
                  label="JSON"
                  icon="pi pi-download"
                  onClick={onExportJson}
                  disabled={loading || !onExportJson}
                  severity="secondary"
                  size="small"
                  aria-label="Export report as JSON"
                />
              </div>
            }
          />
        }
        className="table-section table-section--products"
      >
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
      </Panel>

      <Panel
        header={
          <Toolbar
            className="table-toolbar table-toolbar--plain"
            start={<h3>Categories</h3>}
          />
        }
        className="table-section table-section--categories"
      >
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
      </Panel>
    </div>
  );
}
