# Face-API.js Models

## Required Models

Download the following models from:
https://github.com/justadudewhohacks/face-api.js-models

### Models to Download:

1. **tiny_face_detector_model**
   - tiny_face_detector_model-weights_manifest.json
   - tiny_face_detector_model-shard1

2. **face_landmark_68_model**
   - face_landmark_68_model-weights_manifest.json
   - face_landmark_68_model-shard1

3. **face_recognition_model**
   - face_recognition_model-weights_manifest.json
   - face_recognition_model-shard1

4. **ssd_mobilenetv1_model**
   - ssd_mobilenetv1_model-weights_manifest.json
   - ssd_mobilenetv1_model-shard1
   - ssd_mobilenetv1_model-shard2

## Installation

1. Download all files from the GitHub repository
2. Place them in this directory (`public/models/`)
3. Ensure file names match exactly
4. Total size: ~5-6 MB

## Verification

After placing the models, your directory should look like:

```
public/models/
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── face_landmark_68_model-shard1
├── face_recognition_model-weights_manifest.json
├── face_recognition_model-shard1
├── ssd_mobilenetv1_model-weights_manifest.json
├── ssd_mobilenetv1_model-shard1
├── ssd_mobilenetv1_model-shard2
└── README.md
```

## Troubleshooting

If models fail to load:
1. Check browser console for 404 errors
2. Verify file names are correct
3. Ensure files are in `public/models/` not `src/models/`
4. Clear browser cache and reload
5. Check network tab in DevTools

## Alternative Download

You can also use wget or curl:

```bash
cd public/models

# Tiny Face Detector
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector_model-shard1

# Face Landmark 68
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68_model-shard1

# Face Recognition
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition_model-shard1

# SSD MobileNet
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/ssd_mobilenetv1_model-weights_manifest.json
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/ssd_mobilenetv1_model-shard1
wget https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/ssd_mobilenetv1_model-shard2
```
