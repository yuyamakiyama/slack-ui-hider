import type { HideSettings } from '../types';
import type { MessageType } from '../types/messages';
import { DEFAULT_SETTINGS, saveSettings } from '../utils/storage';

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    await saveSettings(DEFAULT_SETTINGS);
  }

  if (details.reason === 'update') {
    const result = await chrome.storage.sync.get('settings');

    await saveSettings({
      ...DEFAULT_SETTINGS,
      ...result.settings,
    });
  }
});

chrome.runtime.onMessage.addListener((message: MessageType, _sender, sendResponse) => {
  switch (message.type) {
    case 'GET_SETTINGS':
      handleGetSettings(sendResponse);
      return true;

    case 'UPDATE_SETTINGS':
      handleUpdateSettings(message.settings, sendResponse);
      return true;

    default:
      return false;
  }
});

async function handleGetSettings(sendResponse: (response: unknown) => void) {
  try {
    const result = await chrome.storage.sync.get('settings');
    sendResponse({ success: true, settings: result.settings });
  } catch (error) {
    sendResponse({ success: false, error: error });
  }
}

async function handleUpdateSettings(
  settings: HideSettings,
  sendResponse: (response: unknown) => void
) {
  try {
    await saveSettings(settings);

    const tabs = await chrome.tabs.query({ url: '*://*.slack.com/*' });
    for (const tab of tabs) {
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: 'UPDATE_SETTINGS',
          settings,
        });
      }
    }

    sendResponse({ success: true });
  } catch (error) {
    sendResponse({ success: false, error: error });
  }
}

const keepAlive = () => {
  chrome.runtime.getPlatformInfo(() => {
    // NOTE: Just to keep the service worker alive
  });
};

setInterval(keepAlive, 10000);
