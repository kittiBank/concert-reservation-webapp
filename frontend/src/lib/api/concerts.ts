import { apiRequest } from "@/lib/api/client";
import type {
  ApiItemResponse,
  ApiListResponse,
  ApiSuccessResponse,
  Concert,
  CreateConcertInput,
} from "@/types";

export interface ListConcertsParams {
  page?: number;
  pageSize?: number;
}

export async function listConcerts(
  params: ListConcertsParams = {},
): Promise<ApiListResponse<Concert>> {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.pageSize) search.set("pageSize", String(params.pageSize));
  const query = search.toString();
  return apiRequest<ApiListResponse<Concert>>(
    `/concerts${query ? `?${query}` : ""}`,
  );
}

export async function getConcert(id: number): Promise<Concert> {
  const response = await apiRequest<ApiItemResponse<Concert>>(`/concerts/${id}`);
  return response.data;
}

export async function createConcert(
  input: CreateConcertInput,
): Promise<Concert> {
  const response = await apiRequest<ApiItemResponse<Concert>>("/concerts", {
    method: "POST",
    body: input,
  });
  return response.data;
}

export async function deleteConcert(id: number): Promise<void> {
  await apiRequest<ApiSuccessResponse>(`/concerts/${id}`, {
    method: "DELETE",
  });
}
