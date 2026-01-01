# VisionAttend - Troubleshooting Guide

## 🔧 Common Issues & Solutions

### Installation Issues

#### Issue: npm install fails
**Symptoms:**
- Error messages during installation
- Missing dependencies
- Version conflicts

**Solutions:**
```bash
# Solution 1: Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Solution 2: Use specific Node version
nvm use 16
npm install

# Solution 3: Try yarn instead
yarn install
```

#### Issue: Python/node-gyp errors
**Symptoms:**
- Build errors mentioning Python
- node-gyp failures

**Solutions:**
```bash
# Windows
npm install --global windows-build-tools

# Mac
xcode-select --install

# Linux
sudo apt-get install build-essential
```

---

### Firebase Configuration Issues

#### Issue: Firebase not connecting
**Symptoms:**
- "Firebase: Error (auth/invalid-api-key)"
- Network errors in console
- Authentication not working

**Solutions:**
1. **Verify Firebase Config**
   ```javascript
   // Check src/config/firebase.js
   // Ensure all values are correct
   // No extra quotes or spaces
   ```

2. **Check Firebase Console**
   - Verify project exists
   - Check Authentication is enabled
   - Verify Firestore is created
   - Check Storage is enabled

3. **Check API Key**
   - Go to Firebase Console → Project Settings
   - Regenerate API key if needed
   - Update in config file

#### Issue: Firestore permission denied
**Symptoms:**
- "Missing or insufficient permissions"
- Cannot read/write data

**Solutions:**
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Or temporarily use test mode (development only)
# In Firebase Console → Firestore → Rules
# Set to test mode for 30 days
```

#### Issue: Storage permission denied
**Symptoms:**
- Cannot upload images
- Storage errors

**Solutions:**
```bash
# Deploy storage rules
firebase deploy --only storage

