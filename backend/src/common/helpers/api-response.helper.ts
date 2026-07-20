import {
  ApiItemResponseDto,
  ApiListResponseDto,
  ApiSuccessResponseDto,
  PaginationMetaDto,
} from '../dto/api-response.dto';

//build pagination meta
export function buildPaginationMeta(
  page: number,
  pageSize: number,
  total: number,
): PaginationMetaDto {
  return {
    page,
    pageSize,
    total,
    totalPages: total === 0 ? 0 : Math.ceil(total / pageSize),
  };
}

//build list response
export function buildListResponse<T>(
  data: T[],
  page: number,
  pageSize: number,
  total: number,
): ApiListResponseDto<T> {
  return {
    success: true,
    data,
    meta: buildPaginationMeta(page, pageSize, total),
  };
}

//build item response
export function buildItemResponse<T>(data: T): ApiItemResponseDto<T> {
  return {
    success: true,
    data,
  };
}

//build success response
export function buildSuccessResponse(): ApiSuccessResponseDto {
  return {
    success: true,
    data: null,
  };
}
