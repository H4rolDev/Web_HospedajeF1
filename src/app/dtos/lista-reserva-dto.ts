export interface Reserva {
  id: number;
  clientId: number;
  status: string;
  startDate: string;
  endDate: string;
  checkIn: string;
  checkOut: string;
  notes: string;
  totalReservationPrice: number;
  totalExtras: number;
  totalPaid: number;
  totalPrice: number;
  reservationRooms: {
    roomId: number;
    rateType: string;
    rateApplied: number;
  }[];
  payments: {
    id: number;
    reservationId: number;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
  }[];
  extraCharges: {
    id: number;
    reservationId: number;
    description: string;
    price: number;
  }[];
}
