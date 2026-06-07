import { config } from '@/lib/config';
import * as WebBrowser from 'expo-web-browser';

const SLUGS = {
  terms: 'pages/terms-of-service',
  privacy: 'pages/privacy-policy',
} as const;

export const legalUrls = {
  terms: `${config.webUrl}/${SLUGS.terms}`,
  privacy: `${config.webUrl}/${SLUGS.privacy}`,
} as const;

export function openLegalPage(kind: 'terms' | 'privacy'): Promise<unknown> {
  return WebBrowser.openBrowserAsync(legalUrls[kind], {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
  });
}
