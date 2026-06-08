import { config } from '@/lib/config';
import * as WebBrowser from 'expo-web-browser';

const SLUGS = {
  terms: 'pages/terms',
  privacy: 'pages/privacy',
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
