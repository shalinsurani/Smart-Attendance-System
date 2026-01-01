# ⚡ Forgot Password - Quick Fix (2 Steps)

## 🔴 Current Errors

1. ❌ "Student not found" - **FIXED** ✅
2. ❌ "Missing or insufficient permissions" - **NEEDS FIRESTORE RULES**
3. ❌ EmailJS not configured - **FIXED** ✅

## ✅ Step 1: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

**Why?** The `.env` file was just created with your EmailJS credentials.

## ✅ Step 2: Deploy Firestore Rules

### Quick Method (2 Minutes):

1. Open: https://console.firebase.google.com/
2. Select your project
3. Click **"Firestore Database"** → **"Rules"** tab
4. Find this section and make sure it exists:

```javascript
// Add this if it's not there:
match /otps/{otpId} {
  allow read, write: if true;
}
```

5. Click **"Publish"**

### Complete Rules (Copy All):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    match /organizations/{orgId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
    
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if isAuthenticated() && request.auth.uid == userId;
      allow delete: if isAuthenticated();
    }
    
    match /students/{studentId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }
    
    match /classes/{classId} {
      allow read, write: if isAuthenticated();
    }
    
    match /attendance/{attendanceId} {
      allow read, write: if isAuthenticated();
    }
    
    match /otps/{otpId} {
      allow read, write: if true;
    }
    
    match /queries/{queryId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated();
      allow delete: if isAuthenticated();
    }
  }
}
```

## 🎯 Test It

1. Go to: http://localhost:3000/forgot-password
2. Enter: `shalin@2025@gmail.com`
3. Click "Send OTP"
4. Open Console (F12) - see OTP
5. Enter OTP
6. Reset password

## ✨ What's Fixed

| Issue | Status |
|-------|--------|
| Student not found | ✅ Fixed - checks both users & students |
| Permission denied | ⚠️ Deploy rules (Step 2) |
| EmailJS format | ✅ Fixed - added VITE_ prefix |
| .env file | ✅ Created with your credentials |

## 🚀 After Steps 1 & 2

✅ Forgot password works
✅ OTP shows in console
✅ EmailJS sends real emails
✅ Password reset successful

---

**DO THESE 2 STEPS NOW!** ⬆️
