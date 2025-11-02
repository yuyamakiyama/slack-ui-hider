import type { HideSettings, SettingKey } from "../types";
import { getSettings, saveSettings } from "../utils/storage";

class PopupController {
  private settings: HideSettings | null = null;

  async init(): Promise<void> {
    this.settings = await getSettings();
    this.setupEventListeners();
    this.updateUI();
  }

  private setupEventListeners(): void {
    document
      .querySelectorAll<HTMLInputElement>(".toggle-switch")
      .forEach((toggle) => {
        toggle.addEventListener("change", async (e) => {
          const target = e.target as HTMLInputElement;
          const setting = target.dataset.setting as SettingKey;

          if (this.settings && setting) {
            this.settings[setting] = target.checked;
            await saveSettings(this.settings);
            await this.notifyTabs();
          }
        });
      });

    const hideAllBtn = document.getElementById("hide-all");
    const showAllBtn = document.getElementById("show-all");

    hideAllBtn?.addEventListener("click", () => this.toggleAll(true));
    showAllBtn?.addEventListener("click", () => this.toggleAll(false));
  }

  private async toggleAll(hide: boolean): Promise<void> {
    if (!this.settings) return;

    Object.keys(this.settings).forEach((key) => {
      if (!this.settings) return;
      if (typeof this.settings[key as SettingKey] === 'boolean') {
        this.settings[key as SettingKey] = hide;
      }
    });

    await saveSettings(this.settings);
    this.updateUI();
    await this.notifyTabs();
  }

  private async notifyTabs(): Promise<void> {
    if (!this.settings) return;

    const tabs = await chrome.tabs.query({ url: "*://*.slack.com/*" });

    for (const tab of tabs) {
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: "UPDATE_SETTINGS",
          settings: this.settings,
        });
      }
    }
  }


  private updateUI(): void {
    if (!this.settings) return;

    Object.entries(this.settings).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        const toggle = document.querySelector<HTMLInputElement>(
          `[data-setting="${key}"]`
        );
        if (toggle) {
          toggle.checked = value;
        }
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new PopupController().init();
});
