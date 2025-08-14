import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.audio2relation.app',
  appName: 'audio2relations-web-client',
  // Version information
  version: '1.0.0',
  buildNumber: 2,
  versionCode: 2,
  buildDate: '2025-08-14T19:38:06.861Z',
  gitCommit: 'f16008f',

  webDir: 'dist/audio-recorder/browser',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
