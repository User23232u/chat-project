import { TokenService } from './token.service';
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from 'src/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  getUsers(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getUserById(id: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }

  getCurrentUser(): Observable<IUser> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    return this.http.get<IUser>(`${this.apiUrl}/current`, { headers });
  }
}
