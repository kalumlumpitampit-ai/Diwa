import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.littrack.app',
  appName: 'LitTrack',
  webDir: 'dist',
  server: {
    hostname: 'littrack.app',
    androidScheme: 'https'
  }
};

export default config;
