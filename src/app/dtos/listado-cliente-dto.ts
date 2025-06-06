export interface Cliente {
  id: number;
  clientType: string;
  documentType: string;
  documentNumber: string;
  name: string;
  phone: string;
  nationality: string;
  email: string;
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
