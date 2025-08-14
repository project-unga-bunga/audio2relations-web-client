import { Injectable, signal, inject } from '@angular/core';
import { TimelineService } from './timeline.service';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private chunks: Blob[] = [];
  lastRecording = signal<Blob | null>(null);
  private recorderStartTs: number | null = null;
  private timeline = inject(TimelineService);
  private storage = inject(StorageService);

  async startRecording(): Promise<void> {
    // Must be called from user gesture; on HTTP mobile browsers may block
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('getUserMedia unsupported');
    }
    
    // VoIP standard: 16kHz mono, 16-bit for optimal voice quality
    const constraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,  // 16kHz - standard VoIP
        channelCount: 1,    // Mono - standard VoIP
        sampleSize: 16      // 16-bit - standard VoIP
      }
    };
    
    this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Use VoIP-optimized format
    const mimeType = MediaRecorder.isTypeSupported('audio/wav') 
      ? 'audio/wav' 
      : 'audio/webm;codecs=opus';
    
    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: mimeType,
      audioBitsPerSecond: 128000 // 128kbps - standard VoIP
    });
    
    this.chunks = [];
    this.mediaRecorder.ondataavailable = e => this.chunks.push(e.data);
    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.chunks, { type: mimeType });
      this.lastRecording.set(blob);
      this.mediaStream?.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    };
    this.mediaRecorder.start();
    this.recorderStartTs = Date.now();
  }

  async stopRecording(): Promise<Blob | null> {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    const finished = await new Promise<Blob | null>(resolve => setTimeout(() => resolve(this.lastRecording()), 0));
    // Auto-save to timeline and create transcript placeholder
    if (finished) {
      const savedAt = this.recorderStartTs ?? Date.now();
      await this.saveLastRecordingToTimeline();
      // Create placeholder transcript event to be edited/filled later
      this.timeline.addEvent({ id: crypto.randomUUID(), type: 'transcript', timestamp: savedAt, payload: { text: '' } });
    }
    return finished;
  }

  async saveLastRecordingToTimeline(): Promise<void> {
    const blob = this.lastRecording();
    if (!blob) return;
    const blobId = await this.storage.saveBlob(blob);
    await this.timeline.addEvent({
      id: crypto.randomUUID(),
      type: 'audio',
      timestamp: Date.now(),
      payload: { blobRef: blobId }
    });
    // Also save a copy to a user-visible folder (browser: File System Access API)
    try {
      const base = `recording-${new Date().toISOString().replace(/[:.]/g, '-')}`;
      void this.storage.saveAudioToDevice(blob, base);
    } catch {}
  }

  async setRecordingFromFile(file: File){
    const arrayBuffer = await file.arrayBuffer();
    // Convert to VoIP format if needed, or keep original format
    const blob = new Blob([arrayBuffer], { type: file.type || 'audio/wav' });
    this.lastRecording.set(blob);
  }
}


