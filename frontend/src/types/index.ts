export type Role = "ADMIN" | "USER";

export interface User {
  id: number;
  email: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Concert {
  id: number;
  name: string;
  description: string;
  totalSeats: number;
  reservedCount: number;
  availableSeats: number;
  isSoldOut: boolean;
  createdAt: string;
}

export interface ReservationUser {
  id: number;
  email: string;
}

export interface Reservation {
  id: number;
  userId: number;
  concertId: number;
  createdAt: string;
  concert: Omit<Concert, "createdAt">;
  user?: ReservationUser;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiItemResponse<T> {
  success: true;
  data: T;
}

export interface ApiSuccessResponse {
  success: true;
  data: null;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface CreateConcertInput {
  name: string;
  description: string;
  totalSeats: number;
}

export interface CreateReservationInput {
  concertId: number;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
}
