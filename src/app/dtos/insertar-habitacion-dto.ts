export interface InsertarHabitacionDTO {
  number: string;
  description: string;
  dailyPrice: number;
  hourPrice: number;
  capacity: number;
  floor: number;
  status: string;
  statusCleaning: string;
  tipo_habitacion_id: number;
}

export interface ActualizarHabitacionDTO {
  id: number;
  number: string;
  description: string;
  dailyPrice: number;
  hourPrice: number;
  capacity: number;
  floor: number;
  status: string;
  statusCleaning: string;
  tipo_habitacion_id: number;
}
