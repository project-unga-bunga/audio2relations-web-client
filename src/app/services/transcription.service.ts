import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranscriptionService {
  isActive = signal(false);
  text = signal('');
  private recognition: any;
  private finalText = '';

  constructor(){
    const w: any = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) final += t; else interim += t;
        }
        if (final) this.finalText += (this.finalText ? ' ' : '') + final.trim();
        const combined = (this.finalText + ' ' + interim).trim();
        this.text.set(combined);
      };
      this.recognition.onend = () => this.isActive.set(false);
    }
  }

  start(){
    if (this.recognition) {
      this.isActive.set(true);
      this.text.set('');
      this.recognition.start();
    } else {
      alert('Web Speech API not supported in this browser.');
    }
  }

  stop(){
    if (this.recognition) this.recognition.stop();
  }
}


