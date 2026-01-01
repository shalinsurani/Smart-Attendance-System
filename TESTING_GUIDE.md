# VisionAttend - Testing Guide

## Pre-Testing Checklist

Before starting tests, ensure:
- [ ] Application is running (`npm run dev`)
- [ ] Firebase is configured correctly
- [ ] Face-api.js models are downloaded
- [ ] Camera is connected and working
- [ ] Browser is Chrome (recommended)
- [ ] Good lighting for face recognition

## Test Scenarios

### 1. Organization Registration & Admin Login

#### Test Case 1.1: Register New Organization
**Steps:**
1. Navigate to http://localhost:3000
2. Click "Register Organization"
3. Fill in form:
   - Organization Name: "Test School"
   - Admin Name: "John Admin"
   - Email: "admin@testschool.com"
   - Password: "Test123456"
   - Confirm Password: "Test123456"
4. Click "Register Organization"

**Expected Result:**
- ✅ Success toast appears
- ✅ Redirected to admin dashboard
- ✅ Admin name displayed in navbar
- ✅ Statistics cards show 0 values

#### Test Case 1.2: Admin Logout and Login
**Steps:**
1. Click "Logout" button
2. Redirected to login page
3. Enter credentials:
   - Email: "admin@testschool.com"
   - Password: "Test123456"
4. Click "Login"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Redirected to admin dashboard
- ✅ User data persists

### 2. Teacher Management (Admin)

#### Test Case 2.1: Add Teacher
**Steps:**
1. Login as admin
2. Navigate to "Manage Teachers"
3. Click "Add Teacher"
4. Fill in form:
   - Name: "Sarah Teacher"
   - Email: "teacher@testschool.com"
   - Password: "Teacher123"
5. Click "Add Teacher"

**Expected Result:**
- ✅ Success toast appears
- ✅ Teacher appears in list
- ✅ Form resets
- ✅ Teacher count updates

#### Test Case 2.2: View Teachers List
**Steps:**
1. Navigate to "Manage Teachers"
2. Verify teacher list displays

**Expected Result:**
- ✅ Table shows teacher name
- ✅ Email displayed correctly
- ✅ Join date shown

### 3. Teacher Login & Dashboard

#### Test Case 3.1: Teacher Login
**Steps:**
1. Logout from admin
2. Login with teacher credentials:
   - Email: "teacher@testschool.com"
   - Password: "Teacher123"

**Expected Result:**
- ✅ Successfully logged in
- ✅ Redirected to teacher dashboard
- ✅ Role shows "teacher"
- ✅ Statistics show 0 initially

### 4. Student Management (Teacher)

#### Test Case 4.1: Add Student
**Steps:**
1. Login as teacher
2. Navigate to "Manage Students"
3. Click "Add Student"
4. Fill in form:
   - Name: "Alice Student"
   - Student ID: "STU001"
   - Email: "alice@testschool.com"
5. Click "Add Student"

**Expected Result:**
- ✅ Success toast appears
- ✅ Student appears in list
- ✅ Face status shows "✗ Not Enrolled"
- ✅ "Enroll Face" button visible

#### Test Case 4.2: Enroll Student Face
**Steps:**
1. In students list, click "Enroll Face" for Alice
2. Camera modal opens
3. Position face in camera view
4. Wait for good lighting
5. Click "Capture Face"

**Expected Result:**
- ✅ Camera activates
- ✅ Face detected message (check console)
- ✅ Success toast appears
- ✅ Face status changes to "✓ Enrolled"
- ✅ Modal closes

**Troubleshooting:**
- If "No face detected": Improve lighting, move closer
- If camera doesn't start: Check permissions
- If models not loaded: Check console, verify models in public/models/

#### Test Case 4.3: Add Multiple Students
**Steps:**
1. Add 3 more students:
   - Bob (STU002)
   - Carol (STU003)
   - David (STU004)
2. Enroll faces for all

**Expected Result:**
- ✅ All students added successfully
- ✅ All faces enrolled
- ✅ Student count updates

### 5. Class Management (Teacher)

