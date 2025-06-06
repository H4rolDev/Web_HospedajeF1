import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { InsertarCompanyDTO } from '../dtos/insertar-company-dto';
import { Company } from '../dtos/listado-company-dto';

const API_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
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

  public InsertarCompany(data: InsertarCompanyDTO) {
    const url = `${API_URL}company`;
    return this.http.post(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public obtenerCompany(): Observable<Company[]> {
    const url = `${API_URL}companies`;
    return this.http.get<Company[]>(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public actualizarCompany(id: number, data: InsertarCompanyDTO) {
    const url = `${API_URL}company/${id}`;
    return this.http.put(url, data).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }

  public eliminarCompany(id: number) {
    const url = `${API_URL}company/${id}`;
    return this.http.delete(url).pipe(
      retry(this.nRetry),
      catchError(this.handleError)
    );
  }
}
