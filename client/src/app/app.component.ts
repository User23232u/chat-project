import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

const MODULES = [
  RouterOutlet,
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ MODULES ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { }
