# Version Management System

This document explains how to use the version management system for the audio2relations app.

## Overview

The version management system provides:
- **Semantic versioning** (X.Y.Z format)
- **Automatic build number increments**
- **Android version code management**
- **Firebase distribution versioning**
- **Git commit tracking**
- **Build date tracking**

## Version Components

### 1. Semantic Version (X.Y.Z)
- **X** - Major version (breaking changes)
- **Y** - Minor version (new features, backward compatible)
- **Z** - Patch version (bug fixes)

### 2. Build Number
- Increments automatically with each build
- Used in Firebase distribution
- Format: X.Y.Z-B (e.g., 1.0.0-15)

### 3. Version Code (Android)
- Must always increase for each release
- Used by Google Play Store
- Must be unique and incrementing

## Configuration Files

### `version.config.js`
Central configuration file containing all version information:
```javascript
module.exports = {
  version: '1.0.0',           // Semantic version
  buildNumber: 1,             // Build number
  versionCode: 1,             // Android version code
  buildDate: '...',           // Auto-generated
  gitCommit: '',              // Auto-populated
  environment: 'development',  // Build environment
  appId: 'com.audio2relation.app',
  appName: 'audio2relations-web-client'
};
```

## Available Scripts

### Version Management
```bash
# Show current version information
npm run version:show

# Increment build number and version code
npm run version:increment

# Generate version files for build
npm run build:version
```

### Build Commands
```bash
# Build with version generation
npm run build

# Production build with version generation
npm run build:prod

# Android build with version updates
npm run build:android

# Android release build with version updates
npm run build:android:release
```

### Firebase Deployment
```bash
# Deploy to Firebase with automatic version increment
npm run deploy:firebase
```

## Workflow

### 1. Development
1. Make code changes
2. Commit to git
3. Run `npm run build` (automatically generates version files)

### 2. Release Preparation
1. Update semantic version in `version.config.js` if needed
2. Run `npm run version:increment` to increment build number
3. Build the app: `npm run build:android:release`

### 3. Firebase Distribution
1. Run `npm run deploy:firebase`
2. This automatically:
   - Increments build number
   - Updates all version files
   - Builds the Android APK
   - Distributes via Firebase App Distribution

## Version Display

### In-App Version Display
Use the `VersionDisplayComponent` to show version information:

```typescript
// Compact display
<app-version-display displayMode="compact"></app-version-display>

// Detailed display
<app-version-display displayMode="detailed"></app-version-display>

// Firebase format
<app-version-display displayMode="firebase"></app-version-display>

// Badge format
<app-version-display displayMode="badge"></app-version-display>
```

### Version Service
Inject the `VersionService` to access version information programmatically:

```typescript
constructor(private versionService: VersionService) {}

// Get full version info
const versionInfo = this.versionService.getVersionInfo();

// Get specific values
const version = this.versionService.getVersion();
const buildNumber = this.versionService.getBuildNumber();
const firebaseVersion = this.versionService.getVersionForFirebase();
```

## Firebase Integration

### Version Visibility
- **Version string**: Visible to testers in Firebase App Distribution
- **Build number**: Included in release notes
- **Version code**: Used for APK identification

### Release Notes
The Firebase deployment script automatically generates release notes:
```
Version 1.0.0 (Build 15)
```

## Android Integration

### Version Updates
The system automatically updates:
- `android/variables.gradle`
- `android/app/build.gradle`
- `capacitor.config.ts`

### Play Store Requirements
- **versionCode**: Must always increase
- **versionName**: User-visible version string
- **packageId**: Unique app identifier

## Troubleshooting

### Common Issues

1. **Version not updating**
   - Check if `version.config.js` exists
   - Ensure scripts have execute permissions
   - Verify git repository is accessible

2. **Android build errors**
   - Run `npm run build:version` first
   - Check `android/variables.gradle` values
   - Verify `android/app/build.gradle` references

3. **Firebase deployment issues**
   - Ensure `FIREBASE_APP_ID` environment variable is set
   - Check Firebase project configuration
   - Verify APK build success

### Manual Version Updates
If automatic updates fail, manually update:
1. `version.config.js`
2. `package.json`
3. `android/variables.gradle`
4. `android/app/build.gradle`

## Best Practices

1. **Always increment version code** for Android releases
2. **Use semantic versioning** for meaningful version numbers
3. **Test version display** in different app areas
4. **Document breaking changes** in major version updates
5. **Keep git commits clean** for accurate commit hash tracking

## File Structure

```
scripts/
├── version-manager.js          # Version increment logic
├── build-version.js            # Build-time version generation
└── update-android-version.js   # Android version updates

src/
├── app/
│   ├── services/
│   │   └── version.service.ts  # Version service
│   ├── components/
│   │   └── version-display.component.ts  # Version display component
│   └── pages/
│       └── version-info.page.ts # Version info page
└── assets/
    └── version.json            # Generated version file (build time)

android/
├── variables.gradle            # Android version variables
└── app/build.gradle           # Android build configuration
```

## Environment Variables

Set these for production builds:
```bash
export NODE_ENV=production
export FIREBASE_APP_ID=your_firebase_app_id
```

## Support

For issues with the versioning system:
1. Check this README
2. Review script output for errors
3. Verify file permissions and git access
4. Check Android build configuration
