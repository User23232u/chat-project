import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthGoogleService } from '@services/auth-google.service';
import { AuthService } from '@services/auth.service';

const MODULES: any[] = [
  MatIconModule,
  ReactiveFormsModule
];

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ MODULES ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;

  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private authGoogleService = inject(AuthGoogleService);

  constructor() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submitLoginForm() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.authService.login(email, password).subscribe({
        next: response => {
          // Redirige al usuario a la página principal
          console.log('Response:', response);
          this.router.navigate(['/home']);
        },
        error: error => {
          // Muestra un mensaje de error
          alert('Error al iniciar sesión: ' + error.message);
        }
      });
    }
  }

  signInWithGoogle() {
    this.authGoogleService.login();
  }
}
