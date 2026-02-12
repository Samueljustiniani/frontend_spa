export interface Quote {
  id?: number;
  quoteDate: string;
  startTime: string;
  endTime: string;
  status?: string;
  userId: number;
  userName?: string;
  serviceIds: number[];
  serviceNames?: string[];
  roomId: number;
  roomName?: string;
}

export interface QuoteRequest {
  userId: number;
  serviceIds: number[];   // Array de IDs de servicios
  roomId: number;
  quoteDate: string;
  startTime: string;
  endTime: string;
}

export interface QuoteResponse {
  id: number;
  quoteDate: string;
  startTime: string;
  endTime: string;
  status: string;
  userId: number;
  userName: string;
  serviceIds: number[];
  serviceNames: string[];
  roomId: number;
  roomName: string;
}
