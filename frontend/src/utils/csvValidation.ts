const REQUIRED_HEADERS = ["product", "category", "quantity", "unit_price", "date"];

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
}
