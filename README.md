# BG Remover - Chrome Extension

A Chrome extension that removes backgrounds from images directly in your browser using AI. All processing happens locally — your images never leave your device.

Built with Transformers.js, React, and Vite. Packaged as a Manifest V3 Chrome extension.

## Features

- One-click background removal for images
- Right-click any image on any webpage to remove its background
- Custom background color and image selection
- Download options for both transparent and colored backgrounds
- Local processing — no server uploads
- Optional WebGPU acceleration for supported browsers

## Extension Architecture

```
extension (dist/)
├── manifest.json          # Manifest V3 configuration
├── background.js          # Service worker (context menu, tab management)
├── index.html             # Main app page (opened as new tab)
├── assets/                # Built JS/CSS bundles
│   ├── index-*.js
│   ├── index-*.css
│   ├── vendor-*.js        # React bundle
│   └── transformers-*.js  # ML model runtime
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── hero.png               # App hero image
└── favicon.ico
```

### Components

| Part | File | Purpose |
|------|------|---------|
| **Service Worker** | `background.js` | Handles extension icon click (opens app tab), right-click context menu, and message passing |
| **App Page** | `index.html` + `assets/` | The full React application rendered in a new tab |
| **Core Logic** | `assets/transformers-*.js` | ML model loading and image processing via Transformers.js |

### How It Works

1. **Click the extension icon** — Opens the BG Remover app in a new tab
2. **Right-click any image** on any webpage → "Remove Background with BG Remover" — Opens the app and auto-processes that image
3. **Drag & drop / paste / click to upload** images within the app
4. The ML model (RMBG-1.4 or MODNet) runs entirely in-browser via WebAssembly or WebGPU

## Installation (Load Unpacked)

### Prerequisites

- Node.js 18+
- npm

### Build

```bash
# Install dependencies
npm install

# Build the extension
npm run build
```

This produces a `dist/` folder containing the loadable extension.

### Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `dist/` folder from this project
5. The BG Remover extension icon will appear in your toolbar

### Usage

- **Click the extension icon** in the toolbar to open the app
- **Right-click any image** on a webpage and select "Remove Background with BG Remover"
- Drop, paste, or select images in the app to process them

## Development

```bash
# Start dev server (for web development, not extension)
npm run dev

# Build for extension
npm run build

# Lint
npm run lint
```

## Permissions

The extension requests these permissions:

| Permission | Reason |
|-----------|--------|
| `contextMenus` | Adds "Remove Background" right-click option on images |
| `storage` | Temporarily stores image data between context menu click and app tab opening |
| `activeTab` | Access to the current tab for context menu actions |
| `host_permissions` (huggingface.co, unsplash.com) | Downloads ML models and sample images |

### Content Security Policy

The extension uses `wasm-unsafe-eval` in its CSP to allow WebAssembly compilation for the ML models. This is required by ONNX Runtime Web / Transformers.js and is the minimum-privilege directive needed (it does NOT allow arbitrary JavaScript execution).

## Technical Stack

- **React 18** + **Vite** — Frontend framework and build tool
- **Transformers.js** — ML model inference in the browser
- **RMBG-1.4** — Default cross-browser background removal model (WebAssembly)
- **MODNet** — Optional WebGPU-accelerated model
- **TailwindCSS** — Styling
- **Manifest V3** — Chrome extension platform

## Credits

Based on the [WebGPU background removal demo](https://github.com/huggingface/transformers.js-examples/tree/main/remove-background-webgpu) by [@xenova](https://github.com/xenova)

## Reference

Ported from [addyosmani/bg-remove: Free image background removal - private, client-side and powered by Transformers.js](https://github.com/addyosmani/bg-remove )

## License

MIT License
