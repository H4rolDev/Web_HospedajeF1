import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

const API_URL = environment.apiURL;

interface PaymentPayload {
  reservationId: number;
  amount: number;
  paymentMethod: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private baseUrl = 'https://hotel-system-backend-rvha.onrender.com/api/v1/payment';

  constructor(private http: HttpClient) {}

  realizarPago(payload: PaymentPayload): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  agregarCargoExtra(payload: {reservationId: number, description: string, price: number}) {
    return this.http.post('https://hotel-system-backend-rvha.onrender.com/api/v1/extra-charge', payload);
  }

  // reservation.service.ts
  getPagosReserva(reservationId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://hotel-system-backend-rvha.onrender.com/api/v1/payments/reservation/${reservationId}`);
  }

  getCargosExtraReserva(reservationId: number): Observable<any[]> {
    return this.http.get<any[]>(`https://hotel-system-backend-rvha.onrender.com/api/v1/extra-charges/reservation/${reservationId}`);
  }


}
