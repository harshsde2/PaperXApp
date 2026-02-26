import { storageService } from '@services/storage/storageService';

const STRUCTURED_CHAT_LAST_OPENED_KEY = 'structured_chat_last_opened';

type LastOpenedMap = Record<string, string>;

const getMap = (): LastOpenedMap => {
  return storageService.getObject<LastOpenedMap>(STRUCTURED_CHAT_LAST_OPENED_KEY) ?? {};
};

export const getThreadLastOpenedAt = (threadId: number | string): string | null => {
  const map = getMap();
  return map[String(threadId)] ?? null;
};

export const markThreadOpenedNow = (threadId: number | string): string => {
  const map = getMap();
  const timestamp = new Date().toISOString();
  map[String(threadId)] = timestamp;
  storageService.setObject(STRUCTURED_CHAT_LAST_OPENED_KEY, map);
  return timestamp;
};
