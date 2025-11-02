# Slack UI Hider

A Chrome extension that blurs distracting UI elements in Slack for better focus and productivity. Instead of completely hiding elements, it applies a blur effect that maintains spatial context while reducing visual distractions.

## Features

Blur the following Slack UI elements with simple toggle switches:
- **Channels** - Blur the channels sidebar
- **Threads** - Blur the threads section
- **Reactions** - Blur message reactions and emoji picker
- **Direct Messages** - Blur the DMs section
- **Private Channels** - Blur private channels with lock icons
- **Workspaces** - Blur the workspace switcher

### Blur Effect Features:
- Elements are blurred with reduced opacity instead of being completely hidden
- **Hover to reveal**: Hovering over blurred elements temporarily reduces the blur for quick viewing
- Smooth transitions for a pleasant user experience
- Maintains page layout integrity
- All changes apply immediately and are synced across all your Slack tabs

## Installation

### Prerequisites

- [Bun](https://bun.sh/) (for building the extension)
- Google Chrome or Chromium-based browser

### Build from Source

1. Clone the repository:
```bash
git clone https://github.com/yuyamakiyama/slack-ui-hider.git
cd slack-ui-hider
```

2. Install dependencies:
```bash
bun install
```

3. Build the extension:
```bash
bun run build
```

4. The built extension will be in the `dist/` folder

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project
5. The extension is now installed!

## Usage

1. Navigate to any Slack workspace (https://app.slack.com)
2. Click the extension icon in your Chrome toolbar
3. Toggle the UI elements you want to hide
4. Changes apply immediately

### Quick Actions

- **Blur All** - Blur all UI elements at once
- **Clear All** - Remove blur from all UI elements at once

## Development

### Project Structure

```
slack-ui-hider/
├── src/
│   ├── popup/          # Extension popup UI
│   ├── content/        # Content script for Slack pages
│   ├── background/     # Service worker
│   ├── types/          # TypeScript definitions
│   └── utils/          # Shared utilities
├── public/             # Static assets
├── dist/               # Built extension (gitignored)
└── build.ts            # Bun build script
```

### Development Mode

Run the extension in watch mode for development:

```bash
bun run dev
```

This will watch for changes and rebuild automatically.

### Building for Production

```bash
bun run build
```

### Creating a Package

To create a `.zip` file for distribution:

```bash
bun run package
```

### Available Scripts

```bash
bun run dev        # Start development mode with watch
bun run build      # Build for production
bun run clean      # Clean the dist folder
bun run package    # Build and create a zip file

# Code quality
bun run format     # Format code with Biome
bun run lint       # Check for linting issues
bun run lint:fix   # Fix linting issues automatically
bun run check      # Format and lint (recommended)
bun run check:ci   # CI mode - fails on issues
bun run type-check # TypeScript type checking
```

## Technical Details

### Technologies Used

- **TypeScript** - Type-safe development
- **Bun** - Fast JavaScript runtime and bundler
- **Biome** - Fast formatter and linter with recommended presets
- **Chrome Extension Manifest V3** - Latest extension API
- **Chrome Storage API** - Sync settings across devices

### How It Works

1. **Content Script** - Injected into Slack pages to control element visibility
2. **Popup Interface** - Provides toggle controls for each UI element
3. **Background Service Worker** - Manages extension lifecycle and message passing
4. **Chrome Storage** - Persists user preferences

### CSS Selectors

The extension targets Slack's UI elements using CSS selectors:
- Channels: `.p-channel_sidebar__channels`
- Threads: `.p-threads_view`
- Reactions: `.c-reaction, .c-reaction_bar`
- DMs: `[data-qa*="dm"]`
- Private Channels: `.p-channel_sidebar__channel--private`
- Workspaces: `.p-ia__sidebar, .p-workspace_switcher`

## Troubleshooting

### Extension Not Working

1. Make sure you're on a Slack workspace (https://app.slack.com)
2. Try refreshing the Slack page
3. Check if the extension is enabled in `chrome://extensions/`

### Changes Not Applying

1. Refresh the Slack tab
2. Check the console for errors (F12 → Console tab)
3. Try disabling and re-enabling the extension

### Building Issues

1. Make sure Bun is installed: `bun --version`
2. Clear the dist folder: `bun run clean`
3. Reinstall dependencies: `rm -rf node_modules && bun install`

## Privacy

This extension:
- ✅ Works entirely locally in your browser
- ✅ Does not collect any data
- ✅ Does not make external network requests
- ✅ Only modifies the visual appearance of Slack
- ✅ Settings are stored in Chrome's sync storage (encrypted)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Slack for providing a great communication platform
- The Chrome Extensions team for excellent documentation
- Bun for the blazing fast build times

## Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/yuyamakiyama/slack-ui-hider/issues).

---

Made with ❤️ for better focus in Slack