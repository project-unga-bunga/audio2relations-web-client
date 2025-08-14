import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.audio2relation.app',
  appName: 'audio2relations-web-client',
  webDir: 'dist/audio-recorder/browser',
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
