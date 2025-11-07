import type { HideSettings } from '../types';
import type { MessageType } from '../types/messages';
import { getSettings } from '../utils/storage';
import { SLACK_ELEMENTS, type SlackElement } from './constants';

class SlackUIHider {
  private settings: HideSettings | null = null;
  private styleElement: HTMLStyleElement | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  async init(): Promise<void> {
    this.settings = await getSettings();
    this.injectStyles();
    this.applySettings();

    chrome.storage.onChanged.addListener(this.handleStorageChange.bind(this));
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

    this.observeDOM();
  }

  private injectStyles(): void {
    this.styleElement = document.createElement('style');
    this.styleElement.id = 'slack-ui-hider-styles';
    document.head.appendChild(this.styleElement);
    this.updateStyles();
  }

  private updateStyles(): void {
    if (!this.styleElement || !this.settings) return;

    const hoverEnabled = this.settings.hoverToReveal ?? true;

    const css = Object.values(SLACK_ELEMENTS)
      .filter((element): element is SlackElement => element !== null)
      .map((element) => {
        const selectors = element.selector
          .split(',')
          .map((s) => s.trim())
          .map((s) => `body.${element.className} ${s}`)
          .join(', ');

        if (!hoverEnabled) {
          return `${selectors} {
  filter: blur(6px) !important;
  opacity: 0.7 !important;
  transition: filter 0.3s ease, opacity 0.3s ease !important;
}`;
        }

        const hoverSelectors = element.selector
          .split(',')
          .map((s) => s.trim())
          .map((s) => `body.${element.className} ${s}:hover`)
          .join(', ');

        return `${selectors} {
  filter: blur(6px) !important;
  opacity: 0.7 !important;
  transition: filter 0.3s ease, opacity 0.3s ease !important;
} 
${hoverSelectors} {
  filter: none !important;
  opacity: 1 !important;
}`;
      })
      .join('\n\n');

    this.styleElement.textContent = css;
  }

  private applySettings(): void {
    if (!this.settings) return;

    Object.entries(SLACK_ELEMENTS).forEach(([key, element]) => {
      if (!this.settings) return;

      if (element === null) return;

      const shouldHide = this.settings[key as keyof typeof SLACK_ELEMENTS] ?? false;
      document.body.classList.toggle(element.className, shouldHide);
    });

    this.updateStyles();
  }

  private handleStorageChange(
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ): void {
    if (areaName === 'sync' && changes.settings) {
      this.settings = changes.settings.newValue;
      this.applySettings();
    }
  }

  private handleMessage(
    message: MessageType,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: unknown) => void
  ): boolean {
    if (message.type === 'UPDATE_SETTINGS') {
      this.settings = message.settings;
      this.applySettings();
      sendResponse({ success: true });
    } else if (message.type === 'GET_SETTINGS') {
      sendResponse({ settings: this.settings });
    }

    return true;
  }

  private observeDOM(): void {
    const observer = new MutationObserver((mutations) => {
      const hasRelevantChanges = mutations.some((mutation) => {
        return (
          mutation.type === 'childList' &&
          (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
        );
      });

      if (hasRelevantChanges) {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
        }
        this.debounceTimer = setTimeout(() => {
          this.applySettings();
        }, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new SlackUIHider().init());
} else {
  new SlackUIHider().init();
}
