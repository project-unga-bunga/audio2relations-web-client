import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private db: IDBDatabase | null = null;
  private userFolderHandle: FileSystemDirectoryHandle | null = null;
  private readonly dbName = 'AudioRecorderDB';
  private readonly dbVersion = 1;
  private readonly storeName = 'audioBlobs';

  constructor() {
    this.initDB();
  }

  private async initDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async saveBlob(blob: Blob): Promise<string> {
    await this.ensureDB();
    const id = crypto.randomUUID();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(blob, id);
      
      request.onsuccess = () => resolve(id);
      request.onerror = () => reject(request.error);
    });
  }

  async getBlob(id: string): Promise<Blob | null> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getBlobUrl(id: string): Promise<string | null> {
    const blob = await this.getBlob(id);
    return blob ? URL.createObjectURL(blob) : null;
  }

  async deleteBlob(id: string): Promise<void> {
    await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async ensureDB() {
    if (!this.db) {
      await this.initDB();
    }
  }

  // File System Access API for saving to user's device
  async requestDirectoryAccess(): Promise<boolean> {
    try {
      this.userFolderHandle = await (window as any).showDirectoryPicker();
      return true;
    } catch {
      return false;
    }
  }

  async getExportDirHandle(): Promise<FileSystemDirectoryHandle | null> {
    return this.userFolderHandle;
  }

  async saveAudioToDevice(blob: Blob, baseName: string): Promise<void> {
    try {
      // Try to save to user's chosen directory first
      if (this.userFolderHandle) {
        const fileName = `${baseName}.wav`;
        const fileHandle = await this.userFolderHandle.getFileHandle(fileName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      }
    } catch {}

    // Fallback: try to save directly
    try {
      const fileName = `${baseName}.wav`;
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'VoIP Audio (WAV)',
          accept: { 'audio/wav': ['.wav'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch {
      // Final fallback: download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}


