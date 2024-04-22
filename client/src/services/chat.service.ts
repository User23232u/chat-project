import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import io, { Socket } from 'socket.io-client';
import { IMessage } from 'src/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private messages:IMessage[] = []
  // private messagesSubject = new Subject<IMessage[]>();

  constructor() {
    this.socket = io('http://localhost:3000');

    // this.socket.on('chat message', (msgs: IMessage[]) => {
    //   this.messagesSubject.next(msgs);
    // });

    this.socket.on('chat message', (msg: IMessage) => {
      // const item = `<li>${msg.text}</li>`;
      this.messages.push(msg);
    });
  }

  // getMessages(senderId: string, receiverId: string): Observable<IMessage[]> {
  //   this.socket.emit('get messages', { sender: senderId, receiver: receiverId });

  //   return this.messagesSubject.asObservable();
  // }

  sendMessage(msg: string, senderId: string, receiverId: string) {
    this.socket.emit('chat message', { text: msg, sender: senderId, receiver: receiverId });
  }
}
