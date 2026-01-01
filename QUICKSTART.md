# VisionAttend - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)
```bash
npm install
```

### Step 2: Firebase Setup (2 min)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com
   - Click "Add Project"
   - Enter project name: "VisionAttend"
   - Disable Google Analytics (optional)
   - Click "Create Project"

2. **Enable Services**
   - **Authentication**: 
     - Go to Authentication → Get Started
     - Enable "Email/Password"
   
   - **Firestore**:
     - Go to Firestore Database → Create Database
     - Start in "Test Mode" (we'll deploy rules later)
     - Choose location closest to you
   
   - **Storage**:
     - Go to Storage → Get Started
     - Start in "Test Mode"

3. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click Web icon (</>)
   - Register app name: "VisionAttend"
   - Copy the firebaseConfig object

4. **Update Config**
   - Open `src/config/firebase.js`
   - Replace the config with your values

### Step 3: Download Face Models (1 min)

```bash
# Create models directory
mkdir -p public/models

# Download models (or manually from GitHub)
# https://github.com/justadudewhohacks/face-api.js-models
```

**Required Models:**
- tiny_face_detector_model
- face_landmark_68_model
- face_recognition_model
- ssd_mobilenetv1_model

Place all model files in `public/models/`

### Step 4: Run the App (1 min)

```bash
npm run dev
```

Open http://localhost:3000

### Step 5: Test the App

1. **Register Organization**
   - Click "Register Organization"
   - Fill in details
   - Submit

2. **Add a Teacher**
   - Login as admin
   - Go to "Manage Teachers"
   - Add teacher with email/password

3. **Login as Teacher**
   - Logout
   - Login with teacher credentials

4. **Add Students**
   - Go to "Manage Students"
   - Add student details
   - Click "Enroll Face"
   - Capture face

5. **Take Attendance**
   - Create a class first
   - Go to "Start Attendance"
   - Select class
   - Start session
   - Scan faces

## 🎯 You're Ready!

The app is now fully functional. Check out:
- `USAGE_GUIDE.md` for detailed usage instructions
- `DEPLOYMENT.md` for production deployment
- `README.md` for complete documentation

## ⚡ Quick Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Firebase
firebase deploy
```

## 🔧 Troubleshooting

**Camera not working?**
- Use Chrome browser
- Allow camera permissions
- Use HTTPS or localhost

**Models not loading?**
- Check `public/models/` directory
- Verify all model files are present
- Check browser console for errors

**Firebase errors?**
- Verify config in `src/config/firebase.js`
- Check Firebase Console for enabled services
- Ensure Firestore and Auth are active

## 📞 Need Help?

Check the detailed guides:
- Technical issues → README.md
- Usage questions → USAGE_GUIDE.md
- Deployment help → DEPLOYMENT.md

Happy coding! 🎉