# Check rules in Firebase Console
```

---

### Face Recognition Issues

#### Issue: Models not loading
**Symptoms:**
- Console error: "Failed to load model"
- 404 errors for model files
- Face detection not working

**Solutions:**
1. **Verify Models Directory**
   ```bash
   # Check if models exist
   ls public/models/
   
   # Should see 9 files:
   # - tiny_face_detector_model-*
   # - face_landmark_68_model-*
   # - face_recognition_model-*
   # - ssd_mobilenetv1_model-*
   ```

2. **Download Models**
   ```bash
   cd public/models
   # Download from: https://github.com/justadudewhohacks/face-api.js-models
   # Or use wget commands from INSTALL.md
   ```

3. **Check File Names**
   - Must match exactly (case-sensitive)
   - No extra extensions
   - No spaces in names

#### Issue: Face not detected
**Symptoms:**
- "No face detected" message
- Camera works but no detection

**Solutions:**
1. **Improve Lighting**
   - Use bright, even lighting
   - Avoid backlighting
   - Face camera directly

2. **Camera Position**
   - Move closer to camera
   - Center face in frame
   - Remove obstructions (hair, glasses)

3. **Check Models**
   - Verify models loaded (check console)
   - Wait for models to fully load
   - Refresh page

#### Issue: Face not recognized
**Symptoms:**
- Face detected but not matched
- "Face not recognized" message

**Solutions:**
1. **Re-enroll Face**
   - Delete and re-enroll student
   - Use same lighting as attendance
   - Ensure clear face capture

2. **Adjust Threshold**
   ```javascript
   // In src/services/faceRecognitionService.js
   // Line with compareFaces or findBestMatch
   // Change threshold from 0.6 to 0.7 (stricter) or 0.5 (looser)
   ```

3. **Check Enrollment**
   - Verify face was properly enrolled
   - Check faceDescriptor exists in Firestore
   - Ensure faceEnrolled is true

---

### Camera Issues

#### Issue: Camera not starting
**Symptoms:**
- Black screen
- "Camera not accessible"
- Permission errors

**Solutions:**
1. **Grant Permissions**
   - Click allow when prompted
   - Check browser settings
   - Chrome: Settings → Privacy → Camera

2. **Check Camera**
   - Test camera in other apps
   - Ensure not used by another app
   - Try different browser

3. **Use HTTPS**
   - Camera requires HTTPS (except localhost)
   - Use `npm run dev` (localhost works)
   - Deploy to HTTPS hosting

#### Issue: Camera permission denied
**Symptoms:**
- "Permission denied" error
- Camera blocked icon in browser

**Solutions:**
1. **Reset Permissions**
   - Chrome: Click lock icon → Site settings → Camera → Allow
   - Firefox: Click shield icon → Permissions → Camera → Allow

2. **Check System Permissions**
   - Windows: Settings → Privacy → Camera
   - Mac: System Preferences → Security → Camera
   - Linux: Check camera device permissions

---

### Authentication Issues

#### Issue: Cannot login
**Symptoms:**
- "Wrong password" error
- "User not found" error

**Solutions:**
1. **Verify Credentials**
   - Check email spelling
   - Verify password
   - Check caps lock

2. **Check Firebase Auth**
   - Go to Firebase Console → Authentication
   - Verify user exists
   - Check if email/password is enabled

3. **Reset Password**
   - Implement password reset (future feature)
   - Or manually reset in Firebase Console

#### Issue: Logged out unexpectedly
**Symptoms:**
- Session expires
- Redirected to login

**Solutions:**
1. **Check Token Expiration**
   - Firebase tokens expire after 1 hour
   - App should auto-refresh
   - Check network connection

2. **Clear Browser Data**
   ```bash
   # Clear cache and cookies
   # Ctrl+Shift+Delete in most browsers
   ```

---

### UI/Display Issues

#### Issue: Styles not loading
**Symptoms:**
- Unstyled page
- Missing CSS
- Layout broken

**Solutions:**
1. **Rebuild Tailwind**
   ```bash
   npm run dev
   # Tailwind rebuilds automatically
   ```

2. **Check Tailwind Config**
   - Verify tailwind.config.js exists
   - Check content paths are correct

3. **Clear Cache**
   ```bash
   # Hard refresh
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

#### Issue: Responsive design broken
**Symptoms:**
- Mobile view not working
- Horizontal scroll
- Elements overlapping

**Solutions:**
1. **Check Viewport**
   ```html
   <!-- Verify in index.html -->
   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
   ```

2. **Test Different Sizes**
   - Use DevTools responsive mode
   - Test on actual devices
   - Check breakpoints

---

### Data Issues

#### Issue: Data not saving
**Symptoms:**
- Form submits but no data
- No error messages
- Data disappears

**Solutions:**
1. **Check Firestore Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Check Console Errors**
   - Open DevTools (F12)
   - Look for red errors
   - Check Network tab

3. **Verify Firestore**
   - Go to Firebase Console → Firestore
   - Check if collections exist
   - Verify data structure

#### Issue: Data not loading
**Symptoms:**
- Empty lists
- Loading forever
- No data displayed

**Solutions:**
1. **Check Network**
   - Verify internet connection
   - Check Firebase status
   - Look for network errors

2. **Check Queries**
   - Verify organizationId matches
   - Check user permissions
   - Verify collection names

---

### Export Issues

#### Issue: Excel export not working
**Symptoms:**
- No file downloads
- Empty file
- Corrupted file

**Solutions:**
1. **Check Browser Settings**
   - Allow downloads
   - Check download location
   - Disable popup blocker

2. **Verify Data**
   - Ensure data exists
   - Check data format
   - Verify XLSX library loaded

3. **Try Different Browser**
   - Test in Chrome
   - Clear browser cache

---

### Performance Issues

#### Issue: App is slow
**Symptoms:**
- Long load times
- Laggy interface
- Slow face recognition

