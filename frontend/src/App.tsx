import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

import type { ReportRequest, SalesReport } from "./types/api";
import { useReport, useUpload } from "./hooks/useSalesApi";
import {
  ReportTable,
  UploadDialog,
  FilterPanel,
  ErrorNotification,
} from "./components";
import {
  clearStoredReport,
  downloadReport,
  loadStoredReport,
  saveStoredReport,
} from "./utils";
import "./App.css";

export function App(): React.ReactElement {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [report, setReport] = useState<SalesReport | null>(null);
  const [hasStoredReport, setHasStoredReport] = useState(
    () => loadStoredReport() !== null,
  );

  const {
    uploading,
    error: uploadError,
    recordsCount,
    upload,
    reset: resetUpload,
  } = useUpload();
  const {
    report: fetchedReport,
    loading,
    error: reportError,
    fetchReport,
    reset: resetReport,
  } = useReport();

  useEffect(() => {
    if (fetchedReport) {
      setReport(fetchedReport);
      saveStoredReport(fetchedReport);
      setHasStoredReport(true);
    }
  }, [fetchedReport]);

  const handleUploadSuccess = async () => {
    await fetchReport({});
  };

  const handleApplyFilters = async (filters: ReportRequest) => {
    await fetchReport(filters);
  };

  const handleRestoreReport = () => {
    const storedReport = loadStoredReport();

    if (storedReport) {
      setReport(storedReport);
      setHasStoredReport(true);
    }
  };

  const handleClearStoredReport = () => {
    clearStoredReport();
    setHasStoredReport(false);
    setReport(null);
  };

  const categories = report?.category_totals.map((c) => c.category) || [];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-container">
          <h1>Sales Analytics Platform</h1>
          <p>Upload and analyze your sales data</p>
        </div>
      </header>

      <main className="app-container app-main">
        <Card className="upload-panel">
          <div className="upload-panel__content">
            <div>
              <h2>Upload CSV</h2>
              {recordsCount !== null && (
                <p className="success-text">
                  {recordsCount} records uploaded successfully
                </p>
              )}
            </div>
            <Button
              label="Choose File"
              icon="pi pi-upload"
              onClick={() => setShowUploadDialog(true)}
            />
          </div>
        </Card>

        {report && (
          <section className="section-block">
            <FilterPanel
              categories={categories}
              onApplyFilters={handleApplyFilters}
              loading={loading}
            />
          </section>
        )}

        {report && (
          <ReportTable
            report={report}
            loading={loading}
            onExportCsv={() => downloadReport(report, "csv")}
            onExportJson={() => downloadReport(report, "json")}
          />
        )}

        {!report && !loading && (
          <Card className="empty-state">
            <p>Upload a CSV file to get started with your sales analysis</p>
            {hasStoredReport && (
              <div className="actions empty-state__actions">
                <Button
                  label="Restore Last Report"
                  icon="pi pi-history"
                  onClick={handleRestoreReport}
                  severity="secondary"
                />
                <Button
                  label="Clear Saved Report"
                  icon="pi pi-trash"
                  onClick={handleClearStoredReport}
                  severity="danger"
                  outlined
                />
              </div>
            )}
          </Card>
        )}
      </main>

      <UploadDialog
        visible={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={upload}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={() => {}}
        loading={uploading}
      />

      {uploadError && (
        <ErrorNotification error={uploadError} onDismiss={resetUpload} />
      )}
      {reportError && (
        <ErrorNotification error={reportError} onDismiss={resetReport} />
      )}
    </div>
  );
}

export default App;
