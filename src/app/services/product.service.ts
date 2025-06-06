import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { InsertarProductoDTO } from '../dtos/insertar-producto-dto';
import { environment } from '../environments/environment';
import { PaginatedResponse, Producto } from '../dtos/listado-producto-dto';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ProductService {
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

  public InsertarProducto(data: InsertarProductoDTO) {
    const url = `${API_URL}room-product`;
    return this.http.post(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public obtenerProducto(page: number, size: number): Observable<PaginatedResponse<Producto>> {
    const url = `${API_URL}room-products?page=${page}&size=${size}`;
    return this.http.get<PaginatedResponse<Producto>>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public actualizarProducto(id: number, data: InsertarProductoDTO) {
    const url = `${API_URL}room-product/${id}`;
    return this.http.put(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public eliminarProducto(id: number) {
    const url = `${API_URL}room-product/${id}`;
    return this.http.delete(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }
}
