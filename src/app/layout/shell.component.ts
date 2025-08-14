import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../services/audio.service';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-container">
      <header class="topbar animate-fade-in">
        <div class="topbar-left">
          <button class="burger-btn hover-scale btn-ripple" (click)="toggleMenu()" [class.active]="menuOpen">
            <span class="burger-line"></span>
            <span class="burger-line"></span>
            <span class="burger-line"></span>
          </button>
          <h1 class="app-title text-glow animate-float">🎤 Audio Recorder</h1>
        </div>
        
        <div class="auth">
          <ng-container *ngIf="!auth.token(); else logged">
            <a routerLink="/login" class="login-btn hover-lift btn-ripple">Login</a>
          </ng-container>
          <ng-template #logged>
            <span class="user-info text-shimmer">Guest</span>
            <button class="logout-btn hover-scale btn-ripple" (click)="logout()">Wyloguj</button>
          </ng-template>
        </div>
      </header>

      <!-- Hamburger Menu Overlay -->
      <div class="menu-overlay animate-fade-in" *ngIf="menuOpen" (click)="closeMenu()"></div>
      
      <!-- Sidebar Menu -->
      <nav class="sidebar-menu" [class.open]="menuOpen">
        <div class="menu-header animate-slide-left">
          <h2 class="menu-title text-glow">Menu</h2>
          <button class="close-menu-btn hover-scale btn-ripple" (click)="closeMenu()">×</button>
        </div>
        <div class="menu-items">
          <a routerLink="/record" routerLinkActive="active" (click)="closeMenu()" class="menu-item hover-lift animate-fade-in-delay-1">
            <span class="menu-icon animate-pulse">🎤</span>
            <span class="menu-text">Record</span>
          </a>
          <a routerLink="/timeline" routerLinkActive="active" (click)="closeMenu()" class="menu-item hover-lift animate-fade-in-delay-2">
            <span class="menu-icon">📅</span>
            <span class="menu-text">Timeline</span>
          </a>
          <a routerLink="/calendar" routerLinkActive="active" (click)="closeMenu()" class="menu-item hover-lift animate-fade-in-delay-3">
            <span class="menu-icon">📆</span>
            <span class="menu-text">Calendar</span>
          </a>
          <a routerLink="/sensors" routerLinkActive="active" (click)="closeMenu()" class="menu-item hover-lift animate-fade-in-delay-1">
            <span class="menu-icon">📱</span>
            <span class="menu-text">Sensors</span>
          </a>
          <a routerLink="/transcription" routerLinkActive="active" (click)="closeMenu()" class="menu-item hover-lift animate-fade-in-delay-2">
            <span class="menu-icon">📝</span>
            <span class="menu-text">Transcription</span>
          </a>
          <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()" class="menu-item hover-lift animate-fade-in-delay-3">
            <span class="menu-icon">📊</span>
            <span class="menu-text">Dashboard</span>
          </a>
          <a routerLink="/diagram" routerLinkActive="active" (click)="closeMenu()" class="menu-item hover-lift animate-fade-in-delay-1">
            <span class="menu-icon">📈</span>
            <span class="menu-text">Diagram</span>
          </a>
        </div>
      </nav>

      <main class="content">
        <router-outlet />
      </main>

      <footer class="bottombar animate-fade-in">
        <button class="fab hover-scale btn-ripple animate-glow" (click)="toggleQuickMenu()">🎤</button>
        <div class="quick-menu animate-scale-in" *ngIf="quickMenuOpen">
          <button class="quick-btn hover-lift btn-ripple animate-fade-in-delay-1" (click)="quickRecord()">Quick Record</button>
          <button class="quick-btn hover-lift btn-ripple animate-fade-in-delay-2" (click)="voiceAssistant()">Voice Assistant</button>
          <button class="quick-btn hover-lift btn-ripple animate-fade-in-delay-3" (click)="addMarker()">Add Marker</button>
        </div>
        <input #quickCapture type="file" accept="audio/*" capture="microphone" hidden (change)="onQuickPick($event)">
      </footer>
    </div>
  `,
  styles: [`
    .app-container{
      display:flex;
      flex-direction:column;
      height:100vh;
      background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
      color: #e6e6e6;
      position: relative;
    }
    
    .topbar{
      padding: 12px 16px;
      border-bottom: 2px solid #d4af37;
      display:flex;
      align-items:center;
      justify-content:space-between;
      position:relative;
      z-index:1000;
      background: rgba(15, 20, 25, 0.95);
      backdrop-filter: blur(10px);
      min-height: 60px;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .burger-btn {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 30px;
      height: 24px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      transition: all 0.3s ease;
    }

    .burger-btn:hover {
      transform: scale(1.1);
    }

    .burger-btn.active .burger-line:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .burger-btn.active .burger-line:nth-child(2) {
      opacity: 0;
    }

    .burger-btn.active .burger-line:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    .burger-line {
      width: 100%;
      height: 3px;
      background: #d4af37;
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .app-title {
      color: #d4af37;
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
    }
    
    .auth{
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .login-btn{
      padding: 8px 16px;
      border-radius: 20px;
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    .login-btn:hover{
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    }
    
    .user-info{
      color: #d4af37;
      font-weight: 500;
    }
    
    .logout-btn{
      padding: 6px 12px;
      border-radius: 16px;
      background: rgba(220, 53, 69, 0.2);
      color: #dc3545;
      border: 1px solid rgba(220, 53, 69, 0.3);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .logout-btn:hover{
      background: rgba(220, 53, 69, 0.3);
      border-color: rgba(220, 53, 69, 0.5);
    }

    /* Menu Overlay */
    .menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1500;
      backdrop-filter: blur(5px);
    }

    /* Sidebar Menu */
    .sidebar-menu {
      position: fixed;
      top: 0;
      left: -300px;
      width: 300px;
      height: 100vh;
      background: rgba(15, 20, 25, 0.98);
      backdrop-filter: blur(20px);
      border-right: 2px solid #d4af37;
      z-index: 2000;
      transition: left 0.3s ease;
      overflow-y: auto;
    }

    .sidebar-menu.open {
      left: 0;
    }

    .menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    }

    .menu-title {
      color: #d4af37;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .close-menu-btn {
      background: none;
      border: none;
      color: #b0b0b0;
      font-size: 2rem;
      cursor: pointer;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-menu-btn:hover {
      background: rgba(220, 53, 69, 0.2);
      color: #dc3545;
    }

    .menu-items {
      padding: 20px 0;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      color: #e6e6e6;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 4px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .menu-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.1), transparent);
      transition: left 0.5s;
    }

    .menu-item:hover::before {
      left: 100%;
    }

    .menu-item:hover {
      background: rgba(212, 175, 55, 0.1);
      border-left-color: #d4af37;
      color: #d4af37;
      transform: translateX(5px);
    }

    .menu-item.active {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%);
      border-left-color: #d4af37;
      color: #d4af37;
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
    }

    .menu-icon {
      font-size: 1.5rem;
      width: 24px;
      text-align: center;
    }

    .menu-text {
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    .content{
      flex:1;
      overflow:auto;
      padding: 20px;
      padding-bottom:calc(20px + env(safe-area-inset-bottom));
    }
    
    .bottombar{
      position:fixed;
      left:0;
      right:0;
      bottom:0;
      padding: 20px;
      display:flex;
      justify-content:center;
      z-index:1000;
      padding-bottom:calc(20px + env(safe-area-inset-bottom));
      background: rgba(15, 20, 25, 0.95);
      backdrop-filter: blur(10px);
      border-top: 2px solid #d4af37;
    }
    
    .fab{
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      border: none;
      font-size: 28px;
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
      z-index: 1001;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .fab:hover{
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(212, 175, 55, 0.6);
    }

    .fab::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.5s;
    }

    .fab:hover::before {
      left: 100%;
    }
    
    .quick-menu{
      position: fixed;
      bottom: 100px;
      left: 0;
      right: 0;
      display: flex;
      gap: 12px;
      justify-content: center;
      z-index: 1000;
      padding: 0 20px;
    }
    
    .quick-btn{
      padding: 12px 20px;
      border-radius: 25px;
      border: 2px solid #d4af37;
      background: rgba(15, 20, 25, 0.95);
      color: #d4af37;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }
    
    .quick-btn:hover{
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    }
    
    @media (max-width: 768px) {
      .sidebar-menu {
        width: 280px;
        left: -280px;
      }

      .app-title {
        font-size: 1rem;
      }

      .topbar {
        padding: 8px 12px;
      }

      .topbar-left {
        gap: 12px;
      }

      .burger-btn {
        width: 28px;
        height: 22px;
      }

      .menu-item {
        padding: 14px 16px;
      }

      .menu-text {
        font-size: 1rem;
      }

      .quick-menu {
        flex-direction: column;
        align-items: center;
        bottom: 120px;
      }
      
      .quick-btn {
        width: 200px;
      }
    }

    @media (max-width: 480px) {
      .sidebar-menu {
        width: 100vw;
        left: -100vw;
      }

      .app-title {
        display: none;
      }

      .auth {
        gap: 8px;
      }

      .login-btn, .logout-btn {
        padding: 6px 12px;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ShellComponent {
  @ViewChild('quickCapture') quickCapture: ElementRef<HTMLInputElement> | undefined;
  router = inject(Router);
  audio = inject(AudioService);
  auth = inject(AuthService);
  storage = inject(StorageService);
  quickMenuOpen = false;
  menuOpen = false;

  go(path: string) {
    this.router.navigate([path]);
    this.quickMenuOpen = false;
  }

  toggleQuickMenu() {
    this.quickMenuOpen = !this.quickMenuOpen;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  quickRecord(){
    // Na telefonie zawsze używamy natywnego mikrofonu urządzenia
    if (this.isMobileDevice()) {
      // Bezpośrednio otwórz natywny mikrofon urządzenia
      this.quickCapture?.nativeElement?.click();
    } else {
      // Na desktop próbuj przeglądarkę, potem fallback
      this.audio.startRecording()
        .then(() => this.go('/record'))
        .catch(() => {
          this.quickCapture?.nativeElement?.click();
        });
    }
  }

  async onQuickPick(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      await this.audio.setRecordingFromFile(file);
      await this.audio.saveLastRecordingToTimeline();
      this.go('/timeline');
    }
    this.quickMenuOpen = false;
  }

  voiceAssistant() {
    alert('Voice Assistant not implemented yet.');
    this.quickMenuOpen = false;
  }

  addMarker() {
    window.dispatchEvent(new CustomEvent('quick-add-marker'));
    this.go('/timeline');
    this.quickMenuOpen = false;
  }

  logout() {
    this.auth.logout();
  }

  isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  }
}


