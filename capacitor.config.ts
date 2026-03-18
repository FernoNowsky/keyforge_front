import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.keyforge.app',
  appName: 'Keyforge',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    allowNavigation: ['10.0.2.2:*', 'localhost:*', '192.168.*', '172.16.*', '10.0.*']
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
