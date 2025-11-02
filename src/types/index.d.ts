export interface HideSettings {
  hideWorkspaceName: boolean;
  // Channels
  hidePrivateChannels: boolean;
  hidePublicChannels: boolean;
  hideExternalChannels: boolean;
  hideStarredChannels: boolean;
  // Communication
  hideDMs: boolean;
  hideApps: boolean;
  // Content
  hideMessages: boolean;
  hideThreads: boolean;
  hideReactions: boolean;
  hideSenders: boolean;
}

export type SettingKey = keyof HideSettings;

export interface StorageData {
  settings: HideSettings;
}
