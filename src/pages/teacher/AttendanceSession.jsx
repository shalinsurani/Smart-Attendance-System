import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { getStudentsByTeacher, getStudentsByOrganization } from '../../services/studentService'
import { getClassesByTeacher, getClassesByOrganization } from '../../services/classService'
import { markAttendance } from '../../services/attendanceService'
import { loadModels, detectAllFaces, startVideo, stopVideo, findBestMatch } from '../../services/faceRecognitionService'
import PreSessionForm from '../../components/PreSessionForm'
import { useRoleLabels } from '../../hooks/useRoleLabels'
import toast from 'react-hot-toast'

const AttendanceSession = () => {
  const { user } = useSelector((state) => state.auth)
  const labels = useRoleLabels()
  const videoRef = useRef(null)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [sessionDetails, setSessionDetails] = useState(null)
  const [showPreForm, setShowPreForm] = useState(true)
  const [sessionActive, setSessionActive] = useState(false)
  const [stream, setStream] = useState(null)
  const [attendanceList, setAttendanceList] = useState([])
  const [autoScan, setAutoScan] = useState(true)
  const [modelsReady, setModelsReady] = useState(false)
  const sessionId = useRef(`session_${Date.now()}`)
  const scanIntervalRef = useRef(null)
  const isScanning = useRef(false)
  const markedStudents = useRef(new Set())

  useEffect(() => {
    loadData()
    initModels()

    // Cleanup on unmount
    return () => {
      if (stream) {
        stopVideo(stream)
      }
    }
  }, [user])

  const loadData = async () => {
    try {
      // Admin can see all students and classes, teacher sees only their own
      const studentsData = user.role === 'admin'
        ? await getStudentsByOrganization(user.organizationId)
        : await getStudentsByTeacher(user.uid, user.organizationId)
      const classesData = user.role === 'admin'
        ? await getClassesByOrganization(user.organizationId)
        : await getClassesByTeacher(user.uid, user.organizationId)
      setStudents(studentsData.filter(s => s.faceEnrolled))
      setClasses(classesData)
    } catch (error) {
      console.error('Data loading error:', error)
      toast.error('Failed to load data. Please refresh the page or contact support.')
    }
  }

  const initModels = async () => {
    try {
      await loadModels()
      setModelsReady(true)
    } catch (error) {
      console.error('Model loading error:', error)
      toast.error('Failed to load face recognition models. Please refresh the page or contact support.')
    }
  }

  const handlePreSessionSubmit = (formData) => {
    setSessionDetails(formData)
    setSelectedClass(formData.classId)
    setShowPreForm(false)
    
    // Reset marked students for new session
    markedStudents.current.clear()
    setAttendanceList([])
    
    // Set session active first, which will render the video element
    setSessionActive(true)
    sessionId.current = `session_${Date.now()}`
    
    toast.success('Session details saved! Starting camera...')
  }

  const handlePreSessionCancel = () => {
    toast.info('Session cancelled')
  }

  // Start video stream after video element is rendered
  useEffect(() => {
    if (sessionActive && videoRef.current && !stream) {
      const initCamera = async () => {
        try {
          const videoStream = await startVideo(videoRef.current)
          setStream(videoStream)
          toast.success('Attendance session started! Auto-scanning enabled.')
        } catch (error) {
          console.error('Camera start error:', error)
          toast.error('Failed to start camera. Please check camera permissions and try again.')
          setSessionActive(false)
        }
      }
      initCamera()
    }
  }, [sessionActive, stream])

  // Auto-scan for faces continuously when session is active
  useEffect(() => {
    if (sessionActive && stream && autoScan && modelsReady) {
      scanIntervalRef.current = setInterval(() => {
        performAutoScan()
      }, 2000) // Scan every 2 seconds

      return () => {
        if (scanIntervalRef.current) {
          clearInterval(scanIntervalRef.current)
        }
      }
    }
  }, [sessionActive, stream, autoScan, modelsReady, attendanceList])

  const stopSession = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
    }
    if (stream) {
      stopVideo(stream)
      setStream(null)
    }
    setSessionActive(false)
    toast.success('Attendance session ended!')
  }

  const performAutoScan = async () => {
    if (isScanning.current || !modelsReady) return
    
    isScanning.current = true

    try {
      const detections = await detectAllFaces(videoRef.current)

      if (detections && detections.length > 0) {
        const labeledDescriptors = students.map(s => ({
          id: s.id,
          name: s.name,
          studentId: s.studentId,
          descriptor: new Float32Array(s.faceDescriptor),
        }))

        detections.forEach(detection => {
          if (detection.descriptor) {
            const match = findBestMatch(detection.descriptor, labeledDescriptors, 0.6)

            if (match) {
              // Check if already marked using ref (not state)
              if (!markedStudents.current.has(match.studentId)) {
                markedStudents.current.add(match.studentId)
                markStudentPresent(match)
              }
            }
          }
        })
      }
    } catch (error) {
      console.error('Auto-scan error:', error)
    } finally {
      isScanning.current = false
    }
  }

  const markStudentPresent = async (match) => {
    try {
      const selectedClassData = classes.find(c => c.id === selectedClass)
      
      const attendanceData = {
        studentId: match.studentId,
        studentName: match.name,
        teacherId: user.uid,
        classId: selectedClass,
        className: selectedClassData?.name || 'Unknown Class',
        organizationId: user.organizationId,
        sessionId: sessionId.current,
      }

      console.log('Marking attendance:', attendanceData)
      
      const docId = await markAttendance(attendanceData)
      
      console.log('Attendance marked successfully, doc ID:', docId)

      setAttendanceList(prev => [...prev, {
        studentId: match.studentId,
        name: match.name,
        time: new Date().toLocaleTimeString(),
      }])

      toast.success(`${match.name} marked present`, { duration: 2000 })
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error(`Failed to mark ${match.name}. Please try again.`)
    }
  }

  const toggleAutoScan = () => {
    setAutoScan(!autoScan)
    if (!autoScan) {
      toast.success('Auto-scan enabled')
    } else {
      toast.success('Auto-scan disabled')
    }
  }

  // Show pre-session form first
  if (showPreForm) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Attendance Session</h1>
        <PreSessionForm
          classes={classes}
          onSubmit={handlePreSessionSubmit}
          onCancel={handlePreSessionCancel}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Attendance Session</h1>
        {sessionDetails && (
          <div className="sm:text-right">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{sessionDetails.subject}</span> - {sessionDetails.topic}
            </p>
            <p className="text-xs text-gray-500">
              {sessionDetails.sessionType} • {sessionDetails.duration} minutes
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Session Controls</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected {labels.class}</label>
              <input
                type="text"
                value={sessionDetails?.className || ''}
                disabled
                className="input-field bg-gray-100"
              />
            </div>

            <div className="hidden">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input-field"
                disabled={sessionActive}
              >
                <option value="">Choose a {labels.class.toLowerCase()}</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {!sessionActive ? (
              <button onClick={startSession} className="w-full btn-primary">
                Start Session
              </button>
            ) : (
              <>
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-auto"
                  />
                  {autoScan && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <span className="animate-pulse">●</span>
                      Auto-scanning
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Auto-scan faces</span>
                  <button
                    onClick={toggleAutoScan}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoScan ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoScan ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <button onClick={stopSession} className="w-full btn-secondary">
                  End Session
                </button>
              </>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Attendance List</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {attendanceList.map((record, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium">{record.name}</p>
                  <p className="text-sm text-gray-600">{record.studentId}</p>
                </div>
                <span className="text-sm text-gray-500">{record.time}</span>
              </div>
            ))}
            {attendanceList.length === 0 && (
              <p className="text-center text-gray-500 py-8">No attendance marked yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceSession
