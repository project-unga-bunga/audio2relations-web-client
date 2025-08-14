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
      <header class="topbar">
        <nav class="tabs">
          <a routerLink="/record" routerLinkActive="active">Record</a>
          <a routerLink="/timeline" routerLinkActive="active">Timeline</a>
          <a routerLink="/calendar" routerLinkActive="active">Calendar</a>
          <a routerLink="/sensors" routerLinkActive="active">Sensors</a>
          <a routerLink="/transcription" routerLinkActive="active">Transcription</a>
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/diagram" routerLinkActive="active">Diagram</a>
        </nav>
        <div class="auth">
          <ng-container *ngIf="!auth.token(); else logged">
            <a routerLink="/login" class="login-btn">Login</a>
          </ng-container>
          <ng-template #logged>
            <span class="user-info">Guest</span>
            <button class="logout-btn" (click)="logout()">Wyloguj</button>
          </ng-template>
        </div>
      </header>

      <main class="content">
        <router-outlet />
      </main>

      <footer class="bottombar">
        <button class="fab" (click)="toggleQuickMenu()">🎤</button>
        <div class="quick-menu" *ngIf="quickMenuOpen">
          <button class="quick-btn" (click)="quickRecord()">Quick Record</button>
          <button class="quick-btn" (click)="voiceAssistant()">Voice Assistant</button>
          <button class="quick-btn" (click)="addMarker()">Add Marker</button>
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
      padding-top:env(safe-area-inset-top);
      background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
      color: #e6e6e6;
    }
    
    .topbar{
      padding: 12px 16px;
      border-bottom: 2px solid #d4af37;
      display:flex;
      align-items:center;
      justify-content:space-between;
      position:relative;
      z-index:1000;
      padding-top:calc(12px + env(safe-area-inset-top));
      background: rgba(15, 20, 25, 0.95);
      backdrop-filter: blur(10px);
    }
    
    .tabs{
      display:flex;
      gap:8px;
      flex-wrap:wrap;
    }
    
    .tabs a{
      padding: 8px 16px;
      border-radius: 20px;
      text-decoration:none;
      color: #b0b0b0;
      font-weight: 500;
      transition: all 0.3s ease;
      border: 1px solid transparent;
    }
    
    .tabs a:hover{
      color: #d4af37;
      background: rgba(212, 175, 55, 0.1);
      border-color: rgba(212, 175, 55, 0.3);
    }
    
    .tabs a.active{
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
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
      transition: all 0.3s ease;
    }
    
    .fab:hover{
      transform: scale(1.1);
      box-shadow: 0 12px 32px rgba(212, 175, 55, 0.6);
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
      .tabs {
        gap: 4px;
      }
      
      .tabs a {
        padding: 6px 12px;
        font-size: 14px;
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
  `]
})
export class ShellComponent {
  quickMenuOpen = false;
  private router = inject(Router);
  private audio = inject(AudioService);
  auth = inject(AuthService);
  private storage = inject(StorageService);
  @ViewChild('quickCapture') quickCapture?: ElementRef<HTMLInputElement>;

  toggleQuickMenu() {
    this.quickMenuOpen = !this.quickMenuOpen;
  }

  go(path: string) {
    this.router.navigateByUrl(path);
    this.quickMenuOpen = false;
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

  voiceAssistant(){
    this.go('/transcription');
  }

  addMarker(){
    const evt = new CustomEvent('quick-add-marker');
    window.dispatchEvent(evt);
    this.quickMenuOpen = false;
  }

  async onQuickPick(ev: Event){
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file){
      await this.audio.setRecordingFromFile(file);
      try {
        const hasHandle = await this.storage.getExportDirHandle();
        if (!hasHandle) {
          await this.storage.requestDirectoryAccess();
        }
      } catch {}
      await this.audio.saveLastRecordingToTimeline();
      // emit refresh and route to timeline for immediate playback
      window.dispatchEvent(new Event('timeline-refresh'));
      this.go('/timeline');
    }
    if (this.quickCapture?.nativeElement) this.quickCapture.nativeElement.value = '';
  }

  logout(){
    this.auth.logout();
  }

  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  }
}


