import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TimelineService } from '../../services/timeline.service';
import { StorageService } from '../../services/storage.service';

@Component({
  standalone: true,
  selector: 'app-timeline-page',
  imports: [CommonModule, DatePipe],
  template: `
    <h2>Timeline</h2>
    <div *ngIf="events().length === 0">No events yet.</div>
    <ul class="timeline" *ngIf="events().length > 0">
      <li *ngFor="let e of events()">
        <span class="time">{{ e.timestamp | date:'short' }}</span>
        <strong>{{ e.type }}</strong>
        <button (click)="remove(e.id)">Delete</button>
        <div class="payload" *ngIf="e.type === 'audio' && e.payload?.blobRef">
          <audio [src]="audioUrlMap[e.payload.blobRef]" controls></audio>
        </div>
      </li>
    </ul>
  `,
  styles: [`
    .timeline{list-style:none;padding:0}
    .timeline li{padding:8px;border-bottom:1px solid #eee}
    .time{color:#666;margin-right:8px}
  `]
})
export class TimelinePage {
  private timeline = inject(TimelineService);
  private storage = inject(StorageService);
  events = computed(() => this.timeline.events());
  private subAdded = false;
  audioUrlMap: Record<string, string> = {};

  constructor(){
    if (!this.subAdded) {
      this.subAdded = true;
      window.addEventListener('quick-add-marker', () => {
        this.timeline.addEvent({ id: crypto.randomUUID(), type: 'marker', timestamp: Date.now(), payload: { note: 'Quick marker' } });
      });
    }
    // Warm up audio URLs
    this.refreshAudioUrls();
    window.addEventListener('timeline-refresh', () => this.refreshAudioUrls());

    // React to events() changes and refresh audio URLs
    effect(() => {
      // touch signal
      const _ = this.events();
      this.refreshAudioUrls();
    });
  }

  remove(id: string) {
    this.timeline.removeEvent(id);
  }

  async refreshAudioUrls(){
    for (const e of this.events()){
      if (e.type === 'audio' && e.payload?.blobRef){
        const url = await this.storage.getBlobUrl(e.payload.blobRef);
        if (url) this.audioUrlMap[e.payload.blobRef] = url;
      }
    }
  }
}


