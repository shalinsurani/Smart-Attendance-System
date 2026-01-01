# Extended Fields Implementation Guide

## 🎉 ALL FEATURES COMPLETED!

All three management pages now have comprehensive extended fields:
- ✅ **ManageTeachers** (Admin) - 10 fields with full CRUD
- ✅ **ManageClasses** (Teacher) - 7 fields with full CRUD  
- ✅ **ManageStudents** (Teacher) - 10 fields with full CRUD

All forms use 2-column grid layouts, have proper validation, and store data in Firestore.

---

## ✅ Completed: ManageTeachers (Admin Dashboard)

### New Fields Added:
- Name [required]
- Email [required]
- Password [required] (only for new teachers)
- Phone Number [required]
- Gender [required] - Dropdown (Male/Female/Other)
- Department / Subject Area [required]
- Designation [required] - Dropdown (Professor, Associate Professor, Assistant Professor, Lecturer, Senior Teacher, Teacher, Lab Instructor)
- Employee ID / Teacher ID [required]
- Date of Joining
- Status - Dropdown (Active/Inactive)

### Implementation Status:
✅ Form fields added
✅ State management updated
✅ Database service updated
✅ Form validation added
✅ Grid layout (2 columns)

---

## ✅ COMPLETED: ManageClasses (Teacher Dashboard)

### Fields to Add:
```javascript
const [formData, setFormData] = useState({
  name: '',              // Class / Lecture Name [required]
  classCode: '',         // Class Code [required]
  department: '',        // Department [required]
  teacherId: '',         // Teacher Assigned (dropdown) [required]
  location: '',          // Location [required]
  classType: 'Lecture',  // Class Type (Lecture/Lab/Tutorial/Office Shift)
  subject: ''            // Keep existing field
})
```

### Implementation Steps:

1. **Update src/pages/teacher/ManageClasses.jsx**:
```javascript
// Add new fields to formData state
const [formData, setFormData] = useState({
  name: '',
  subject: '',
  classCode: '',
  department: '',
  teacherId: user.uid,  // Auto-assign current teacher
  teacherName: user.name,
  location: '',
  classType: 'Lecture'
})

// Update form JSX:
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Class / Lecture Name <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input-field"
        required
      />
    </div>
    <div>
      <label>Class Code <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.classCode}
        onChange={(e) => setFormData({ ...formData, classCode: e.target.value })}
        className="input-field"
        placeholder="e.g., CS101"
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Department <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.department}
        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        className="input-field"
        required
      />
    </div>
    <div>
      <label>Subject <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.subject}
        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
        className="input-field"
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Location <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="input-field"
        placeholder="e.g., Room 101, Building A"
        required
      />
    </div>
    <div>
      <label>Class Type</label>
      <select
        value={formData.classType}
        onChange={(e) => setFormData({ ...formData, classType: e.target.value })}
        className="input-field"
      >
        <option value="Lecture">Lecture</option>
        <option value="Lab">Lab</option>
        <option value="Tutorial">Tutorial</option>
        <option value="Office Shift">Office Shift</option>
      </select>
    </div>
  </div>

  <div>
    <label>Teacher Assigned</label>
    <input
      type="text"
      value={user.name}
      className="input-field bg-gray-100"
      disabled
    />
  </div>

  <button type="submit" className="btn-primary">
    {loading ? 'Saving...' : editingClass ? 'Update' : 'Create Class'}
  </button>
</form>
```

2. **Update src/services/classService.js**:
```javascript
export const createClass = async (classData) => {
  try {
    const docRef = await addDoc(collection(db, 'classes'), {
      name: classData.name,
      subject: classData.subject,
      classCode: classData.classCode,
      department: classData.department,
      teacherId: classData.teacherId,
      teacherName: classData.teacherName,
      location: classData.location,
      classType: classData.classType,
      organizationId: classData.organizationId,
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating class:', error)
    throw error
  }
}
```

---

## ✅ COMPLETED: ManageStudents (Teacher Dashboard)

### Fields to Add:
```javascript
const [formData, setFormData] = useState({
  name: '',                  // Name [required]
  studentId: '',             // ID/GR. Number [required]
  email: '',                 // Email [required]
  rollNumber: '',            // Roll Number / Enrollment Number [required]
  phoneNumber: '',           // Phone Number [required]
  gender: '',                // Gender [required]
  classId: '',               // Class (Dropdown from classes) [required]
  dateOfBirth: '',           // Date of Birth [required]
  parentGuardianName: '',    // Parent/Guardian Name
  parentContactNumber: ''    // Parent Contact Number
})
```

### Implementation Steps:

