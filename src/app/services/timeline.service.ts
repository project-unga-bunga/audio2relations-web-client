import { Injectable, signal, inject } from '@angular/core';
import { StorageService } from './storage.service';

export type TimelineEvent = {
  id: string;
  type: 'audio' | 'marker' | 'note' | 'sensor' | 'transcript';
  timestamp: number;
  payload: any;
};

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private storage = inject(StorageService);
  private storageKey = 'timeline-events-v1';
  events = signal<TimelineEvent[]>(this.load());
  private loaded = true;

  async addEvent(evt: TimelineEvent) {
    const next = [...this.events(), evt].sort((a, b) => a.timestamp - b.timestamp);
    this.events.set(next);
    this.persist();
  }

  async removeEvent(id: string) {
    this.events.set(this.events().filter(e => e.id !== id));
    this.persist();
  }

  async clear() {
    this.events.set([]);
    this.persist();
  }

  private async persist() {
    const serializable = await Promise.all(this.events().map(e => this.serializeEvent(e)));
    localStorage.setItem(this.storageKey, JSON.stringify(serializable));
  }

  private load(): TimelineEvent[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return (parsed as any[]).map(e => this.deserializeEvent(e));
    } catch {
      return [];
    }
  }

  private async serializeEvent(e: TimelineEvent): Promise<any> {
    if (e.type === 'audio') {
      // If event still contains raw blob (older entries), migrate to blobRef
      if (e.payload?.blob instanceof Blob) {
        const blobId = await this.storage.saveBlob(e.payload.blob);
        return { ...e, payload: { blobRef: blobId } };
      }
    }
    return e;
  }

  private deserializeEvent(e: any): TimelineEvent {
    return e as TimelineEvent;
  }

  // Binary handling moved to IndexedDB via StorageService
}



