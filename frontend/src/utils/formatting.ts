/**
 * Utility functions for formatting and parsing.
 */

/**
 * Format a numeric string or number as currency (Brazilian Real).
 * @param value - Numeric value to format
 * @returns Formatted currency string
 */
export function formatCurrency(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(num)
    .replace(/\u00a0/g, " ");
}

/**
 * Format a date string to Brazilian date format (DD/MM/YYYY).
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

/**
 * Parse a Brazilian date input (DD/MM/YYYY) to ISO format (YYYY-MM-DD).
 * @param dateString - Date in DD/MM/YYYY format
 * @returns ISO date string or null if invalid
 */
export function parseBrDate(dateString: string): string | null {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);

  if (!match) return null;

  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

/**
 * Format a quantity as a localized number string.
 * @param quantity - Numeric quantity
 * @returns Formatted quantity string
 */
export function formatQuantity(quantity: number): string {
  return new Intl.NumberFormat("pt-BR").format(quantity);
}
