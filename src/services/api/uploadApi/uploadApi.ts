/**
 * Generic file upload API (single image).
 * Uses native fetch instead of axios because React Native's XMLHttpRequest
 * adapter in axios has well-known issues with multipart/form-data boundary
 * generation. Native fetch handles FormData correctly out of the box.
 */

import { useMutation } from '@tanstack/react-query';
import { UPLOAD_ENDPOINTS } from '@shared/constants/api';
import { API_BASE_URL } from '@shared/constants/config';
import { storageService } from '@services/storage/storageService';
import type { PickedImage } from '@shared/utils/imagePicker';

export type UploadImageVariables = {
  file: PickedImage;
  /** Use 'dispatch' for RTD dispatch proof uploads (stored under uploads/rtd/dispatch/). */
  purpose?: 'dispatch';
};

function extractPath(json: unknown): string {
  const j = json as Record<string, unknown> | null;
  const data = j?.data as Record<string, unknown> | undefined;
  const path = (typeof data?.path === 'string' && data.path) || (typeof j?.path === 'string' && j.path);
  if (!path) {
    throw new Error('Upload response missing path');
  }
  return path;
}

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (variables: UploadImageVariables): Promise<string> => {
      const { file, purpose } = variables;
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);
      if (purpose === 'dispatch') {
        formData.append('purpose', 'dispatch');
      }

      const token = storageService.getAuthToken();
      const url = `${API_BASE_URL}${UPLOAD_ENDPOINTS.SINGLE}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const json = await response.json();

      if (!response.ok) {
        if (__DEV__) {
          console.log('[Upload Error Detail]', JSON.stringify(json, null, 2));
        }
        const errors = json?.errors;
        let msg = '';
        if (errors && typeof errors === 'object') {
          msg = Object.values(errors).flat().join(', ');
        }
        if (!msg) {
          msg = json?.message || json?.error?.message || `Upload failed (${response.status})`;
        }
        throw new Error(msg);
      }

      return extractPath(json);
    },
  });
};
