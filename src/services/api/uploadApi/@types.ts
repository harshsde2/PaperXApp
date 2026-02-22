/**
 * Upload API types
 */

/** Response from POST /upload/single. Backend may return path at top level or under data. */
export interface UploadImageResponse {
  path?: string;
  url?: string;
  data?: { path?: string; url?: string };
}
