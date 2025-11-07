import type { SettingKey } from '../types';

export type SlackElement = {
  selector: string;
  className: string;
};

export const SLACK_ELEMENTS: Record<SettingKey, SlackElement | null> = {
  hoverToReveal: null,
  hideWorkspaceName: {
    selector: '.p-ia4_home_header_menu__team_name',
    className: 'slack-ui-hider-blur-workspace-name',
  },
  hidePrivateChannels: {
    selector: '[data-qa-channel-sidebar-channel-type="private"] .p-channel_sidebar__name',
    className: 'slack-ui-hider-blur-private-channels',
  },
  hidePublicChannels: {
    selector:
      '[data-qa-channel-sidebar-channel-type="channel"]:not([data-qa-channel-sidebar-shared-type="externally-shared"]):not([data-qa-channel-sidebar-is-starred="true"]) .p-channel_sidebar__name',
    className: 'slack-ui-hider-blur-public-channels',
  },
  hideExternalChannels: {
    selector: '[data-qa-channel-sidebar-shared-type="externally-shared"] .p-channel_sidebar__name',
    className: 'slack-ui-hider-blur-external-channels',
  },
  hideStarredChannels: {
    selector: '[data-qa-channel-sidebar-is-starred="true"] .p-channel_sidebar__name',
    className: 'slack-ui-hider-blur-starred-channels',
  },
  hideDMs: {
    selector:
      '.p-channel_sidebar__channel[data-qa-channel-sidebar-channel-type="im"]:has(.c-avatar__presence) .p-channel_sidebar__name, .p-channel_sidebar__channel[data-qa-channel-sidebar-channel-type="im"]:has(.c-avatar__presence) .p-channel_sidebar__user_avatar',
    className: 'slack-ui-hider-blur-dms',
  },
  hideApps: {
    selector:
      '.p-channel_sidebar__channel[data-qa-channel-sidebar-channel-type="im"]:not(:has(.c-avatar__presence)) .p-channel_sidebar__name, .p-channel_sidebar__channel[data-qa-channel-sidebar-channel-type="im"]:not(:has(.c-avatar__presence)) .p-channel_sidebar__user_avatar',
    className: 'slack-ui-hider-blur-apps',
  },
  hideMessages: {
    selector:
      '.c-message_kit__blocks, .p-rich_text_block, .c-message_kit__attachments, .c-message_attachment, .c-files_container, .c-file_gallery, .p-file_image_thumbnail__image, .p-message_gallery_image_file',
    className: 'slack-ui-hider-blur-messages',
  },
  hideThreads: {
    selector:
      ".p-threads_view, [data-qa='threads-tab'], .p-threads_flexpane, .c-message__reply_bar",
    className: 'slack-ui-hider-blur-threads',
  },
  hideReactions: {
    selector:
      '[data-qa="reactji"], [data-qa="reaction_bar"], .c-reaction, .c-reaction_bar, .c-message_kit__reaction_bar, .c-reaction_add',
    className: 'slack-ui-hider-blur-reactions',
  },
  hideSenders: {
    selector: ".c-message__sender_button, [data-qa='message_sender_name'], .c-message__sender",
    className: 'slack-ui-hider-blur-senders',
  },
};
