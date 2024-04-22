import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthConfig, OAuthEvent, OAuthService } from 'angular-oauth2-oidc';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  private oAuthService = inject(OAuthService);
  private http = inject(HttpClient);

  constructor() {
    this.initConfiguration();
  }

  async initConfiguration() {
    const authConfig: AuthConfig = {
      issuer: 'https://accounts.google.com',
      strictDiscoveryDocumentValidation: false,
      clientId: '946520968342-ab1jrnm9f61jpbl6jibc3b8jn2caa2d0.apps.googleusercontent.com',
      redirectUri: window.location.origin + '/home',
      scope: 'openid profile email',
    };

    this.oAuthService.configure(authConfig);
    this.oAuthService.setupAutomaticSilentRefresh();

    // Espera el evento tokenReceived antes de obtener el token de acceso
    this.oAuthService.events.subscribe(event => {
      // console.log('OAuth event:', event);

      if (event.type === 'token_received') {
        const token = this.oAuthService.getIdToken();
        console.log('ID token received:', token);
        this.sendTokenToServer(token);
      }
    });

    await this.oAuthService.loadDiscoveryDocumentAndTryLogin();
  }

  public login(): void {
    this.oAuthService.initImplicitFlow();
  }

  private sendTokenToServer(token: string): void {
    this.http.post('http://localhost:3000/api/auth/google', { token }).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
      },
      (err) => console.error('Error:', err)
    );
  }

  logout() {
    this.oAuthService.revokeTokenAndLogout();
    this.oAuthService.logOut();
  }

  getProfile() {
    return this.oAuthService.getIdentityClaims();
  }

  getToken() {
    return this.oAuthService.getAccessToken();
  }
}
