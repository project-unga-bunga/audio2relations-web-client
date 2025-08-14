import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptionService } from '../../services/transcription.service';

@Component({
  standalone: true,
  selector: 'app-transcription-page',
  imports: [CommonModule],
  template: `
    <h2>Real-time Transcription</h2>
    <div class="controls">
      <button (click)="start()" [disabled]="isActive()">Start</button>
      <button (click)="stop()" [disabled]="!isActive()">Stop</button>
    </div>
    <div class="transcript">
      {{ text() }}
    </div>
  `,
  styles: [`
    .transcript{white-space:pre-wrap;border:1px solid #eee;padding:12px;border-radius:8px;min-height:120px}
    .controls{display:flex;gap:8px;margin-bottom:12px}
  `]
})
export class TranscriptionPage {
  private svc = inject(TranscriptionService);
  isActive = this.svc.isActive;
  text = this.svc.text;

  start(){ this.svc.start(); }
  stop(){ this.svc.stop(); }
}


