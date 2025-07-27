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

// Interface for receipt data
export interface Receipt {
  id: number;
  merchant: string;
  amount: string;
  date: string;
  category: string;
  status: string;
  items: Array<{
    name: string;
    price: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Interface for the API response
export interface ReceiptsResponse {
  receipts: Receipt[];
  total: number;
  page: number;
  limit: number;
}

// Get all receipts with optional pagination and filtering
export const getAllReceipts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.start_date) queryParams.append('start_date', params.start_date);
  if (params?.end_date) queryParams.append('end_date', params.end_date);
  
  const queryString = queryParams.toString();
  const url = `/receipt/all${queryString ? `?${queryString}` : ''}`;
  
  return AXIOS_INSTANCE.get<ReceiptsResponse>(url);
};

// Get a single receipt by ID
export const getReceiptById = async (receiptId: string | number) => {
  return AXIOS_INSTANCE.get<Receipt>(`/receipt/${receiptId}`);
};

// Add receipt to Google Wallet
export const addToGoogleWallet = async (receiptId: string | number) => {
  return AXIOS_INSTANCE.post(`/receipt/${receiptId}`);
};