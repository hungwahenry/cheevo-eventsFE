const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL is not set. Add it to your .env (see .env.example).');
}

export const config = {
  apiUrl,
  apiBaseUrl: `${apiUrl.replace(/\/+$/, '')}/api/v1`,
} as const;
