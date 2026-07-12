import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.learnhub.app',
  appName: 'HamroLearning',
  webDir: 'out', // Next.js typically exports to 'out', though we are using live server
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://learn-hub-rahuls-projects-f7f3b70c.vercel.app',
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