**Solutions:**
1. **Check Network**
   - Test internet speed
   - Check Firebase region
   - Use closer Firebase location

2. **Optimize Browser**
   - Close other tabs
   - Clear cache
   - Disable extensions

3. **Check Device**
   - Ensure adequate RAM
   - Close other applications
   - Update browser

#### Issue: Face recognition slow
**Symptoms:**
- Takes >5 seconds
- Freezes during scan

**Solutions:**
1. **Reduce Students**
   - Limit enrolled students per session
   - Use class-based filtering

2. **Optimize Models**
   - Models are already optimized
   - Ensure models cached

3. **Improve Hardware**
   - Use better camera
   - Upgrade device
   - Use desktop instead of mobile

---

### Build/Deployment Issues

#### Issue: Build fails
**Symptoms:**
- `npm run build` errors
- Compilation errors

**Solutions:**
```bash
# Clear and rebuild
rm -rf dist node_modules
npm install
npm run build

# Check for TypeScript errors
# Check for import errors
# Verify all files exist
```

#### Issue: Deployed app not working
**Symptoms:**
- Works locally, fails in production
- 404 errors
- Blank page

**Solutions:**
1. **Check Build Output**
   - Verify dist/ folder created
   - Check index.html exists
   - Verify assets compiled

2. **Check Hosting Config**
   ```json
   // firebase.json
   {
     "hosting": {
       "public": "dist",
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

3. **Check Environment Variables**
   - Verify Firebase config in production
   - Check API keys
   - Verify domain settings

---

## 🔍 Debugging Tips

### Browser Console
```javascript
// Check Firebase connection
console.log(firebase.apps.length) // Should be > 0

// Check user state
console.log(auth.currentUser)

// Check models loaded
console.log(faceapi.nets)
```

### Network Tab
- Check API calls
- Verify Firebase requests
- Look for 404s or 500s
- Check request/response data

### React DevTools
- Install React DevTools extension
- Check component state
- Verify props
- Check Redux store

### Firebase Console
- Check Authentication users
- Verify Firestore data
- Check Storage files
- Review usage/quotas

---

## 📞 Getting Help

### Before Asking for Help

1. **Check Documentation**
   - README.md
   - INSTALL.md
   - USAGE_GUIDE.md
   - This file

2. **Check Console**
   - Browser console (F12)
   - Terminal output
   - Firebase Console

3. **Try Solutions Above**
   - Follow troubleshooting steps
   - Test in different browser
   - Clear cache and retry

### When Asking for Help

Include:
- **Error message** (exact text)
- **Browser** and version
- **Operating system**
- **Steps to reproduce**
- **Console errors** (screenshot)
- **What you've tried**

### Useful Commands

```bash
# Check versions
node --version
npm --version

# Check Firebase
firebase --version
firebase projects:list

# Check running processes
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Clear everything and start fresh
rm -rf node_modules package-lock.json dist
npm cache clean --force
npm install
npm run dev
```

---

## 🐛 Known Issues

### Current Limitations
1. **Face Recognition**
   - Requires good lighting
   - One face per student
   - Accuracy depends on camera quality

2. **Browser Support**
   - Camera requires HTTPS (except localhost)
   - Some features may not work in old browsers

3. **Performance**
   - Large student lists may slow down
   - Face recognition takes 1-2 seconds

4. **Offline**
   - Requires internet connection
   - No offline mode currently

### Workarounds
- Use good lighting for face recognition
- Limit students per class
- Use modern browsers
- Ensure stable internet

---

## ✅ Quick Fixes Checklist

When something doesn't work:
- [ ] Refresh the page (Ctrl+R)
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Clear browser cache
- [ ] Check internet connection
- [ ] Check browser console (F12)
- [ ] Verify Firebase config
- [ ] Check models are downloaded
- [ ] Grant camera permissions
- [ ] Try different browser
- [ ] Restart development server

---

**Still having issues?** Check the documentation files or review the code comments for more details.
