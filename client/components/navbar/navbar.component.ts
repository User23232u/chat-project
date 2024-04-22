import { Component, Input, inject } from '@angular/core';
import { UserService } from '@services/user.service';
import { IUser } from 'src/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  @Input() logOut!: () => void;

  currentUser?: IUser;

  private userService = inject(UserService);

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: user => this.currentUser = user,
      error: error => console.error('Error:', error)
    });

    console.log(this.currentUser);
  }

}
