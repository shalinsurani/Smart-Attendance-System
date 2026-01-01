import * as faceapi from '@vladmandic/face-api'

let modelsLoaded = false
let initializationPromise = null

export const loadModels = async () => {
  // If already loaded, return immediately
  if (modelsLoaded) return
  
  // If initialization is in progress, wait for it
  if (initializationPromise) return initializationPromise
  
  initializationPromise = (async () => {
    try {
      const MODEL_URL = '/models'
      
      // Load models in parallel - @vladmandic/face-api handles backend automatically
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
      ])
      
      modelsLoaded = true
      console.log('Face-api models loaded successfully')
    } catch (error) {
      console.error('Error loading face-api models:', error)
      initializationPromise = null
      modelsLoaded = false
      throw error
    }
  })()
  
  return initializationPromise
}

export const detectFace = async (videoElement) => {
  try {
    // Ensure models are loaded
    await loadModels()
    
    // Ensure video is ready
    if (!videoElement || videoElement.readyState !== 4) {
      console.log('Video not ready yet')
      return null
    }
    
    // Use TinyFaceDetector with optimized options
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 416,
      scoreThreshold: 0.5
    })
    
    const detection = await faceapi
      .detectSingleFace(videoElement, options)
      .withFaceLandmarks()
      .withFaceDescriptor()

    return detection
  } catch (error) {
    console.error('Error detecting face:', error)
    // Return null instead of throwing to allow retry
    return null
  }
}

export const detectAllFaces = async (videoElement) => {
  try {
    // Ensure models are loaded
    await loadModels()
    
    // Ensure video is ready
    if (!videoElement || videoElement.readyState !== 4) {
      console.log('Video not ready yet')
      return []
    }
    
    // Use TinyFaceDetector with optimized options
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 416,
      scoreThreshold: 0.5
    })
    
    const detections = await faceapi
      .detectAllFaces(videoElement, options)
      .withFaceLandmarks()
      .withFaceDescriptors()

    return detections
  } catch (error) {
    console.error('Error detecting faces:', error)
    // Return empty array instead of throwing to allow retry
    return []
  }
}

export const compareFaces = (descriptor1, descriptor2, threshold = 0.6) => {
  if (!descriptor1 || !descriptor2) return false
  
  const distance = faceapi.euclideanDistance(descriptor1, descriptor2)
  return distance < threshold
}

export const findBestMatch = (faceDescriptor, labeledDescriptors, threshold = 0.6) => {
  let bestMatch = null
  let minDistance = threshold

  labeledDescriptors.forEach((labeled) => {
    const distance = faceapi.euclideanDistance(faceDescriptor, labeled.descriptor)
    if (distance < minDistance) {
      minDistance = distance
      bestMatch = labeled
    }
  })

  return bestMatch
}

export const startVideo = async (videoElement) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    })
    videoElement.srcObject = stream
    return stream
  } catch (error) {
    console.error('Error accessing camera:', error)
    throw error
  }
}

export const stopVideo = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
}
