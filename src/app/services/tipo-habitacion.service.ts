import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { InsertarTipoHabitacionDTO } from '../dtos/insertar-tipo-habitacion-dto';
import { PaginatedResponse } from '../dtos/lista-habitacion-dto';
import { TipoHabitacion } from '../dtos/listado-tipo-habitacion-dto';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class TipoHabitacionService {
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

  public InsertarTipoHabitacion(data: InsertarTipoHabitacionDTO) {
    const url = `${API_URL}room-type`;
    return this.http.post(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public obtenerTipoHabitacion(page: number, size: number): Observable<PaginatedResponse<TipoHabitacion>> {
    const url = `${API_URL}room-types?page=${page}&size=${size}`;
    return this.http.get<PaginatedResponse<TipoHabitacion>>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public actualizarTipoHabitacion(id: number, data: InsertarTipoHabitacionDTO) {
    const url = `${API_URL}room-type/${id}`;
    return this.http.put(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public eliminarTipoHabitacion(id: number) {
    const url = `${API_URL}room-type/${id}`;
    return this.http.delete(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }
}
