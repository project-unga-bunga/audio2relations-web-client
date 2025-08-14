import { Injectable } from '@angular/core';

type BlobRecord = { id: string; mime: string; createdAt: number; blob: Blob };

@Injectable({ providedIn: 'root' })
export class StorageService {
  private static DB_NAME = 'counsellor-db';
  private static DB_VERSION = 1;

  private dbPromise: Promise<IDBDatabase> | null = null;

  private openDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;
    this.dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(StorageService.DB_NAME, StorageService.DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('blobs')) {
          db.createObjectStore('blobs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('events')) {
          const store = db.createObjectStore('events', { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp');
        }
        if (!db.objectStoreNames.contains('handles')) {
          db.createObjectStore('handles', { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this.dbPromise;
  }

  async setExportDirHandle(handle: any): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('handles', 'readwrite');
      tx.objectStore('handles').put({ key: 'exportDir', handle });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async getExportDirHandle(): Promise<any | null> {
    const db = await this.openDb();
    return await new Promise<any | null>((resolve, reject) => {
      const tx = db.transaction('handles', 'readonly');
      const req = tx.objectStore('handles').get('exportDir');
      req.onsuccess = () => resolve(req.result?.handle ?? null);
      req.onerror = () => reject(req.error);
    });
  }

  async saveBlob(blob: Blob, mime?: string): Promise<string> {
    const id = crypto.randomUUID();
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('blobs', 'readwrite');
      const store = tx.objectStore('blobs');
      const rec: BlobRecord = { id, mime: mime || blob.type || 'application/octet-stream', createdAt: Date.now(), blob };
      store.put(rec);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    return id;
  }

  async getBlob(id: string): Promise<Blob | null> {
    const db = await this.openDb();
    return await new Promise<Blob | null>((resolve, reject) => {
      const tx = db.transaction('blobs', 'readonly');
      const store = tx.objectStore('blobs');
      const req = store.get(id);
      req.onsuccess = () => {
        const rec = req.result as BlobRecord | undefined;
        resolve(rec ? rec.blob : null);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getBlobUrl(id: string): Promise<string | null> {
    const blob = await this.getBlob(id);
    return blob ? URL.createObjectURL(blob) : null;
  }

  async deleteBlob(id: string): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('blobs', 'readwrite');
      tx.objectStore('blobs').delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async addEvent(evt: any): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('events', 'readwrite');
      tx.objectStore('events').put(evt);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async removeEvent(id: string): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('events', 'readwrite');
      tx.objectStore('events').delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  async getAllEvents(): Promise<any[]> {
    const db = await this.openDb();
    return await new Promise<any[]>((resolve, reject) => {
      const tx = db.transaction('events', 'readonly');
      const store = tx.objectStore('events');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as any[]);
      req.onerror = () => reject(req.error);
    });
  }

  async clearEvents(): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('events', 'readwrite');
      tx.objectStore('events').clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }

  // ===== Shared folder support (Browser via File System Access API) =====
  private async getDirectoryHandle(): Promise<any | null> {
    try {
      return await this.getExportDirHandle();
    } catch {
      return null;
    }
  }

  async requestDirectoryAccess(): Promise<boolean> {
    try {
      const anyWindow: any = window as any;
      if (anyWindow?.showDirectoryPicker) {
        const dirHandle = await anyWindow.showDirectoryPicker({ mode: 'readwrite' });
        await this.setExportDirHandle(dirHandle);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async saveAudioToDevice(blob: Blob, suggestedBaseName?: string): Promise<boolean> {
    const baseName = suggestedBaseName || this.suggestFileBase();
    const ext = this.suggestExt(blob.type);
    const fileName = `${baseName}.${ext}`;

    // Try directory handle first
    try {
      const dir = await this.getDirectoryHandle();
      if (dir) {
        const fileHandle = await dir.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      }
    } catch {}

    // Try Save File Picker
    try {
      const anyWindow: any = window as any;
      if (anyWindow?.showSaveFilePicker) {
        const handle = await anyWindow.showSaveFilePicker({
          suggestedName: fileName,
          types: [{ description: 'Audio', accept: { [blob.type || 'audio/webm']: ['.' + ext] } }]
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return true;
      }
    } catch {}

    // Fallback: trigger download
    this.triggerDownload(blob, fileName);
    return true;
  }

  private triggerDownload(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private suggestFileBase(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `recording-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }

  private suggestExt(mime: string): string {
    if (!mime) return 'webm';
    if (mime.includes('webm')) return 'webm';
    if (mime.includes('wav')) return 'wav';
    if (mime.includes('mpeg') || mime.includes('mp3')) return 'mp3';
    if (mime.includes('ogg')) return 'ogg';
    return 'bin';
  }
}


