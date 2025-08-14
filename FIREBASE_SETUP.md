# 🔥 Firebase App Distribution Setup

This guide will help you set up Firebase App Distribution for instant APK downloads.

## 🚀 **Quick Setup Steps:**

### **1. Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing project
3. Enable "App Distribution" in the left sidebar

### **2. Add Android App**
1. Click "Add app" → Android
2. Enter package name: `com.audio2relation.app`
3. Enter app nickname: `Audio Recorder`
4. Click "Register app"

### **3. Get Firebase App ID**
1. In App Distribution, note your **App ID** (looks like: `1:123456789:android:abcdef`)
2. Update `firebase.json` with this ID

### **4. Create Service Account**
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. **Keep this file secure!**

### **5. Add GitHub Secrets**
In your GitHub repository, go to Settings → Secrets and variables → Actions:

- **`FIREBASE_APP_ID`**: Your Firebase App ID
- **`FIREBASE_SERVICE_ACCOUNT_KEY`**: Content of the downloaded JSON file

### **6. Update firebase.json**
Replace `your-firebase-app-id-here` with your actual Firebase App ID:

```json
{
  "appdistribution": {
    "app": "1:123456789:android:abcdef",
    "groups": "testers",
    "release_notes": "Auto-deployed from GitHub Actions"
  }
}
```

## 📱 **How It Works:**

1. **Push to GitHub** → Triggers workflow
2. **Builds APK** → Angular + Capacitor + Android
3. **Deploys to Firebase** → Instant download link
4. **Testers notified** → Email with download link

## 🎯 **Test Groups:**

- **`testers`** - Default group for all testers
- **`qa`** - Quality assurance team
- **`developers`** - Development team

## 🚨 **Troubleshooting:**

### **Build Fails:**
- Check Android SDK setup in workflow
- Verify Java version (17+)
- Check Capacitor sync

### **Firebase Deploy Fails:**
- Verify `FIREBASE_APP_ID` secret
- Check service account JSON content
- Ensure App Distribution is enabled

### **APK Not Downloading:**
- Check Firebase console for build status
- Verify tester email addresses
- Check app signing configuration

## 🔗 **Useful Links:**

- [Firebase App Distribution Docs](https://firebase.google.com/docs/app-distribution)
- [GitHub Actions Setup](https://docs.github.com/en/actions)
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)

## ✨ **Benefits:**

- 🚀 **Instant APK distribution**
- 📱 **Real device testing**
- 🔄 **Automatic builds**
- 📧 **Email notifications**
- 📊 **Download analytics**
