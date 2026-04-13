import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fvfmatchdaypro.app',
  appName: 'matchdaypro-mobile',
  webDir: 'www',
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com'],
    },
  },
};

export default config;
