export interface Habitacion {
  id: number;
  number: string;
  description: string;
  dailyPrice: number;
  hourPrice: number;
  roomTypeId: number;
  capacity: number;
  floor: number;
  status?: string;
  statusCleaning?: string;
  typeRoom?: string;
  roomTypeName?: string;
  tipo_habitacion_id?: number;
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

export interface RoomDto {
  id: number;
  number: string;
  description: string;
  dailyPrice: number;
  hourPrice: number;
  capacity: number;
  floor: number;
  status: string;
  statusCleaning: string;
  roomTypeId: number;
  roomTypeName: string;
  productsAssignments: ProductAssignmentDto[];
}

export interface ProductAssignmentDto {
  roomId: number;
  productId: number;
  quantity: number;
}
