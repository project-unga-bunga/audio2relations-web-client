# 🚀 GitHub Actions CI/CD Pipeline

This document explains the complete GitHub Actions setup for your Audio Recorder app.

## 📋 **Available Workflows:**

### **1. 🔥 Firebase Deploy Workflow** (`.github/workflows/firebase-deploy.yml`)
**Triggers:** Push to main/develop, Pull Requests, Manual dispatch
**Purpose:** Builds and deploys APKs to Firebase App Distribution

**Features:**
- ✅ **Multi-stage pipeline**: Test → Build → Deploy
- ✅ **Environment selection**: Choose testers/qa/developers
- ✅ **Dual APK builds**: Debug + Release versions
- ✅ **Smart caching**: Gradle and Android build caching
- ✅ **PR comments**: Automatic notifications on PRs
- ✅ **Manual triggers**: Deploy to specific environments

**Manual Deployment:**
```bash
# Go to Actions tab → Firebase Deploy → Run workflow
# Select environment: testers, qa, or developers
```

### **2. 🧪 CI Workflow** (`.github/workflows/ci.yml`)
**Triggers:** Push to main/develop, Pull Requests
**Purpose:** Code quality, testing, and build verification

**Stages:**
- **Lint**: Code quality checks
- **Test**: Unit tests with coverage
- **Build**: Angular app compilation
- **Security**: Dependency audits
- **Android Build**: APK compilation test

**Benefits:**
- 🚫 **Blocks bad code** from merging
- 📊 **Code coverage** reporting
- 🔒 **Security scanning** for vulnerabilities
- 📱 **Android build** verification

### **3. 🏷️ Release Workflow** (`.github/workflows/release.yml`)
**Triggers:** GitHub Release published
**Purpose:** Creates releases with signed APKs

**Features:**
- 📱 **APK upload** to GitHub releases
- 🔥 **Firebase deployment** for testing
- 🔐 **APK signing** (if keystore configured)
- 📝 **Release notes** integration

**Usage:**
1. Create a new release in GitHub
2. Add release notes
3. Publish release
4. Workflow automatically builds and distributes APK

## ⚙️ **Configuration Files:**

### **Firebase Config** (`firebase.json`)
```json
{
  "appdistribution": {
    "app": "your-firebase-app-id",
    "groups": "testers",
    "releaseNotes": "Auto-deployed from GitHub Actions"
  }
}
```



## 🔐 **Required Secrets:**

### **Firebase:**
- `FIREBASE_APP_ID`: Your Firebase App ID
- `FIREBASE_SERVICE_ACCOUNT_KEY`: Service account JSON content

### **Android Signing (Optional):**
- `ANDROID_SIGNING_KEY`: Base64 encoded keystore
- `ANDROID_ALIAS`: Keystore alias
- `ANDROID_KEY_STORE_PASSWORD`: Keystore password
- `ANDROID_KEY_PASSWORD`: Key password

## 🎯 **Workflow Triggers:**

### **Automatic:**
- **Push to main/develop** → Firebase deploy + CI
- **Pull Request** → CI only (no Firebase deploy)
- **Release published** → Release workflow

### **Manual:**
- **Firebase Deploy** → Choose environment and deploy
- **CI** → Re-run specific stages

## 📱 **APK Distribution:**

### **Firebase App Distribution:**
- 🚀 **Instant download links**
- 📧 **Email notifications** to testers
- 📊 **Download analytics**
- 🔄 **Automatic updates**

### **GitHub Releases:**
- 📱 **APK attachments** to releases
- 🔐 **Signed APKs** (if configured)
- 📝 **Release notes** integration

## 🚨 **Troubleshooting:**

### **Build Failures:**
1. Check **Android SDK** setup in workflow
2. Verify **Java version** (17+)
3. Check **Capacitor sync** logs
4. Review **Gradle cache** issues

### **Firebase Deploy Failures:**
1. Verify **FIREBASE_APP_ID** secret
2. Check **service account** JSON content
3. Ensure **App Distribution** is enabled
4. Review **Firebase console** for errors

### **CI Failures:**
1. Check **test failures** in logs
2. Verify **linting** rules
3. Review **security audit** results
4. Check **build** compilation errors

## 🔄 **Development Workflow:**

### **Daily Development:**
1. **Push code** → Triggers CI
2. **Create PR** → Full testing
3. **Merge to main** → Auto-deploy to Firebase
4. **Test APK** → Download from Firebase

### **Release Process:**
1. **Create release** in GitHub
2. **Add release notes**
3. **Publish release** → Triggers release workflow
4. **APK available** in GitHub release + Firebase

## 📊 **Monitoring:**

### **GitHub Actions:**
- 📈 **Workflow success rates**
- ⏱️ **Build times** and performance
- 🔍 **Detailed logs** for debugging

### **Firebase Console:**
- 📱 **APK distribution** status
- 👥 **Tester groups** and access
- 📊 **Download metrics**

## 🎉 **Benefits:**

- 🚀 **Zero manual work** - Everything automated
- 📱 **Instant APK distribution** - Test on real devices
- 🔒 **Secure deployment** - Proper signing and permissions
- 📊 **Full visibility** - Build status and metrics
- 🔄 **Continuous delivery** - Always up-to-date builds

## 🚀 **Getting Started:**

1. **Push this code** to GitHub
2. **Set up Firebase** App Distribution
3. **Add GitHub secrets** for Firebase
4. **Watch the magic happen!**

Every push will automatically build and deploy your APK for instant testing! 🎯
