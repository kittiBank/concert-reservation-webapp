import { apiRequest } from "@/lib/api/client";
import type {
  ApiItemResponse,
  ApiListResponse,
  ApiSuccessResponse,
  CreateReservationInput,
  Reservation,
} from "@/types";

export interface ListReservationsParams {
  page?: number;
  pageSize?: number;
}

export async function listMyReservations(
  params: ListReservationsParams = {},
): Promise<ApiListResponse<Reservation>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const query = search.toString();
  return apiRequest<ApiListResponse<Reservation>>(
    `/reservations/me${query ? `?${query}` : ""}`,
  );
}

export async function listAllReservations(
  params: ListReservationsParams = {},
): Promise<ApiListResponse<Reservation>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const query = search.toString();
  return apiRequest<ApiListResponse<Reservation>>(
    `/reservations${query ? `?${query}` : ""}`,
  );
}

export async function createReservation(
  input: CreateReservationInput,
): Promise<Reservation> {
  const response = await apiRequest<ApiItemResponse<Reservation>>(
    "/reservations",
    { method: "POST", body: input },
  );
  return response.data;
}

export async function cancelReservation(id: number): Promise<void> {
  await apiRequest<ApiSuccessResponse>(`/reservations/${id}`, {
    method: "DELETE",
  });
}
