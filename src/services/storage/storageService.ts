/**
 * MMKV Storage Service (v4)
 * High-performance key-value storage for React Native
 */

import { createMMKV } from 'react-native-mmkv';
import { STORAGE_KEYS } from '@shared/constants/config';

// Initialize MMKV instance using v4 API
const storage = createMMKV({
  id: 'paperx-storage',
  encryptionKey: 'your-encryption-key-here', // TODO: Move to secure key management
});

/**
 * Storage Service Class
 * Provides typed methods for storing and retrieving data
 */
class StorageService {
  // String operations
  setString(key: string, value: string): void {
    storage.set(key, value);
  }

  getString(key: string): string | undefined {
    return storage.getString(key);
  }

  // Number operations
  setNumber(key: string, value: number): void {
    storage.set(key, value);
  }

  getNumber(key: string): number | undefined {
    return storage.getNumber(key);
  }

  // Boolean operations
  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  }

  getBoolean(key: string): boolean | undefined {
    return storage.getBoolean(key);
  }

  // Object operations (JSON)
  setObject<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  }

  getObject<T>(key: string): T | undefined {
    const value = storage.getString(key);
    if (!value) return undefined;
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing object for key ${key}:`, error);
      return undefined;
    }
  }

  // Delete operation (v4 API uses 'remove')
  delete(key: string): void {
    storage.remove(key);
  }

  // Check if key exists
  contains(key: string): boolean {
    return storage.contains(key);
  }

  // Get all keys
  getAllKeys(): string[] {
    return storage.getAllKeys();
  }

  // Clear all data
  clearAll(): void {
    storage.clearAll();
  }

  // Auth-specific methods
  setAuthToken(token: string): void {
    this.setString(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  getAuthToken(): string | undefined {
    return this.getString(STORAGE_KEYS.AUTH_TOKEN);
  }

  setRefreshToken(token: string): void {
    this.setString(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | undefined {
    return this.getString(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setUserData<T>(user: T): void {
    this.setObject(STORAGE_KEYS.USER_DATA, user);
  }

  getUserData<T>(): T | undefined {
    return this.getObject<T>(STORAGE_KEYS.USER_DATA);
  }

  clearAuth(): void {
    this.delete(STORAGE_KEYS.AUTH_TOKEN);
    this.delete(STORAGE_KEYS.REFRESH_TOKEN);
    this.delete(STORAGE_KEYS.USER_DATA);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.contains(STORAGE_KEYS.AUTH_TOKEN);
  }
}

// Export singleton instance
export const storageService = new StorageService();
export default storageService;

