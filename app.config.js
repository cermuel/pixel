// app.config.js
export default ({ config }) => {
  return {
    ...config,
    slug: 'pixels',
    name: 'Pixels',
    android: {
      ...config.android,
      package: 'com.cermuel.pixels', // YOUR PACKAGE NAME
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
      },
    },
    ios: {
      ...config.ios,
      bundleIdentifier: 'com.cermuel.pixels', // YOUR BUNDLE ID
    },
    extra: {
      ...config.extra,
      PINTEREST_API_KEY: process.env.EXPO_PUBLIC_PINTEREST_API_KEY,
      SPLASH_APP_ID: process.env.EXPO_PUBLIC_SPLASH_APP_ID,
      SPLASH_ACCESS_KEY: process.env.EXPO_PUBLIC_SPLASH_ACCESS_KEY,
      SPLASH_BACKUP_KEY: process.env.EXPO_PUBLIC_SPLASH_BACKUP_KEY,
      SPLASH_SECRET_KEY: process.env.EXPO_PUBLIC_SPLASH_SECRET_KEY,
    },
  };
};
