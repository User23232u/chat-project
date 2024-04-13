import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthGoogleService } from '@services/auth-google.service';

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

  private authService = inject(AuthGoogleService);
  private http = inject(HttpClient);
  private formBuilder: FormBuilder = inject(FormBuilder);

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

      this.http.post('/api/login', { email, password }).subscribe(
        response => {
          // Maneja la respuesta de la API
        },
        error => {
          // Maneja el error
        }
      );
    }
  }

  signInWithGoogle() {
    this.authService.login();
  }
}
