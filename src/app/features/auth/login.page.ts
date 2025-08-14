import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule],
  template: `
    <h2>Login</h2>
    <button (click)="loginGuest()">Zaloguj jako gość</button>
  `
})
export class LoginPage {
  private auth = inject(AuthService);
  email = signal('');
  password = signal('');

  async onSubmit(e: Event) {
    e.preventDefault();
    await this.auth.login(this.email(), this.password());
  }

  onEmail(e: Event){ this.email.set((e.target as HTMLInputElement).value); }
  onPassword(e: Event){ this.password.set((e.target as HTMLInputElement).value); }

  async loginGuest(){
    await this.auth.loginGuest();
    window.history.back();
  }
}


