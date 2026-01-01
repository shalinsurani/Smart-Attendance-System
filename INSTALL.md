# VisionAttend - Installation Instructions

## Prerequisites Check

Before starting, ensure you have:
- [ ] Node.js 16 or higher installed
- [ ] npm or yarn package manager
- [ ] A Firebase account (free tier works)
- [ ] A modern web browser (Chrome recommended)
- [ ] Webcam/camera for face recognition

Check Node.js version:
```bash
node --version
# Should show v16.0.0 or higher
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages:
- React and React DOM
- Redux Toolkit
- React Router
- Firebase SDK
- face-api.js
- Chart.js
- Tailwind CSS
- And more...

**Expected time**: 2-3 minutes

### 2. Firebase Project Setup

#### A. Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project" or "Create a project"
3. Enter project name: `visionattend` (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create project"
6. Wait for project creation (30 seconds)

#### B. Enable Authentication
1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Email/Password" under Sign-in method
4. Toggle "Enable" switch
5. Click "Save"

#### C. Create Firestore Database
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in test mode" (we'll deploy rules later)
4. Choose your location (closest to your users)
5. Click "Enable"
6. Wait for database creation

#### D. Enable Storage
1. Click "Storage" in left sidebar
2. Click "Get started"
3. Click "Next" (keep default rules)
4. Choose same location as Firestore
5. Click "Done"

#### E. Get Configuration
1. Click gear icon (⚙️) → "Project settings"
2. Scroll down to "Your apps"
3. Click web icon `</>`
4. Enter app nickname: "VisionAttend Web"
5. Don't check "Firebase Hosting"
6. Click "Register app"
7. Copy the `firebaseConfig` object

#### F. Update Application Config
1. Open `src/config/firebase.js` in your code editor
2. Replace the placeholder config with your values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```

3. Save the file

### 3. Download Face Recognition Models

#### Option A: Manual Download (Recommended)
1. Go to: https://github.com/justadudewhohacks/face-api.js-models
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Copy these files to `public/models/`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`
   - `face_landmark_68_model-weights_manifest.json`
   - `face_landmark_68_model-shard1`
   - `face_recognition_model-weights_manifest.json`
   - `face_recognition_model-shard1`
   - `ssd_mobilenetv1_model-weights_manifest.json`
   - `ssd_mobilenetv1_model-shard1`
   - `ssd_mobilenetv1_model-shard2`

#### Option B: Using wget (Linux/Mac)
```bash
cd public/models

# Download all required models
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/ssd_mobilenetv1_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/ssd_mobilenetv1_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/ssd_mobilenetv1_model-shard2

cd ../..
```

### 4. Deploy Firebase Security Rules

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select your project)
firebase init

# Select:
# - Firestore
# - Hosting (optional)
# - Storage

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 5. Run the Application

```bash
npm run dev
```

The app will open at: http://localhost:3000

## Verification Checklist

After installation, verify:

- [ ] App loads without errors
- [ ] Can access registration page
- [ ] Firebase connection working (no console errors)
- [ ] Camera permission prompt appears
- [ ] Face models load successfully

Check browser console (F12) for any errors.

## Common Installation Issues

### Issue: npm install fails
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Firebase config errors
**Solution:**
- Double-check all values in `src/config/firebase.js`
- Ensure no extra quotes or spaces
- Verify project ID matches Firebase Console

### Issue: Models not loading
**Solution:**
- Check `public/models/` directory exists
- Verify all 9 model files are present
- Check file names match exactly (case-sensitive)
- Clear browser cache

### Issue: Camera not working
**Solution:**
- Use Chrome or Firefox browser
- Allow camera permissions when prompted
- Check if camera works in other apps
- Use HTTPS or localhost (required for camera access)

### Issue: Port 3000 already in use
**Solution:**
```bash
# Use different port
npm run dev -- --port 3001
```

## Next Steps

After successful installation:

1. **Test the app**: Follow QUICKSTART.md
2. **Learn usage**: Read USAGE_GUIDE.md
3. **Deploy**: Follow DEPLOYMENT.md

## Getting Help

If you encounter issues:

1. Check browser console (F12) for errors
2. Review Firebase Console for service status
3. Verify all installation steps completed
4. Check that models are in correct location
5. Ensure Firebase config is correct

## System Requirements

**Minimum:**
- 4GB RAM
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+)
- Webcam (for face recognition)
- Internet connection

**Recommended:**
- 8GB RAM
- Chrome browser (best compatibility)
- Good lighting for camera
- Stable internet connection

---

**Installation Complete!** 🎉

You're ready to use VisionAttend. Start with QUICKSTART.md for a guided tour.
