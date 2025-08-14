import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { StorageService } from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-record-page',
  imports: [CommonModule],
  template: `
    <h2>Record</h2>
    <div class="controls">
      <button (click)="start()" [disabled]="isRecording()">Start</button>
      <button (click)="stop()" [disabled]="!isRecording()">Stop</button>
      <button (click)="play()" [disabled]="!audioUrl()">Play</button>
      <button (click)="save()" [disabled]="!audioUrl()">Save to Timeline</button>
    </div>
    <div class="fallback">
      <label>
        Fallback (mobile):
        <input type="file" accept="audio/*" capture (change)="onPick($event)">
      </label>
    </div>
    <audio *ngIf="audioUrl()" [src]="audioUrl()" controls></audio>
  `,
  styles: [`
    .controls{display:flex;gap:8px;margin-bottom:12px}
    .fallback{margin-bottom:12px}
  `]
})
export class RecordPage {
  private audio = inject(AudioService);
  private storage = inject(StorageService);
  isRecording = signal(false);
  audioUrl = signal<string>('');

  async start() {
    try {
      await this.audio.startRecording();
      this.isRecording.set(true);
    } catch (e) {
      alert('Brak dostępu do mikrofonu lub wymagana jest przeglądarka/HTTPS. Użyj Fallback poniżej.');
    }
  }

  async stop() {
    const blob = await this.audio.stopRecording();
    this.isRecording.set(false);
    if (blob) {
      this.audioUrl.set(URL.createObjectURL(blob));
      // ensure timeline refresh after auto-save
      setTimeout(() => window.dispatchEvent(new Event('timeline-refresh')), 0);
      try {
        const hasHandle = await this.storage.getExportDirHandle();
        if (!hasHandle) {
          await this.storage.requestDirectoryAccess();
        }
      } catch {}
    }
  }

  play() {
    const url = this.audioUrl();
    if (url) new Audio(url).play();
  }

  async save() {
    try {
      const hasHandle = await this.storage.getExportDirHandle();
      if (!hasHandle) {
        await this.storage.requestDirectoryAccess();
      }
    } catch {}
    await this.audio.saveLastRecordingToTimeline();
    window.dispatchEvent(new Event('timeline-refresh'));
  }

  async onPick(ev: Event){
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (file){
      await this.audio.setRecordingFromFile(file);
      this.audioUrl.set(URL.createObjectURL(file));
    }
  }
}


