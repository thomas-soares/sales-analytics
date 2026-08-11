/**
 * Error notification component.
 */

import React, { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";

interface ErrorNotificationProps {
  error: string | null;
  onDismiss?: () => void;
}

export function ErrorNotification({
  error,
  onDismiss,
}: ErrorNotificationProps): React.ReactElement {
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (error && toastRef.current) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: error,
        life: 5000,
        onRemove: onDismiss,
      });
    }
  }, [error, onDismiss]);

  return <Toast ref={toastRef} />;
}
