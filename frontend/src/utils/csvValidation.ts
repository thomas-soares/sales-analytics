const REQUIRED_HEADERS = ["product", "category", "quantity", "unit_price", "date"];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read CSV file"));
    reader.readAsText(file);
  });
}

function splitCsvLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim());
}

function buildHeaderIndex(headers: string[]): Record<string, number> {
  return headers.reduce<Record<string, number>>((index, header, position) => {
    index[header] = position;
    return index;
  }, {});
}

function isValidDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validateSalesRow(
  row: string,
  rowNumber: number,
  headerIndex: Record<string, number>,
): void {
  const cells = splitCsvLine(row);
  const valueOf = (header: string) => cells[headerIndex[header]] ?? "";
  const product = valueOf("product");
  const category = valueOf("category");
  const quantity = valueOf("quantity");
  const unitPrice = valueOf("unit_price");
  const date = valueOf("date");

  if (!product) {
    throw new Error(`Row ${rowNumber}: product is required`);
  }

  if (!category) {
    throw new Error(`Row ${rowNumber}: category is required`);
  }

  if (!/^\d+$/.test(quantity) || Number(quantity) <= 0) {
    throw new Error(`Row ${rowNumber}: quantity must be a positive integer`);
  }

  if (!/^\d+(\.\d+)?$/.test(unitPrice)) {
    throw new Error(`Row ${rowNumber}: unit_price must be a valid number`);
  }

  if (!isValidDate(date)) {
    throw new Error(`Row ${rowNumber}: date must use YYYY-MM-DD format`);
  }
}

export async function validateSalesCsvFile(file: File): Promise<void> {
  const content = await readFileAsText(file);
  const rows = content
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  if (rows.length < 2) {
    throw new Error("CSV must include a header and at least one sales row");
  }

  const headers = splitCsvLine(rows[0]);
  const missingHeaders = REQUIRED_HEADERS.filter(
    (header) => !headers.includes(header),
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required CSV columns: ${missingHeaders.join(", ")}`);
  }

  const headerIndex = buildHeaderIndex(headers);
  rows.slice(1).forEach((row, index) => {
    validateSalesRow(row, index + 2, headerIndex);
  });
}
