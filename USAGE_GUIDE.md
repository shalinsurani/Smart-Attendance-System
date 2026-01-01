# VisionAttend Usage Guide

## Getting Started

### For Organization Admins

#### 1. Register Your Organization
1. Navigate to the registration page
2. Fill in:
   - Organization Name (e.g., "ABC School")
   - Admin Name (your name)
   - Email
   - Password
3. Click "Register Organization"
4. You'll be automatically logged in to the admin dashboard

#### 2. Add Teachers
1. Go to "Manage Teachers" from the dashboard
2. Click "Add Teacher"
3. Enter teacher details:
   - Name
   - Email
   - Password (they'll use this to login)
4. Click "Add Teacher"
5. Teacher can now login with their credentials

#### 3. View Statistics
- Dashboard shows:
  - Total teachers
  - Total students (across all teachers)
  - Today's attendance count
- Export all attendance records to Excel

---

### For Teachers

#### 1. Login
- Use credentials provided by your admin
- You'll land on the teacher dashboard

#### 2. Add Students
1. Navigate to "Manage Students"
2. Click "Add Student"
3. Fill in:
   - Student Name
   - Student ID (Roll Number/Employee ID)
   - Email
4. Click "Add Student"

#### 3. Enroll Student Faces
1. In the students list, click "Enroll Face" next to a student
2. Camera will activate
3. Student should:
   - Face the camera directly
   - Ensure good lighting
   - Keep face centered
4. Click "Capture Face"
5. System will detect and save the face
6. Status changes to "✓ Enrolled"

**Tips for Best Results:**
- Good lighting is essential
- Face should be clearly visible
- Remove glasses if possible
- Neutral expression works best
- Capture from same distance as attendance will be taken

#### 4. Create Classes
1. Go to "Manage Classes"
2. Click "Create Class"
3. Enter:
   - Class Name (e.g., "Computer Science 101")
   - Subject (e.g., "Programming")
4. Click "Create Class"

#### 5. Take Attendance

**Starting a Session:**
1. Navigate to "Start Attendance"
2. Select a class from dropdown
3. Click "Start Session"
4. Camera will activate

**Marking Attendance:**
1. Student stands in front of camera
2. Click "Scan Face"
3. System will:
   - Detect the face
   - Match with enrolled faces
   - Automatically mark attendance if recognized
4. Student name appears in attendance list
5. Repeat for each student

**Ending Session:**
- Click "End Session" when done
- All attendance is saved to database

**Important Notes:**
- Each student can only be marked once per session
- Unrecognized faces will show "Face not recognized"
- Ensure same lighting conditions as enrollment

#### 6. View Attendance History
1. Go to "View Attendance"
2. Use filters:
   - Start Date
   - End Date
   - Student ID
3. View complete attendance records
4. Click "Export to Excel" to download

---

### For Students

#### 1. Access Dashboard
- Students don't login directly
- They are added by teachers
- Can view their attendance if given access

#### 2. View Attendance
- See total attendance count
- Monthly attendance summary
- Attendance percentage
- Visual charts showing trends
- Recent attendance records

---

## Common Workflows

### Daily Attendance Flow
1. Teacher logs in
2. Navigates to "Start Attendance"
3. Selects today's class
4. Starts session
5. Students come one by one
6. Teacher clicks "Scan Face" for each
7. System marks attendance automatically
8. Teacher ends session

### Weekly Report Generation
1. Teacher goes to "View Attendance"
2. Sets date range (last 7 days)
3. Reviews records
4. Clicks "Export to Excel"
5. Opens Excel file
6. Shares with admin/management

### New Student Onboarding
1. Teacher adds student details
2. Enrolls student's face
3. Verifies enrollment status
4. Student is ready for attendance

---

## Troubleshooting

### Face Not Detected
**Problem:** "No face detected" message
**Solutions:**
- Improve lighting
- Move closer to camera
- Remove obstructions (hair, glasses)
- Ensure camera is working
- Check browser permissions

### Face Not Recognized
**Problem:** "Face not recognized" during attendance
**Solutions:**
- Re-enroll the face
- Ensure similar lighting as enrollment
- Check if student is in the system
- Verify face was properly enrolled
- Try adjusting distance from camera

### Camera Not Working
**Problem:** Camera doesn't start
**Solutions:**
- Grant camera permissions in browser
- Check if camera is being used by another app
- Try different browser (Chrome recommended)
- Ensure HTTPS connection
- Restart browser

### Slow Performance
**Problem:** App is slow or laggy
**Solutions:**
- Close other browser tabs
- Clear browser cache
- Check internet connection
- Ensure good device performance
- Try on different device

---

## Best Practices

### For Admins
- Regularly export attendance data
- Monitor teacher activity
- Keep organization info updated
- Review attendance statistics weekly

### For Teachers
- Enroll faces in good lighting
- Take attendance at consistent times
- Export records regularly
- Keep student information updated
- End sessions properly

### For Face Enrollment
- Use consistent lighting
- Same distance from camera
- Neutral facial expression
- No accessories if possible
- Multiple angles (optional)

### For Attendance Sessions
- Start session on time
- Ensure proper lighting
- One student at a time
- Verify each scan
- End session after class

---

## Security Tips

1. **Passwords:**
   - Use strong passwords
   - Don't share credentials
   - Change passwords regularly

2. **Data Privacy:**
   - Face data is encrypted
   - Only authorized users can access
   - Regular backups recommended

3. **Access Control:**
   - Admins manage teachers
   - Teachers manage students
   - Role-based permissions enforced

---

## Support

### Getting Help
- Check this guide first
- Review error messages
- Check browser console
- Contact system administrator

### Reporting Issues
- Describe the problem clearly
- Include screenshots if possible
- Note when the issue occurs
- Mention browser and device used

---

## FAQ

**Q: Can I enroll multiple faces for one student?**
A: Currently, one face per student. Re-enrollment replaces the previous face.

**Q: What if a student's appearance changes?**
A: Re-enroll their face with the new appearance.

**Q: Can attendance be edited?**
A: Only admins can modify attendance records in the database.

**Q: How accurate is the face recognition?**
A: 95%+ accuracy with proper enrollment and conditions.

**Q: Can I use this offline?**
A: No, internet connection required for database access.

**Q: What browsers are supported?**
A: Chrome, Firefox, Safari, Edge (latest versions).

**Q: Is the data secure?**
A: Yes, Firebase security rules protect all data.

**Q: Can I export data in other formats?**
A: Currently Excel (XLSX) format is supported.

---

**VisionAttend** - Making attendance simple and secure! 🎯
