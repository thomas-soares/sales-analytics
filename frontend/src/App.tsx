import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";

import type { ReportRequest, SalesReport } from "./types/api";
import { useReport, useUpload } from "./hooks/useSalesApi";
import {
  ReportTable,
  UploadDialog,
  FilterPanel,
  ErrorNotification,
} from "./components";
import { downloadReport, loadStoredReport, saveStoredReport } from "./utils";
import "./App.css";

export function App(): React.ReactElement {
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [report, setReport] = useState<SalesReport | null>(() =>
    loadStoredReport(),
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
    }
  }, [fetchedReport]);

  const handleUploadSuccess = async () => {
    await fetchReport({});
  };

  const handleApplyFilters = async (filters: ReportRequest) => {
    await fetchReport(filters);
  };

  const categories =
    report?.category_totals.map((c) => c.category) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Sales Analytics Platform
          </h1>
          <p className="text-gray-600 mt-2">
            Upload and analyze your sales data
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Upload Section */}
        <div className="bg-white rounded shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Upload CSV
              </h2>
              {recordsCount !== null && (
                <p className="text-sm text-green-600 mt-2">
                  {recordsCount} records uploaded successfully
                </p>
              )}
            </div>
            <button
              onClick={() => setShowUploadDialog(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
              Choose File
            </button>
          </div>
        </div>

        {/* Filter Section */}
        {report && (
          <div className="mb-8">
            <FilterPanel
              categories={categories}
              onApplyFilters={handleApplyFilters}
              loading={loading}
            />
          </div>
        )}

        {/* Report Section */}
        {report && (
          <ReportTable
            report={report}
            loading={loading}
            onExportCsv={() => downloadReport(report, "csv")}
            onExportJson={() => downloadReport(report, "json")}
          />
        )}

        {/* Empty State */}
        {!report && !loading && (
          <div className="bg-white rounded shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              Upload a CSV file to get started with your sales analysis
            </p>
          </div>
        )}
      </main>

      {/* Upload Dialog */}
      <UploadDialog
        visible={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={upload}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={() => {}}
        loading={uploading}
      />

      {/* Error Notifications */}
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
