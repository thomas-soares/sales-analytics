/**
 * Tests for the UploadDialog component.
 */

import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { UploadDialog } from "./UploadDialog";

describe("UploadDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnUpload = vi.fn();
  const mockOnUploadSuccess = vi.fn();
  const mockOnUploadError = vi.fn();

  it("should render dialog when visible", () => {
    render(
      <UploadDialog
        visible={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={false}
      />,
    );

    expect(screen.getByText(/Upload Sales CSV/i)).toBeTruthy();
  });

  it("should not render dialog when not visible", () => {
    const { container } = render(
      <UploadDialog
        visible={false}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={false}
      />,
    );

    const dialogs = container.querySelectorAll("[role='dialog']");
    expect(dialogs.length).toBe(0);
  });

  it("should show error when no file selected", () => {
    render(
      <UploadDialog
        visible={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={false}
      />,
    );

    const uploadButton = screen.getByRole("button", {
      name: "Upload",
    }) as HTMLButtonElement;
    expect(uploadButton.disabled).toBe(true);
  });

  it("should disable buttons when loading", () => {
    render(
      <UploadDialog
        visible={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={true}
      />,
    );

    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    }) as HTMLButtonElement;
    expect(cancelButton.disabled).toBe(true);
  });

  it("should upload selected file through callback", async () => {
    mockOnUpload.mockResolvedValueOnce(7);

    render(
      <UploadDialog
        visible={true}
        onClose={mockOnClose}
        onUpload={mockOnUpload}
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={false}
      />,
    );

    const file = new File(["date,product"], "sales.csv", { type: "text/csv" });
    const input = screen.getByLabelText(/Select CSV File/i);
    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(await screen.findByRole("button", { name: "Upload" }));

    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalledWith(file);
      expect(mockOnUploadSuccess).toHaveBeenCalledWith(7);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
