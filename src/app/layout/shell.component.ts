import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../services/audio.service';
import { StorageService } from '../services/storage.service';
import { AuthService } from '../services/auth.service';

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
            <a routerLink="/login">Login</a>
          </ng-container>
          <ng-template #logged>
            <span>Guest</span>
            <button (click)="logout()">Wyloguj</button>
          </ng-template>
        </div>
      </header>

      <main class="content">
        <router-outlet />
      </main>

      <footer class="bottombar">
        <button class="fab" (click)="toggleQuickMenu()">🎤</button>
        <div class="quick-menu" *ngIf="quickMenuOpen">
          <button (click)="quickRecord()">Quick Record</button>
          <button (click)="voiceAssistant()">Voice Assistant</button>
          <button (click)="addMarker()">Add Marker</button>
        </div>
        <input #quickCapture type="file" accept="audio/*" capture hidden (change)="onQuickPick($event)">
      </footer>
    </div>
  `,
  styles: [`
    .app-container{display:flex;flex-direction:column;height:100vh}
    .topbar{padding:8px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:1000}
    .tabs{display:flex;gap:12px;flex-wrap:wrap}
    .tabs a{padding:6px 10px;border-radius:6px;text-decoration:none;color:#333}
    .tabs a.active{background:#efefef}
    .content{flex:1;overflow:auto;padding:12px}
    .bottombar{position:fixed;left:0;right:0;bottom:0;padding:12px;display:flex;justify-content:center;z-index:1000}
    .fab{width:64px;height:64px;border-radius:50%;background:#e74c3c;color:#fff;border:none;font-size:24px;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:1001}
    .quick-menu{position:fixed;bottom:84px;left:0;right:0;display:flex;gap:8px;justify-content:center;z-index:1000}
    .quick-menu button{padding:8px 12px;border-radius:8px;border:1px solid #ddd;background:#fff}
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
    // Attempt to start immediately, then navigate; fallback to file capture on failure
    this.audio.startRecording()
      .then(() => this.go('/record'))
      .catch(() => {
        this.quickCapture?.nativeElement?.click();
      });
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
}


