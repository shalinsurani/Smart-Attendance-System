# Face-API Library Upgrade

## What Changed

We've upgraded from the outdated `face-api.js` to the modern `@vladmandic/face-api` library.

### Why the Upgrade?

The original `face-api.js@0.20.0` package:
- ❌ Last updated in 2019 (no longer maintained)
- ❌ Uses outdated TensorFlow.js v1.0.3
- ❌ Has backend initialization bugs causing "Cannot read properties of undefined (reading 'backend')" errors
- ❌ Poor browser compatibility with modern Chrome/Edge

The new `@vladmandic/face-api@1.7.15` package:
- ✅ Actively maintained (updated 2024)
- ✅ Uses modern TensorFlow.js v4.x
- ✅ Proper backend initialization and error handling
- ✅ Better performance and accuracy
- ✅ Full TypeScript support
- ✅ Compatible with modern browsers

## Changes Made

### 1. Package Installation
```bash
npm uninstall face-api.js
npm install @vladmandic/face-api
```

### 2. Import Statement Updated
**Before:**
```javascript
import * as faceapi from 'face-api.js'
```

**After:**
```javascript
import * as faceapi from '@vladmandic/face-api'
```

### 3. Detection Options Improved
**Before:**
```javascript
const detection = await faceapi
  .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
  .withFaceLandmarks()
  .withFaceDescriptor()
```

**After:**
```javascript
const options = new faceapi.TinyFaceDetectorOptions({
  inputSize: 416,
  scoreThreshold: 0.5
})

const detection = await faceapi
  .detectSingleFace(videoElement, options)
  .withFaceLandmarks()
  .withFaceDescriptor()
```

### 4. Models Simplified
Removed `ssdMobilenetv1` model (not needed for our use case):
- ✅ `tinyFaceDetector` - Fast face detection
- ✅ `faceLandmark68Net` - Facial landmarks
- ✅ `faceRecognitionNet` - Face descriptors
- ❌ `ssdMobilenetv1` - Removed (redundant)

## API Compatibility

The `@vladmandic/face-api` library is **100% API compatible** with the original `face-api.js`. All existing code continues to work without changes, except for the import statement.

### Same API Methods:
- ✅ `detectSingleFace()`
- ✅ `withFaceLandmarks()`
- ✅ `withFaceDescriptor()`
- ✅ `euclideanDistance()`
- ✅ `TinyFaceDetectorOptions()`
- ✅ All other methods remain the same

## Testing

After the upgrade, test these features:
1. ✅ Student face enrollment (Teacher Dashboard → Manage Students)
2. ✅ Face recognition during attendance (Teacher Dashboard → Attendance Session)
3. ✅ Multiple face detection in a session
4. ✅ Face matching accuracy

## Performance Improvements

Expected improvements:
- **Faster model loading** - Parallel loading of models
- **Better detection accuracy** - Optimized detector options
- **No backend errors** - Proper TensorFlow.js initialization
- **Smaller bundle size** - Removed unnecessary ssdMobilenetv1 model

## Rollback (If Needed)

If you need to rollback to the old version:
```bash
npm uninstall @vladmandic/face-api
npm install face-api.js@0.20.0
```

Then change the import back:
```javascript
import * as faceapi from 'face-api.js'
```

**Note:** Rollback is NOT recommended as it will bring back the backend errors.

## Additional Resources

- [@vladmandic/face-api GitHub](https://github.com/vladmandic/face-api)
- [Original face-api.js](https://github.com/justadudewhohacks/face-api.js)
- [TensorFlow.js Documentation](https://www.tensorflow.org/js)

## Support

If you encounter any issues after the upgrade:
1. Clear browser cache and restart dev server
2. Check console for specific error messages
3. Verify all model files are in `public/models/`
4. Ensure camera permissions are granted
5. Try a different browser (Chrome/Edge recommended)
