import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { LoginData } from '../dtos/LoginData';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/v1/auth/signin';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(this.apiUrl, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('auth_token', response.token);
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    this.isAuthenticatedSubject.next(!!token);
  }
}
