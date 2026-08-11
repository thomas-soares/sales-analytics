/**
 * Type definitions for the Sales Analytics API.
 */

export interface ProductTotal {
  product: string;
  total_quantity: number;
  total_value: string;
}

export interface CategoryTotal {
  category: string;
  total_value: string;
}

export interface ProductSold {
  product: string;
  total_quantity: number;
  total_value: string;
}

export interface SalesReport {
  product_totals: ProductTotal[];
  category_totals: CategoryTotal[];
  total_value: string;
  most_sold_product: ProductSold;
}

export interface UploadResponse {
  status: "success" | "error";
  records_count?: number;
  message?: string;
}

export interface ReportRequest {
  start_date?: string;
  end_date?: string;
  category?: string;
}

export interface HealthResponse {
  status: "ok" | "error";
}
