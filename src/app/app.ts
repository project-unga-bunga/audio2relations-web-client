import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Audio Recorder</h1>
      
      <div class="controls">
        <button 
          (click)="startRecording()" 
          [disabled]="isRecording"
          class="btn btn-record">
          🎤 Start Recording
        </button>
        
        <button 
          (click)="stopRecording()" 
          [disabled]="!isRecording"
          class="btn btn-stop">
          ⏹️ Stop Recording
        </button>
        
        <button 
          (click)="playRecording()" 
          [disabled]="!audioBlob"
          class="btn btn-play">
          ▶️ Play Recording
        </button>
      </div>
      
      <div class="status">
        <p *ngIf="isRecording" class="recording">🔴 Recording...</p>
        <p *ngIf="audioBlob && !isRecording" class="ready">✅ Ready to play</p>
        <p *ngIf="!audioBlob && !isRecording" class="idle">⏸️ Ready to record</p>
      </div>
      
      <audio #audioPlayer *ngIf="audioBlob" [src]="audioUrl" controls></audio>
    </div>
  `,
  styles: [`
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    h1 {
      color: #333;
      margin-bottom: 2rem;
    }
    
    .controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      min-width: 140px;
    }
    
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-record {
      background: #e74c3c;
      color: white;
    }
    
    .btn-record:hover:not(:disabled) {
      background: #c0392b;
    }
    
    .btn-stop {
      background: #34495e;
      color: white;
    }
    
    .btn-stop:hover:not(:disabled) {
      background: #2c3e50;
    }
    
    .btn-play {
      background: #27ae60;
      color: white;
    }
    
    .btn-play:hover:not(:disabled) {
      background: #229954;
    }
    
    .status {
      margin-bottom: 2rem;
    }
    
    .recording {
      color: #e74c3c;
      font-weight: bold;
    }
    
    .ready {
      color: #27ae60;
      font-weight: bold;
    }
    
    .idle {
      color: #7f8c8d;
    }
    
    audio {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
      display: block;
    }
    
    @media (max-width: 600px) {
      .controls {
        flex-direction: column;
        align-items: center;
      }
      
      .btn {
        width: 100%;
        max-width: 200px;
      }
    }
  `]
})
export class AppComponent {
  isRecording = false;
  mediaRecorder: MediaRecorder | null = null;
  audioBlob: Blob | null = null;
  audioUrl: string = '';

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(chunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  playRecording() {
    if (this.audioBlob) {
      const audio = new Audio(this.audioUrl);
      audio.play();
    }
  }
}
