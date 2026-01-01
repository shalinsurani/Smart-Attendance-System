# Auto-Scan Feature for Attendance

## Overview

The attendance session now includes **automatic continuous face detection** that scans for multiple faces every 2 seconds and automatically marks students present.

## What's New

### 1. Continuous Auto-Scanning
- **Before:** Teachers had to click "Scan Face" button for each student individually
- **After:** System automatically detects and marks all visible faces every 2 seconds

### 2. Multiple Face Detection
- Detects **all faces** in the camera view simultaneously
- Matches each detected face against enrolled students
- Automatically marks attendance for recognized students
- Prevents duplicate entries (won't mark the same student twice)

### 3. Toggle Control
- Auto-scan is **enabled by default** when session starts
- Teachers can toggle auto-scan on/off with a switch
- Visual indicator shows when auto-scanning is active

## How It Works

### Flow:
1. Teacher selects a class
2. Clicks "Start Session"
3. Camera opens and auto-scan begins immediately
4. System scans every 2 seconds:
   - Detects all faces in view
   - Matches against enrolled students
   - Marks attendance automatically
   - Shows toast notification for each student marked
5. Teacher can toggle auto-scan on/off as needed
6. Click "End Session" to stop

### Technical Details:

**New Functions:**
- `detectAllFaces()` - Detects multiple faces in video frame
- `performAutoScan()` - Runs every 2 seconds to scan and mark attendance
- `markStudentPresent()` - Marks individual student attendance
- `toggleAutoScan()` - Enables/disables auto-scanning

**Scan Interval:** 2 seconds (configurable)
**Detection Method:** TinyFaceDetector with face landmarks and descriptors
**Match Threshold:** 0.6 (60% similarity required)

## UI Changes

### Session Controls:
- **Auto-scan toggle switch** - Enable/disable automatic scanning
- **Visual indicator** - Green "Auto-scanning" badge on video when active
- **Removed "Scan Face" button** - No longer needed with auto-scan

### Attendance List:
- Real-time updates as students are detected
- Shows student name, ID, and time marked
- Scrollable list for large classes

## Benefits

### For Teachers:
- ✅ **Faster attendance** - No need to click for each student
- ✅ **Hands-free operation** - Just point camera at class
- ✅ **Multiple students at once** - Detects all visible faces
- ✅ **Less interaction** - Set it and forget it

### For Students:
- ✅ **Quicker process** - No waiting in line
- ✅ **Group detection** - Multiple students marked simultaneously
- ✅ **Less disruption** - Faster class start

## Usage Tips

### Best Practices:
1. **Good lighting** - Ensure classroom is well-lit
2. **Clear view** - Position camera to see multiple faces
3. **Face forward** - Students should face the camera
4. **Wait 2 seconds** - System scans every 2 seconds
5. **Check list** - Verify all students are marked

### Troubleshooting:

**Issue:** Student not detected
- **Solution:** Ensure face is clearly visible and well-lit
- **Solution:** Wait for next scan cycle (2 seconds)
- **Solution:** Student may need to re-enroll face

**Issue:** Too many false detections
- **Solution:** Adjust camera angle to focus on enrolled students
- **Solution:** Temporarily disable auto-scan and use manual mode

**Issue:** Duplicate notifications
- **Solution:** System prevents duplicate entries automatically
- **Solution:** Toast notifications are brief (2 seconds)

## Configuration

### Adjustable Settings:

**Scan Interval** (in code):
```javascript
setInterval(() => {
  performAutoScan()
}, 2000) // Change 2000 to adjust milliseconds
```

**Match Threshold** (in code):
```javascript
const match = findBestMatch(detection.descriptor, labeledDescriptors, 0.6)
// Change 0.6 to adjust sensitivity (0.5 = more lenient, 0.7 = stricter)
```

**Toast Duration** (in code):
```javascript
toast.success(`${match.name} marked present`, { duration: 2000 })
// Change 2000 to adjust notification display time
```

## Performance

### Optimizations:
- Uses `TinyFaceDetector` for fast detection
- Scans every 2 seconds (not continuous) to reduce CPU usage
- Prevents concurrent scans with `isScanning` flag
- Only processes enrolled students

### Expected Performance:
- **Detection time:** ~500ms per scan
- **CPU usage:** Moderate (depends on number of faces)
- **Memory usage:** Low
- **Battery impact:** Moderate (camera + processing)

## Future Enhancements

Potential improvements:
- [ ] Adjustable scan interval in UI
- [ ] Confidence score display
- [ ] Face bounding boxes overlay
- [ ] Attendance statistics (X of Y students present)
- [ ] Export attendance report
- [ ] Sound notification option
- [ ] Dark mode support

## Files Modified

1. **src/services/faceRecognitionService.js**
   - Added `detectAllFaces()` function for multiple face detection

2. **src/pages/teacher/AttendanceSession.jsx**
   - Added auto-scan state and interval management
   - Added `performAutoScan()` for continuous scanning
   - Added `markStudentPresent()` for attendance marking
   - Added toggle switch for auto-scan control
   - Updated UI with visual indicator

## Compatibility

- ✅ Works with existing face enrollment system
- ✅ Compatible with all enrolled students
- ✅ Works with existing attendance records
- ✅ No database schema changes required
- ✅ Backward compatible with manual scanning

## Testing Checklist

- [ ] Start session with auto-scan enabled
- [ ] Verify faces are detected automatically
- [ ] Check attendance list updates in real-time
- [ ] Toggle auto-scan off and on
- [ ] Test with multiple students in view
- [ ] Verify no duplicate entries
- [ ] Test with poor lighting conditions
- [ ] End session and verify cleanup
- [ ] Check attendance records in database
