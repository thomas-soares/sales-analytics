/**
 * UploadDialog component for CSV file upload.
 */

import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface UploadDialogProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<number>;
  onUploadSuccess: (recordsCount: number) => void;
  onUploadError: (error: string) => void;
  loading: boolean;
}

export function UploadDialog({
  visible,
  onClose,
  onUpload,
  onUploadSuccess,
  onUploadError,
  loading,
}: UploadDialogProps): React.ReactElement {
  const toastRef = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onUploadError("Please select a CSV file");
      return;
    }

    try {
      const recordsCount = await onUpload(selectedFile);
      onUploadSuccess(recordsCount);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog
        header="Upload Sales CSV"
        visible={visible}
        style={{ width: "50vw" }}
        onHide={onClose}
        modal
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="sales-csv-file"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select CSV File
            </label>
            <input
              id="sales-csv-file"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={onClose}
              className="p-button-secondary"
              disabled={loading}
            />
            <Button
              label="Upload"
              icon="pi pi-upload"
              onClick={handleUpload}
              loading={loading}
              disabled={!selectedFile || loading}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}
