import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { AuthGoogleService } from '@services/auth-google.service';
import { UserService } from '@services/user.service';
import { IUser } from 'src/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Variables
  users?: IUser[];
  profile: any;

  // Inyecciones de dependencias
  private authService = inject(AuthGoogleService);
  private userService = inject(UserService);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {

    this.userService.getUsers().subscribe({
      next: users => this.users = users,
      error: error => console.error('Error:', error)
    });

    await this.authService.initConfiguration();

    this.showData();

    if (!this.profile) {
      this.router.navigate(['/auth/login']);
    }
  }

  showData() {
    this.profile = this.authService.getProfile();
    console.log(this.profile);
  }

  logOut = () => {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
