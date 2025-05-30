import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { InsertarEmpleadoDTO } from '../dtos/insertar-empleado-dto';
import { environment } from '../environments/environment';
import { Empleado, PaginatedResponse } from '../dtos/lista-empleado-dto';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
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

  public InsertarEmpleado(data: InsertarEmpleadoDTO) {
    const url = `${API_URL}employee`;
    return this.http.post(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public obtenerEmpleados(page: number, size: number): Observable<PaginatedResponse<Empleado>> {
    const url = `${API_URL}employees?page=${page}&size=${size}`;
    return this.http.get<PaginatedResponse<Empleado>>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public actualizarEmpleado(id: number, data: InsertarEmpleadoDTO) {
    const url = `${API_URL}employee/${id}`;
    return this.http.put(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public eliminarEmpleado(id: number) {
    const url = `${API_URL}employee/${id}`;
    return this.http.delete(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public buscarEmpleadoPorDocumento(numeroDocumento: string) {
    const url = `${API_URL}employee/document-number/${numeroDocumento}`;
    return this.http.get<Empleado>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }
}
