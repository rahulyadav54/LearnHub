import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnhub.app',
  appName: 'HamroLearning',
  webDir: 'out', // Next.js typically exports to 'out', though we are using live server
  bundledWebRuntime: false,
  server: {
    // In production, this should be the live site URL e.g., 'https://learnhub.com.np'
    // For development, it points to local dev server
    url: process.env.CAPACITOR_SERVER_URL || 'http://10.0.2.2:3000',
    cleartext: true,
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: 'YOUR_GOOGLE_WEB_CLIENT_ID', // Replace with real ID
      forceCodeForRefreshToken: true,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
