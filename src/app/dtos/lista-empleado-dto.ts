export interface Empleado {
  id: number;
  documentType: string;
  documentNumber: string;
  name: string;
  lastName: string;
  phone: string;
  companyId: number | string;
  userId: number | string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
