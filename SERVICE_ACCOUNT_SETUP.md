# 🔐 Firebase Service Account Setup for GitHub Actions

## 🎯 **What You Need:**

### **Firebase App ID:**
```
1:436143522639:android:db7298d0eaf13d260a3b3a
```

### **GitHub Secrets Required:**
1. **`FIREBASE_APP_ID`**: `1:436143522639:android:db7298d0eaf13d260a3b3a`
2. **`FIREBASE_SERVICE_ACCOUNT_KEY`**: Service account JSON content

## 🚀 **Step-by-Step Setup:**

### **1. Go to Google Cloud Console:**
Visit: https://console.cloud.google.com/project/audio2relations-app

### **2. Navigate to Service Accounts:**
- Go to **IAM & Admin** → **Service Accounts**
- Click **"Create Service Account"**

### **3. Create Service Account:**
- **Name**: `firebase-github-actions`
- **Description**: `Service account for GitHub Actions Firebase deployment`
- Click **"Create and Continue"**

### **4. Grant Permissions:**
- **Role**: `Firebase Admin` (or `Firebase App Distribution Admin`)
- Click **"Continue"**

### **5. Create Key:**
- Click **"Done"**
- Find your service account in the list
- Click **"Manage keys"** → **"Add Key"** → **"Create new key"**
- Choose **JSON** format
- Click **"Create"**

### **6. Download and Secure:**
- The JSON file will download automatically
- **Keep this file secure!** Never commit it to git
- Copy the entire content of this JSON file

### **7. Add to GitHub Secrets:**
In your GitHub repository:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add **`FIREBASE_SERVICE_ACCOUNT_KEY`** with the JSON content
3. Add **`FIREBASE_APP_ID`** with `1:436143522639:android:db7298d0eaf13d260a3b3a`

## ✅ **What You'll Get:**

- **Automatic APK builds** on every push
- **Instant Firebase distribution** to testers
- **Email notifications** when new builds are ready
- **Download links** for testing on real devices

## 🧪 **Test the Setup:**

Once secrets are added:
1. **Push code** to trigger GitHub Actions
2. **Watch the workflow** build and deploy APK
3. **Check your email** for Firebase download link
4. **Install APK** on your device for testing

## 🔗 **Useful Links:**

- [Firebase Console](https://console.firebase.google.com/project/audio2relations-app)
- [Google Cloud Console](https://console.cloud.google.com/project/audio2relations-app)
- [GitHub Actions](https://github.com/project-unga-bunga/audio2relations-web-client/actions)

## 🎉 **Ready to Deploy!**

Your Firebase App Distribution is now set up and ready to automatically deploy APKs for instant testing! 🚀📱
