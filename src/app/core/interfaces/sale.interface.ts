export interface SaleDetail {
  id?: number;
  productId: number;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  subtotal?: number;
}

export interface Sale {
  id?: number;
  saleDate?: string;
  total?: number;
  paymentType: string; // 'E' = Efectivo, 'T' = Tarjeta
  status?: string;
  userId: number;
  userName?: string;
  details: SaleDetail[];
}

export interface SaleRequest {
  userId: number;
  paymentType: string;
  details: { productId: number; quantity: number }[];
}

export interface SaleResponse {
  id: number;
  saleDate: string;
  total: number;
  paymentType: string;
  status: string;
  userId: number;
  userName: string;
  details: SaleDetail[];
}
