export interface Habitacion {
  id?: number;            // Opcional, si es para crear puede no llevar id
  number: string;         // Número de habitación
  description: string;    // Descripción
  dailyPrice: number;     // Precio por día
  hourPrice: number;      // Precio por hora
  roomTypeId: number;     // Id del tipo de habitación
  capacity: number;       // Capacidad de la habitación
  floor: number;          // Piso donde está la habitación
  status?: string;        // Estado de la habitación, ej: 'LIBRE'
  statusCleaning?: string;// Estado de limpieza, ej: 'LIMPIO'
  typeRoom?: string;
  roomTypeName?: string; // Nombre del tipo de habitación
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
