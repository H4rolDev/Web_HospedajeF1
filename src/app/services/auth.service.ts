import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LoginData } from '../dtos/LoginData';
import { Router } from '@angular/router';
import { InsertarUsuariosDTO } from '../dtos/insertar-usuarios-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://hotel-system-backend-rvha.onrender.com/api/v1/user/signin';
  private registerUrl = 'https://hotel-system-backend-rvha.onrender.com/api/v1/user/register';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, credentials).pipe(
      tap(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('token');
    this.isAuthenticatedSubject.next(!!token);
  }

  register(userData: InsertarUsuariosDTO): Observable<any> {
    return this.http.post<any>(this.registerUrl, userData);
  }
}
