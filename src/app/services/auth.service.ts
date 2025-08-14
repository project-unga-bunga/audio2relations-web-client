import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storageKey = 'auth-token';
  token = signal<string | null>(localStorage.getItem(this.storageKey));
  userEmail = signal<string | null>(null);

  async login(email: string, password: string) {
    // Placeholder: simulate login
    const fakeToken = btoa(`${email}:${Date.now()}`);
    localStorage.setItem(this.storageKey, fakeToken);
    this.token.set(fakeToken);
    this.userEmail.set(email);
  }

  async loginGuest() {
    const guestToken = 'guest';
    localStorage.setItem(this.storageKey, guestToken);
    this.token.set(guestToken);
    this.userEmail.set('guest');
  }

  logout() {
    localStorage.removeItem(this.storageKey);
    this.token.set(null);
    this.userEmail.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }
}


