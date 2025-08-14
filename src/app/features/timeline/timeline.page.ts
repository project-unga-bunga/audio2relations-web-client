import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineService } from '../../services/timeline.service';
import { StorageService } from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-timeline-page',
  imports: [CommonModule],
  template: `
    <div class="timeline-container">
      <h2 class="page-title">📅 Timeline</h2>
      
      <div class="timeline-controls">
        <button class="control-btn clear-btn" (click)="clear()">
          <span class="btn-icon">🗑️</span>
          <span class="btn-text">Clear All</span>
        </button>
        <button class="control-btn export-btn" (click)="export()">
          <span class="btn-icon">📤</span>
          <span class="btn-text">Export</span>
        </button>
      </div>
      
      <div class="timeline-list" *ngIf="timeline.events().length > 0; else emptyState">
        <div class="timeline-item" *ngFor="let event of timeline.events(); trackBy: trackByEvent">
          <div class="event-header">
            <div class="event-type">
              <span class="type-icon">{{ getEventIcon(event.type) }}</span>
              <span class="type-text">{{ event.type | titlecase }}</span>
            </div>
            <div class="event-time">{{ formatTime(event.timestamp) }}</div>
          </div>
          
          <div class="event-content">
            <ng-container [ngSwitch]="event.type">
              <div *ngSwitchCase="'audio'" class="audio-event">
                <div class="audio-info">
                  <span class="audio-icon">🎵</span>
                  <span class="audio-text">Audio Recording</span>
                </div>
                <div class="audio-controls">
                  <button class="play-audio-btn" (click)="playAudio(event.payload.blobRef)">
                    <span class="play-icon">▶️</span>
                    <span>Play</span>
                  </button>
                  <button class="delete-btn" (click)="removeEvent(event.id)">
                    <span class="delete-icon">❌</span>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
              
              <div *ngSwitchCase="'transcript'" class="transcript-event">
                <div class="transcript-info">
                  <span class="transcript-icon">📝</span>
                  <span class="transcript-text">Transcription</span>
                </div>
                <div class="transcript-content">
                  <textarea 
                    class="transcript-input" 
                    [value]="event.payload.text || ''" 
                    (input)="updateTranscript(event.id, $event)"
                    placeholder="Add transcription text here...">
                  </textarea>
                </div>
                <button class="delete-btn" (click)="removeEvent(event.id)">
                  <span class="delete-icon">❌</span>
                  <span>Delete</span>
                </button>
              </div>
              
              <div *ngSwitchDefault class="default-event">
                <span class="default-text">{{ event.payload | json }}</span>
                <button class="delete-btn" (click)="removeEvent(event.id)">
                  <span class="delete-icon">❌</span>
                  <span>Delete</span>
                </button>
              </div>
            </ng-container>
          </div>
        </div>
      </div>
      
      <ng-template #emptyState>
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <h3 class="empty-title">No Events Yet</h3>
          <p class="empty-text">Start recording audio to see events here!</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .timeline-container {
      max-width: 800px;
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
    
    .timeline-controls {
      display: flex;
      gap: 16px;
      margin-bottom: 30px;
      justify-content: center;
    }
    
    .control-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      border: 2px solid transparent;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      background: rgba(15, 20, 25, 0.8);
      color: #e6e6e6;
      backdrop-filter: blur(10px);
    }
    
    .control-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
    
    .clear-btn {
      border-color: #dc3545;
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.2) 0%, rgba(220, 53, 69, 0.1) 100%);
    }
    
    .clear-btn:hover {
      border-color: #dc3545;
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.3) 0%, rgba(220, 53, 69, 0.2) 100%);
    }
    
    .export-btn {
      border-color: #28a745;
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.2) 0%, rgba(40, 167, 69, 0.1) 100%);
    }
    
    .export-btn:hover {
      border-color: #28a745;
      background: linear-gradient(135deg, rgba(40, 167, 69, 0.3) 0%, rgba(40, 167, 69, 0.2) 100%);
    }
    
    .timeline-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .timeline-item {
      background: rgba(15, 20, 25, 0.8);
      border: 2px solid #d4af37;
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    .timeline-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.2);
    }
    
    .event-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(212, 175, 55, 0.3);
    }
    
    .event-type {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .type-icon {
      font-size: 1.2rem;
    }
    
    .type-text {
      color: #d4af37;
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .event-time {
      color: #b0b0b0;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .event-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .audio-event, .transcript-event, .default-event {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .audio-info, .transcript-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .audio-icon, .transcript-icon {
      font-size: 1.1rem;
    }
    
    .audio-text, .transcript-text {
      color: #e6e6e6;
      font-weight: 500;
    }
    
    .audio-controls {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .play-audio-btn, .delete-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid transparent;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }
    
    .play-audio-btn {
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      border-color: #007bff;
    }
    
    .play-audio-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
    }
    
    .delete-btn {
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.2) 0%, rgba(220, 53, 69, 0.1) 100%);
      color: #dc3545;
      border-color: rgba(220, 53, 69, 0.3);
    }
    
    .delete-btn:hover {
      background: linear-gradient(135deg, rgba(220, 53, 69, 0.3) 0%, rgba(220, 53, 69, 0.2) 100%);
      border-color: rgba(220, 53, 69, 0.5);
    }
    
    .transcript-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .transcript-input {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      background: rgba(15, 20, 25, 0.6);
      color: #e6e6e6;
      font-family: inherit;
      resize: vertical;
    }
    
    .transcript-input:focus {
      outline: none;
      border-color: #d4af37;
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
    }
    
    .default-text {
      color: #b0b0b0;
      font-family: monospace;
      font-size: 0.9rem;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: rgba(15, 20, 25, 0.6);
      border: 2px dashed rgba(212, 175, 55, 0.3);
      border-radius: 16px;
    }
    
    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }
    
    .empty-title {
      color: #d4af37;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 12px;
    }
    
    .empty-text {
      color: #b0b0b0;
      font-size: 1rem;
    }
    
    @media (max-width: 600px) {
      .timeline-controls {
        flex-direction: column;
        align-items: center;
      }
      
      .control-btn {
        width: 200px;
      }
      
      .event-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .audio-controls {
        justify-content: center;
      }
    }
  `]
})
export class TimelinePage {
  timeline = inject(TimelineService);
  private storage = inject(StorageService);
  audioUrlMap = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      const events = this.timeline.events();
      const newMap: Record<string, string> = {};
      events.forEach(event => {
        if (event.type === 'audio' && event.payload.blobRef) {
          this.storage.getBlobUrl(event.payload.blobRef).then(url => {
            if (url) newMap[event.id] = url;
          });
        }
      });
      this.audioUrlMap.set(newMap);
    });
  }

  ngOnInit() {
    window.addEventListener('timeline-refresh', () => {
      // Force re-render
      this.timeline.events.set([...this.timeline.events()]);
    });
  }

  trackByEvent(index: number, event: any) {
    return event.id;
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'audio': return '🎵';
      case 'transcript': return '📝';
      default: return '📋';
    }
  }

  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
  }

  async playAudio(blobRef: string) {
    const url = await this.storage.getBlobUrl(blobRef);
    if (url) {
      new Audio(url).play();
    }
  }

  async removeEvent(id: string) {
    await this.timeline.removeEvent(id);
  }

  updateTranscript(id: string, event: Event) {
    const text = (event.target as HTMLTextAreaElement).value;
    this.timeline.updateEvent(id, { text });
  }

  async clear() {
    if (confirm('Are you sure you want to clear all events?')) {
      await this.timeline.clear();
    }
  }

  export() {
    const data = this.timeline.events();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}


