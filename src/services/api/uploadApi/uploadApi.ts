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

function extractPath(json: any): string {
  const data = json?.data;
  const path = data?.path ?? data?.url ?? json?.path ?? json?.url;
  if (typeof path !== 'string' || !path) {
    throw new Error('Upload response missing path or url');
  }
  return path;
}

export const useUploadImage = () => {
  return useMutation({
    mutationFn: async (file: PickedImage): Promise<string> => {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as any);

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
