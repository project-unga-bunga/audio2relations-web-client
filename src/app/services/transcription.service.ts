import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TranscriptionService {
  isActive = signal(false);
  text = signal('');
  private recognition: any;

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
        this.text.set((final + ' ' + interim).trim());
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


