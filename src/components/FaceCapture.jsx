import { useEffect, useRef, useState } from 'react'
import { loadModels, detectFace, startVideo, stopVideo } from '../services/faceRecognitionService'
import toast from 'react-hot-toast'

const FaceCapture = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [detecting, setDetecting] = useState(false)
  const [modelsReady, setModelsReady] = useState(false)

  useEffect(() => {
    let mounted = true
    
    const init = async () => {
      try {
        // Load models first
        await loadModels()
        
        if (!mounted) return
        
        setModelsReady(true)
        
        // Start video stream
        const videoStream = await startVideo(videoRef.current)
        
        if (!mounted) {
          stopVideo(videoStream)
          return
        }
        
        setStream(videoStream)
        
        // Wait for video to be fully ready
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error('Camera initialization error:', error)
        if (mounted) {
          toast.error('Failed to initialize camera. Please check permissions and refresh the page.')
        }
      }
    }

    init()

    return () => {
      mounted = false
      if (stream) {
        stopVideo(stream)
      }
    }
  }, [])

  const handleCapture = async () => {
    if (!modelsReady) {
      toast.error('Face recognition models are still loading. Please wait.')
      return
    }

    if (!videoRef.current || videoRef.current.readyState !== 4) {
      toast.error('Camera is not ready yet. Please wait a moment.')
      return
    }

    setDetecting(true)

    try {
      // Try detection with a timeout
      const detectionPromise = detectFace(videoRef.current)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Detection timeout')), 10000)
      )
      
      const detection = await Promise.race([detectionPromise, timeoutPromise])

      if (detection && detection.descriptor) {
        const descriptorArray = Array.from(detection.descriptor)
        onCapture(descriptorArray)
        if (stream) {
          stopVideo(stream)
        }
      } else {
        toast.error('No face detected. Please ensure your face is clearly visible and well-lit.')
      }
    } catch (error) {
      console.error('Face detection error:', error)
      toast.error('Error detecting face. Please refresh the page and try again.')
    } finally {
      setDetecting(false)
    }
  }

  const handleCancel = () => {
    if (stream) {
      stopVideo(stream)
    }
    onCancel()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Face Enrollment</h2>
        
        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-auto"
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.play()
              }
            }}
          />
        </div>

        <div className="text-center mb-4">
          <p className="text-gray-600">
            Position your face in the center and click Capture
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCapture}
            disabled={detecting || !modelsReady}
            className="flex-1 btn-primary"
          >
            {detecting ? 'Detecting...' : 'Capture Face'}
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default FaceCapture
