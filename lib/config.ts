const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const webUrl = process.env.EXPO_PUBLIC_WEB_URL ?? 'https://cheevo.events';

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL is not set. Add it to your .env (see .env.example).');
}

export const config = {
  apiUrl,
  apiBaseUrl: `${apiUrl.replace(/\/+$/, '')}/api/v1`,
  webUrl: webUrl.replace(/\/+$/, ''),
} as const;
