import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { StorageService } from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-record-page',
  imports: [CommonModule],
  template: `
    <div class="record-container">
      <h2 class="page-title">🎤 Audio Recording</h2>
      
      <div class="controls">
        <button class="control-btn start-btn" (click)="start()" [disabled]="isRecording()">
          <span class="btn-icon">⏺️</span>
          <span class="btn-text">Start Recording</span>
        </button>
        
        <button class="control-btn stop-btn" (click)="stop()" [disabled]="!isRecording()">
          <span class="btn-icon">⏹️</span>
          <span class="btn-text">Stop Recording</span>
        </button>
        
        <button class="control-btn play-btn" (click)="play()" [disabled]="!audioUrl()">
          <span class="btn-icon">▶️</span>
          <span class="btn-text">Play Recording</span>
        </button>
        
        <button class="control-btn save-btn" (click)="save()" [disabled]="!audioUrl()">
          <span class="btn-icon">💾</span>
          <span class="btn-text">Save to Timeline</span>
        </button>
      </div>
      
      <div class="fallback-section">
        <div class="fallback-header">
          <span class="fallback-icon">📱</span>
          <h3 class="fallback-title">Native Device Recording</h3>
        </div>
        <p class="fallback-description">
          {{ isMobileDevice() ? 'Użyj natywnego mikrofonu urządzenia:' : 'Na telefonach i niektórych przeglądarkach użyj tej opcji:' }}
        </p>
        <label class="fallback-label">
          <input type="file" accept="audio/*" capture="microphone" (change)="onPick($event)" class="fallback-input">
          <div class="fallback-button">
            <span class="fallback-btn-icon">🎤</span>
            <span class="fallback-btn-text">{{ isMobileDevice() ? 'Otwórz natywny mikrofon' : 'Wybierz plik audio lub nagraj' }}</span>
          </div>
        </label>
      </div>
      
      <div class="audio-player" *ngIf="audioUrl()">
        <h3 class="player-title">🎵 Audio Preview</h3>
        <audio [src]="audioUrl()" controls class="audio-element"></audio>
      </div>
      
      <div class="status-info">
        <div class="status-item" [class.recording]="isRecording()">
          <span class="status-icon">{{ isRecording() ? '🔴' : '⚪' }}</span>
          <span class="status-text">{{ isRecording() ? 'Recording in progress...' : 'Ready to record' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .record-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .page-title {
      color: #d4af37;
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 30px;
      text-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
    }
    
    .controls {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 30px;
    }
    
    .control-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px 16px;
      border-radius: 16px;
      border: 2px solid transparent;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(15, 20, 25, 0.8);
      color: #e6e6e6;
      backdrop-filter: blur(10px);
    }
    
    .control-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    
    .control-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .start-btn {
      border-color: #28a745;
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.2) 0%, rgba(40, 167, 69, 0.1) 100%);
    }
    
    .start-btn:hover:not(:disabled) {
      border-color: #28a745;
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.3) 0%, rgba(40, 167, 69, 0.2) 100%);
    }
    
    .stop-btn {
      border-color: #dc3545;
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.2) 0%, rgba(220, 53, 69, 0.1) 100%);
    }
    
    .stop-btn:hover:not(:disabled) {
      border-color: #dc3545;
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.3) 0%, rgba(220, 53, 69, 0.2) 100%);
    }
    
    .play-btn {
      border-color: #007bff;
      background: linear-gradient(135deg, rgba(0, 123, 255, 0.2) 0%, rgba(0, 123, 255, 0.1) 100%);
    }
    
    .play-btn:hover:not(:disabled) {
      border-color: #007bff;
      background: linear-gradient(135deg, rgba(0, 123, 255, 0.3) 0%, rgba(0, 123, 255, 0.2) 100%);
    }
    
    .save-btn {
      border-color: #d4af37;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%);
    }
    
    .save-btn:hover:not(:disabled) {
      border-color: #d4af37;
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%);
      color: #d4af37;
    }
    
    .btn-icon {
      font-size: 1.5rem;
    }
    
    .btn-text {
      font-size: 0.9rem;
    }
    
    .fallback-section {
      background: rgba(15, 20, 25, 0.6);
      border: 2px solid #d4af37;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 30px;
    }
    
    .fallback-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .fallback-icon {
      font-size: 1.5rem;
    }
    
    .fallback-title {
      color: #d4af37;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
    }
    
    .fallback-description {
      color: #b0b0b0;
      font-size: 0.95rem;
      margin-bottom: 16px;
      line-height: 1.4;
    }
    
    .fallback-label {
      display: block;
      cursor: pointer;
    }
    
    .fallback-input {
      display: none;
    }
    
    .fallback-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 24px;
      background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
      color: #0f1419;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .fallback-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(212, 175, 55, 0.4);
    }
    
    .fallback-btn-icon {
      font-size: 1.3rem;
    }
    
    .fallback-btn-text {
      font-size: 1rem;
    }
    
    .audio-player {
      background: rgba(15, 20, 25, 0.8);
      border: 2px solid #007bff;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
    }
    
    .player-title {
      color: #007bff;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .audio-element {
      width: 100%;
      border-radius: 8px;
    }
    
    .status-info {
      background: rgba(15, 20, 25, 0.6);
      border-radius: 12px;
      padding: 16px;
    }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #e6e6e6;
    }
    
    .status-item.recording {
      color: #dc3545;
    }
    
    .status-icon {
      font-size: 1.2rem;
    }
    
    .status-text {
      font-weight: 500;
    }
    
    @media (max-width: 600px) {
      .controls {
        grid-template-columns: 1fr;
      }
      
      .control-btn {
        flex-direction: row;
        justify-content: center;
        padding: 16px;
      }
      
      .btn-icon {
        font-size: 1.2rem;
      }
      
      .btn-text {
        font-size: 0.85rem;
      }
      
      .fallback-button {
        padding: 14px 20px;
      }
      
      .fallback-btn-text {
        font-size: 0.9rem;
      }
    }
  `]
})
export class RecordPage {
  private audio = inject(AudioService);
  private storage = inject(StorageService);
  isRecording = signal(false);
  audioUrl = signal<string>('');

  async start() {
    // Na telefonie zawsze używamy natywnego mikrofonu
    if (this.isMobileDevice()) {
      // Na mobile nie próbujemy przeglądarki - użytkownik ma fallback
      console.log('On mobile, use native device microphone option below');
      return;
    }
    
    try {
      await this.audio.startRecording();
      this.isRecording.set(true);
    } catch (e) {
      console.log('Microphone access blocked, use fallback option below');
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

  isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  }
}


