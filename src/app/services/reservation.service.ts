import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { InsertarReservaDTO } from '../dtos/insertar-reserva-dto';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  constructor( private http: HttpClient ) { }

  public nTimeout: number = 20000;
  public nRetry: number = 0;
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('A ocurrido un error :', error.error.message);
    } else {
      console.error(
        'El servidor retornó el código, ' + error.status);
    }
    return throwError(() => error.error);
  };

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  public insertarReserva(data: InsertarReservaDTO): Observable<any> {
    const url = `${API_URL}reservation`;
    return this.http.post(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  private baseUrl = 'https://hotel-system-backend-rvha.onrender.com/api/v1/reservations';
  public obtenerReservas(params: {
    clientId?: number;
    roomId?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
    sort?: string[] | string;
  } = {}): Observable<any> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'sort' && Array.isArray(value)) {
        value.forEach(val => {
          httpParams = httpParams.append('sort', val);
        });
      } else if (key === 'fromDate' || key === 'toDate') {
        // Cortar la 'Z' si viene en formato ISO
        const dateValue = value.toString().replace(/Z$/, '');
        httpParams = httpParams.set(key, dateValue);
      } else {
        httpParams = httpParams.set(key, value.toString());
      }
    }
  });
    return this.http.get<any>(this.baseUrl, { params: httpParams });
  }

  public getReservationById(id: number) {
    return this.http.get<any>(`${API_URL}reservation/${id}`);
  }

  checkInReserva(id: number): Observable<any> {
    return this.http.put(`${API_URL}reservation/${id}/check-in`, {});
  }

  checkOutReserva(id: number): Observable<any> {
    return this.http.put(`${API_URL}reservation/${id}/check-out`, {});
  }

}
