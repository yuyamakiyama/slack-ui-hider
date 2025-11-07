import type { HideSettings } from './index';

export type MessageType =
  | { type: 'UPDATE_SETTINGS'; settings: HideSettings }
  | { type: 'GET_SETTINGS' }
  | { type: 'SETTINGS_RESPONSE'; settings: HideSettings }
  | { type: 'TOGGLE_ELEMENT'; element: string; hide: boolean };
