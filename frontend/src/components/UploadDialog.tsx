import React, { useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload, type FileUploadHandlerEvent } from "primereact/fileupload";
import { Toast } from "primereact/toast";

import { validateSalesCsvFile } from "../utils/csvValidation";

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
  const toastRef = useRef<Toast>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (files: File[]) => {
    const file = files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleCustomUpload = async (event: FileUploadHandlerEvent) => {
    const [file] = event.files;
    if (!file) {
      onUploadError("Please select a CSV file");
      return;
    }

    setSelectedFile(file);

    try {
      await validateSalesCsvFile(file);
      const recordsCount = await onUpload(file);
      onUploadSuccess(recordsCount);
      setSelectedFile(null);
      event.options.clear();
      onClose();
    } catch (error) {
      onUploadError(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      onUploadError("Please select a CSV file");
      return;
    }

    try {
      await validateSalesCsvFile(selectedFile);
      const recordsCount = await onUpload(selectedFile);
      onUploadSuccess(recordsCount);
      setSelectedFile(null);
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
        className="upload-dialog"
        onHide={onClose}
        modal
      >
        <div className="dialog-content">
          <FileUpload
            name="sales-csv-file"
            accept=".csv,text/csv"
            maxFileSize={5_000_000}
            customUpload
            uploadHandler={handleCustomUpload}
            onSelect={(event) => handleFileSelect(event.files)}
            onClear={() => setSelectedFile(null)}
            onRemove={() => setSelectedFile(null)}
            chooseLabel="Choose CSV"
            uploadLabel="Upload"
            cancelLabel="Clear"
            disabled={loading}
            pt={{
              input: {
                "aria-label": "Select CSV File",
              },
            }}
            emptyTemplate={
              <p className="upload-empty">Drag and drop a CSV file here.</p>
            }
          />
            {selectedFile && (
              <p className="success-text">Selected: {selectedFile.name}</p>
            )}

          <div className="actions">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={onClose}
              severity="secondary"
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
