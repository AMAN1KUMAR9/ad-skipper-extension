# Ad Skipper & Speed Booster

A browser extension that automatically skips YouTube ads and plays them at 10x speed to get through them faster.

## Features

- **Automatic Ad Detection**: Detects when a YouTube ad is playing
- **10x Playback Speed**: Speeds up ads to 10x normal speed
- **Auto-Skip**: Automatically clicks the "Skip Ad" button as soon as it appears
- **Speed Restoration**: Returns to normal playback speed after ads finish

## Installation

### Chrome/Edge/Brave

1. Download or clone this extension folder
2. Open your browser and navigate to:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`
   - **Brave**: `brave://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the `ad-skipper-extension` folder
6. The extension is now installed!

### Firefox

1. Download or clone this extension folder
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to the extension folder and select `manifest.json`
5. The extension is now installed (temporarily)

**Note**: For permanent installation in Firefox, you'll need to sign the extension through Mozilla's Add-on Developer Hub.

## How It Works

The extension monitors YouTube pages for ads and:

1. Detects ad playback using multiple indicators
2. Saves your current playback speed
3. Sets video speed to 10x during ads
4. Automatically clicks the skip button when available
5. Restores normal speed when the ad ends

## Icons

To complete the installation, you'll need to add icons. You can:
- Create simple PNG icons (16x16, 48x48, 128x128 pixels)
- Or remove the `icons` section from `manifest.json`

## Browser Compatibility

- ✅ Chrome
- ✅ Edge
- ✅ Brave
- ✅ Opera
- ⚠️ Firefox (requires minor manifest adjustments for permanent installation)

## Privacy

This extension:
- Only runs on YouTube pages
- Does not collect any data
- Does not make external network requests
- All processing happens locally in your browser

## Disclaimer

This extension is for educational purposes. Use responsibly and consider supporting content creators through YouTube Premium or other means.

## License

MIT License - feel free to modify and distribute as needed.
