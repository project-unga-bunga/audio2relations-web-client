import { Injectable, signal } from '@angular/core';

interface GyroReading { x: number | null; y: number | null; z: number | null; }
interface GeoReading { lat: number | null; lng: number | null; accuracy?: number | null; }
interface DeviceInfo { platform: 'ios' | 'android' | 'web'; userAgent: string; }

@Injectable({ providedIn: 'root' })
export class SensorsService {
  gyro = signal<GyroReading>({ x: null, y: null, z: null });
  geo = signal<GeoReading>({ lat: null, lng: null, accuracy: null });
  device = signal<DeviceInfo>({ platform: this.detectPlatform(), userAgent: navigator.userAgent });
  private geoWatchId: number | null = null;
  private orientationHandler?: (event: any) => void;

  start() {
    // Gyroscope / DeviceOrientation
    try {
      const needsPermission = 'DeviceMotionEvent' in window && typeof (DeviceMotionEvent as any).requestPermission === 'function';
      if (needsPermission) {
        (DeviceMotionEvent as any).requestPermission().catch(() => null);
      }
    } catch {}
    const handler = (e: any) => {
      this.gyro.set({ x: e.beta ?? 0, y: e.gamma ?? 0, z: e.alpha ?? 0 });
    };
    this.orientationHandler = handler as any;
    window.addEventListener('deviceorientation', handler, { passive: true });

    // Geolocation
    if (navigator.geolocation) {
      this.geoWatchId = navigator.geolocation.watchPosition(pos => {
        this.geo.set({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      }, (err) => {
        console.warn('Geolocation error', err);
      }, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
    }
  }

  stop() {
    if (this.orientationHandler) {
      window.removeEventListener('deviceorientation', this.orientationHandler);
      this.orientationHandler = undefined;
    }
    if (this.geoWatchId !== null) {
      navigator.geolocation.clearWatch(this.geoWatchId);
      this.geoWatchId = null;
    }
  }

  private detectPlatform(): 'ios' | 'android' | 'web' {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    if (isAndroid) return 'android';
    if (isIOS) return 'ios';
    return 'web';
  }
}


