import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { InsertarClienteDTO } from '../dtos/insertar-cliente-dto';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Cliente, PaginatedResponse } from '../dtos/listado-cliente-dto';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class ClientService {

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

  public InsertarCliente(data: InsertarClienteDTO) {
    const url = `${API_URL}client`;
    return this.http.post(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public obtenerClientes(page: number, size: number): Observable<PaginatedResponse<Cliente>> {
    const url = `${API_URL}clients?page=${page}&size=${size}`;
    return this.http.get<PaginatedResponse<Cliente>>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public actualizarCliente(id: number, data: InsertarClienteDTO) {
    const url = `${API_URL}client/${id}`;
    return this.http.put(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public eliminarCliente(id: number) {
    const url = `${API_URL}client/${id}`;
    return this.http.delete(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public buscarClientePorDocumento(numeroDocumento: string) {
    const url = `${API_URL}client/document-number/${numeroDocumento}`;
    return this.http.get<Cliente>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }
}
