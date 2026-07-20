export class PaginationMetaDto {
  page!: number;
  pageSize!: number;
  total!: number;
  totalPages!: number;
}

export class ApiListResponseDto<T> {
  success!: true;
  data!: T[];
  meta!: PaginationMetaDto;
}

export class ApiItemResponseDto<T> {
  success!: true;
  data!: T;
}

export class ApiSuccessResponseDto {
  success!: true;
  data!: null;
}
