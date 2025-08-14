import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';

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
    <audio *ngIf="audioUrl()" [src]="audioUrl()" controls></audio>
  `,
  styles: [`
    .controls{display:flex;gap:8px;margin-bottom:12px}
  `]
})
export class RecordPage {
  private audio = inject(AudioService);
  isRecording = signal(false);
  audioUrl = signal<string>('');

  async start() {
    await this.audio.startRecording();
    this.isRecording.set(true);
  }

  async stop() {
    const blob = await this.audio.stopRecording();
    this.isRecording.set(false);
    if (blob) {
      this.audioUrl.set(URL.createObjectURL(blob));
    }
  }

  play() {
    const url = this.audioUrl();
    if (url) new Audio(url).play();
  }

  save() {
    this.audio.saveLastRecordingToTimeline();
  }
}


