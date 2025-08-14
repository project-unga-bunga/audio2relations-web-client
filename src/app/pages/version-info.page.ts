import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VersionService, VersionInfo } from '../services/version.service';
import { VersionDisplayComponent } from '../components/version-display.component';

@Component({
  selector: 'app-version-info',
  standalone: true,
  imports: [CommonModule, VersionDisplayComponent],
  template: `
    <div class="version-page">
      <header class="page-header">
        <h1>Version Information</h1>
        <a routerLink="/dashboard" class="back-link">← Back to Dashboard</a>
      </header>

      <div class="version-container">
        <div class="version-card">
          <div class="card-header">
            <h2>📱 App Version</h2>
          </div>
          <div class="card-content">
            <app-version-display displayMode="detailed"></app-version-display>
          </div>
        </div>

        <div class="version-card">
          <div class="card-header">
            <h2>🔥 Firebase Distribution</h2>
          </div>
          <div class="card-content">
            <div class="firebase-info">
              <app-version-display displayMode="firebase"></app-version-display>
              <p class="firebase-note">
                This version string is used for Firebase App Distribution and will be visible to testers.
              </p>
            </div>
          </div>
        </div>

        <div class="version-card">
          <div class="card-header">
            <h2>⚙️ Build Details</h2>
          </div>
          <div class="card-content">
            <div class="build-details">
              <div class="detail-item">
                <span class="label">Build Environment:</span>
                <span class="value" [class]="versionInfo.environment">{{ versionInfo.environment }}</span>
              </div>
              
              <div class="detail-item">
                <span class="label">Build Date:</span>
                <span class="value">{{ formatDate(versionInfo.buildDate) }}</span>
              </div>
              
              <div class="detail-item">
                <span class="label">Git Commit:</span>
                <span class="value git-commit">{{ versionInfo.gitCommit }}</span>
                <button class="copy-btn" (click)="copyGitCommit()">Copy</button>
              </div>
            </div>
          </div>
        </div>

        <div class="version-card">
          <div class="card-header">
            <h2>🤖 Android Information</h2>
          </div>
          <div class="card-content">
            <div class="android-details">
              <div class="detail-item">
                <span class="label">Version Code:</span>
                <span class="value">{{ versionInfo.versionCode }}</span>
              </div>
              
              <div class="detail-item">
                <span class="label">Package ID:</span>
                <span class="value">{{ versionInfo.appId }}</span>
                <button class="copy-btn" (click)="copyAppId()">Copy</button>
              </div>
            </div>
          </div>
        </div>

        <div class="version-card">
          <div class="card-header">
            <h2>❓ About Versioning</h2>
          </div>
          <div class="card-content">
            <div class="about-versioning">
              <p><strong>Version Format:</strong> X.Y.Z (Semantic Versioning)</p>
              <ul>
                <li><strong>X</strong> - Major version (breaking changes)</li>
                <li><strong>Y</strong> - Minor version (new features, backward compatible)</li>
                <li><strong>Z</strong> - Patch version (bug fixes)</li>
              </ul>
              <p><strong>Build Number:</strong> Increments with each build</p>
              <p><strong>Version Code:</strong> Android-specific, must always increase</p>
              <p><strong>Firebase Version:</strong> Format: X.Y.Z-B (visible to testers)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .version-page {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .page-header {
      margin-bottom: 30px;
      text-align: center;
    }
    
    .page-header h1 {
      margin: 0 0 10px 0;
      color: #333;
      font-size: 2.5em;
    }
    
    .back-link {
      color: #007bff;
      text-decoration: none;
      font-size: 16px;
    }
    
    .back-link:hover {
      text-decoration: underline;
    }
    
    .version-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .version-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card-header {
      background: #f8f9fa;
      padding: 15px 20px;
      border-bottom: 1px solid #ddd;
    }
    
    .card-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.3em;
    }
    
    .card-content {
      padding: 20px;
    }
    
    .firebase-info {
      text-align: center;
    }
    
    .firebase-note {
      margin-top: 16px;
      font-size: 14px;
      color: #666;
      font-style: italic;
    }
    
    .build-details, .android-details {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    
    .detail-item:last-child {
      border-bottom: none;
    }
    
    .label {
      font-weight: bold;
      color: #555;
      min-width: 120px;
    }
    
    .value {
      color: #333;
      flex: 1;
    }
    
    .value.production {
      color: #28a745;
      font-weight: bold;
    }
    
    .value.development {
      color: #ffc107;
      font-weight: bold;
    }
    
    .git-commit {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    .copy-btn {
      background: #007bff;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
    }
    
    .copy-btn:hover {
      background: #0056b3;
    }
    
    .about-versioning {
      font-size: 14px;
      line-height: 1.6;
    }
    
    .about-versioning ul {
      margin: 8px 0;
      padding-left: 20px;
    }
    
    .about-versioning li {
      margin: 4px 0;
    }
    
    @media (max-width: 600px) {
      .version-page {
        padding: 10px;
      }
      
      .detail-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 5px;
      }
      
      .label {
        min-width: auto;
      }
    }
  `]
})
export class VersionInfoPage implements OnInit {
  versionInfo!: VersionInfo;
  
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
  
  copyGitCommit() {
    navigator.clipboard.writeText(this.versionInfo.gitCommit).then(() => {
      // You could add a toast notification here
      console.log('Git commit copied to clipboard');
    });
  }
  
  copyAppId() {
    navigator.clipboard.writeText(this.versionInfo.appId).then(() => {
      // You could add a toast notification here
      console.log('App ID copied to clipboard');
    });
  }
}
