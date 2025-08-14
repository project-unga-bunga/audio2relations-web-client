import { Injectable } from '@angular/core';

export interface VersionInfo {
  version: string;
  buildNumber: number;
  versionCode: number;
  buildDate: string;
  gitCommit: string;
  environment: string;
  appId: string;
  appName: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private versionInfo: VersionInfo = {
    version: '1.0.0',
    buildNumber: 1,
    versionCode: 1,
    buildDate: new Date().toISOString(),
    gitCommit: 'unknown',
    environment: 'development',
    appId: 'com.audio2relation.app',
    appName: 'audio2relations-web-client'
  };

  constructor() {
    this.loadVersionInfo();
  }

  private async loadVersionInfo() {
    try {
      // Try to load from version config if available
      const response = await fetch('/assets/version.json');
      if (response.ok) {
        this.versionInfo = await response.json();
      }
    } catch (error) {
      console.warn('Could not load version info, using defaults');
    }
  }

  getVersionInfo(): VersionInfo {
    return { ...this.versionInfo };
  }

  getVersion(): string {
    return this.versionInfo.version;
  }

  getBuildNumber(): number {
    return this.versionInfo.buildNumber;
  }

  getVersionCode(): number {
    return this.versionInfo.versionCode;
  }

  getBuildDate(): string {
    return this.versionInfo.buildDate;
  }

  getGitCommit(): string {
    return this.versionInfo.gitCommit;
  }

  getEnvironment(): string {
    return this.versionInfo.environment;
  }

  getAppId(): string {
    return this.versionInfo.appId;
  }

  getAppName(): string {
    return this.versionInfo.appName;
  }

  getFullVersionString(): string {
    return `${this.versionInfo.version} (${this.versionInfo.buildNumber})`;
  }

  getVersionForFirebase(): string {
    return `${this.versionInfo.version}-${this.versionInfo.buildNumber}`;
  }

  isProduction(): boolean {
    return this.versionInfo.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.versionInfo.environment === 'development';
  }
}
