export interface Quote {
  id?: number;
  quoteDate: string;
  startTime: string;
  endTime: string;
  status?: string;
  userId: number;
  userName?: string;
  serviceId: number;
  serviceName?: string;
  roomId: number;
  roomName?: string;
}

export interface QuoteRequest {
  userId: number;
  serviceId: number;
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
  serviceId: number;
  serviceName: string;
  roomId: number;
  roomName: string;
}
