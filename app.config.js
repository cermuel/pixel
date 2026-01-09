// app.config.js
export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...config.extra, // <-- THIS IS THE CRITICAL LINE
      PINTEREST_API_KEY: process.env.PINTEREST_API_KEY,
      SPLASH_APP_ID: process.env.SPLASH_APP_ID,
      SPLASH_ACCESS_KEY: process.env.SPLASH_ACCESS_KEY,
      SPLASH_BACKUP_KEY: process.env.SPLASH_BACKUP_KEY,
      SPLASH_SECRET_KEY: process.env.SPLASH_SECRET_KEY,
    },
  };
};
