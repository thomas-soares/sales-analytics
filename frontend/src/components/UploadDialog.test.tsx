/**
 * Tests for the UploadDialog component.
 */

import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { UploadDialog } from "./UploadDialog";

describe("UploadDialog", () => {
  const mockOnClose = vi.fn();
  const mockOnUploadSuccess = vi.fn();
  const mockOnUploadError = vi.fn();

  it("should render dialog when visible", () => {
    render(
      <UploadDialog
        visible={true}
        onClose={mockOnClose}
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={false}
      />,
    );

    expect(screen.getByText(/Upload Sales CSV/i)).toBeInTheDocument();
  });

  it("should not render dialog when not visible", () => {
    const { container } = render(
      <UploadDialog
        visible={false}
        onClose={mockOnClose}
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
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={false}
      />,
    );

    const uploadButton = screen.getByText(/Upload/i) as HTMLButtonElement;
    expect(uploadButton).toBeDisabled();
  });

  it("should disable buttons when loading", () => {
    render(
      <UploadDialog
        visible={true}
        onClose={mockOnClose}
        onUploadSuccess={mockOnUploadSuccess}
        onUploadError={mockOnUploadError}
        loading={true}
      />,
    );

    const cancelButton = screen.getByText(/Cancel/i) as HTMLButtonElement;
    expect(cancelButton).toBeDisabled();
  });
});
