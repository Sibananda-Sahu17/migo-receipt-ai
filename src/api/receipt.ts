import { API_URL_V1 } from "../constants/staticUrls";
import { AXIOS_INSTANCE } from "./_interceptor/_axios";


interface CreateRawReceiptData {
  filename: string;
  file_type: string;
  content_type: string;
  file_size: number;
  file_path: string;
}

export const createRawReceipt = async (data: CreateRawReceiptData) => {
    return AXIOS_INSTANCE.post(`/receipt/create-raw-receipt`, data);
};

// Types for receipt data
export interface TaxDetail {
  tax_name: string;
  tax_amount: number;
  tax_rate: number;
}

export interface LineItem {
  name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  category: string;
}

export interface ReceiptMetadata {
  processing_notes: string;
  additional_fields: Record<string, any>;
  confidence_score: number;
}

export interface ReceiptData {
  created_at: string;
  receipt_id: string;
  tax_details: TaxDetail[];
  metadata: ReceiptMetadata;
  grand_total: number;
  updated_at: string;
  transaction_date: string;
  token_no: string | null;
  language: string;
  merchant_address: string;
  transaction_time: string;
  total_tax: number;
  line_items: LineItem[];
  subtotal: number;
  currency: string;
  file_path: string;
  bill_no: string;
  order_ref: string;
  user_id: string;
  merchant_name: string;
  raw_receipt_ref: string | null;
  note: string;
  gst_no: string;
  id: string;
}

export interface AnalyzeReceiptResponse {
  success: boolean;
  receipt_id: string;
  receipt_data: ReceiptData;
  firestore_id: string | null;
  error_message: string | null;
}

// Fetch receipt data by file_path
export const getReceiptByFilePath = async (filePath: string) => {
  return AXIOS_INSTANCE.get<ReceiptData>(`/receipt/file/${filePath}`);
};