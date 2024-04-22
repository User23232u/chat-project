import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  public send(message: string) {
    this.socket.emit('chat message', message);
  }

  public onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chat message', (msg: string) => observer.next(msg));
    });
  }
}
