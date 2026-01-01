import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGa2WcecePhEISGLlktOK9swl89xrvR4A",
  authDomain: "ai-attendance-system-de86c.firebaseapp.com",
  projectId: "ai-attendance-system-de86c",
  storageBucket: "ai-attendance-system-de86c.firebasestorage.app",
  messagingSenderId: "878907183035",
  appId: "1:878907183035:web:6bdcfc2dc0677d3803be9e",
  measurementId: "G-DZ0L9ZXS5H"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
