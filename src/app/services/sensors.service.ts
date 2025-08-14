import { Injectable, signal } from '@angular/core';

interface GyroReading { x: number | null; y: number | null; z: number | null; }
interface GeoReading { lat: number | null; lng: number | null; accuracy?: number | null; }

@Injectable({ providedIn: 'root' })
export class SensorsService {
  gyro = signal<GyroReading>({ x: null, y: null, z: null });
  geo = signal<GeoReading>({ lat: null, lng: null, accuracy: null });
  private geoWatchId: number | null = null;
  private orientationHandler?: (event: any) => void;

  start() {
    // Gyroscope / DeviceOrientation
    // iOS permission prompt (no-op on Android/Web if unsupported)
    try {
      if ('DeviceMotionEvent' in window && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission().catch(() => null);
      }
    } catch {}
    window.addEventListener('deviceorientation', this.orientationHandler = (e: any) => {
      this.gyro.set({ x: e.beta ?? 0, y: e.gamma ?? 0, z: e.alpha ?? 0 });
    });

    // Geolocation
    if (navigator.geolocation) {
      this.geoWatchId = navigator.geolocation.watchPosition(pos => {
        this.geo.set({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
      }, () => {}, { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
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
}


