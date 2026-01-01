# VisionAttend Deployment Guide

## Prerequisites
- Node.js 16+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- Git installed

## Step-by-Step Deployment

### 1. Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Hosting
# - Storage
```

### 2. Configure Firebase

Update `src/config/firebase.js` with your project credentials from Firebase Console → Project Settings → General → Your apps → Web app

### 3. Download Face-API Models

1. Download models from: https://github.com/justadudewhohacks/face-api.js-models
2. Create `public/models/` directory
3. Copy these model files:
   - tiny_face_detector_model-weights_manifest.json
   - tiny_face_detector_model-shard1
   - face_landmark_68_model-weights_manifest.json
   - face_landmark_68_model-shard1
   - face_recognition_model-weights_manifest.json
   - face_recognition_model-shard1
   - ssd_mobilenetv1_model-weights_manifest.json
   - ssd_mobilenetv1_model-shard1
   - ssd_mobilenetv1_model-shard2

### 4. Install Dependencies

```bash
npm install
```

### 5. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 6. Deploy Storage Rules

```bash
firebase deploy --only storage
```

### 7. Build Application

```bash
npm run build
```

### 8. Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

### 9. Configure Firebase Authentication

1. Go to Firebase Console → Authentication
2. Enable Email/Password sign-in method
3. (Optional) Configure authorized domains

## Alternative Deployment Options

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

## Environment Variables

For production, consider using environment variables:

Create `.env` file:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Update `src/config/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}
```

## Post-Deployment Checklist

- [ ] Test admin registration
- [ ] Test teacher creation
- [ ] Test student enrollment
- [ ] Test face capture
- [ ] Test attendance marking
- [ ] Test Excel export
- [ ] Verify mobile responsiveness
- [ ] Check camera permissions
- [ ] Test all user roles
- [ ] Verify Firestore security rules

## Monitoring

### Firebase Console
- Monitor authentication users
- Check Firestore usage
- Review storage usage
- Check hosting analytics

### Performance
- Use Firebase Performance Monitoring
- Enable Analytics
- Monitor error logs

## Troubleshooting

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Deployment Fails
```bash
# Check Firebase CLI version
firebase --version

# Update Firebase CLI
npm install -g firebase-tools@latest

# Re-deploy
firebase deploy
```

### Camera Not Working in Production
- Ensure site is served over HTTPS
- Check browser permissions
- Verify camera access in browser settings

## Security Best Practices

1. Never commit Firebase config with real credentials to public repos
2. Use environment variables for sensitive data
3. Regularly review Firestore security rules
4. Enable Firebase App Check for additional security
5. Monitor authentication logs for suspicious activity

## Scaling Considerations

- Enable Firestore indexes for large datasets
- Consider Cloud Functions for heavy operations
- Implement pagination for large lists
- Use Firebase Performance Monitoring
- Consider CDN for static assets

## Support

For deployment issues:
1. Check Firebase Console logs
2. Review browser console errors
3. Verify all dependencies are installed
4. Ensure models are properly loaded
5. Check network requests in DevTools
