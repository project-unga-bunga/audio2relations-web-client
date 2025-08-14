# Audio Recorder App

A simple Angular Capacitor application for recording audio with a clean, modern UI.

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
