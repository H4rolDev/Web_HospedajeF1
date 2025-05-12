import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
// import { login } from '../store/authentication/authentication.actions';

@Component({
  selector: 'app-singin',
  templateUrl: './singin.component.html',
  styleUrl: './singin.component.css'
})
export class SinginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
          console.error('Error en el login:', err);
        }
      });
    }
  }
}
