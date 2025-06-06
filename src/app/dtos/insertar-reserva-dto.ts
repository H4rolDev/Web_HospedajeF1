export interface InsertarReservaDTO {
  clientId: number;
  reservationRooms: {
    roomId: number;
    rateType: 'DIA' | 'HORA';
  }[];
  startDate: string;
  endDate: string;
  notes: string;
}
