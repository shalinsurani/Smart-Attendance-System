import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import organizationReducer from './slices/organizationSlice'
import teacherReducer from './slices/teacherSlice'
import studentReducer from './slices/studentSlice'
import attendanceReducer from './slices/attendanceSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    organization: organizationReducer,
    teacher: teacherReducer,
    student: studentReducer,
    attendance: attendanceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
