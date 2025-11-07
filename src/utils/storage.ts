import type { HideSettings } from '../types';

export const DEFAULT_SETTINGS: HideSettings = {
  hideWorkspaceName: false,
  hidePrivateChannels: false,
  hidePublicChannels: false,
  hideExternalChannels: false,
  hideStarredChannels: false,
  hideDMs: false,
  hideApps: false,
  hideMessages: false,
  hideThreads: false,
  hideReactions: false,
  hideSenders: false,
  hoverToReveal: true,
};

export async function getSettings(): Promise<HideSettings> {
  try {
    const result = await chrome.storage.sync.get('settings');
    return result.settings || DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: HideSettings): Promise<void> {
  await chrome.storage.sync.set({ settings });
}
