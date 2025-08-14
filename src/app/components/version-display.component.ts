import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionService, VersionInfo } from '../services/version.service';

@Component({
  selector: 'app-version-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="version-display" [class]="displayMode">
      <ng-container [ngSwitch]="displayMode">
        
        <!-- Compact mode (default) -->
        <div *ngSwitchDefault class="version-compact">
          <span class="version-text">{{ versionInfo.version }}</span>
          <span class="build-number">({{ versionInfo.buildNumber }})</span>
        </div>
        
        <!-- Detailed mode -->
        <div *ngSwitchCase="'detailed'" class="version-detailed">
          <div class="version-row">
            <span class="label">Version:</span>
            <span class="value">{{ versionInfo.version }}</span>
          </div>
          <div class="version-row">
            <span class="label">Build:</span>
            <span class="value">{{ versionInfo.buildNumber }}</span>
          </div>
          <div class="version-row">
            <span class="label">Code:</span>
            <span class="value">{{ versionInfo.versionCode }}</span>
          </div>
          <div class="version-row">
            <span class="label">Date:</span>
            <span class="value">{{ formatDate(versionInfo.buildDate) }}</span>
          </div>
          <div class="version-row">
            <span class="label">Commit:</span>
            <span class="value">{{ versionInfo.gitCommit }}</span>
          </div>
          <div class="version-row">
            <span class="label">Env:</span>
            <span class="value" [class]="versionInfo.environment">{{ versionInfo.environment }}</span>
          </div>
        </div>
        
        <!-- Firebase mode -->
        <div *ngSwitchCase="'firebase'" class="version-firebase">
          <span class="firebase-version">{{ getFirebaseVersion() }}</span>
        </div>
        
        <!-- Badge mode -->
        <div *ngSwitchCase="'badge'" class="version-badge">
          <span class="badge-text">{{ versionInfo.version }}</span>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .version-display {
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    
    .version-compact {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .version-text {
      font-weight: bold;
      color: #333;
    }
    
    .build-number {
      color: #666;
      font-size: 10px;
    }
    
    .version-detailed {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    
    .version-row {
      display: flex;
      justify-content: space-between;
      gap: 8px;
    }
    
    .label {
      font-weight: bold;
      color: #555;
      min-width: 50px;
    }
    
    .value {
      color: #333;
    }
    
    .value.production {
      color: #28a745;
      font-weight: bold;
    }
    
    .value.development {
      color: #ffc107;
      font-weight: bold;
    }
    
    .version-firebase {
      display: flex;
      align-items: center;
    }
    
    .firebase-version {
      background: #ff6b35;
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
    }
    
    .version-badge {
      display: flex;
      align-items: center;
    }
    
    .badge-text {
      background: #007bff;
      color: white;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: bold;
    }
  `]
})
export class VersionDisplayComponent implements OnInit {
  @Input() displayMode: 'compact' | 'detailed' | 'firebase' | 'badge' = 'compact';
  @Input() showEnvironment: boolean = false;
  
  versionInfo: VersionInfo;
  
  constructor(private versionService: VersionService) {}
  
  ngOnInit() {
    this.versionInfo = this.versionService.getVersionInfo();
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
  }
  
  getFirebaseVersion(): string {
    return this.versionService.getVersionForFirebase();
  }
}
