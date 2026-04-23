import { API_BASE_URL } from '@shared/constants/config';

/**
 * Build a displayable image URI from an API path or absolute URL.
 * Relative paths (e.g. uploads/rtd/products/...) are prefixed with API_BASE_URL.
 */
export function resolveMediaUrl(pathOrUrl: string | null | undefined): string | undefined {
  if (pathOrUrl == null || pathOrUrl === '') return undefined;
  const s = pathOrUrl.trim();
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  const path = s.replace(/^\/+/, '');
  return `${API_BASE_URL.replace(/\/+$/, '')}/${path}`;
}