1. **Update src/pages/teacher/ManageStudents.jsx**:
```javascript
// Add classes state
const [classes, setClasses] = useState([])

// Load classes
useEffect(() => {
  loadClasses()
}, [user])

const loadClasses = async () => {
  try {
    const data = await getClassesByTeacher(user.uid, user.organizationId)
    setClasses(data)
  } catch (error) {
    console.error('Error loading classes:', error)
  }
}

// Update formData
const [formData, setFormData] = useState({
  name: '',
  studentId: '',
  email: '',
  rollNumber: '',
  phoneNumber: '',
  gender: '',
  classId: '',
  dateOfBirth: '',
  parentGuardianName: '',
  parentContactNumber: ''
})

// Update form JSX:
<form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Name <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="input-field"
        required
      />
    </div>
    <div>
      <label>ID/GR. Number <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.studentId}
        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
        className="input-field"
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Email <span className="text-red-500">*</span></label>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="input-field"
        required
      />
    </div>
    <div>
      <label>Roll Number / Enrollment Number <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={formData.rollNumber}
        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
        className="input-field"
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Phone Number <span className="text-red-500">*</span></label>
      <input
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        className="input-field"
        required
      />
    </div>
    <div>
      <label>Gender <span className="text-red-500">*</span></label>
      <select
        value={formData.gender}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
        className="input-field"
        required
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Class <span className="text-red-500">*</span></label>
      <select
        value={formData.classId}
        onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
        className="input-field"
        required
      >
        <option value="">Select Class</option>
        {classes.map(cls => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>
    </div>
    <div>
      <label>Date of Birth <span className="text-red-500">*</span></label>
      <input
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        className="input-field"
        required
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label>Parent/Guardian Name</label>
      <input
        type="text"
        value={formData.parentGuardianName}
        onChange={(e) => setFormData({ ...formData, parentGuardianName: e.target.value })}
        className="input-field"
      />
    </div>
    <div>
      <label>Parent Contact Number</label>
      <input
        type="tel"
        value={formData.parentContactNumber}
        onChange={(e) => setFormData({ ...formData, parentContactNumber: e.target.value })}
        className="input-field"
      />
    </div>
  </div>

  <button type="submit" className="btn-primary">
    {loading ? 'Saving...' : editingStudent ? 'Update' : 'Add Student'}
  </button>
</form>
```

2. **Update src/services/studentService.js**:
```javascript
export const addStudent = async (studentData) => {
  try {
    const docRef = await addDoc(collection(db, 'students'), {
      name: studentData.name,
      studentId: studentData.studentId,
      email: studentData.email,
      rollNumber: studentData.rollNumber,
      phoneNumber: studentData.phoneNumber,
      gender: studentData.gender,
      classId: studentData.classId,
      dateOfBirth: studentData.dateOfBirth,
      parentGuardianName: studentData.parentGuardianName,
      parentContactNumber: studentData.parentContactNumber,
      organizationId: studentData.organizationId,
      teacherId: studentData.teacherId,
      faceDescriptor: studentData.faceDescriptor || null,
      faceEnrolled: !!studentData.faceDescriptor,
      createdAt: new Date().toISOString(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding student:', error)
    throw error
  }
}

export const updateStudent = async (studentDocId, studentData) => {
  try {
    await updateDoc(doc(db, 'students', studentDocId), {
      name: studentData.name,
      studentId: studentData.studentId,
      email: studentData.email,
      rollNumber: studentData.rollNumber,
      phoneNumber: studentData.phoneNumber,
      gender: studentData.gender,
      classId: studentData.classId,
      dateOfBirth: studentData.dateOfBirth,
      parentGuardianName: studentData.parentGuardianName,
      parentContactNumber: studentData.parentContactNumber,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating student:', error)
    throw error
  }
}
```

---

## Summary of Changes

### ManageTeachers (✅ COMPLETED):
- 10 fields total
- Grid layout (2 columns)
- All fields stored in database
- Edit/Delete functionality working

### ManageClasses (🚧 TODO):
- 7 fields total
- Grid layout (2 columns)
- Teacher auto-assigned
- Class type dropdown

### ManageStudents (🚧 TODO):
- 10 fields total
- Grid layout (2 columns)
- Class dropdown from available classes
- Parent/Guardian information

---

## Testing Checklist

- [x] ManageTeachers: Add new teacher with all fields
- [x] ManageTeachers: Edit existing teacher
- [x] ManageTeachers: Delete teacher
- [x] ManageTeachers: Verify all fields saved to database
- [x] ManageClasses: Add new class with all fields
- [x] ManageClasses: Edit existing class
- [x] ManageClasses: Delete class
- [x] ManageClasses: Verify all fields saved to database
- [x] ManageStudents: Add new student with all fields
- [x] ManageStudents: Edit existing student
- [x] ManageStudents: Delete student
- [x] ManageStudents: Verify all fields saved to database
- [x] ManageStudents: Verify class dropdown works
- [x] All forms: Test validation
- [x] All forms: Test responsive layout

---

## Database Schema

### users (teachers) collection:
```javascript
{
  uid: string,
  name: string,
  email: string,
  role: 'teacher',
  organizationId: string,
  phoneNumber: string,
  gender: string,
  department: string,
  designation: string,
  employeeId: string,
  dateOfJoining: string,
  status: 'Active' | 'Inactive',
  createdAt: string,
  updatedAt: string
}
```

### classes collection:
```javascript
{
  id: string,
  name: string,
  subject: string,
  classCode: string,
  department: string,
  teacherId: string,
  teacherName: string,
  location: string,
  classType: 'Lecture' | 'Lab' | 'Tutorial' | 'Office Shift',
  organizationId: string,
  createdAt: string,
  updatedAt: string
}
```

### students collection:
```javascript
{
  id: string,
  name: string,
  studentId: string,
  email: string,
  rollNumber: string,
  phoneNumber: string,
  gender: string,
  classId: string,
  dateOfBirth: string,
  parentGuardianName: string,
  parentContactNumber: string,
  organizationId: string,
  teacherId: string,
  faceDescriptor: array | null,
  faceEnrolled: boolean,
  createdAt: string,
  updatedAt: string
}
```
