# Audio Recorder App

[![CI - Code Quality & Testing](https://github.com/project-unga-bunga/audio2relations-web-client/workflows/CI%20-%20Code%20Quality%20%26%20Testing/badge.svg)](https://github.com/project-unga-bunga/audio2relations-web-client/actions/workflows/ci.yml)
[![Firebase Deploy](https://github.com/project-unga-bunga/audio2relations-web-client/workflows/Deploy%20to%20Firebase%20App%20Distribution/badge.svg)](https://github.com/project-unga-bunga/audio2relations-web-client/actions/workflows/firebase-deploy.yml)
[![Release](https://github.com/project-unga-bunga/audio2relations-web-client/workflows/Release/badge.svg)](https://github.com/project-unga-bunga/audio2relations-web-client/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=flat&logo=angular&logoColor=white)](https://angular.io/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=flat&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

A simple Angular Capacitor application for recording audio with a clean, modern UI.

## 📊 Pipeline Status

The badges above show the current status of our CI/CD pipelines:

- **CI - Code Quality & Testing**: Runs on every push/PR to ensure code quality, run tests, and check security
- **Firebase Deploy**: Automatically deploys to Firebase App Distribution for testing
- **Release**: Handles the release process and creates GitHub releases with APKs
- **License**: MIT license badge
- **Tech Stack**: Angular and Capacitor framework badges

## Features

- 🎤 Record audio using device microphone
- ⏹️ Stop recording at any time
- ▶️ Play back recorded audio
- 📱 Responsive design for mobile and desktop
- 🔒 Secure microphone access with proper permissions

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- For mobile development: Xcode (iOS) or Android Studio

### Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Sync with Capacitor
npx cap sync
```

### Development

```bash
# Start development server
npm start

# Build for production
npm run build
```

### Mobile Development

```bash
# Open in iOS Simulator
npx cap open ios

# Open in Android Studio
npx cap open android
```

## Deployment

### Web Deployment

The app is ready for web deployment. After building:

```bash
npm run build
```

The built files are in `dist/audio-recorder/browser/` and can be deployed to any static hosting service.

### Mobile Deployment

1. **iOS**: Open `ios/App.xcworkspace` in Xcode and deploy to App Store
2. **Android**: Open `android/` in Android Studio and build APK/AAB

## File Structure

```
src/
├── app/
│   ├── app.ts          # Main audio recorder component
│   ├── app.config.ts   # Angular configuration
│   └── app.html        # HTML template
├── main.ts             # Application entry point
└── styles.css          # Global styles

capacitor.config.ts      # Capacitor configuration
```

## Permissions

The app requests microphone access for audio recording. On mobile devices, ensure:

- **iOS**: Add `NSMicrophoneUsageDescription` to `Info.plist`
- **Android**: Add `RECORD_AUDIO` permission to `AndroidManifest.xml`

## Browser Support

- Chrome 47+
- Firefox 25+
- Safari 11+
- Edge 12+

## License

MIT
