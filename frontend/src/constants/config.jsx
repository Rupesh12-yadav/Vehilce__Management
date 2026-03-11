export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  appName: process.env.REACT_APP_NAME || 'RentEase',
  appVersion: process.env.REACT_APP_VERSION || '1.0.0',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableDebug: process.env.REACT_APP_ENABLE_DEBUG === 'true',
};

export default config;


