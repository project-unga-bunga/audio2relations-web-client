import { Injectable, signal, inject } from '@angular/core';
import { TimelineService } from './timeline.service';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private chunks: Blob[] = [];
  lastRecording = signal<Blob | null>(null);

  private timeline = inject(TimelineService);

  async startRecording(): Promise<void> {
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(this.mediaStream);
    this.chunks = [];
    this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: 'audio/webm' });
      this.lastRecording.set(blob);
      this.mediaStream?.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    };
    this.mediaRecorder.start();
  }

  async stopRecording(): Promise<Blob | null> {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    return new Promise(resolve => setTimeout(() => resolve(this.lastRecording()), 0));
  }

  saveLastRecordingToTimeline(): void {
    const blob = this.lastRecording();
    if (!blob) return;
    this.timeline.addEvent({
      id: crypto.randomUUID(),
      type: 'audio',
      timestamp: Date.now(),
      payload: { blob }
    });
  }
}


