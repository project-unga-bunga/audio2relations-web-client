import { Injectable, signal } from '@angular/core';

export type TimelineEvent = {
  id: string;
  type: 'audio' | 'marker' | 'note' | 'sensor' | 'transcript';
  timestamp: number;
  payload: any;
};

@Injectable({ providedIn: 'root' })
export class TimelineService {
  private storageKey = 'timeline-events-v1';
  events = signal<TimelineEvent[]>(this.load());

  addEvent(evt: TimelineEvent) {
    const next = [...this.events(), evt].sort((a, b) => a.timestamp - b.timestamp);
    this.events.set(next);
    this.persist();
  }

  removeEvent(id: string) {
    this.events.set(this.events().filter(e => e.id !== id));
    this.persist();
  }

  clear() {
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
    if (e.type === 'audio' && e.payload?.blob instanceof Blob) {
      const dataUrl = await this.blobToDataUrl(e.payload.blob);
      return { ...e, payload: { blob: { __type: 'dataUrl', dataUrl } } };
    }
    return e;
  }

  private deserializeEvent(e: any): TimelineEvent {
    if (e?.type === 'audio' && e?.payload?.blob?.__type === 'dataUrl') {
      const blob = this.dataUrlToBlob(e.payload.blob.dataUrl);
      return { ...e, payload: { blob } } as TimelineEvent;
    }
    return e as TimelineEvent;
  }

  private blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    const [meta, base64] = dataUrl.split(',');
    const mime = /data:(.*?);base64/.exec(meta)?.[1] || 'application/octet-stream';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }
}


