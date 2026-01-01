# 🚨 Fix Forgot Password - URGENT STEPS

## Issues Fixed

✅ EmailJS credentials format corrected
✅ Student lookup fixed (checks both users and students collections)
⚠️ **MUST DEPLOY FIRESTORE RULES** (see below)

## Step 1: Restart Dev Server (REQUIRED)

The `.env` file has been created with your EmailJS credentials. You MUST restart the dev server:

```bash
# Press Ctrl+C to stop the current server
# Then restart:
npm run dev
```

## Step 2: Deploy Firestore Rules (CRITICAL)

The "Missing or insufficient permissions" error means you need to deploy the Firestore rules.

### Option A: Firebase Console (Easiest - 2 Minutes)

1. **Open Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Click "Firestore Database"** in left sidebar
4. **Click "Rules" tab** at the top
5. **Copy and paste these rules** (replace everything):

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
    
    // CRITICAL: Allow OTP operations without authentication
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

6. **Click "Publish"** button
7. **Wait for "Rules published successfully"** message

### Option B: Firebase CLI (If Installed)

```bash
firebase deploy --only firestore:rules
```

## Step 3: Test Forgot Password

After completing Steps 1 and 2:

1. Go to: http://localhost:3000/forgot-password
2. Enter email: `shalin@2025@gmail.com` (or any student email)
3. Click "Send OTP"
4. Check browser console (F12) for the OTP
5. Enter the OTP
6. Complete the password reset

## What Was Fixed

### 1. EmailJS Configuration
**Before:**
```
SERVICE_ID=service_fyvi50a
TEMPLATE_ID=template_ajg3gzz
PUBLIC_KEY=TCNLLP-DLDPb2OkvL
```

**After (in .env file):**
```
VITE_EMAILJS_SERVICE_ID=service_fyvi50a
VITE_EMAILJS_TEMPLATE_ID=template_ajg3gzz
VITE_EMAILJS_PUBLIC_KEY=TCNLLP-DLDPb2OkvL
```

The `VITE_` prefix is required for Vite to expose these variables to the browser.

### 2. Student Lookup
Now checks both:
- `users` collection (for staff)
- `students` collection (for students)

### 3. Firestore Rules
Added OTP collection rules to allow unauthenticated access for password reset.

## Expected Results

### Before Fixes:
❌ "Student not found" error
❌ "Missing or insufficient permissions" error
❌ EmailJS not working

### After Fixes:
✅ Finds students by email
✅ OTP stored in Firestore
✅ OTP displayed in console
✅ EmailJS sends real emails (if configured)
✅ Password reset works

## Troubleshooting

### Still Getting "Student not found"?
- Make sure the email exists in either `users` or `students` collection
- Check Firebase Console → Firestore Database → students collection
- Verify the email is spelled correctly

### Still Getting "Permission denied"?
- **You MUST deploy the Firestore rules** (Step 2 above)
- This is the most common issue
- Rules in your local file don't apply until deployed

### OTP Not Showing?
- Open browser console (F12)
- Look for the OTP message
- If EmailJS is configured, check your email inbox/spam

### EmailJS Not Sending?
- Make sure you restarted the dev server (Step 1)
- Check that `.env` file exists with correct format
- Verify EmailJS credentials are correct

## Quick Checklist

- [ ] `.env` file created with EmailJS credentials
- [ ] Dev server restarted (`npm run dev`)
- [ ] Firestore rules deployed via Firebase Console
- [ ] Tested forgot password with student email
- [ ] OTP appears in console
- [ ] Password reset successful

## Next Steps

Once everything works:
1. Test with different user types (students, teachers, admins)
2. Verify email sending (if EmailJS configured)
3. Test OTP expiration (wait 5 minutes)
4. Test invalid OTP rejection

---

**IMPORTANT**: You MUST complete Steps 1 and 2 for the forgot password to work!