#### Test Case 5.1: Create Class
**Steps:**
1. Navigate to "Manage Classes"
2. Click "Create Class"
3. Fill in form:
   - Class Name: "Computer Science 101"
   - Subject: "Programming"
4. Click "Create Class"

**Expected Result:**
- ✅ Success toast appears
- ✅ Class appears in grid
- ✅ Class details correct
- ✅ Created date shown

#### Test Case 5.2: Create Multiple Classes
**Steps:**
1. Create 2 more classes:
   - "Mathematics 101" - "Algebra"
   - "Physics 101" - "Mechanics"

**Expected Result:**
- ✅ All classes created
- ✅ Class count updates in dashboard

### 6. Attendance Session (Teacher)

#### Test Case 6.1: Start Attendance Session
**Steps:**
1. Navigate to "Start Attendance"
2. Select class: "Computer Science 101"
3. Click "Start Session"

**Expected Result:**
- ✅ Camera activates
- ✅ Video feed displays
- ✅ "Scan Face" button enabled
- ✅ Attendance list empty

#### Test Case 6.2: Mark Attendance via Face Recognition
**Steps:**
1. Have Alice stand in front of camera
2. Click "Scan Face"
3. Wait for recognition

**Expected Result:**
- ✅ "Scanning..." message appears
- ✅ Face detected and recognized
- ✅ Success toast: "Alice Student marked present"
- ✅ Alice appears in attendance list
- ✅ Time recorded

#### Test Case 6.3: Prevent Duplicate Attendance
**Steps:**
1. Keep Alice in front of camera
2. Click "Scan Face" again

**Expected Result:**
- ✅ Error toast: "Alice Student already marked present"
- ✅ No duplicate entry in list

#### Test Case 6.4: Mark Multiple Students
**Steps:**
1. Have Bob stand in front of camera
2. Click "Scan Face"
3. Repeat for Carol and David

**Expected Result:**
- ✅ All students recognized
- ✅ All marked present
- ✅ Attendance list shows all 4 students
- ✅ Different timestamps

#### Test Case 6.5: Unrecognized Face
**Steps:**
1. Have someone not enrolled stand in front of camera
2. Click "Scan Face"

**Expected Result:**
- ✅ Error toast: "Face not recognized"
- ✅ No attendance marked

#### Test Case 6.6: End Session
**Steps:**
1. Click "End Session"

**Expected Result:**
- ✅ Camera stops
- ✅ Success toast appears
- ✅ Attendance saved to database

### 7. View Attendance History (Teacher)

#### Test Case 7.1: View All Records
**Steps:**
1. Navigate to "View Attendance"

**Expected Result:**
- ✅ Table shows all attendance records
- ✅ Student IDs displayed
- ✅ Names shown
- ✅ Class names correct
- ✅ Dates and times accurate
- ✅ Status shows "present"

#### Test Case 7.2: Filter by Date
**Steps:**
1. Set start date to today
2. Set end date to today

**Expected Result:**
- ✅ Only today's records shown
- ✅ Record count updates

#### Test Case 7.3: Search by Student ID
**Steps:**
1. Enter "STU001" in Student ID field

**Expected Result:**
- ✅ Only Alice's records shown
- ✅ Other students filtered out

#### Test Case 7.4: Export to Excel
**Steps:**
1. Clear all filters
2. Click "Export to Excel"

**Expected Result:**
- ✅ Excel file downloads
- ✅ Filename includes date
- ✅ File opens in Excel/Sheets
- ✅ All data present
- ✅ Columns formatted correctly

### 8. Admin Statistics & Export

#### Test Case 8.1: View Organization Stats
**Steps:**
1. Logout from teacher
2. Login as admin
3. View dashboard

**Expected Result:**
- ✅ Total Teachers: 1
- ✅ Today's Attendance: 4
- ✅ Statistics accurate

#### Test Case 8.2: Export All Attendance
**Steps:**
1. Click "Export All Attendance"

**Expected Result:**
- ✅ Excel file downloads
- ✅ Contains all organization attendance
- ✅ All teachers' data included

### 9. Student Dashboard (If Implemented)

