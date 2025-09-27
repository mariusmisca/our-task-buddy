import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7f5e86cbc5854b59be4cb97a187d01f5',
  appName: 'TaskFlow - Seguimiento de Tareas',
  webDir: 'dist',
  server: {
    url: 'https://7f5e86cb-c585-4b59-be4c-b97a187d01f5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#3b82f6",
      androidSplashResourceName: "splash",
      showSpinner: false
    }
  }
};

export default config;