import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SensorsService } from '../../services/sensors.service';

@Component({
  standalone: true,
  selector: 'app-sensors-page',
  imports: [CommonModule],
  template: `
    <div class="sensors-container">
      <h2 class="page-title">📱 Device Sensors</h2>
      
      <div class="device-info">
        <div class="device-card">
          <div class="device-header">
            <span class="device-icon">📱</span>
            <h3 class="device-title">Device Information</h3>
          </div>
          <div class="device-details">
            <div class="detail-item">
              <span class="detail-label">Platform:</span>
              <span class="detail-value">{{ sensors.device().platform }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">User Agent:</span>
              <span class="detail-value">{{ getUserAgent() }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="sensors-grid">
        <div class="sensor-card">
          <div class="sensor-header">
            <span class="sensor-icon">🎯</span>
            <h3 class="sensor-title">Gyroscope</h3>
          </div>
          <div class="sensor-data">
            <div class="data-item">
              <span class="data-label">X-axis (Beta):</span>
              <span class="data-value">{{ sensors.gyro().x?.toFixed(2) || 'N/A' }}°</span>
            </div>
            <div class="data-item">
              <span class="data-label">Y-axis (Gamma):</span>
              <span class="data-value">{{ sensors.gyro().y?.toFixed(2) || 'N/A' }}°</span>
            </div>
            <div class="data-item">
              <span class="data-label">Z-axis (Alpha):</span>
              <span class="data-value">{{ sensors.gyro().z?.toFixed(2) || 'N/A' }}°</span>
            </div>
          </div>
          <div class="sensor-status" [class.active]="sensors.gyro().x !== null">
            <span class="status-icon">{{ sensors.gyro().x !== null ? '🟢' : '🔴' }}</span>
            <span class="status-text">{{ sensors.gyro().x !== null ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>
        
        <div class="sensor-card">
          <div class="sensor-header">
            <span class="sensor-icon">📍</span>
            <h3 class="sensor-title">GPS Location</h3>
          </div>
          <div class="sensor-data">
            <div class="data-item">
              <span class="data-label">Latitude:</span>
              <span class="data-value">{{ sensors.geo().lat?.toFixed(6) || 'N/A' }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Longitude:</span>
              <span class="data-value">{{ sensors.geo().lng?.toFixed(6) || 'N/A' }}</span>
            </div>
            <div class="data-item">
              <span class="data-label">Accuracy:</span>
              <span class="data-value">{{ sensors.geo().accuracy?.toFixed(1) || 'N/A' }}m</span>
            </div>
          </div>
          <div class="sensor-status" [class.active]="sensors.geo().lat !== null">
            <span class="status-icon">{{ sensors.geo().lat !== null ? '🟢' : '🔴' }}</span>
            <span class="status-text">{{ sensors.geo().lat !== null ? 'Active' : 'Inactive' }}</span>
          </div>
        </div>
      </div>
      
      <div class="permissions-info">
        <div class="permissions-card">
          <h3 class="permissions-title">🔐 Permissions Required</h3>
          <div class="permissions-list">
            <div class="permission-item">
              <span class="permission-icon">📍</span>
              <span class="permission-text">Location access for GPS coordinates</span>
            </div>
            <div class="permission-item">
              <span class="permission-icon">📱</span>
              <span class="permission-text">Motion & orientation for gyroscope data</span>
            </div>
            <div class="permission-item">
              <span class="permission-icon">🌐</span>
              <span class="permission-text">HTTPS connection required for sensor access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sensors-container {
      max-width: 1200px;
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
    
    .device-info {
      margin-bottom: 30px;
    }
    
    .device-card {
      background: rgba(15, 20, 25, 0.8);
      border: 2px solid #d4af37;
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
    }
    
    .device-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .device-icon {
      font-size: 1.5rem;
    }
    
    .device-title {
      color: #d4af37;
      font-size: 1.3rem;
      font-weight: 600;
      margin: 0;
    }
    
    .device-details {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
    }
    
    .detail-label {
      color: #b0b0b0;
      font-weight: 500;
    }
    
    .detail-value {
      color: #e6e6e6;
      font-weight: 600;
      font-family: monospace;
    }
    
    .sensors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }
    
    .sensor-card {
      background: rgba(15, 20, 25, 0.8);
      border: 2px solid rgba(212, 175, 55, 0.3);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }
    
    .sensor-card:hover {
      border-color: #d4af37;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(212, 175, 55, 0.2);
    }
    
    .sensor-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .sensor-icon {
      font-size: 1.5rem;
    }
    
    .sensor-title {
      color: #d4af37;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
    }
    
    .sensor-data {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .data-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(15, 20, 25, 0.6);
      border-radius: 8px;
      border: 1px solid rgba(212, 175, 55, 0.1);
    }
    
    .data-label {
      color: #b0b0b0;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .data-value {
      color: #e6e6e6;
      font-weight: 600;
      font-family: monospace;
      font-size: 0.9rem;
    }
    
    .sensor-status {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.2);
    }
    
    .sensor-status.active {
      background: rgba(40, 167, 69, 0.1);
      border-color: rgba(40, 167, 69, 0.2);
    }
    
    .status-icon {
      font-size: 1rem;
    }
    
    .status-text {
      color: #dc3545;
      font-weight: 500;
      font-size: 0.9rem;
    }
    
    .sensor-status.active .status-text {
      color: #28a745;
    }
    
    .permissions-info {
      margin-top: 30px;
    }
    
    .permissions-card {
      background: rgba(15, 20, 25, 0.8);
      border: 2px solid rgba(212, 175, 55, 0.3);
      border-radius: 16px;
      padding: 24px;
      backdrop-filter: blur(10px);
    }
    
    .permissions-title {
      color: #d4af37;
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 16px;
      text-align: center;
    }
    
    .permissions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    
    .permission-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }
    
    .permission-icon {
      font-size: 1.1rem;
      width: 24px;
      text-align: center;
    }
    
    .permission-text {
      color: #e6e6e6;
      font-size: 0.95rem;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .sensors-grid {
        grid-template-columns: 1fr;
      }
      
      .detail-item, .data-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      
      .detail-value, .data-value {
        align-self: flex-end;
      }
    }
  `]
})
export class SensorsPage {
  public sensors = inject(SensorsService);

  constructor() {
    this.sensors.start();
  }

  getUserAgent(): string {
    return navigator.userAgent.substring(0, 50) + (navigator.userAgent.length > 50 ? '...' : '');
  }
}


