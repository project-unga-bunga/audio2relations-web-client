import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../services/audio.service';
import { StorageService } from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-record-page',
  imports: [CommonModule, FormsModule],
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

        <button class="control-btn send-btn" (click)="sendToEndpoint()" [disabled]="!audioUrl() || isSending()">
          <span class="btn-icon">{{ isSending() ? '⏳' : '📤' }}</span>
          <span class="btn-text">{{ isSending() ? 'Sending...' : 'Send to Server' }}</span>
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
           <div class="fallback-button" (click)="openNativeRecording()">
             <span class="fallback-btn-icon">🎤</span>
             <span class="fallback-btn-text">{{ isMobileDevice() ? 'Otwórz natywny mikrofon' : 'Wybierz plik audio lub nagraj' }}</span>
           </div>
         </label>
      </div>
      
      <div class="audio-player" *ngIf="audioUrl()">
        <h3 class="player-title">🎵 Audio Preview</h3>
        <audio [src]="audioUrl()" controls class="audio-element"></audio>
      </div>

      <!-- Server Response Section -->
      <div class="server-response" *ngIf="serverResponse()">
        <div class="response-header">
          <span class="response-icon">📡</span>
          <h3 class="response-title">Server Response</h3>
        </div>
        <div class="response-content">
          <div class="response-status" [class.success]="serverResponse()?.success" [class.error]="!serverResponse()?.success">
            <span class="status-icon">{{ serverResponse()?.success ? '✅' : '❌' }}</span>
            <span class="status-text">{{ serverResponse()?.success ? 'Success' : 'Error' }}</span>
          </div>
          <div class="response-data">
            <pre class="response-json">{{ formatResponse(serverResponse()) }}</pre>
          </div>
          <div class="response-meta" *ngIf="serverResponse()?.timestamp">
            <span class="meta-label">Response Time:</span>
            <span class="meta-value">{{ formatTime(serverResponse()?.timestamp) }}</span>
          </div>
          <div class="response-meta" *ngIf="serverResponse()?.endpoint">
            <span class="meta-label">Endpoint:</span>
            <span class="meta-value">{{ serverResponse()?.endpoint }}</span>
          </div>
          <div class="response-meta" *ngIf="serverResponse()?.endpoints_tried">
            <span class="meta-label">Endpoints Tried:</span>
            <span class="meta-value">{{ serverResponse()?.endpoints_tried?.join(', ') }}</span>
          </div>
        </div>
      </div>
      
      <div class="status-info">
        <div class="status-item" [class.recording]="isRecording()">
          <span class="status-icon">{{ isRecording() ? '🔴' : '⚪' }}</span>
          <span class="status-text">{{ isRecording() ? 'Recording in progress...' : 'Ready to record' }}</span>
        </div>
        <div class="status-item" *ngIf="isSending()">
          <span class="status-icon">📤</span>
          <span class="status-text">Sending to server...</span>
        </div>
      </div>
    </div>
  `,
     styles: [`
     .record-container {
       max-width: 600px;
       margin: 0 auto;
       padding: 70px 20px 20px 20px;
       min-height: 100vh;
       overflow-y: auto;
       box-sizing: border-box;
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
       grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
       gap: 12px;
       margin-bottom: 30px;
       width: 100%;
     }
    
         .control-btn {
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 8px;
       padding: 16px 12px;
       border-radius: 16px;
       border: 2px solid transparent;
       font-weight: 600;
       cursor: pointer;
       transition: all 0.3s ease;
       background: rgba(15, 20, 25, 0.8);
       color: #e6e6e6;
       backdrop-filter: blur(10px);
       min-height: 80px;
       justify-content: center;
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

    .send-btn {
      border-color: #6f42c1;
      background: linear-gradient(135deg, rgba(111, 66, 193, 0.2) 0%, rgba(111, 66, 193, 0.1) 100%);
    }
    
    .send-btn:hover:not(:disabled) {
      border-color: #6f42c1;
      background: linear-gradient(135deg, rgba(111, 66, 193, 0.3) 0%, rgba(111, 66, 193, 0.2) 100%);
      color: #6f42c1;
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
       padding: 20px;
       margin-bottom: 30px;
       width: 100%;
       box-sizing: border-box;
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
       width: 100%;
       box-sizing: border-box;
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

         /* Server Response Section */
     .server-response {
       background: rgba(15, 20, 25, 0.8);
       border: 2px solid #6f42c1;
       border-radius: 16px;
       padding: 20px;
       margin-bottom: 30px;
       width: 100%;
       box-sizing: border-box;
     }

    .response-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .response-icon {
      font-size: 1.5rem;
    }

    .response-title {
      color: #6f42c1;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
    }

    .response-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .response-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.2);
    }

    .response-status.success {
      background: rgba(40, 167, 69, 0.1);
      border-color: rgba(40, 167, 69, 0.2);
    }

    .status-icon {
      font-size: 1rem;
    }

    .status-text {
      color: #dc3545;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .response-status.success .status-text {
      color: #28a745;
    }

    .response-data {
      background: rgba(15, 20, 25, 0.6);
      border: 1px solid rgba(111, 66, 193, 0.2);
      border-radius: 8px;
      padding: 12px;
    }

    .response-json {
      color: #e6e6e6;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      margin: 0;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 200px;
      overflow-y: auto;
    }

    .response-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }

    .meta-label {
      color: #b0b0b0;
      font-size: 0.9rem;
    }

    .meta-value {
      color: #e6e6e6;
      font-weight: 600;
      font-size: 0.9rem;
    }
    
         .status-info {
       background: rgba(15, 20, 25, 0.6);
       border-radius: 12px;
       padding: 16px;
       width: 100%;
       box-sizing: border-box;
       margin-bottom: 20px;
     }
    
    .status-item {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #e6e6e6;
      margin-bottom: 8px;
    }

    .status-item:last-child {
      margin-bottom: 0;
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
    
                @media (max-width: 768px) {
         .record-container {
           padding: 60px 16px 16px 16px;
           max-width: 100%;
         }
       
       .page-title {
         font-size: 1.5rem;
         margin-bottom: 20px;
       }
       
       .controls {
         grid-template-columns: 1fr;
         gap: 10px;
         margin-bottom: 20px;
       }
       
       .control-btn {
         flex-direction: row;
         justify-content: center;
         padding: 14px;
         min-height: 60px;
       }
       
       .btn-icon {
         font-size: 1.2rem;
       }
       
       .btn-text {
         font-size: 0.85rem;
       }
       
       .fallback-section {
         padding: 16px;
         margin-bottom: 20px;
       }
       
       .fallback-button {
         padding: 12px 16px;
       }
       
       .fallback-btn-text {
         font-size: 0.9rem;
       }
       
       .audio-player {
         padding: 16px;
         margin-bottom: 20px;
       }
       
       .server-response {
         padding: 16px;
         margin-bottom: 20px;
       }

       .response-json {
         font-size: 0.8rem;
         max-height: 150px;
       }
       
       .status-info {
         padding: 12px;
         margin-bottom: 16px;
       }
     }
     
            @media (max-width: 480px) {
         .record-container {
           padding: 50px 12px 12px 12px;
         }
       
       .page-title {
         font-size: 1.3rem;
         margin-bottom: 16px;
       }
       
       .controls {
         gap: 8px;
         margin-bottom: 16px;
       }
       
       .control-btn {
         padding: 12px;
         min-height: 50px;
       }
       
       .btn-icon {
         font-size: 1rem;
       }
       
       .btn-text {
         font-size: 0.8rem;
       }
       
       .fallback-section {
         padding: 12px;
         margin-bottom: 16px;
       }
       
       .fallback-button {
         padding: 10px 14px;
       }
       
       .fallback-btn-text {
         font-size: 0.85rem;
       }
       
       .audio-player {
         padding: 12px;
         margin-bottom: 16px;
       }
       
       .server-response {
         padding: 12px;
         margin-bottom: 16px;
       }
       
       .status-info {
         padding: 10px;
         margin-bottom: 12px;
       }
     }
  `]
})
export class RecordPage {
  private audio = inject(AudioService);
  private storage = inject(StorageService);
  isRecording = signal(false);
  isSending = signal(false);
  audioUrl = signal<string>('');
  serverResponse = signal<any>(null);

  async start() {
    console.log('🎤 DEBUG: Start recording clicked');
    
    // Na telefonie zawsze używamy natywnego mikrofonu
    if (this.isMobileDevice()) {
      console.log('📱 DEBUG: Mobile device detected, opening native recording');
      this.openNativeRecording();
      return;
    }
    
    try {
      console.log('🖥️ DEBUG: Desktop device, trying browser microphone');
      await this.audio.startRecording();
      this.isRecording.set(true);
      console.log('✅ DEBUG: Browser recording started');
    } catch (e) {
      console.log('❌ DEBUG: Microphone access blocked, use fallback option below');
      console.error('🔍 DEBUG: Error details:', e);
    }
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
    if (url) {
      new Audio(url).play();
    }
  }

  async save() {
    await this.audio.saveLastRecordingToTimeline();
  }

  async sendToEndpoint() {
    const blob = this.audio.lastRecording();
    if (!blob) {
      console.warn('No recording to send');
      return;
    }

    console.log('🔍 DEBUG: Starting sendToEndpoint');
    console.log('📊 DEBUG: Blob info:', {
      size: blob.size,
      type: blob.type
    });

    this.isSending.set(true);
    this.serverResponse.set(null);

    // Lista endpointów do przetestowania
    const endpoints = [
      'http://54.37.130.147:8000/test',
      'http://localhost:8000/test',
      'http://127.0.0.1:8000/test'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`🔗 DEBUG: Trying endpoint: ${endpoint}`);
        
        // Convert blob to base64
        console.log('🔄 DEBUG: Converting blob to base64...');
        const arrayBuffer = await blob.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        console.log('✅ DEBUG: Base64 conversion complete, length:', base64.length);

        const payload = {
          audio: base64,
          format: blob.type,
          timestamp: new Date().toISOString(),
          filename: `recording-${Date.now()}.wav`
        };

        console.log('📤 DEBUG: Sending payload:', {
          format: payload.format,
          timestamp: payload.timestamp,
          filename: payload.filename,
          audioLength: payload.audio.length
        });

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        console.log('📥 DEBUG: Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });

        let responseData;
        try {
          responseData = await response.json();
          console.log('📋 DEBUG: Response data:', responseData);
        } catch (jsonError) {
          console.error('❌ DEBUG: Failed to parse JSON response:', jsonError);
          const textResponse = await response.text();
          console.log('📄 DEBUG: Raw text response:', textResponse);
          responseData = { error: 'Invalid JSON response', raw: textResponse };
        }
        
        this.serverResponse.set({
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          endpoint: endpoint,
          timestamp: Date.now()
        });

        console.log(`✅ DEBUG: Success with endpoint: ${endpoint}`);
        this.isSending.set(false);
        return; // Sukces - wychodzimy z pętli

      } catch (error) {
        console.error(`❌ DEBUG: Error with endpoint ${endpoint}:`, error);
        console.error('🔍 DEBUG: Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Jeśli to ostatni endpoint, pokazujemy błąd
        if (endpoint === endpoints[endpoints.length - 1]) {
          this.serverResponse.set({
            success: false,
            error: `All endpoints failed. Last error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            endpoints_tried: endpoints,
            timestamp: Date.now()
          });
        }
        // Kontynuujemy z następnym endpointem
      }
    }
    
    console.log('🏁 DEBUG: All endpoints failed');
    this.isSending.set(false);
  }

  async onPick(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('📱 DEBUG: File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      await this.audio.setRecordingFromFile(file);
      this.audioUrl.set(URL.createObjectURL(file));
      await this.audio.saveLastRecordingToTimeline();
    }
  }

  openNativeRecording() {
    console.log('📱 DEBUG: Opening native recording...');
    
    // Dla różnych urządzeń używamy różnych podejść
    if (this.isMobileDevice()) {
      // Na mobile próbujemy bezpośrednio otworzyć nagrywanie
      try {
        // Tworzymy nowy input z odpowiednimi atrybutami
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.capture = 'microphone';
        
        // Dodajemy event listener
        input.addEventListener('change', (event) => {
          this.onPick(event);
        });
        
        // Wywołujemy click
        input.click();
        
        console.log('📱 DEBUG: Native recording input created and clicked');
      } catch (error) {
        console.error('❌ DEBUG: Error opening native recording:', error);
        // Fallback do oryginalnego input
        const originalInput = document.querySelector('.fallback-input') as HTMLInputElement;
        if (originalInput) {
          originalInput.click();
        }
      }
    } else {
      // Na desktop używamy oryginalnego input
      const originalInput = document.querySelector('.fallback-input') as HTMLInputElement;
      if (originalInput) {
        originalInput.click();
      }
    }
  }

  isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    console.log('📱 DEBUG: Device detection:', {
      userAgent: userAgent,
      isMobile: isMobile,
      isAndroid: /android/i.test(userAgent),
      isPixel: /pixel/i.test(userAgent)
    });
    
    return isMobile;
  }

  formatResponse(response: any): string {
    if (!response) return '';
    return JSON.stringify(response, null, 2);
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}


