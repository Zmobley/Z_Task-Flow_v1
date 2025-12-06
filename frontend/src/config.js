const isProd = process.env.NODE_ENV === 'production';

// Use your actual Render URL here:
const CLOUD_API_BASE = 'https://z-task-flow-v1.onrender.com';
export const API_BASE_URL = isProd
  ? CLOUD_API_BASE
  : 'http://localhost:4000';
