export interface InsertarHabitacionDTO {
  number: string;
  description: string;
  dailyPrice: number;
  hourPrice: number;       // corregido
  capacity: number;
  floor: number;           // corregido
  status: string;
  statusCleaning: string;
  roomTypeId: number;
}

export interface ActualizarHabitacionDTO {
  id: number;
  number: string;
  description: string;
  dailyPrice: number;
  hourPrice: number;       // corregido
  capacity: number;
  floor: number;           // corregido
  status: string;
  statusCleaning: string;
  roomTypeId: number;
}
