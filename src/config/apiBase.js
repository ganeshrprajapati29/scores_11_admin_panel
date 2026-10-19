const DEFAULT_BACKEND_URL = 'http://68.178.171.95:3000';

const cleanUrl = (value) => {
  const trimmed = String(value || '').trim();
  if (!trimmed || trimmed.includes(' ')) return '';

  try {
    return new URL(trimmed).origin + new URL(trimmed).pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
};

export const BACKEND_URL = cleanUrl(import.meta.env.VITE_BACKEND_URL) || DEFAULT_BACKEND_URL;
export const API_URL = cleanUrl(import.meta.env.VITE_API_URL) || `${BACKEND_URL}/api/v1`;
export const SOCKET_URL = cleanUrl(import.meta.env.VITE_SOCKET_URL) || BACKEND_URL;

