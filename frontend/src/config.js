const isProd = process.env.NODE_ENV === 'production';

// Replace this with your actual Render URL
const CLOUD_API_BASE = 'https://taskflow-backend.onrender.com';

export const API_BASE_URL = isProd
  ? CLOUD_API_BASE
  : 'http://localhost:4000';