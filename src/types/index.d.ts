export interface HideSettings {
  hideWorkspaceName: boolean;
  hidePrivateChannels: boolean;
  hidePublicChannels: boolean;
  hideExternalChannels: boolean;
  hideStarredChannels: boolean;
  hideDMs: boolean;
  hideApps: boolean;
  hideMessages: boolean;
  hideThreads: boolean;
  hideReactions: boolean;
  hideSenders: boolean;
  hoverToReveal: boolean;
}

export type SettingKey = keyof HideSettings;

export interface StorageData {
  settings: HideSettings;
}
