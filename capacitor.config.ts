
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4f8d2552974e4edab0e82afdf5ac21ee',
  appName: 'chess-move-navigator',
  webDir: 'dist',
  server: {
    url: 'https://4f8d2552-974e-4eda-b0e8-2afdf5ac21ee.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      androidxCore: '1.7.0',
      androidxAppCompat: '1.4.2',
    }
  },
  plugins: {
    Camera: {
      permissionDescription: "The app needs camera access to detect chess positions."
    },
    Permissions: {
      permissions: [
        "android.permission.SYSTEM_ALERT_WINDOW",
        "android.permission.FOREGROUND_SERVICE",
        "android.permission.CAMERA"
      ]
    }
  }
};

export default config;