#### Test Case 9.1: View Personal Attendance
**Steps:**
1. Login as student (if login enabled)
2. View dashboard

**Expected Result:**
- ✅ Personal attendance count shown
- ✅ Chart displays
- ✅ Recent records visible

### 10. Edge Cases & Error Handling

#### Test Case 10.1: Invalid Login
**Steps:**
1. Try login with wrong password

**Expected Result:**
- ✅ Error toast appears
- ✅ Stays on login page

#### Test Case 10.2: Empty Form Submission
**Steps:**
1. Try submitting forms with empty fields

**Expected Result:**
- ✅ HTML5 validation prevents submission
- ✅ Required field messages show

#### Test Case 10.3: Duplicate Email
**Steps:**
1. Try adding teacher with existing email

**Expected Result:**
- ✅ Firebase error caught
- ✅ Error toast displayed

#### Test Case 10.4: Camera Permission Denied
**Steps:**
1. Deny camera permission
2. Try to enroll face

**Expected Result:**
- ✅ Error message shown
- ✅ Graceful failure

#### Test Case 10.5: No Face in Frame
**Steps:**
1. Start face capture
2. Click capture with no face visible

**Expected Result:**
- ✅ "No face detected" message
- ✅ Can retry

### 11. Responsive Design Testing

#### Test Case 11.1: Mobile View (375px)
**Steps:**
1. Open DevTools
2. Set viewport to iPhone SE (375px)
3. Navigate through all pages

**Expected Result:**
- ✅ All pages responsive
- ✅ No horizontal scroll
- ✅ Buttons accessible
- ✅ Tables scroll horizontally
- ✅ Forms usable

#### Test Case 11.2: Tablet View (768px)
**Steps:**
1. Set viewport to iPad (768px)
2. Test all features

**Expected Result:**
- ✅ Layout adapts properly
- ✅ Grid columns adjust
- ✅ Navigation works

#### Test Case 11.3: Desktop View (1920px)
**Steps:**
1. Test on large desktop screen

**Expected Result:**
- ✅ Content centered
- ✅ Max-width respected
- ✅ No stretched elements

### 12. Performance Testing

#### Test Case 12.1: Page Load Time
**Steps:**
1. Open DevTools Network tab
2. Reload page
3. Check load time

**Expected Result:**
- ✅ Initial load < 3 seconds
- ✅ Models load < 5 seconds

#### Test Case 12.2: Face Recognition Speed
**Steps:**
1. Time face recognition process

**Expected Result:**
- ✅ Detection < 2 seconds
- ✅ Recognition < 1 second

### 13. Security Testing

#### Test Case 13.1: Protected Routes
**Steps:**
1. Logout
2. Try accessing /admin directly

**Expected Result:**
- ✅ Redirected to login
- ✅ Cannot access without auth

#### Test Case 13.2: Role-Based Access
**Steps:**
1. Login as teacher
2. Try accessing /admin

**Expected Result:**
- ✅ Redirected to teacher dashboard
- ✅ Cannot access admin routes

## Test Results Template

```
Test Date: ___________
Tester: ___________
Browser: ___________
OS: ___________

| Test Case | Status | Notes |
|-----------|--------|-------|
| 1.1       | ✅/❌   |       |
| 1.2       | ✅/❌   |       |
| ...       | ✅/❌   |       |

Issues Found:
1. 
2. 
3. 

Overall Status: PASS / FAIL
```

## Automated Testing (Future)

Consider adding:
- Unit tests with Jest
- Component tests with React Testing Library
- E2E tests with Cypress/Playwright
- API tests for Firebase functions

## Performance Benchmarks

Expected performance:
- Page load: < 3s
- Face detection: < 2s
- Face recognition: < 1s
- Database queries: < 500ms
- Excel export: < 2s

## Browser Compatibility

Test on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Known Limitations

- Face recognition accuracy depends on lighting
- Camera quality affects detection
- One face per student currently
- Requires internet connection
- HTTPS required for camera (except localhost)

---

**Testing Complete!** 🎉

If all tests pass, the application is ready for production deployment.
