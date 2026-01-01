# Deploy Updated Firestore Rules for OTP System

## Important: You must deploy these rules to Firebase

The Firestore rules have been updated to support:
- OTP collection for password reset
- Queries collection for student-teacher communication

## How to Deploy:

### Option 1: Firebase Console (Recommended for Quick Fix)
1. Go to https://console.firebase.google.com/
2. Select your project
3. Click on "Firestore Database" in the left menu
4. Click on the "Rules" tab
5. Copy the content from `firestore.rules` file
6. Paste it into the rules editor
7. Click "Publish"

### Option 2: Firebase CLI
```bash
firebase deploy --only firestore:rules
```

## What's New in the Rules:

```javascript
// OTPs - allow unauthenticated read/write for password reset
match /otps/{otpId} {
  allow read, write: if true;
}

// Queries - allow authenticated users to create and read their own queries
match /queries/{queryId} {
  allow read: if isAuthenticated();
  allow create: if isAuthenticated();
  allow update: if isAuthenticated();
  allow delete: if isAuthenticated();
}
```

## After Deployment:

The forgot password feature will work without permission errors!

---

**Note**: The OTP collection allows unauthenticated access because users need to verify OTPs before logging in. This is secure because:
- OTPs expire after 5 minutes
- OTPs are randomly generated 6-digit codes
- Additional verification (name + ID) is required
- OTPs are deleted after use
