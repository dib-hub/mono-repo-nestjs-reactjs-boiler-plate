export interface PaginationMeta {
  page: number;
  take: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  iat?: number;
  exp?: number;
}
