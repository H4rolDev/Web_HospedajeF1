import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { ActualizarHabitacionDTO, InsertarHabitacionDTO } from '../dtos/insertar-habitacion-dto';
import { Habitacion, PaginatedResponse } from '../dtos/lista-habitacion-dto';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
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

  public InsertarHabitacion(data: InsertarHabitacionDTO) {
    const url = `${API_URL}room`;
    return this.http.post(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public obtenerHabitaciones(page: number, size: number): Observable<PaginatedResponse<Habitacion>> {
    const url = `${API_URL}rooms?page=${page}&size=${size}`;
    return this.http.get<PaginatedResponse<Habitacion>>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public actualizarHabitacion(id: number, data: ActualizarHabitacionDTO) {
    const url = `${API_URL}room/${id}`;
    return this.http.put(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public eliminarHabitacion(id: number) {
    const url = `${API_URL}room/${id}`;
    return this.http.delete(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

}
