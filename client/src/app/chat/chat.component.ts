import { UserService } from '@services/user.service';
import { ViewChild, ElementRef } from '@angular/core';
import { Component, OnInit, inject } from '@angular/core';
import { SocketService } from '@services/socket.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IUser } from 'src/models/user.model';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { ChatService } from '@services/chat.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { IMessage } from 'src/models/message.model';
import io, { Socket } from 'socket.io-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterLink, CommonModule, NgFor, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit {


  messages: IMessage[] = [];
  sender?: IUser;
  receiver?: IUser;
  newMessage = '';
  socket = io('http://localhost:3000');

  constructor(
    private userService: UserService,
    private chatService: ChatService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.sender = user;
      this.socket.emit('user connected', this.sender._id);
    });

    this.socket.on('user connected', () => {
      const receiverId = this.route.snapshot.paramMap.get('id');
      if (receiverId) {
        this.userService.getUserById(receiverId).subscribe(user => {
          this.receiver = user;
          if (this.sender && this.receiver) {
            this.socket.emit('get messages', { sender: this.sender._id, receiver: this.receiver._id });
          }
        });
      }
    });

    this.socket.on('chat message', (msg: IMessage | IMessage[]) => {
      if (Array.isArray(msg)) {
        // Si el mensaje es un array, reemplaza todos los mensajes
        this.messages = msg;
      } else {
        // Si el mensaje no es un array, añade el nuevo mensaje al final de la lista de mensajes
        this.messages.push(msg);
      }
    });
  }

  sendMessage(): void {
    if (this.newMessage.trim() !== '' && this.sender && this.receiver) {
      const msg: IMessage = { text: this.newMessage, sender: this.sender._id, receiver: this.receiver._id };
      this.socket.emit('chat message', msg);
      this.newMessage = '';
      this.messages.push(msg);
    }
  }
}
